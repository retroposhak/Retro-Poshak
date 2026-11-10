import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

const app = createApp();

// This function is what Vercel will call for every request
export default async function handler(req, res) {
  try {
    // 1. Await the connection BEFORE letting Express handle the request
    await connectDB();
    
    // 2. Pass the request to the Express app
    return app(req, res);
  } catch (error) {
    console.error('[server] Database connection failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      details: error.message 
    });
  }
}

// ── Local Development Server ──
// This block only runs when you run `npm run dev` locally.
// Vercel ignores this because it only uses the exported `handler`.
if (env.nodeEnv !== 'production') {
  connectDB().then(() => {
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
  }).catch((err) => {
    console.error('[server] Database connection failed locally:', err);
    process.exit(1);
  });
}