export function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}