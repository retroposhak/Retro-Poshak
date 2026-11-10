import { env } from '../config/env.js';

let resendClient = null;
async function getResend() {
  if (resendClient) return resendClient;
  if (!env.mail.resendApiKey) return null;
  const { Resend } = await import('resend');
  resendClient = new Resend(env.mail.resendApiKey);
  return resendClient;
}

async function send({ to, subject, html }) {
  const client = await getResend();
  if (!client) {
    console.log('\n─────────────── ✉ DEV EMAIL (Resend not configured) ───────────────');
    console.log('To     :', to);
    console.log('From   :', env.mail.from);
    console.log('Subject:', subject);
    console.log('Body   :');
    console.log(html.replace(/<[^>]+>/g, '').trim());
    console.log('───────────────────────────────────────────────────────────────────\n');
    return { dev: true };
  }
  const result = await client.emails.send({ from: env.mail.from, to, subject, html });
  return result;
}

const layout = (body) => `
  <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f5f0e8;color:#1a1a1a;border-radius:16px">
    <h1 style="font-family:Georgia,serif;font-style:italic;font-size:24px;margin:0 0 8px">Retro Poshak</h1>
    <p style="color:#7a7a7a;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;margin:0">Pehno Yaaden · Est. 2026</p>
    <hr style="border:none;border-top:1px solid #d8c9ac;margin:24px 0" />
    ${body}
    <hr style="border:none;border-top:1px solid #d8c9ac;margin:24px 0" />
    <p style="color:#7a7a7a;font-size:11px;margin:0">Same streets. Different generations. Same feelings.</p>
  </div>
`;

export async function sendPasswordResetEmail(toEmail, name, rawToken) {
  const resetUrl = `${env.clientOrigin}/reset-password/${rawToken}`;
  return send({
    to: toEmail,
    subject: 'Reset your Retro Poshak password',
    html: layout(`
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click below to choose a new one. This link expires in <strong>10 minutes</strong>.</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${resetUrl}" style="background:#1a1a1a;color:#f5f0e8;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:13px;letter-spacing:1.6px;text-transform:uppercase">Reset Password</a>
      </p>
      <p style="color:#7a7a7a;font-size:13px">If you didn't request this, ignore this email.</p>
    `),
  });
}

export async function sendOrderConfirmationEmail(toEmail, name, order) {
  const itemsHtml = order.items.map(
    (i) => `
    <tr>
      <td style="padding:8px 0">${i.name} (${i.size}, ${i.colour}) × ${i.quantity}</td>
      <td style="text-align:right">₹${(i.unitPrice * i.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `
  ).join('');

  return send({
    to: toEmail,
    subject: `Order #${order.orderId} confirmed — Retro Poshak`,
    html: layout(`
      <p>Hi ${name},</p>
      <p>Thank you for your order. We're preparing it with care.</p>
      <p><strong>Order #${order.orderId}</strong><br/>
      Placed ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <table style="width:100%;margin-top:16px;border-collapse:collapse;font-size:13px">
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="margin-top:16px"><strong>Total: ₹${order.total.toLocaleString('en-IN')}</strong> · ${order.paymentMethod}</p>
      <p style="margin-top:24px">
        <a href="${env.clientOrigin}/orders/${order.orderId}" style="background:#b33a3a;color:#f5f0e8;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">View Order</a>
      </p>
      <p style="color:#7a7a7a;font-size:12px;margin-top:24px">Questions? Reply to this email or contact us at retroposhak2026@gmail.com</p>
    `),
  });
}