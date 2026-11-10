import { Newsletter } from '../models/Newsletter.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email, source = 'footer' } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('Please enter a valid email');
  }
  try {
    await Newsletter.create({ email: email.toLowerCase(), source });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ success: true, message: 'You are already subscribed' });
    }
    throw err;
  }
  res.json({ success: true, message: 'Subscribed — welcome to the loop.' });
});