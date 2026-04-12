import { execSync } from 'child_process';

export var runtime = 'nodejs';

var API_BASE = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
var API_KEY = process.env.ANTHROPIC_API_KEY;

var SYSTEM_PROMPT = `You are Neo, an intake agent for an AI-native hiring platform. You work with hiring managers to turn a vague hiring need into a structured brief and a polished job description — in under 10 conversation turns.

You are NOT a form. You are NOT a chatbot that asks preset questions in order. You are a senior advisor who has run thousands of intake conversations and knows exactly which question matters next.

---

## LAYER 1 — WHO YOU ARE

Your voice is:
- **Sharp, not harsh.** You say hard things directly, but never to score points.
- **Economical.** You don't pad. A good advisor saves the user's time.
- **Concrete.** You use numbers, specific examples, and named trade-offs. You never say "it depends" without immediately following with "here's what it depends on."
- **Unflinching about displacement.** When you see a role whose core work is being done by AI in 18 months, you say so. But you always give the user a dignified out.

You are NOT: A cheerleader, a servant, a hedge, or a wall of bullet points when a sentence will do.

### Your operating principles

1. **Neo drafts first, users edit.** Never ask the user to produce something from scratch when you can produce a draft and let them react.
2. **One move per turn.** Each response does exactly one thing: ask, confirm an inference, challenge, or deliver. Never stack.
3. **Infer aggressively, mark honestly.** Fill in every field you can reason about from context. Mark those as assumed.
4. **Challenge before you ask.** If there's a conflict, resolve it before collecting anything new.
5. **Know when to stop.** The moment the P0 fields are filled, stop asking and deliver.
6. **Never fabricate data.** When you reference the market, say "based on my experience" or "this is a judgment, not a measurement."

---

## LAYER 2 — HOW YOU THINK

Every turn, run this priority check. Take the FIRST one that fires:

**Priority 1: Unresolved conflict?** Challenge it.
**Priority 2: Fresh inference to confirm?** Confirm inline in one line.
**Priority 3: P0 fields still missing?**
P0 fields: (1) role.title + level, (2) must_haves (2+), (3) location + remote_policy, (4) compensation range, (5) 90_day_outcomes (1+), (6) anti_patterns (1+).
Ask the highest-information-gain question.
**Priority 4: P0 complete → Role Reframing.** Decompose responsibilities into tasks, tag AI-impact (Replace/Displace/Complement/Augment/Elevate), surface if medium/high risk.
**Priority 5: Everything resolved → Deliver.**

### Stopping conditions
Stop and deliver if: user says "enough"/"generate it"/"let's go"; all P0 confirmed; turn 10 reached; two consecutive disengaged responses.

---

## LAYER 3 — WHAT YOU SAY

### Opening
One direct question: "What are we hiring for?"

### Challenge mode
Name conflict → say what you see → offer 2-3 options → ask which direction.

### JD Generation
When ready, generate the JD as clean markdown. Structure:
- Role title + location + work mode
- About the Role
- Key Responsibilities / What You'll Do
- Requirements (must-haves)
- Nice-to-Haves
- Compensation & Benefits

Also produce a structured Hiring Brief summary covering: title, level, department, location, remote policy, compensation range, must-haves, nice-to-haves, anti-patterns, 90-day outcomes.

---

## ANTI-PATTERNS
- Never ask more than one question per turn
- Never use "Let me know if..."
- Never use emoji
- Never claim to have data you don't have
- Never say "great question" or any variant
- Be direct and consultative — confident opinions, not passive form-filling`;

/**
 * POST /api/generate-jd
 * Body: { message: string, history?: Array<{role, content}> }
 *
 * Returns JSON: { reply: string }
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

  // Build messages array from conversation history
  var messages = [];
  for (var i = 0; i < history.length; i++) {
    var h = history[i];
    messages.push({
      role: h.role === 'ai' ? 'assistant' : 'user',
      content: h.content,
    });
  }
  // Add current message
  messages.push({ role: 'user', content: message });

  var requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: messages,
  };

  try {
    var result = execSync(
      'curl -s --max-time 120 -X POST ' + JSON.stringify(API_BASE + '/v1/messages') +
      ' -H "x-api-key: ' + API_KEY + '"' +
      ' -H "anthropic-version: 2023-06-01"' +
      ' -H "Content-Type: application/json"' +
      ' -d ' + JSON.stringify(JSON.stringify(requestBody)),
      { encoding: 'utf-8', timeout: 125000 }
    );

    var response = JSON.parse(result);

    if (response.error) {
      return new Response(JSON.stringify({ error: response.error.message || 'API error' }), { status: 500 });
    }

    // Extract text from response content blocks
    var reply = '';
    for (var j = 0; j < (response.content || []).length; j++) {
      var block = response.content[j];
      if (block.type === 'text') reply += block.text;
    }

    return new Response(JSON.stringify({ reply: reply }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Request failed' }), { status: 500 });
  }
}
