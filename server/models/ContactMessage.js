import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: {
      type: String,
      required: true,
      enum: ['general', 'order', 'return', 'feedback', 'collab'],
    },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    isHandled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);