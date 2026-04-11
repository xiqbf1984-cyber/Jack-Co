import { getAnthropicClient, AGENT_ID, getEnvironmentId } from '@/lib/anthropic';

export var runtime = 'nodejs';

/**
 * POST /api/generate-jd
 * Body: { message: string, sessionId?: string }
 *
 * Returns SSE stream with events:
 *   type=session   → { sessionId }           (first event, on new session)
 *   type=chat      → { text, delta }         (agent's conversational reply chunk)
 *   type=done      → { fullText }            (stream finished, full response)
 *   type=error     → { text }                (error message)
 */
export async function POST(req) {
  var body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  var message = body.message;
  var sessionId = body.sessionId || null;

  if (!message || typeof message !== 'string') {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400 });
  }

  var client;
  var environmentId;
  try {
    client = getAnthropicClient();
    environmentId = getEnvironmentId();
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }

  var encoder = new TextEncoder();

  var stream = new ReadableStream({
    async start(controller) {
      function send(type, data) {
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: type, ...data }) + '\n\n'));
      }

      try {
        // Create session if we don't have one
        if (!sessionId) {
          var session = await client.beta.sessions.create({
            agent: AGENT_ID,
            environment_id: environmentId,
          });
          sessionId = session.id;
          send('session', { sessionId: sessionId });
        }

        // Open stream FIRST, then send the message (stream-first pattern)
        var eventStream = await client.beta.sessions.events.stream(sessionId);

        await client.beta.sessions.events.send(sessionId, {
          events: [{
            type: 'user.message',
            content: [{ type: 'text', text: message }],
          }],
        });

        // Collect agent messages from the stream
        var agentText = '';

        for await (var event of eventStream) {
          if (event.type === 'agent.message') {
            for (var block of (event.content || [])) {
              if (block.type === 'text' && block.text) {
                agentText += block.text;
                send('chat', { text: block.text, delta: true });
              }
            }
          }

          // Session finished this turn
          if (event.type === 'session.status_idle') {
            if (event.stop_reason && event.stop_reason.type === 'requires_action') {
              continue;
            }
            break; // end_turn or retries_exhausted
          }

          if (event.type === 'session.status_terminated') {
            break;
          }

          if (event.type === 'session.error') {
            var errMsg = 'Agent error';
            if (event.error && typeof event.error === 'object') {
              errMsg = event.error.message || event.error.type || errMsg;
            } else if (typeof event.error === 'string') {
              errMsg = event.error;
            }
            send('error', { text: errMsg });
            break;
          }
        }

        send('done', { fullText: agentText });
      } catch (err) {
        send('error', { text: err.message || 'Unknown error' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
