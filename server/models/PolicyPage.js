import mongoose from 'mongoose';

const policyPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      enum: [
        'returns',
        'faqs',
        'privacy',
        'terms',
        'shipping-policy',
        'size-guide',
      ],
    },
    title: { type: String, required: true },
    eyebrow: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    updatedAtLabel: { type: String, default: '' },
    // Simple ordered sections
    sections: [
      {
        heading: { type: String, required: true },
        body: { type: String, default: '' },          // may contain simple markdown-ish text
        bullets: { type: [String], default: [] },
        note: { type: String, default: '' },
        _id: false,
      },
    ],
    // For FAQs only: question/answer pairs
    faqs: [
      {
        group: { type: String, default: '' },
        question: { type: String, required: true },
        answer: { type: String, required: true },
        _id: false,
      },
    ],
    // For size guide
    sizeTable: {
      headers: { type: [String], default: [] },
      rows: { type: [[String]], default: [] },
    },
  },
  { timestamps: true }
);

export const PolicyPage = mongoose.model('PolicyPage', policyPageSchema);