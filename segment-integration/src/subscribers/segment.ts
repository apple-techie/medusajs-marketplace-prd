import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { SEGMENT_MODULE } from "../modules/segment"
import SegmentService from "../modules/segment/service"

// Customer events
export const customerCreatedHandler = async ({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) => {
  const segmentService: SegmentService = container.resolve(SEGMENT_MODULE)
  const customerService = container.resolve("customer")

  const customer = await customerService.retrieve(data.id)
  await segmentService.trackCustomerCreated(customer)
}

// Order events
export const orderPlacedHandler = async ({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) => {
  const segmentService: SegmentService = container.resolve(SEGMENT_MODULE)
  const orderService = container.resolve("order")

  const order = await orderService.retrieve(data.id, {
    relations: ["items", "items.variant", "items.variant.product", "customer"],
  })
  
  await segmentService.trackOrderPlaced(order)
}

// Cart events
export const cartUpdatedHandler = async ({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) => {
  const segmentService: SegmentService = container.resolve(SEGMENT_MODULE)
  const cartService = container.resolve("cart")

  const cart = await cartService.retrieve(data.id, {
    relations: ["items", "items.variant", "customer"],
  })

  // Track if cart has items (potential checkout start)
  if (cart.items?.length > 0) {
    await segmentService.trackCheckoutStarted(cart)
  }
}

// Product events - line item added
export const lineItemCreatedHandler = async ({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) => {
  const segmentService: SegmentService = container.resolve(SEGMENT_MODULE)
  const lineItemService = container.resolve("line-item")

  const item = await lineItemService.retrieve(data.id, {
    relations: ["variant", "variant.product", "cart"],
  })

  if (item.cart_id) {
    await segmentService.trackProductAdded(item, item.cart?.customer_id)
  }
}

// Export subscriber configuration
export const config: SubscriberConfig = {
  event: [
    "customer.created",
    "order.placed", 
    "cart.updated",
    "line-item.created",
  ],
}

// Map events to handlers
export default {
  "customer.created": customerCreatedHandler,
  "order.placed": orderPlacedHandler,
  "cart.updated": cartUpdatedHandler,
  "line-item.created": lineItemCreatedHandler,
}