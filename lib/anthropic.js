import Anthropic from '@anthropic-ai/sdk';

let _client = null;

export function getAnthropicClient() {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    _client = new Anthropic({
      timeout: 120000, // 2 min — session creation + agent response can be slow
    });
  }
  return _client;
}

export var AGENT_ID = process.env.ANTHROPIC_AGENT_ID || 'agent_011CZvk5yQ9pXKdgKvdSDN1v';

export function getEnvironmentId() {
  var id = process.env.ANTHROPIC_ENVIRONMENT_ID;
  if (!id) {
    throw new Error('ANTHROPIC_ENVIRONMENT_ID environment variable is not set. Create one via the Anthropic API or CLI.');
  }
  return id;
}
