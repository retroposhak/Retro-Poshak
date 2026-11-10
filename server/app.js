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
  
  // Allow requests from localhost and your Vercel frontend
  const allowedOrigins = [
    'http://localhost:5173',
    'https://retro-poshak.vercel.app',
    // Add your custom GoDaddy domain here once configured (e.g., 'https://yourdomain.com')
  ];

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images/assets to load cross-origin
  }));

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || env.nodeEnv !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Crucial for cookies
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