import { Router } from 'express';
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createRazorpayOrder,
  verifyPayment,
  webhook,
} from '../controllers/paymentController.js';

const router = Router();

// Webhook uses raw body — mount BEFORE express.json() in app.js if you ever
// upgrade to use `express.raw()`. Here we rely on Razorpay's canonical JSON.
router.post('/webhook', webhook);

router.use(requireAuth);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;