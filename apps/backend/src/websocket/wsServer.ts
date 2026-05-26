import { WebSocketServer, WebSocket } from 'ws';
import type { WSMessage } from '@vedaai/shared-types';

let wss: WebSocketServer;
const clients = new Set<WebSocket>();

export function initWSServer(port: number): void {
  wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'CONNECTED' }));
  });

  console.log(`✅ WebSocket server running on port ${port}`);
}

export function broadcastJobUpdate(payload: WSMessage['payload']): void {
  const message: WSMessage = { type: 'JOB_UPDATE', payload };
  const data = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
