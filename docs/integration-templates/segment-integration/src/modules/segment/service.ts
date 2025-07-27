import { Analytics } from "@segment/analytics-node"
import { Logger } from "@medusajs/framework/types"

type SegmentServiceOptions = {
  writeKey: string
  flushAt?: number
  flushInterval?: number
}

type TrackEventData = {
  userId?: string
  anonymousId?: string
  event: string
  properties?: Record<string, any>
  context?: Record<string, any>
  timestamp?: Date
}

type IdentifyData = {
  userId?: string
  anonymousId?: string
  traits?: Record<string, any>
  context?: Record<string, any>
  timestamp?: Date
}

export default class SegmentService {
  protected analytics_: Analytics
  protected logger_: Logger

  constructor(
    { logger }: { logger: Logger },
    options: SegmentServiceOptions
  ) {
    this.logger_ = logger

    if (!options.writeKey) {
      this.logger_.warn(
        "Segment write key not provided. Analytics tracking will be disabled."
      )
      return
    }

    try {
      this.analytics_ = new Analytics({
        writeKey: options.writeKey,
        flushAt: options.flushAt || 20,
        flushInterval: options.flushInterval || 10000,
      })

      this.logger_.info("Segment analytics initialized successfully")
    } catch (error) {
      this.logger_.error("Failed to initialize Segment analytics", error)
    }
  }

  /**
   * Track an event
   */
  async track(data: TrackEventData): Promise<void> {
    if (!this.analytics_) {
      return
    }

    try {
      await this.analytics_.track({
        userId: data.userId,
        anonymousId: data.anonymousId,
        event: data.event,
        properties: data.properties || {},
        context: {
          app: {
            name: "MedusaJS Marketplace",
            version: "2.0",
          },
          ...data.context,
        },
        timestamp: data.timestamp || new Date(),
      })
    } catch (error) {
      this.logger_.error(`Failed to track event: ${data.event}`, error)
    }
  }

  /**
   * Identify a user
   */
  async identify(data: IdentifyData): Promise<void> {
    if (!this.analytics_) {
      return
    }

    try {
      await this.analytics_.identify({
        userId: data.userId,
        anonymousId: data.anonymousId,
        traits: data.traits || {},
        context: {
          app: {
            name: "MedusaJS Marketplace",
            version: "2.0",
          },
          ...data.context,
        },
        timestamp: data.timestamp || new Date(),
      })
    } catch (error) {
      this.logger_.error("Failed to identify user", error)
    }
  }

  /**
   * Track order placed event
   */
  async trackOrderPlaced(order: any): Promise<void> {
    const products = order.items?.map((item: any) => ({
      product_id: item.variant?.product_id || item.product_id,
      sku: item.variant?.sku || item.sku,
      name: item.title,
      price: item.unit_price / 100,
      quantity: item.quantity,
      category: item.variant?.product?.type?.value || "uncategorized",
      variant: item.variant?.title,
    }))

    await this.track({
      userId: order.customer_id,
      event: "Order Placed",
      properties: {
        order_id: order.id,
        total: order.total / 100,
        subtotal: order.subtotal / 100,
        tax: order.tax_total / 100,
        shipping: order.shipping_total / 100,
        discount: order.discount_total / 100,
        currency: order.currency_code,
        products,
        payment_method: order.payment_sessions?.[0]?.provider_id,
        shipping_method: order.shipping_methods?.[0]?.shipping_option?.name,
      },
    })
  }

  /**
   * Track product viewed event
   */
  async trackProductViewed(product: any, customerId?: string): Promise<void> {
    await this.track({
      userId: customerId,
      event: "Product Viewed",
      properties: {
        product_id: product.id,
        sku: product.variants?.[0]?.sku,
        name: product.title,
        price: product.variants?.[0]?.prices?.[0]?.amount / 100,
        category: product.type?.value || "uncategorized",
        variant: product.variants?.[0]?.title,
        image_url: product.thumbnail,
      },
    })
  }

  /**
   * Track product added to cart
   */
  async trackProductAdded(item: any, customerId?: string): Promise<void> {
    await this.track({
      userId: customerId,
      event: "Product Added",
      properties: {
        cart_id: item.cart_id,
        product_id: item.variant?.product_id,
        sku: item.variant?.sku,
        name: item.title,
        price: item.unit_price / 100,
        quantity: item.quantity,
        category: item.variant?.product?.type?.value || "uncategorized",
        variant: item.variant?.title,
      },
    })
  }

  /**
   * Track checkout started
   */
  async trackCheckoutStarted(cart: any): Promise<void> {
    const products = cart.items?.map((item: any) => ({
      product_id: item.variant?.product_id,
      sku: item.variant?.sku,
      name: item.title,
      price: item.unit_price / 100,
      quantity: item.quantity,
      category: item.variant?.product?.type?.value || "uncategorized",
      variant: item.variant?.title,
    }))

    await this.track({
      userId: cart.customer_id,
      event: "Checkout Started",
      properties: {
        cart_id: cart.id,
        value: cart.total / 100,
        currency: cart.region?.currency_code,
        products,
      },
    })
  }

  /**
   * Track customer created
   */
  async trackCustomerCreated(customer: any): Promise<void> {
    await this.identify({
      userId: customer.id,
      traits: {
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        created_at: customer.created_at,
      },
    })

    await this.track({
      userId: customer.id,
      event: "Customer Created",
      properties: {
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      },
    })
  }

  /**
   * Track search
   */
  async trackSearch(query: string, results: number, customerId?: string): Promise<void> {
    await this.track({
      userId: customerId,
      event: "Products Searched",
      properties: {
        query,
        results_count: results,
      },
    })
  }

  /**
   * Flush pending events
   */
  async flush(): Promise<void> {
    if (!this.analytics_) {
      return
    }

    try {
      await this.analytics_.flush()
    } catch (error) {
      this.logger_.error("Failed to flush Segment events", error)
    }
  }

  /**
   * Close the analytics client
   */
  async close(): Promise<void> {
    if (!this.analytics_) {
      return
    }

    try {
      await this.analytics_.closeAndFlush()
    } catch (error) {
      this.logger_.error("Failed to close Segment client", error)
    }
  }
}