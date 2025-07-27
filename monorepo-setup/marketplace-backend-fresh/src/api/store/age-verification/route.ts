import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { VerificationMethod } from "../../../modules/age_verification/models/age-verification-session"

// POST /store/age-verification - Create verification session
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  const { method = VerificationMethod.SESSION, age_threshold = 21 } = req.body as { method?: VerificationMethod; age_threshold?: number }
  
  // Get IP address from request
  const ip_address = req.headers['x-forwarded-for'] as string || 
                    req.socket.remoteAddress || 
                    '127.0.0.1'
  
  const user_agent = req.headers['user-agent']
  
  // Get customer ID from session if available
  const customer_id = req.session?.customer_id || null
  
  try {
    const session = await ageVerificationService.createVerificationSession({
      customer_id,
      ip_address,
      user_agent,
      method,
      age_threshold,
    })
    
    res.json({
      session: {
        token: session.session_token,
        expires_at: session.expires_at,
        age_threshold: session.age_threshold,
        method: session.method,
      }
    })
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to create verification session",
      error: error.message 
    })
  }
}

// GET /store/age-verification - Check verification status
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  const { token } = req.query
  
  if (!token) {
    return res.status(400).json({ message: "Session token required" })
  }
  
  try {
    const session = await ageVerificationService.retrieveSessionByToken(token as string)
    
    res.json({
      session: {
        status: session.status,
        age_threshold: session.age_threshold,
        expires_at: session.expires_at,
        verified_at: session.verified_at,
      }
    })
  } catch (error) {
    res.status(404).json({ 
      message: "Session not found or expired",
      error: error.message 
    })
  }
}