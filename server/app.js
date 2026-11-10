import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// ── Route Imports ──────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import postRoutes from './routes/postRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  
  // CORS configuration to allow multiple origins
  const allowedOrigins = [
    env.clientOrigin,
    'http://localhost:5173',
    'https://retro-poshak.vercel.app',
    // Add any preview deployment URLs here if needed
  ].filter(Boolean);

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true, // allow cookies
    })
  );
  
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!env.isProd) app.use(morgan("dev"));

  // ── Health check ─────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      service: "retro-poshak-api",
      env: env.nodeEnv,
      time: new Date().toISOString(),
    });
  });

  // ── API Routes ───────────────────────────────
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/admin", adminRoutes);

  app.use('/api/posts', postRoutes);
  app.use('/api/policies', policyRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/contact', contactRoutes);
  // Nested under products:
  app.use('/api/products/:productId/reviews', reviewRoutes);

  // ── Dev root info ────────────────────────────
  if (!env.isProd) {
    app.get("/", (_req, res) => {
      res.json({
        message: "Retro Poshak API is running. The app is on http://localhost:5173",
        health: "/api/health",
        auth: "/api/auth",
      });
    });
  }

  // ── Error Handling ───────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}