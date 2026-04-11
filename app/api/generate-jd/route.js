import { execSync, spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;
var AGENT_ID = process.env.ANTHROPIC_AGENT_ID || 'agent_011CZxrrdt7dcEqmmVL9ovvp';
var ENVIRONMENT_ID = process.env.ANTHROPIC_ENVIRONMENT_ID;

function curlPost(path, body) {
  var result = execSync(
    'curl -s --max-time 60 -X POST ' + JSON.stringify(API_BASE + path) +
    ' -H "x-api-key: ' + API_KEY + '"' +
    ' -H "anthropic-version: 2023-06-01"' +
    ' -H "anthropic-beta: managed-agents-2026-04-01"' +
    ' -H "Content-Type: application/json"' +
    ' -d ' + JSON.stringify(JSON.stringify(body)),
    { encoding: 'utf-8', timeout: 65000 }
  );
  return JSON.parse(result);
}

function curlSSE(path) {
  return spawn('curl', [
    '-s', '-N', '--max-time', '180',
    API_BASE + path,
    '-H', 'x-api-key: ' + API_KEY,
    '-H', 'anthropic-version: 2023-06-01',
    '-H', 'anthropic-beta: managed-agents-2026-04-01',
    '-H', 'Accept: text/event-stream',
  ]);
}

/**
 * POST /api/generate-jd
 * Body: { message: string, sessionId?: string, companyContext?: object, hmContext?: object }
 *
 * SSE events returned:
 *   type=session   → { sessionId }
 *   type=chat      → { text, delta }
 *   type=tool      → { name, status }       (agent using a tool)
 *   type=done      → { fullText }
 *   type=error     → { text }
 */
export async function POST(req) {
  if (!API_KEY || !ENVIRONMENT_ID) {
    return new Response(JSON.stringify({
      error: 'Missing ANTHROPIC_API_KEY or ANTHROPIC_ENVIRONMENT_ID',
    }), { status: 500 });
  }

  var body;
  try { body = await req.json(); } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  var message = body.message;
  var sessionId = body.sessionId || null;
  var companyContext = body.companyContext || null;
  var hmContext = body.hmContext || null;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 });
  }

  var encoder = new TextEncoder();

  var stream = new ReadableStream({
    async start(controller) {
      function send(type, data) {
        try {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: type, ...data }) + '\n\n'));
        } catch (e) { /* closed */ }
      }

      try {
        // 1. Create session if needed
        if (!sessionId) {
          var session = curlPost('/v1/sessions', {
            agent: AGENT_ID,
            environment_id: ENVIRONMENT_ID,
          });
          if (session.error) throw new Error(session.error.message || JSON.stringify(session.error));
          sessionId = session.id;
          send('session', { sessionId: sessionId });

          // Inject company + HM context as first message if provided
          if (companyContext || hmContext) {
            var contextParts = [];
            if (companyContext) {
              contextParts.push('## Company Context\n' + JSON.stringify(companyContext, null, 2));
            }
            if (hmContext) {
              contextParts.push('## Hiring Manager Context\n' + JSON.stringify(hmContext, null, 2));
            }
            // Send context, wait for agent to process it
            var ctxStream = curlSSE('/v1/sessions/' + sessionId + '/events/stream');
            curlPost('/v1/sessions/' + sessionId + '/events', {
              events: [{
                type: 'user.message',
                content: [{ type: 'text', text: contextParts.join('\n\n') + '\n\n---\nContext loaded. Wait for the hiring manager\'s first message.' }],
              }],
            });
            // Drain until idle
            await new Promise(function (resolve) {
              ctxStream.stdout.on('data', function (chunk) {
                var text = chunk.toString();
                if (text.includes('"session.status_idle"') || text.includes('"session.status_terminated"')) {
                  ctxStream.kill();
                  resolve();
                }
              });
              ctxStream.on('close', resolve);
              setTimeout(function () { ctxStream.kill(); resolve(); }, 30000);
            });
          }
        }

        // 2. Open SSE stream (stream-first)
        var sseProc = curlSSE('/v1/sessions/' + sessionId + '/events/stream');

        // 3. Send user message
        curlPost('/v1/sessions/' + sessionId + '/events', {
          events: [{
            type: 'user.message',
            content: [{ type: 'text', text: message }],
          }],
        });

        // 4. Read SSE events
        var agentText = '';
        var sseBuffer = '';

        await new Promise(function (resolve) {
          sseProc.stdout.on('data', function (chunk) {
            sseBuffer += chunk.toString();
            var parts = sseBuffer.split('\n\n');
            sseBuffer = parts.pop();

            for (var p = 0; p < parts.length; p++) {
              var lines = parts[p].split('\n');
              for (var k = 0; k < lines.length; k++) {
                var line = lines[k].trim();
                if (!line.startsWith('data: ')) continue;
                var evt;
                try { evt = JSON.parse(line.slice(6)); } catch (e) { continue; }

                // Agent text
                if (evt.type === 'agent.message') {
                  for (var b = 0; b < (evt.content || []).length; b++) {
                    var block = evt.content[b];
                    if (block.type === 'text' && block.text) {
                      agentText += block.text;
                      send('chat', { text: block.text, delta: true });
                    }
                  }
                }

                // Agent using a tool (file edit, web search, etc.)
                if (evt.type === 'agent.tool_use') {
                  send('tool', { name: evt.name || 'tool', status: 'running' });
                }
                if (evt.type === 'agent.tool_result') {
                  send('tool', { name: '', status: 'done' });
                }

                // Session idle
                if (evt.type === 'session.status_idle') {
                  if (evt.stop_reason && evt.stop_reason.type === 'requires_action') continue;
                  send('done', { fullText: agentText });
                  sseProc.kill();
                  resolve();
                  return;
                }

                // Session terminated
                if (evt.type === 'session.status_terminated') {
                  send('done', { fullText: agentText });
                  sseProc.kill();
                  resolve();
                  return;
                }

                // Session error
                if (evt.type === 'session.error') {
                  var errMsg = (evt.error && evt.error.message) || 'Agent error';
                  send('error', { text: errMsg });
                  send('done', { fullText: agentText });
                  sseProc.kill();
                  resolve();
                  return;
                }
              }
            }
          });

          sseProc.stderr.on('data', function () {});
          sseProc.on('close', function () {
            if (agentText) send('done', { fullText: agentText });
            resolve();
          });
          sseProc.on('error', function (err) {
            send('error', { text: err.message });
            resolve();
          });
        });

      } catch (err) {
        send('error', { text: err.message || 'Unknown error' });
      } finally {
        try { controller.close(); } catch (e) {}
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
