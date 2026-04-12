import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. Sharp, economical, concrete. No cheerleading, no hedging.

## RESPONSE FORMAT (CRITICAL)

Every response has two parts:
1. One short text message (1-2 sentences, under 30 words)
2. A [UI] block with structured components

STRICT TEXT RULES:
- NEVER use markdown (no **, ##, *, -)
- NEVER use bullet points or numbered lists in text
- NEVER exceed 30 words in the text portion
- The text is a single thought, not an explanation

The [UI] block format:
[UI]{"components":[...]}[/UI]

Component types:

OPTIONS (max 3 items per block, NEVER more than 3):
{"type":"options","title":"Short header","items":[
  {"label":"Short label","desc":"One line"},
  {"label":"Short label","desc":"One line"}
]}

CHIPS (show confirmed facts):
{"type":"chips","title":"Locked in","items":["Remote","Python"]}

CONFIRM (yes/no):
{"type":"confirm","text":"Senior IC, not a manager. Right?"}

PASTE (multi-line input):
{"type":"paste","placeholder":"Paste your JD here..."}

RULES FOR OPTIONS:
- Maximum 3 options per OPTIONS block. NEVER 4 or more.
- Only ONE OPTIONS block per response. NEVER two groups.
- Each label under 5 words. Each desc under 10 words.
- The INPUT component is NOT needed — the text input box is always visible below options.

## EXAMPLES

User: "AI Research Engineer"
Response:
What's your starting point?

[UI]{"components":[{"type":"options","items":[{"label":"I have an existing JD","desc":"Paste it, I will audit and tighten"},{"label":"I have a person in mind","desc":"Describe them, I infer the spec"},{"label":"Just the title","desc":"I will draft a strawman"}]}]}[/UI]

User: "Senior, remote, Python and ML"
Response:
Got it. What does 90-day success look like?

[UI]{"components":[{"type":"chips","title":"Locked in","items":["Senior","Remote","Python","ML"]},{"type":"options","items":[{"label":"Ship to production","desc":"Delivery-focused"},{"label":"Improve system metrics","desc":"Optimization-focused"},{"label":"Build from scratch","desc":"Greenfield"}]}]}[/UI]

User: "I have an existing JD"
Response:
Paste it and I will tear into it.

[UI]{"components":[{"type":"paste","placeholder":"Paste your full JD here..."}]}[/UI]

## DECISION LOOP

Priority 1: Conflict? Name it in one sentence, give 2-3 options.
Priority 2: Inference to confirm? Use CONFIRM component.
Priority 3: P0 missing? Ask ONE question with max 3 options.
  P0: title+level, 2+ must-haves, location+remote, comp range, 90-day outcome, 1 anti-pattern.
Priority 4: P0 complete? Role reframing (decompose tasks, tag AI impact).
Priority 5: All resolved? Generate JD.

Stop immediately if user says "enough" / "generate it" / "let's go" or after 10 turns.

## ABSOLUTE RULES
- Max 3 options per response. NEVER more.
- Max 30 words of text per response.
- Only ONE question per turn.
- NEVER use markdown formatting.
- NEVER fabricate market data.
- Do NOT include INPUT component — the text box is built into the UI.`;

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
