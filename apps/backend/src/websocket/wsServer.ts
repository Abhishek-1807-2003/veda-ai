import type { WSMessage } from '@vedaai/shared-types';

/**
 * Broadcast job updates to all connected WebSocket clients
 * This function is set globally by the main server in index.ts
 */
export function broadcastJobUpdate(payload: WSMessage['payload']): void {
  // Use the global broadcast function set in index.ts
  if (typeof global.broadcastJobUpdate === 'function') {
    global.broadcastJobUpdate(payload);
  } else {
    console.warn('⚠️ broadcastJobUpdate not initialized. WebSocket server may not be running.');
  }
}

/**
 * Legacy function for backward compatibility
 * WebSocket server is now integrated into main HTTP server in index.ts
 */
export function initWSServer(port: number): void {
  console.warn('⚠️ initWSServer is deprecated. WebSocket is now on the same port as HTTP server.');
}
