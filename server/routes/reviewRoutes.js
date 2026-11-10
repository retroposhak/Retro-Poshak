import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listReviews, createReview } from '../controllers/reviewController.js';

// Mounted under /api/products — see app.js
const router = Router({ mergeParams: true });
router.get('/', listReviews);
router.post('/', requireAuth, createReview);

export default router;