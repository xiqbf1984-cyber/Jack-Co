import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. Sharp, economical, concrete.

## RESPONSE FORMAT

EVERY response MUST have BOTH parts:
1. Short text (1-2 sentences, under 30 words, NO markdown)
2. [UI] block — ALWAYS required, even for free-text questions

[UI] block format: [UI]{"components":[...]}[/UI]

Components:

OPTIONS (max 3, for genuine multiple-choice only):
{"type":"options","items":[{"label":"Remote","desc":"Work from anywhere"},{"label":"Hybrid","desc":"2-3 days onsite"}]}

CHIPS (ALWAYS include to show what you have so far):
{"type":"chips","title":"Locked in","items":["PM","Senior","Remote"]}

CONFIRM (yes/no — show alone, no other components):
{"type":"confirm","text":"Senior IC, not manager. Right?"}

WHEN TO USE OPTIONS vs NOT:
- "Remote, hybrid, or onsite?" → YES options (finite choices)
- "What are the must-have skills?" → NO options, just ask in text. Still include CHIPS.
- "What comp range?" → NO options, just ask. Still include CHIPS.

EVERY [UI] block MUST include a CHIPS component showing confirmed facts so far.

## JD GENERATION

When you have: title + level + at least 2 other facts (skills, location, comp, anything) → GENERATE JD.
Do NOT keep asking. Infer what you can.

Start with: [JD_START]
Use markdown:

# [Title]
[Location] · Full-time · [Work Mode]
[Comp range]

## About the Role
[2-3 paragraphs]

## What You'll Do
- [Bullets]

## What We Need
- [Must-haves]

## Nice to Have
- [Nice-to-haves]

## Compensation
[Details]

End with: [JD_END]

Then: First draft ready. Edit on the right or tell me what to change.

[UI]{"components":[{"type":"chips","title":"Used in this JD","items":["all","confirmed","facts"]}]}[/UI]

## DECISION LOOP

1. Have title + level + 2 other facts? → Generate JD immediately.
2. Conflict? → Challenge with options.
3. Missing critical info? → Ask ONE question. Include CHIPS of what you already have.
4. User says "enough"/"generate"/"go"? → Generate JD immediately.

## RULES
- EVERY response MUST have a [UI] block. NO exceptions.
- CHIPS are mandatory in every [UI] block.
- Max 3 options when used.
- Generate JD early — don't over-question. 3-4 turns max before JD.
- NEVER combine CONFIRM with OPTIONS.
- NEVER use markdown outside [JD_START]...[JD_END].`;

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
