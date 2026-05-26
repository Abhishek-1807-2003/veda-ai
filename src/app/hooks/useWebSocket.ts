import { useEffect, useRef, useCallback } from 'react';
import { useAssignmentStore } from '../store/assignmentStore';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4001';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { updateJobStatus } = useAssignmentStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'JOB_UPDATE') {
          const { assignmentId, status, paper, error } = msg.payload;
          updateJobStatus(assignmentId, status, paper);

          if (status === 'completed') {
            toast.success('Question paper generated successfully!', {
              icon: '🎉',
              duration: 4000,
            });
          } else if (status === 'failed') {
            toast.error(`Generation failed: ${error ?? 'Unknown error'}`, {
              duration: 5000,
            });
          } else if (status === 'processing') {
            toast('Generating question paper...', {
              icon: '⏳',
              duration: 2000,
            });
          }
        }
      } catch {
        console.error('WS parse error');
      }
    };

    ws.onerror = () => {
      console.error('WebSocket error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 3s...');
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
  }, [updateJobStatus]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return wsRef;
}
