import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

// 1. Create the Express app at the top level
const app = createApp();

// 2. Connect to the database immediately (Vercel waits for this to resolve)
connectDB().catch((err) => {
  console.error('[server] Database connection failed:', err);
});

// 3. Export the app for Vercel Serverless
export default app;

// 4. Only run the local server listener if NOT in production
if (env.nodeEnv !== 'production') {
  const server = app.listen(env.port, () => {
    console.log(`[server] Listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 8000).unref();
  };
  
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
} else {
  console.log('[server] Running in serverless production mode.');
}