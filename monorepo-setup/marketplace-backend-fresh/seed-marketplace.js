const { execSync } = require('child_process');

console.log('🌱 Running marketplace seed script...\n');

try {
  execSync('npx medusa exec ./src/scripts/seed-marketplace.ts', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_VERSION: '20' }
  });
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}