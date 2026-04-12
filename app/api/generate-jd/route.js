import { spawn } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, a senior hiring intake advisor. You help hiring managers turn a vague need into a structured brief and polished job description in under 10 turns.

## RULES

Voice: sharp, economical, concrete. No cheerleading, no hedging, no padding.

Format rules (CRITICAL):
- NEVER use markdown formatting. No **, no ##, no *, no bullet dashes.
- Write in plain, flowing sentences and short paragraphs.
- Keep each response under 120 words unless generating a JD.
- When presenting options, output EXACTLY this JSON block on its own line:
  [OPTIONS]{"items":["Option A description","Option B description","Option C description"]}[/OPTIONS]
  The frontend will render these as clickable chips. Add a one-line sentence before the options block explaining the choice.

## DECISION LOOP (every turn)

Priority 1: Conflict detected? Challenge it. Name the conflict, say what you see, present options.
Priority 2: Fresh inference to confirm? Confirm in one line.
Priority 3: P0 fields missing? Ask ONE question — the highest-information-gain one.
  P0: (1) title + level, (2) 2+ must-haves, (3) location + remote policy, (4) comp range, (5) one 90-day outcome, (6) one anti-pattern.
Priority 4: P0 complete? Do role reframing — decompose tasks, tag AI impact, surface if risky.
Priority 5: All resolved? Generate JD.

## OPENING
One sentence: "What are we hiring for?"

## CHALLENGE MODE
Name conflict in one sentence. Present options via [OPTIONS] block. Ask which direction.

## JD GENERATION
When ready, output the full JD as clean structured text (no markdown). Also output a structured hiring brief.

Stop immediately if user says "enough" / "generate it" / "let's go", or after turn 10, or two disengaged responses in a row.

## ANTI-PATTERNS
- Never ask more than one question per turn
- Never use markdown formatting (**, ##, *, -)
- Never use emoji
- Never say "great question" or "let me know if"
- Never fabricate market data`;

/**
 * POST /api/generate-jd
 * Body: { message: string, history?: Array<{role, content}> }
 * Returns: SSE stream of { type, text } events
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

  var messages = [];
  for (var i = 0; i < history.length; i++) {
    var h = history[i];
    messages.push({
      role: h.role === 'ai' ? 'assistant' : 'user',
      content: h.content,
    });
  }
  messages.push({ role: 'user', content: message });

  var requestBody = {
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
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
          if (!line.startsWith('data: ')) continue;
          if (line === 'data: [DONE]') continue;
          var evt;
          try { evt = JSON.parse(line.slice(6)); } catch (e) { continue; }

          // Text delta
          if (evt.type === 'content_block_delta' && evt.delta && evt.delta.type === 'text_delta') {
            fullText += evt.delta.text;
            send('delta', { text: evt.delta.text });
          }

          // Message complete
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
