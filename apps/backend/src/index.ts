import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initWSServer } from './websocket/wsServer.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import worker to start processing jobs
import './queues/workers/generationWorker.js';

async function main() {
  // Connect to MongoDB
  await connectDB();

  // Create Express app
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/v1', routes);

  // Error handler (must be last)
  app.use(errorHandler);

  // Start HTTP server
  app.listen(env.PORT, () => {
    console.log(`✅ API server running on http://localhost:${env.PORT}`);
  });

  // Start WebSocket server
  initWSServer(env.WS_PORT);
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
