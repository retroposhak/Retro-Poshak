import { PolicyPage } from '../models/PolicyPage.js';

const POLICIES = [
  // ── RETURNS ─────────────────────────────────
  {
    slug: 'returns',
    title: 'Returns & Exchanges',
    eyebrow: 'PEACE OF MIND',
    subtitle: 'Not the right fit? No worries. We offer easy returns and exchanges within 7 days of delivery.',
    sections: [
      {
        heading: 'Return Window',
        body: "You can request a return or exchange within 7 days of receiving your order. After this window, we're unable to accept returns.",
        note: 'Important: Items must be unworn, unwashed, and in their original packaging with all tags attached.',
      },
      {
        heading: 'Eligibility for Return',
        body: 'To be eligible for a return or exchange, your item must meet the following conditions:',
        bullets: [
          'Unworn, unwashed, and free from any stains or odours',
          'Original tags and packaging intact',
          'Return request raised within 7 days of delivery',
          'Proof of purchase (order ID) available',
          'Items marked as "Final Sale" or "Clearance" are not returnable',
          'Custom or personalised products are not returnable',
          'Items damaged due to misuse or improper washing are not returnable',
        ],
      },
      {
        heading: 'How to Initiate a Return',
        body: 'Log in to your account and go to My Orders. Select the item you’d like to return or exchange, choose a reason, and submit your request. Our team will approve the request within 24–48 hours. Schedule a pickup or ship the item back using the address we provide. Once we receive and inspect the item, we’ll process your refund or ship the exchange within 5–7 business days.',
      },
      {
        heading: 'Refunds',
        body: 'Refunds are issued to the original payment method. For Cash on Delivery orders, refunds are processed via bank transfer — our team will contact you for details.',
        bullets: [
          'Prepaid Orders: Refund to source in 5–7 business days',
          'COD Orders: Refund via bank transfer in 7–10 business days',
        ],
      },
      {
        heading: 'Exchanges',
        body: 'Want a different size or colour? We offer free exchanges within the 7-day window, subject to availability. If the requested size or colour is out of stock, we’ll issue a full refund.',
      },
      {
        heading: 'Damaged or Wrong Items',
        body: 'If you received a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with your order ID and photos. We’ll arrange a free replacement or full refund — no questions asked.',
      },
    ],
  },

  // ── FAQS ────────────────────────────────────
  {
    slug: 'faqs',
    title: 'Frequently Asked Questions',
    eyebrow: 'GOT QUESTIONS?',
    subtitle: 'Everything you need to know about shopping with Retro Poshak — from orders to returns.',
    faqs: [
      { group: 'Orders & Shopping', question: 'How do I place an order?', answer: 'Simply browse our shop, choose your size and colour, and click "Add to Cart". Once you’re ready, head to checkout, enter your details, and place your order. You’ll receive a confirmation email right away.' },
      { group: 'Orders & Shopping', question: 'Can I modify or cancel my order after placing it?', answer: 'Yes — you can modify or cancel your order within 2 hours of placing it, as long as it hasn’t been shipped. Just contact us with your order ID and we’ll take care of it.' },
      { group: 'Orders & Shopping', question: 'Do you offer Cash on Delivery (COD)?', answer: 'Absolutely. COD is available across India at no extra charge. You can choose it at checkout.' },
      { group: 'Orders & Shopping', question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards, UPI, net banking, and wallets. Cash on Delivery is also available.' },

      { group: 'Shipping & Delivery', question: 'How long does delivery take?', answer: 'Metro cities: 2–4 business days. Other cities: 4–6 business days. Remote areas: 6–9 business days. You’ll get a tracking link once your order ships.' },
      { group: 'Shipping & Delivery', question: 'Is shipping free?', answer: 'Yes — free shipping on all orders above ₹1,499. For orders below that, a flat shipping fee of ₹79 applies.' },
      { group: 'Shipping & Delivery', question: 'Do you ship internationally?', answer: 'Not yet — we currently ship only within India. International shipping is coming soon!' },
      { group: 'Shipping & Delivery', question: 'How can I track my order?', answer: 'Visit our Track Order page and enter your order ID. You can also use the tracking link sent to your email and SMS.' },

      { group: 'Returns & Exchanges', question: 'What is your return policy?', answer: 'We accept returns and exchanges within 7 days of delivery. Items must be unworn, unwashed, and in original packaging.' },
      { group: 'Returns & Exchanges', question: 'How long do refunds take?', answer: 'Prepaid refunds are processed to the original payment method within 5–7 business days. COD refunds are made via bank transfer within 7–10 business days.' },
      { group: 'Returns & Exchanges', question: 'Can I exchange for a different size?', answer: 'Yes — free exchanges within 7 days, subject to stock availability. If your size is unavailable, we’ll issue a full refund.' },

      { group: 'Products & Sizing', question: 'How do your tees fit?', answer: 'Our signature fit is oversized — relaxed through the body with dropped shoulders. If you prefer a classic fit, we suggest sizing down.' },
      { group: 'Products & Sizing', question: 'How should I care for my Retro Poshak tee?', answer: 'Machine wash cold, inside out, with similar colours. Do not bleach. Tumble dry low or hang dry. Iron on low heat, avoiding the print.' },
      { group: 'Products & Sizing', question: 'Will the print fade over time?', answer: 'With proper care, our prints hold up beautifully. Wash inside out in cold water and avoid direct ironing on the graphic to keep it looking fresh for years.' },
    ],
  },

  // ── PRIVACY ─────────────────────────────────
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    eyebrow: 'YOUR PRIVACY MATTERS',
    subtitle: "We're committed to protecting your personal information. Here's how we collect, use, and safeguard your data.",
    updatedAtLabel: 'Last Updated: October 2026',
    sections: [
      { heading: '1. Information We Collect', body: 'When you interact with Retro Poshak, we may collect the following information:', bullets: ['Personal details: Name, email address, phone number, and shipping address', 'Order details: Products purchased, sizes, colours, and payment method', 'Account information: Login credentials and order history', 'Device & usage data: IP address, browser type, and pages visited'] },
      { heading: '2. How We Use Your Information', body: 'We use your information to:', bullets: ['Process and fulfil your orders', 'Send order confirmations and shipping updates', 'Respond to customer service inquiries', 'Improve our website, products, and shopping experience', 'Send promotional emails (only if you’ve opted in)', 'Prevent fraud and ensure website security'] },
      { heading: '3. Information Sharing', body: 'We never sell your personal information. We may share it only with:', bullets: ['Courier partners — to deliver your order', 'Payment processors — to securely handle transactions', 'Service providers — who help us operate the website (under strict confidentiality)', 'Legal authorities — if required by law'] },
      { heading: '4. Data Security', body: 'We implement industry-standard security measures to protect your data from unauthorised access, alteration, or disclosure. All payment transactions are encrypted using SSL technology.', note: 'Note: While we take every precaution, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.' },
      { heading: '5. Cookies', body: 'We use cookies and similar technologies to:', bullets: ['Keep you logged in to your account', 'Remember your cart and preferences', 'Analyse website traffic and improve performance', 'Show relevant product recommendations'] },
      { heading: '6. Your Rights', body: 'You have the right to:', bullets: ['Access the personal information we hold about you', 'Request corrections to inaccurate data', 'Request deletion of your account and personal data', 'Opt out of marketing communications at any time', 'Withdraw consent for data processing'] },
      { heading: '7. Third-Party Links', body: "Our website may contain links to third-party sites. We're not responsible for the privacy practices of those sites. We encourage you to read their privacy policies before providing any personal information." },
      { heading: "8. Children's Privacy", body: 'Our website is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us so we can delete it.' },
      { heading: '9. Changes to This Policy', body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this page periodically.' },
      { heading: '10. Contact Us', body: 'If you have any questions about this Privacy Policy or how we handle your data, please reach out to us.' },
    ],
  },

  // ── TERMS ───────────────────────────────────
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    eyebrow: 'LEGAL',
    subtitle: 'Please read these terms carefully before using our website or placing an order.',
    updatedAtLabel: 'Last Updated: October 2026',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By accessing or using the Retro Poshak website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.' },
      { heading: '2. Use of Website', body: 'You agree to use this website only for lawful purposes. You must not:', bullets: ['Use the site in any way that violates applicable laws or regulations', 'Attempt to gain unauthorised access to any part of the site', 'Reproduce, duplicate, or copy any content without permission', 'Transmit any harmful code, viruses, or malicious software'] },
      { heading: '3. Products & Pricing', body: 'All products are subject to availability. We reserve the right to modify prices without prior notice, limit quantities, refuse or cancel any order at our discretion, and discontinue any product at any time. While we strive for accuracy, colours may appear slightly different depending on your screen.' },
      { heading: '4. Orders & Payment', body: "When you place an order, you're making an offer to purchase. We reserve the right to accept or decline your order. Payment must be made in full before dispatch, except for Cash on Delivery orders. All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise." },
      { heading: '5. Shipping & Delivery', body: "Delivery timelines are estimates and not guarantees. We're not liable for delays caused by courier partners, natural events, or circumstances beyond our control. Risk of loss passes to you upon delivery." },
      { heading: '6. Returns & Refunds', body: 'Our return and refund policy is outlined on our Returns & Exchanges page. By placing an order, you agree to those terms.' },
      { heading: '7. Intellectual Property', body: 'All content on this website — including logos, designs, graphics, text, and images — is the property of Retro Poshak and protected by Indian and international copyright laws. You may not reproduce, distribute, or use any content without prior written permission.' },
      { heading: '8. User Accounts', body: "You're responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. Notify us immediately of any unauthorised use." },
      { heading: '9. Limitation of Liability', body: 'To the maximum extent permitted by law, Retro Poshak shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or products purchased. Our total liability shall not exceed the amount paid for the product in question.' },
      { heading: '10. Governing Law', body: 'These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.' },
      { heading: '11. Changes to Terms', body: 'We may update these Terms & Conditions from time to time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance of the new terms.' },
      { heading: '12. Contact', body: 'If you have any questions about these terms, please contact us.' },
    ],
  },

  // ── SHIPPING ────────────────────────────────
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    eyebrow: 'DELIVERY',
    subtitle: 'Every order is packed with care and shipped across India. Here’s everything you need to know about delivery.',
    sections: [
      { heading: 'Shipping Timelines', body: 'All orders are processed within 1–2 business days of being placed. Once dispatched, you’ll receive a tracking link via email and SMS.', bullets: ['Metro Cities: 2–4 business days', 'Other Cities: 4–6 business days', 'Remote / Rural Areas: 6–9 business days'] },
      { heading: 'Shipping Charges', body: 'Shipping charges are calculated at checkout and displayed before payment.', bullets: ['Free Shipping: On all orders above ₹1,499', 'Standard Shipping: ₹79 for orders below ₹1,499', 'Cash on Delivery (COD): Available across India at no extra charge'] },
      { heading: 'Order Tracking', body: 'Once your order is shipped, you’ll receive a tracking ID via email and SMS. You can use this ID to check the status of your delivery anytime. You can also track your order directly from our website by visiting the Track Order page.' },
      { heading: 'International Shipping', body: 'Currently, we ship only within India. We’re working on bringing Retro Poshak to more countries soon — follow us on social media for updates.' },
      { heading: 'Undelivered Packages', body: 'If a package is returned to us due to an incorrect address, repeated failed delivery attempts, or refusal at the door, we’ll contact you to arrange a re-shipment. Additional shipping charges may apply.' },
      { heading: 'Lost or Damaged Packages', body: 'If your order is lost in transit or arrives damaged, please contact us within 48 hours of the expected delivery date with your order ID and photos (if applicable). We’ll resolve it as quickly as possible.' },
    ],
  },

  // ── SIZE GUIDE ──────────────────────────────
  {
    slug: 'size-guide',
    title: 'Size Guide',
    eyebrow: 'FIND YOUR FIT',
    subtitle: 'Every body is different. Use our measurements to find the fit that feels like it was made for you.',
    sections: [
      { heading: 'How to Measure', body: 'For the most accurate fit, measure yourself over a light t-shirt. Keep the tape snug but not tight. If you’re between two sizes, we recommend sizing up for a relaxed, oversized fit.', bullets: ['Chest — Wrap the tape around the fullest part of your chest, keeping it level under your arms and across your shoulder blades.', 'Length — Measure from the highest point of your shoulder (near the neck) straight down to where you want the hem to sit.', 'Sleeve — Measure from the shoulder seam down to the end of the sleeve, with your arm slightly bent.'] },
      { heading: 'Fit Guide', body: 'Oversized Fit — Relaxed through the body with dropped shoulders and a longer hem. This is our signature silhouette — made to feel lived-in from day one. Regular Fit — Classic straight cut, true to size. Slim Fit — Tailored closer to the body with a narrower chest and sleeve.' },
    ],
    sizeTable: {
      headers: ['Size', 'Chest', 'Length', 'Sleeve', 'Shoulder'],
      rows: [
        ['XS', '38"', '26"', '8"', '17"'],
        ['S', '40"', '27"', '8.5"', '18"'],
        ['M', '42"', '28"', '9"', '19"'],
        ['L', '44"', '29"', '9.5"', '20"'],
        ['XL', '46"', '30"', '10"', '21"'],
        ['XXL', '48"', '31"', '10.5"', '22"'],
      ],
    },
  },
];

export async function seedPolicies({ reset = true } = {}) {
  if (reset) {
    await PolicyPage.deleteMany({});
    console.log('[seed] Cleared policy pages');
  }

  const inserted = await PolicyPage.insertMany(POLICIES);
  console.log(`[seed] Inserted ${inserted.length} policy pages`);
  inserted.forEach((p) =>
    console.log(
      `        · ${p.title} (${p.sections.length} sections, ${p.faqs.length} faqs, ${p.sizeTable?.rows?.length || 0} size rows)`
    )
  );

  return { policies: inserted.length };
}