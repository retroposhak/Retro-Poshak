import { connectDB, disconnectDB } from '../config/db.js';
import { seedProducts } from './seedProducts.js';
import { seedPosts } from './seedPosts.js';
import { seedPolicies } from './seedPolicies.js';
import { seedAdmin } from './seedAdmin.js';

async function main() {
  console.log('━'.repeat(56));
  console.log('  Retro Poshak — Seeding database');
  console.log('━'.repeat(56));

  await connectDB();

  const results = {};

  console.log('\n▸ Products & Categories');
  results.products = await seedProducts({ reset: true });

  console.log('\n▸ Blog Posts');
  results.posts = await seedPosts({ reset: true });

  console.log('\n▸ Policy Pages');
  results.policies = await seedPolicies({ reset: true });

  console.log('\n▸ Admin User');
  const admin = await seedAdmin();
  results.admin = { email: admin.email, role: admin.role };

  console.log('\n' + '━'.repeat(56));
  console.log('  Summary');
  console.log('━'.repeat(56));
  console.log(`  Products   : ${results.products.products}`);
  console.log(`  Categories : ${results.products.categories}`);
  console.log(`  Posts      : ${results.posts.posts}`);
  console.log(`  Policies   : ${results.policies.policies}`);
  console.log(`  Admin      : ${results.admin.email}`);
  console.log('━'.repeat(56));

  await disconnectDB();
  console.log('\n✓ Seeding complete.\n');
}

main().catch(async (err) => {
  console.error('\n✗ Seeding failed:', err);
  await disconnectDB().catch(() => {});
  process.exit(1);
});