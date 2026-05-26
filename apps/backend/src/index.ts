import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import worker to start processing jobs
import './queues/workers/generationWorker.js';

let wsClients = new Set();

async function main() {
  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Create Express app
    const app = express();

    // Middleware
    const corsOrigin = env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || '*'
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];
    
    app.use(
      cors({
        origin: corsOrigin,
        credentials: env.NODE_ENV === 'development',
      })
    );
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes
    app.use('/api/v1', routes);

    // Error handler (must be last)
    app.use(errorHandler);

    // Create HTTP server for both HTTP and WebSocket
    const server = createServer(app);

    // Initialize WebSocket server on same HTTP server
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
      console.log(`📡 WebSocket client connected (total: ${wsClients.size + 1})`);
      wsClients.add(ws);

      // Send connection confirmation
      ws.send(JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() }));

      ws.on('close', () => {
        wsClients.delete(ws);
        console.log(`📡 WebSocket client disconnected (total: ${wsClients.size})`);
      });

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
        wsClients.delete(ws);
      });
    });

    // Export broadcast function for other modules
    global.broadcastJobUpdate = (payload) => {
      const message = JSON.stringify({ type: 'JOB_UPDATE', payload, timestamp: new Date().toISOString() });
      wsClients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN = 1
          client.send(message);
        }
      });
    };

    // Start HTTP server on all interfaces (0.0.0.0) for Railway compatibility
    const PORT = parseInt(process.env.PORT || '4000', 10);
    const HOST = '0.0.0.0';

    server.listen(PORT, HOST, () => {
      console.log(`✅ Server running on http://${HOST}:${PORT}`);
      console.log(`📡 WebSocket endpoint: ws://*:${PORT}`);
      console.log(`🏥 Health check: GET http://${HOST}:${PORT}/health`);
      console.log(`🔧 Environment: ${env.NODE_ENV}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📋 SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📋 SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

main();
