import Anthropic from '@anthropic-ai/sdk';

let _client = null;

export function getAnthropicClient() {
  if (!_client) {
    _client = new Anthropic();
  }
  return _client;
}

export var AGENT_ID = process.env.ANTHROPIC_AGENT_ID || 'agent_011CZvk5yQ9pXKdgKvdSDN1v';
export var ENVIRONMENT_ID = process.env.ANTHROPIC_ENVIRONMENT_ID || 'env_id_placeholder';
