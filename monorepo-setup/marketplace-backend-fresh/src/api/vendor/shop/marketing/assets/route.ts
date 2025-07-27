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
    
    // Mock marketing assets - in a real system, these would come from a CDN or media library
    const mockAssets = [
      {
        id: 'asset_1',
        name: 'Instagram Story - New Arrivals',
        type: 'social_post' as const,
        category: 'social',
        dimensions: '1080x1920',
        file_size: '2.3 MB',
        preview_url: 'https://via.placeholder.com/300x400/4F46E5/ffffff?text=Instagram+Story',
        download_url: 'https://example.com/assets/instagram-story-new-arrivals.png',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['instagram', 'story', 'new-arrivals', 'cannabis']
      },
      {
        id: 'asset_2',
        name: 'Facebook Banner - 4/20 Sale',
        type: 'banner' as const,
        category: 'banners',
        dimensions: '1200x630',
        file_size: '1.8 MB',
        preview_url: 'https://via.placeholder.com/300x200/10B981/ffffff?text=Facebook+Banner',
        download_url: 'https://example.com/assets/facebook-banner-420-sale.png',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['facebook', 'banner', '420', 'sale', 'promotion']
      },
      {
        id: 'asset_3',
        name: 'Email Header - Welcome Series',
        type: 'email_template' as const,
        category: 'email',
        dimensions: '600x200',
        file_size: '450 KB',
        preview_url: 'https://via.placeholder.com/300x100/F59E0B/ffffff?text=Email+Header',
        download_url: 'https://example.com/assets/email-header-welcome.png',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['email', 'welcome', 'header', 'template']
      },
      {
        id: 'asset_4',
        name: 'Product Grid - Best Sellers',
        type: 'product_image' as const,
        category: 'products',
        dimensions: '1200x1200',
        file_size: '3.1 MB',
        preview_url: 'https://via.placeholder.com/300x300/EF4444/ffffff?text=Product+Grid',
        download_url: 'https://example.com/assets/product-grid-bestsellers.png',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['products', 'grid', 'bestsellers', 'showcase']
      },
      {
        id: 'asset_5',
        name: 'Print Flyer - Grand Opening',
        type: 'flyer' as const,
        category: 'print',
        dimensions: '8.5x11 inches',
        file_size: '5.2 MB',
        preview_url: 'https://via.placeholder.com/300x400/7C3AED/ffffff?text=Print+Flyer',
        download_url: 'https://example.com/assets/print-flyer-grand-opening.pdf',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['print', 'flyer', 'grand-opening', 'high-res']
      },
      {
        id: 'asset_6',
        name: 'Twitter Post - Daily Deal',
        type: 'social_post' as const,
        category: 'social',
        dimensions: '1200x675',
        file_size: '890 KB',
        preview_url: 'https://via.placeholder.com/300x200/1DA1F2/ffffff?text=Twitter+Post',
        download_url: 'https://example.com/assets/twitter-post-daily-deal.png',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['twitter', 'social', 'daily-deal', 'promotion']
      },
      {
        id: 'asset_7',
        name: 'YouTube Thumbnail - Product Review',
        type: 'banner' as const,
        category: 'banners',
        dimensions: '1280x720',
        file_size: '1.2 MB',
        preview_url: 'https://via.placeholder.com/300x200/FF0000/ffffff?text=YouTube+Thumbnail',
        download_url: 'https://example.com/assets/youtube-thumbnail-review.png',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['youtube', 'thumbnail', 'video', 'review']
      },
      {
        id: 'asset_8',
        name: 'Email Template - Flash Sale',
        type: 'email_template' as const,
        category: 'email',
        dimensions: '600x800',
        file_size: '780 KB',
        preview_url: 'https://via.placeholder.com/300x400/EC4899/ffffff?text=Email+Template',
        download_url: 'https://example.com/assets/email-template-flash-sale.html',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['email', 'template', 'flash-sale', 'responsive']
      }
    ]
    
    res.json({
      assets: mockAssets,
      count: mockAssets.length
    })
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch marketing assets",
      message: error.message 
    })
  }
}