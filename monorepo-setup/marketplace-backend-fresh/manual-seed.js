const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function manualSeed() {
  console.log('🌱 Starting manual database seed...');
  
  try {
    // Get default region
    const regionResult = await pool.query(`
      SELECT id, currency_code, name FROM region LIMIT 1
    `);
    
    if (regionResult.rows.length === 0) {
      console.error('No region found. Please run medusa seed first.');
      process.exit(1);
    }
    
    const region = regionResult.rows[0];
    console.log(`✅ Found region: ${region.name}`);
    
    // Get sales channel
    const salesChannelResult = await pool.query(`
      SELECT id FROM sales_channel WHERE name = 'Default Sales Channel' LIMIT 1
    `);
    
    const salesChannelId = salesChannelResult.rows[0]?.id;
    if (!salesChannelId) {
      console.error('No sales channel found');
      process.exit(1);
    }
    
    console.log('✅ Found sales channel');
    
    // Get existing customers
    const customerResult = await pool.query(`
      SELECT id, email, first_name, last_name FROM customer LIMIT 3
    `);
    
    if (customerResult.rows.length === 0) {
      console.error('No customers found in database');
      process.exit(1);
    }
    
    const customers = customerResult.rows;
    console.log(`✅ Found ${customers.length} customers`);
    
    // Create sample orders
    console.log('📦 Creating sample orders...');
    
    const orderStatuses = ['pending', 'completed', 'processing'];
    
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const orderId = `order_01JFKX${Date.now()}${i}`;
      const displayId = i + 1;
      
      try {
        // Create order
        await pool.query(`
          INSERT INTO "order" (
            id,
            created_at,
            updated_at,
            display_id,
            region_id,
            email,
            customer_id,
            sales_channel_id,
            currency_code,
            canceled_at,
            metadata,
            status
          ) VALUES (
            $1,
            NOW(),
            NOW(),
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            NULL,
            $8,
            $9
          )
        `, [
          orderId,
          displayId,
          region.id,
          customer.email,
          customer.id,
          salesChannelId,
          region.currency_code,
          JSON.stringify({
            source: 'marketplace_seed',
            created_by: 'manual_seed_script'
          }),
          orderStatuses[i % orderStatuses.length]
        ]);
        
        console.log(`✅ Created order #${displayId} for ${customer.email} (${orderStatuses[i % orderStatuses.length]})`);
        
        // Create a shipping address for the order
        await pool.query(`
          INSERT INTO order_shipping_address (
            id,
            created_at,
            updated_at,
            address_1,
            city,
            province,
            postal_code,
            country_code,
            order_id
          ) VALUES (
            'orderaddr_' || $1,
            NOW(),
            NOW(),
            '123 Main St',
            'New York',
            'NY',
            '10001',
            'us',
            $1
          )
        `, [orderId]);
        
      } catch (error) {
        console.error(`Failed to create order for ${customer.email}:`, error.message);
      }
    }
    
    console.log('✨ Manual seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

manualSeed();