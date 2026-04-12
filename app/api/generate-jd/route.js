import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. Sharp, economical, concrete. No cheerleading, no hedging.

## RESPONSE FORMAT

During discovery (before JD generation), every response has:
1. One short text message (1-2 sentences, under 30 words, NO markdown)
2. A [UI] block: [UI]{"components":[...]}[/UI]

Component types for [UI]:

OPTIONS (max 3 items, NEVER more):
{"type":"options","items":[{"label":"Short label","desc":"One line"}]}

CHIPS (confirmed facts):
{"type":"chips","title":"Locked in","items":["Remote","Python"]}

CONFIRM (yes/no inference):
{"type":"confirm","text":"Senior IC, not a manager. Right?"}

PASTE (multi-line input):
{"type":"paste","placeholder":"Paste your JD here..."}

Rules: max 3 options, ONE options block, labels under 5 words, descs under 10 words. No INPUT component needed.

## JD GENERATION (CRITICAL)

When all P0 fields are collected, signal JD generation by starting your response with exactly:
[JD_START]

Then output the JD using this skeleton in clean markdown:

# [Title]
[Location] · [Employment Type] · [Work Mode]
[Comp range]

## About [Company]
[Company description or placeholder]

## About the Role
[2-3 paragraphs based on variant]

## What You'll Do
[Outcome-oriented bullets]

## What We Need
[Must-have requirements]

## Nice to Have
[Nice-to-haves]

## Compensation
[From brief]

End with exactly:
[JD_END]

After [JD_END], add a text message and UI block:
Three versions ready. Pick one to start editing.

[UI]{"components":[{"type":"options","items":[{"label":"Version A \u2014 Mission","desc":"Why this role matters to the mission"},{"label":"Version B \u2014 Outcomes","desc":"What you will ship, fast and direct"},{"label":"Version C \u2014 Reframing","desc":"AI-native reshape of the role"}]}]}[/UI]

## DECISION LOOP

Priority 1: Conflict? Name it, give 2-3 options.
Priority 2: Inference to confirm? CONFIRM component.
Priority 3: P0 missing? Ask ONE question with max 3 options.
  P0: title+level, 2+ must-haves, location+remote, comp range, 90-day outcome, 1 anti-pattern.
Priority 4: P0 complete? Generate JD (use [JD_START]...[JD_END]).
Priority 5: User picks variant? Output that variant between [JD_START]...[JD_END].

Stop and generate if user says "enough" / "generate it" / "let's go" or after turn 8.

## RULES
- Max 3 options per response. NEVER more.
- Max 30 words of text during discovery.
- Only ONE question per turn.
- NEVER use markdown in chat text (only inside [JD_START]...[JD_END]).
- NEVER output JD content without [JD_START]...[JD_END] wrapper.
- NEVER fabricate market data.`;

/**
 * POST /api/generate-jd
 * Body: { message: string, history?: Array<{role, content}> }
 * Returns: SSE stream
 */
export async function POST(req) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }), { status: 500 });
  }

  var body;
  try { body = await req.json(); } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  var message = body.message;
  var history = body.history || [];

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 });
  }

  // Build messages, stripping [UI] blocks from history so model doesn't see rendered JSON
  var messages = [];
  for (var i = 0; i < history.length; i++) {
    var h = history[i];
    var content = h.content || '';
    // Strip UI blocks from assistant messages in history
    if (h.role === 'ai') {
      content = content.replace(/\[UI\][\s\S]*?\[\/UI\]/g, '').trim();
    }
    messages.push({
      role: h.role === 'ai' ? 'assistant' : 'user',
      content: content,
    });
  }
  messages.push({ role: 'user', content: message });

  var requestBody = {
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    stream: true,
    system: SYSTEM_PROMPT,
    messages: messages,
  };

  var encoder = new TextEncoder();

  var stream = new ReadableStream({
    start: function (controller) {
      function send(type, data) {
        try {
          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: type, ...data }) + '\n\n'));
        } catch (e) {}
      }

      var proc = spawn('curl', [
        '-s', '-N', '--max-time', '120',
        '-X', 'POST', API_BASE + '/v1/messages',
        '-H', 'x-api-key: ' + API_KEY,
        '-H', 'anthropic-version: 2023-06-01',
        '-H', 'Content-Type: application/json',
        '-d', JSON.stringify(requestBody),
      ]);

      var buffer = '';
      var fullText = '';

      proc.stdout.on('data', function (chunk) {
        buffer += chunk.toString();
        var parts = buffer.split('\n');
        buffer = parts.pop();

        for (var p = 0; p < parts.length; p++) {
          var line = parts[p].trim();
          if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;
          var evt;
          try { evt = JSON.parse(line.slice(6)); } catch (e) { continue; }

          if (evt.type === 'content_block_delta' && evt.delta && evt.delta.type === 'text_delta') {
            fullText += evt.delta.text;
            send('delta', { text: evt.delta.text });
          }
          if (evt.type === 'message_stop') {
            send('done', { fullText: fullText });
          }
        }
      });

      proc.stderr.on('data', function () {});
      proc.on('close', function (code) {
        if (!fullText && code !== 0) {
          send('error', { text: 'API request failed (exit ' + code + ')' });
        }
        try { controller.close(); } catch (e) {}
      });
      proc.on('error', function (err) {
        send('error', { text: err.message });
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
