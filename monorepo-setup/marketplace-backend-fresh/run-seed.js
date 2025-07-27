require('dotenv').config();

async function runSeed() {
  const { runSeedCommand } = await import('@medusajs/cli/dist/commands/run/seed.js');
  
  await runSeedCommand({
    directory: process.cwd(),
    seed: './src/scripts/seed-marketplace.ts'
  });
}

runSeed().catch(console.error);