import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

// POST /store/age-verification/verify - Verify age with birth date
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const ageVerificationService = req.scope.resolve("age_verification")
  
  const { token, birth_date } = req.body as { token?: string; birth_date?: string }
  
  if (!token || !birth_date) {
    return res.status(400).json({ 
      message: "Session token and birth date are required" 
    })
  }
  
  try {
    const result = await ageVerificationService.verifyAgeBySession(
      token,
      new Date(birth_date)
    )
    
    // Store verification in session if customer
    if (result.verified && result.session.customer_id) {
      req.session.age_verified = true
      req.session.age_verified_at = new Date()
      req.session.age_threshold = result.session.age_threshold
    }
    
    res.json({
      verified: result.verified,
      message: result.verified 
        ? "Age verification successful" 
        : "Age verification failed - minimum age not met",
      session: {
        status: result.session.status,
        verified_age: result.session.verified_age,
        age_threshold: result.session.age_threshold,
      }
    })
  } catch (error) {
    res.status(400).json({ 
      message: "Verification failed",
      error: error.message 
    })
  }
}