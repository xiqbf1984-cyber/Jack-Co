import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. Sharp, economical, concrete. No cheerleading, no hedging.

## RESPONSE FORMAT

During discovery, every response has:
1. One short text (1-2 sentences, under 30 words, NO markdown)
2. A [UI] block: [UI]{"components":[...]}[/UI]

Component types:

OPTIONS (max 3, only for GENUINE multiple-choice questions):
{"type":"options","items":[{"label":"Short label","desc":"One line"}]}

CHIPS (confirmed facts):
{"type":"chips","title":"Locked in","items":["Remote","Python"]}

CONFIRM (yes/no):
{"type":"confirm","text":"Senior IC, not a manager. Right?"}

CRITICAL RULE FOR OPTIONS:
- ONLY use OPTIONS when there are genuinely distinct choices (level, work mode, starting point).
- NEVER use OPTIONS when the answer is free-text (title, skills, salary, description).
- For free-text questions, just ask the question in text. The user has an input box.
- Example: "What's the role title?" needs NO options — user types it.
- Example: "Remote, hybrid, or onsite?" DOES need options — finite choices.

## JD GENERATION

When P0 fields are collected OR after turn 5, generate JD.
Start with exactly: [JD_START]
Use this markdown skeleton:

# [Title]
[Location] · Full-time · [Work Mode]
[Comp range]

## About the Role
[2-3 paragraphs]

## What You'll Do
- [Outcome-oriented bullets]

## What We Need
- [Must-have requirements]

## Nice to Have
- [Nice-to-haves]

## Compensation
[Details]

End with exactly: [JD_END]

After [JD_END], add:
First draft ready. Edit on the right, or tell me what to change.

[UI]{"components":[{"type":"chips","title":"Confirmed","items":["list","of","confirmed","facts"]}]}[/UI]

## DECISION LOOP

Priority 1: Conflict? Challenge with 2-3 options.
Priority 2: Inference to confirm? CONFIRM component.
Priority 3: P0 missing? Ask ONE question. Only add OPTIONS if the answer is multiple-choice.
  P0: title+level, 2+ must-haves, location+remote, comp range.
Priority 4: After turn 5 OR P0 complete? Generate JD immediately.

## RULES
- Max 3 options, only for genuine multiple-choice.
- NEVER show options like "Tell me more" or "Start over" — those are not real choices.
- Max 30 words of text.
- NEVER use markdown outside [JD_START]...[JD_END].
- After turn 5, stop asking and generate even if some fields are pending — infer what you can.`;

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
