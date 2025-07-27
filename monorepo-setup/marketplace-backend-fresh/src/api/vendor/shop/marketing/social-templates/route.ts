import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, MedusaError } from "@medusajs/framework/utils"
import * as jwt from "jsonwebtoken"

// Set CORS headers helper
const setCorsHeaders = (req: MedusaRequest, res: MedusaResponse) => {
  const origin = req.headers.origin
  const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"]
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
}

// Helper to validate vendor JWT
const validateVendorToken = (req: MedusaRequest) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "No authorization token provided")
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "marketplace_jwt_secret_2025_production_key") as any
    return decoded
  } catch (error) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Invalid or expired token")
  }
}

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  res.status(200).end()
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  setCorsHeaders(req, res)
  
  try {
    const decoded = validateVendorToken(req)
    const vendorId = decoded.app_metadata?.vendor_id
    
    if (!vendorId) {
      return res.status(401).json({ error: "Vendor ID not found in token" })
    }
    
    const marketplaceService = req.scope.resolve("marketplace")
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Mock social media templates
    const mockTemplates = [
      {
        id: 'template_1',
        platform: 'instagram' as const,
        title: 'New Product Announcement',
        content: `🌿 NEW ARRIVAL ALERT! 🌿

Check out our latest premium {product_name} - now available in-store and online!

✨ {product_benefit_1}
✨ {product_benefit_2}
✨ {product_benefit_3}

Use my code {referral_code} for an exclusive discount on your first order! 🎁

Shop now: {shop_link}`,
        hashtags: ['cannabis', 'newproduct', 'cannabiscommunity', '420friendly', 'shoplocal'],
        character_count: 245,
        has_image: true
      },
      {
        id: 'template_2',
        platform: 'facebook' as const,
        title: 'Weekend Special Promotion',
        content: `🎉 WEEKEND SPECIAL - This Saturday & Sunday Only! 🎉

Hey friends! I'm excited to share an amazing deal from our partners:

📍 {promotion_details}
🕒 Valid: {promotion_dates}
💰 Save: {discount_amount}

Don't forget to use my referral code "{referral_code}" at checkout for an extra discount!

Limited quantities available - don't miss out! 

{shop_link}`,
        hashtags: ['weekendsale', 'cannabis', 'deals', 'localcannabis'],
        character_count: 312,
        has_image: true
      },
      {
        id: 'template_3',
        platform: 'twitter' as const,
        title: 'Daily Deal Tweet',
        content: `🔥 TODAY'S DEAL: {product_name} - {discount_percentage}% OFF! 

Use code {referral_code} for extra savings 💚

Shop now: {shop_link}`,
        hashtags: ['dailydeal', 'cannabis', '420', 'sale'],
        character_count: 140,
        has_image: false
      },
      {
        id: 'template_4',
        platform: 'instagram' as const,
        title: 'Educational Post - CBD Benefits',
        content: `Did you know? CBD can help with:

🌱 Stress & anxiety relief
😴 Better sleep quality
💪 Post-workout recovery
🧘 Overall wellness

Ready to try CBD? I've partnered with {shop_name} to bring you premium, lab-tested products.

Use my code {referral_code} for 15% off your first CBD purchase!

Questions? Drop them in the comments 👇`,
        hashtags: ['cbd', 'wellness', 'naturalhealing', 'cbdbenefits', 'holistichealth'],
        character_count: 298,
        has_image: true
      },
      {
        id: 'template_5',
        platform: 'tiktok' as const,
        title: 'Product Review Video Script',
        content: `POV: You just found your new favorite {product_category} 😍

✅ {feature_1}
✅ {feature_2}
✅ {feature_3}

Get yours with my discount code {referral_code} - link in bio!`,
        hashtags: ['cannabisreview', 'producttesting', '420community', 'foryou'],
        character_count: 156,
        has_image: true
      },
      {
        id: 'template_6',
        platform: 'facebook' as const,
        title: 'Customer Testimonial Share',
        content: `⭐⭐⭐⭐⭐ CUSTOMER LOVE!

"I've tried many {product_category}, but {shop_name} has the best quality by far! The {product_name} is exactly what I was looking for."

This is why I partner with the best in the business! 💚

Ready to experience it yourself? Use my code {referral_code} for an exclusive discount.

{shop_link}`,
        hashtags: ['customerreview', 'testimonial', 'qualitycannabis', 'trusted'],
        character_count: 289,
        has_image: false
      },
      {
        id: 'template_7',
        platform: 'instagram' as const,
        title: 'Holiday Sale Announcement',
        content: `🎄 HOLIDAY SALE STARTS NOW! 🎄

Give the gift of relaxation this season with premium cannabis products from {shop_name}!

🎁 Up to {discount_percentage}% off select items
🎁 Free gift with purchases over {min_purchase}
🎁 Extra savings with code {referral_code}

Sale ends {end_date} - don't wait!

Tap the link in my bio to shop now 🛍️`,
        hashtags: ['holidaysale', 'giftideas', 'cannabisgifts', 'seasonsale', 'christmas420'],
        character_count: 334,
        has_image: true
      },
      {
        id: 'template_8',
        platform: 'twitter' as const,
        title: 'Flash Sale Alert',
        content: `⚡ FLASH SALE ⚡ Next 2 hours only!

{discount_details} with code {referral_code}

{shop_link}`,
        hashtags: ['flashsale', 'limitedtime', 'cannabisdeals'],
        character_count: 98,
        has_image: false
      }
    ]
    
    res.json({
      templates: mockTemplates,
      count: mockTemplates.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch social media templates",
      message: error.message 
    })
  }
}