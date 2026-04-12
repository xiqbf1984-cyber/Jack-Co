import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. Sharp, economical, concrete. No cheerleading, no hedging.

## RESPONSE FORMAT (CRITICAL)

Every response MUST have two parts:
1. A short text message (1-3 sentences max, NEVER more)
2. A [UI] block with structured components

Text rules:
- NEVER use markdown (no **, ##, *, -)
- NEVER use bullet points or numbered lists in text
- Keep under 50 words unless generating a JD

The [UI] block format (must be valid JSON):
[UI]{"components":[...]}[/UI]

Available component types:

OPTIONS \u2014 clickable choices (use for EVERY question):
{"type":"options","title":"Optional header","items":[
  {"label":"Senior Engineer","desc":"5-7 years, owns systems"},
  {"label":"Staff Engineer","desc":"8+ years, sets direction"}
]}

CHIPS \u2014 show inferred/confirmed facts:
{"type":"chips","title":"Confirmed so far","items":["Remote","Python","Senior level"]}

INPUT \u2014 free-text field (always include as last component):
{"type":"input","placeholder":"Or describe in your own words..."}

CONFIRM \u2014 yes/no on an inference:
{"type":"confirm","text":"This sounds like a Senior IC role, not a manager. Right?"}

PASTE \u2014 multi-line paste area (for JD text, notes, etc.):
{"type":"paste","placeholder":"Paste your full JD here..."}

## EXAMPLES

User: "AI Research Engineer"
Response:
What problem are you solving with this hire?

[UI]{"components":[{"type":"options","title":"Common starting points","items":[{"label":"Paste an existing JD","desc":"I will review and upgrade it"},{"label":"I have a reference person in mind","desc":"Describe them and I will infer requirements"},{"label":"Just the title is enough","desc":"I will draft a strawman for you to react to"}]},{"type":"input","placeholder":"Or just describe the role..."}]}[/UI]

User: "Senior, remote, Python and ML"
Response:
Got it. Filling in what I can.

[UI]{"components":[{"type":"chips","title":"Locked in","items":["Senior level","Remote","Python","ML"]},{"type":"options","title":"What does success look like at 90 days?","items":[{"label":"Ship a model to production","desc":"Delivery-oriented"},{"label":"Improve existing system metrics","desc":"Optimization-oriented"},{"label":"Build the ML platform from scratch","desc":"Greenfield"}]},{"type":"input","placeholder":"Or describe the 90-day goal..."}]}[/UI]

## DECISION LOOP

Priority 1: Conflict? Challenge it with options.
Priority 2: Fresh inference? Show CONFIRM component.
Priority 3: P0 fields missing? Ask with OPTIONS + INPUT.
  P0: title+level, 2+ must-haves, location+remote, comp range, 90-day outcome, 1 anti-pattern.
Priority 4: P0 complete? Role reframing.
Priority 5: All done? Generate JD.

## RULES
- EVERY response must end with [UI]{...}[/UI]
- EVERY question must have clickable options
- ALWAYS include an INPUT component so user can type freely
- Never ask more than one question per turn
- Never fabricate market data
- Stop and deliver when user says "enough" / "generate it" / "let's go"`;

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
