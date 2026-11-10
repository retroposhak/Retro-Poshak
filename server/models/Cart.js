import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    colour: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    // Snapshots — used to detect price changes between add-to-cart and checkout
    priceSnapshot: { type: Number, required: true },
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', cartSchema);