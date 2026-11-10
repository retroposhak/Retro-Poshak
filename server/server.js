import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function start() {
  try {
    await connectDB();
    const app = createApp();
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
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();