import { PRICING } from '../utils/constants.js';

/**
 * Compute order totals from a list of cart items.
 * Every item must have `{ price, quantity }` already resolved from the DB.
 *
 * @param {{ items: {price: number, quantity: number}[], prepaid?: boolean, coupon?: object|null }} args
 * @returns {{ subtotal:number, shipping:number, discount:number, couponDiscount:number, total:number }}
 */
export function computeTotals({ items, prepaid = false, coupon = null }) {
  const subtotal = items.reduce(
    (sum, i) => sum + Math.round(i.price * i.quantity),
    0
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= PRICING.FREE_SHIPPING_THRESHOLD
      ? 0
      : PRICING.FLAT_SHIPPING_FEE;

  let couponDiscount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount > 0) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'flat') {
      couponDiscount = Math.min(coupon.value, subtotal);
    }
  }

  const prepaidDiscount = prepaid
    ? Math.round((subtotal - couponDiscount) * PRICING.PREPAID_DISCOUNT_RATE)
    : 0;

  const discount = couponDiscount + prepaidDiscount;
  const total = Math.max(0, subtotal + shipping - discount);

  return { subtotal, shipping, discount, couponDiscount, prepaidDiscount, total };
}