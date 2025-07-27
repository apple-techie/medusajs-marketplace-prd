-- Insert test orders for the marketplace
-- This is a temporary solution to populate the database with test data

-- First, let's check if we have the necessary data
DO $$
DECLARE
    v_region_id TEXT;
    v_currency_code TEXT;
    v_customer_id TEXT;
    v_sales_channel_id TEXT;
BEGIN
    -- Get the first region
    SELECT id, currency_code INTO v_region_id, v_currency_code 
    FROM region 
    LIMIT 1;
    
    -- Get the first customer
    SELECT id INTO v_customer_id 
    FROM customer 
    WHERE email = 'john.doe@example.com'
    LIMIT 1;
    
    -- Get the default sales channel
    SELECT id INTO v_sales_channel_id 
    FROM sales_channel 
    WHERE name = 'Default Sales Channel'
    LIMIT 1;
    
    -- Only proceed if we have all required data
    IF v_region_id IS NOT NULL AND v_customer_id IS NOT NULL AND v_sales_channel_id IS NOT NULL THEN
        -- Insert a few test orders
        INSERT INTO "order" (
            id,
            display_id,
            status,
            email,
            region_id,
            customer_id,
            sales_channel_id,
            currency_code,
            total,
            subtotal,
            item_total,
            shipping_total,
            tax_total,
            discount_total,
            gift_card_total,
            created_at,
            updated_at
        ) VALUES 
        (
            'order_' || gen_random_uuid(),
            1001,
            'pending',
            'john.doe@example.com',
            v_region_id,
            v_customer_id,
            v_sales_channel_id,
            v_currency_code,
            12999, -- $129.99
            11999, -- $119.99
            11999, -- $119.99
            1000,  -- $10.00 shipping
            0,     -- $0 tax
            0,     -- $0 discount
            0,     -- $0 gift card
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days'
        ),
        (
            'order_' || gen_random_uuid(),
            1002,
            'completed',
            'john.doe@example.com',
            v_region_id,
            v_customer_id,
            v_sales_channel_id,
            v_currency_code,
            35999, -- $359.99
            34999, -- $349.99
            34999, -- $349.99
            1000,  -- $10.00 shipping
            0,     -- $0 tax
            0,     -- $0 discount
            0,     -- $0 gift card
            NOW() - INTERVAL '5 days',
            NOW() - INTERVAL '3 days'
        );
        
        RAISE NOTICE 'Test orders created successfully!';
    ELSE
        RAISE NOTICE 'Missing required data. Please run marketplace seed first.';
        RAISE NOTICE 'Region ID: %, Customer ID: %, Sales Channel ID: %', v_region_id, v_customer_id, v_sales_channel_id;
    END IF;
END $$;