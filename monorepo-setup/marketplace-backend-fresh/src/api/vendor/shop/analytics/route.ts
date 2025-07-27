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

// Helper to generate daily metrics for charts
const generateDailyMetrics = (days: number) => {
  const metrics: any[] = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate realistic random data with some variance
    const baseClicks = 50 + Math.floor(Math.random() * 100)
    const conversionRate = 0.02 + Math.random() * 0.03 // 2-5% conversion
    const conversions = Math.floor(baseClicks * conversionRate)
    const avgOrderValue = 8000 + Math.floor(Math.random() * 4000) // $80-120
    
    metrics.push({
      date: date.toISOString(),
      clicks: baseClicks,
      conversions: conversions,
      revenue: conversions * avgOrderValue
    })
  }
  
  return metrics
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
    const period = req.query.period as string || 'last_30_days'
    
    // Get vendor details
    const vendor = await marketplaceService.retrieveVendor(vendorId)
    
    // Verify it's a shop partner
    if (vendor.type !== 'shop_partner') {
      return res.status(403).json({ error: "This endpoint is only for shop partners" })
    }
    
    // Determine number of days based on period
    let days = 30
    switch (period) {
      case 'last_7_days':
        days = 7
        break
      case 'last_30_days':
        days = 30
        break
      case 'last_90_days':
        days = 90
        break
      case 'this_month':
        days = new Date().getDate()
        break
      case 'last_month':
        days = 30
        break
    }
    
    // Generate daily metrics
    const dailyMetrics = generateDailyMetrics(days)
    
    // Calculate overview stats from daily metrics
    const totalClicks = dailyMetrics.reduce((sum, d) => sum + d.clicks, 0)
    const totalConversions = dailyMetrics.reduce((sum, d) => sum + d.conversions, 0)
    const totalRevenue = dailyMetrics.reduce((sum, d) => sum + d.revenue, 0)
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0
    const avgOrderValue = totalConversions > 0 ? Math.floor(totalRevenue / totalConversions) : 0
    
    // Mock analytics data
    const mockAnalytics = {
      overview: {
        total_clicks: totalClicks,
        unique_visitors: Math.floor(totalClicks * 0.8), // 80% unique
        conversion_rate: Math.round(conversionRate * 10) / 10,
        average_order_value: avgOrderValue,
        total_revenue: totalRevenue,
        total_commission: Math.floor(totalRevenue * 0.15), // 15% commission
        period_change: {
          clicks: 15,
          visitors: 12,
          conversion: 8,
          aov: 5,
          revenue: 18,
          commission: 18
        }
      },
      referral_performance: [
        {
          code: 'INSTA123',
          clicks: Math.floor(totalClicks * 0.35),
          conversions: Math.floor(totalConversions * 0.40),
          conversion_rate: 4.2,
          revenue: Math.floor(totalRevenue * 0.40),
          commission: Math.floor(totalRevenue * 0.40 * 0.15)
        },
        {
          code: 'BLOG456',
          clicks: Math.floor(totalClicks * 0.25),
          conversions: Math.floor(totalConversions * 0.30),
          conversion_rate: 3.8,
          revenue: Math.floor(totalRevenue * 0.30),
          commission: Math.floor(totalRevenue * 0.30 * 0.15)
        },
        {
          code: 'EMAIL789',
          clicks: Math.floor(totalClicks * 0.20),
          conversions: Math.floor(totalConversions * 0.20),
          conversion_rate: 3.5,
          revenue: Math.floor(totalRevenue * 0.20),
          commission: Math.floor(totalRevenue * 0.20 * 0.15)
        },
        {
          code: 'YT2024',
          clicks: Math.floor(totalClicks * 0.15),
          conversions: Math.floor(totalConversions * 0.08),
          conversion_rate: 2.1,
          revenue: Math.floor(totalRevenue * 0.08),
          commission: Math.floor(totalRevenue * 0.08 * 0.15)
        },
        {
          code: 'TIKTOK99',
          clicks: Math.floor(totalClicks * 0.05),
          conversions: Math.floor(totalConversions * 0.02),
          conversion_rate: 1.5,
          revenue: Math.floor(totalRevenue * 0.02),
          commission: Math.floor(totalRevenue * 0.02 * 0.15)
        }
      ],
      traffic_sources: [
        {
          source: 'Instagram',
          visits: Math.floor(totalClicks * 0.35),
          conversions: Math.floor(totalConversions * 0.40),
          revenue: Math.floor(totalRevenue * 0.40)
        },
        {
          source: 'Blog',
          visits: Math.floor(totalClicks * 0.25),
          conversions: Math.floor(totalConversions * 0.30),
          revenue: Math.floor(totalRevenue * 0.30)
        },
        {
          source: 'Email',
          visits: Math.floor(totalClicks * 0.20),
          conversions: Math.floor(totalConversions * 0.20),
          revenue: Math.floor(totalRevenue * 0.20)
        },
        {
          source: 'YouTube',
          visits: Math.floor(totalClicks * 0.15),
          conversions: Math.floor(totalConversions * 0.08),
          revenue: Math.floor(totalRevenue * 0.08)
        },
        {
          source: 'TikTok',
          visits: Math.floor(totalClicks * 0.05),
          conversions: Math.floor(totalConversions * 0.02),
          revenue: Math.floor(totalRevenue * 0.02)
        }
      ],
      top_products: [
        {
          product_name: 'Premium THC Vape Pen',
          referrals: Math.floor(totalConversions * 0.25),
          revenue: Math.floor(totalRevenue * 0.28),
          commission: Math.floor(totalRevenue * 0.28 * 0.15)
        },
        {
          product_name: 'Organic CBD Tincture 1000mg',
          referrals: Math.floor(totalConversions * 0.20),
          revenue: Math.floor(totalRevenue * 0.22),
          commission: Math.floor(totalRevenue * 0.22 * 0.15)
        },
        {
          product_name: 'Delta-8 Gummies Pack',
          referrals: Math.floor(totalConversions * 0.18),
          revenue: Math.floor(totalRevenue * 0.18),
          commission: Math.floor(totalRevenue * 0.18 * 0.15)
        },
        {
          product_name: 'Live Resin Cartridge',
          referrals: Math.floor(totalConversions * 0.15),
          revenue: Math.floor(totalRevenue * 0.15),
          commission: Math.floor(totalRevenue * 0.15 * 0.15)
        },
        {
          product_name: 'Full Spectrum CBD Oil',
          referrals: Math.floor(totalConversions * 0.12),
          revenue: Math.floor(totalRevenue * 0.10),
          commission: Math.floor(totalRevenue * 0.10 * 0.15)
        },
        {
          product_name: 'THC Edibles Variety Pack',
          referrals: Math.floor(totalConversions * 0.10),
          revenue: Math.floor(totalRevenue * 0.07),
          commission: Math.floor(totalRevenue * 0.07 * 0.15)
        }
      ],
      daily_metrics: dailyMetrics
    }
    
    res.json(mockAnalytics)
  } catch (error) {
    if (error.type === MedusaError.Types.UNAUTHORIZED) {
      return res.status(401).json({ error: error.message })
    }
    
    res.status(500).json({ 
      error: "Failed to fetch analytics",
      message: error.message 
    })
  }
}