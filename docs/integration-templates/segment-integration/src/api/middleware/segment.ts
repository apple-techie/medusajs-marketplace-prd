import { MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework"
import { SEGMENT_MODULE } from "../../modules/segment"
import SegmentService from "../../modules/segment/service"

/**
 * Middleware to track product views
 */
export async function trackProductView(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Only track on GET requests to product detail endpoints
  if (req.method === "GET" && req.params.id) {
    try {
      const segmentService: SegmentService = req.scope.resolve(SEGMENT_MODULE)
      const productService = req.scope.resolve("product")
      
      const product = await productService.retrieve(req.params.id)
      const customerId = req.user?.customer_id || req.session?.customer_id
      
      await segmentService.trackProductViewed(product, customerId)
    } catch (error) {
      // Don't block the request if tracking fails
      req.scope.resolve("logger").error("Failed to track product view", error)
    }
  }
  
  next()
}

/**
 * Middleware to track searches
 */
export async function trackSearch(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  // Track after the search completes
  const originalJson = res.json.bind(res)
  
  res.json = function(data: any) {
    if (req.query.q && data.products) {
      const segmentService: SegmentService = req.scope.resolve(SEGMENT_MODULE)
      const customerId = req.user?.customer_id || req.session?.customer_id
      
      segmentService.trackSearch(
        req.query.q as string,
        data.products.length,
        customerId
      ).catch(error => {
        req.scope.resolve("logger").error("Failed to track search", error)
      })
    }
    
    return originalJson(data)
  }
  
  next()
}