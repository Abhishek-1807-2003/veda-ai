import { env } from '../../config/env.js';
import { OpenAIProvider } from './openaiProvider.js';

export interface AIProvider {
  generate(prompt: string): Promise<string>;
}

export function getAIProvider(): AIProvider {
  const provider = env.AI_PROVIDER;

  if (provider === 'openai') {
    return new OpenAIProvider();
  }

  // TODO: Add anthropic / together branches here
  throw new Error(`Unknown AI_PROVIDER: ${provider}`);
}
