import { Router } from 'express';
import { getPolicy, listPolicies } from '../controllers/policyController.js';
const router = Router();
router.get('/', listPolicies);
router.get('/:slug', getPolicy);
export default router;