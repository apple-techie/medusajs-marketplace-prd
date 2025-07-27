// SendGrid Notification Configuration for medusa-config.ts

const sendgridConfig = {
  resolve: "@medusajs/notification-sendgrid",
  options: {
    api_key: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
    // Dynamic template IDs from SendGrid
    templates: {
      // Customer notifications
      order_placed: {
        id: process.env.SENDGRID_ORDER_PLACED_ID,
        subject: "Order Confirmation - {{order.display_id}}",
      },
      order_shipped: {
        id: process.env.SENDGRID_ORDER_SHIPPED_ID,
        subject: "Your order has been shipped!",
      },
      order_canceled: {
        id: process.env.SENDGRID_ORDER_CANCELED_ID,
        subject: "Order Canceled - {{order.display_id}}",
      },
      order_refund_created: {
        id: process.env.SENDGRID_ORDER_REFUND_ID,
        subject: "Refund Processed - {{order.display_id}}",
      },
      
      // Customer account
      customer_created: {
        id: process.env.SENDGRID_CUSTOMER_CREATED_ID,
        subject: "Welcome to {{company_name}}!",
      },
      customer_password_reset: {
        id: process.env.SENDGRID_RESET_PASSWORD_ID,
        subject: "Reset your password",
      },
      
      // Vendor notifications
      vendor_order_placed: {
        id: process.env.SENDGRID_VENDOR_ORDER_ID,
        subject: "New Order - {{order.display_id}}",
      },
      vendor_approved: {
        id: process.env.SENDGRID_VENDOR_APPROVED_ID,
        subject: "Your vendor account has been approved!",
      },
      
      // Admin notifications
      admin_vendor_request: {
        id: process.env.SENDGRID_ADMIN_VENDOR_REQUEST_ID,
        subject: "New Vendor Application - {{vendor.name}}",
      },
    },
    
    // Global template data
    template_data: {
      company_name: "Marketplace",
      support_email: "support@marketplace.com",
      website_url: "https://marketplace.com",
    },
    
    // SendGrid settings
    settings: {
      sandbox_mode: process.env.NODE_ENV === "development",
      ip_pool_name: "marketplace_transactional",
      categories: ["transactional", "marketplace"],
    },
  }
}

// Email template examples for SendGrid Dynamic Templates

// Order Placed Template Variables:
export const orderPlacedTemplateVars = {
  customer: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
  },
  order: {
    display_id: "#1001",
    created_at: "2024-01-20",
    total: "$99.99",
    items: [
      {
        title: "Product Name",
        quantity: 2,
        price: "$49.99",
        thumbnail: "https://example.com/image.jpg",
      }
    ],
    shipping_address: {
      address_1: "123 Main St",
      city: "New York",
      province: "NY",
      postal_code: "10001",
    },
  },
  tracking_url: "https://marketplace.com/orders/12345",
}

// Vendor Order Notification Template Variables:
export const vendorOrderTemplateVars = {
  vendor: {
    name: "Vendor Shop Name",
    contact_name: "Jane Smith",
  },
  order: {
    display_id: "#1001",
    items: [
      {
        title: "Your Product",
        quantity: 1,
        price: "$29.99",
        sku: "PROD-001",
      }
    ],
    fulfillment_deadline: "2024-01-22",
  },
  dashboard_url: "https://marketplace.com/vendor/orders/12345",
}

// Add to medusa-config.ts modules array
export default sendgridConfig