import { ContactMessage } from '../models/ContactMessage.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const submit = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw ApiError.badRequest('All fields are required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw ApiError.badRequest('Invalid email');
  }
  if (!['general', 'order', 'return', 'feedback', 'collab'].includes(subject)) {
    throw ApiError.badRequest('Invalid subject');
  }

  const doc = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true, id: doc._id });
});