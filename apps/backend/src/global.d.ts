import type { WSMessage } from '@vedaai/shared-types';

/**
 * Global type declarations for the backend server
 */
declare global {
  function broadcastJobUpdate(payload: WSMessage['payload']): void;
}

export {};
