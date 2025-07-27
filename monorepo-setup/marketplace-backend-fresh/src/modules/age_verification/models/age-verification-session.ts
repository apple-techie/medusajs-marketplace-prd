import { model } from "@medusajs/framework/utils"

export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  FAILED = "failed",
  EXPIRED = "expired"
}

export enum VerificationMethod {
  SESSION = "session",
  ID_UPLOAD = "id_upload",
  CREDIT_CARD = "credit_card",
  THIRD_PARTY = "third_party"
}

export const AgeVerificationSession = model.define("age_verification_session", {
  id: model.id().primaryKey(),
  
  // Session info
  session_token: model.text().unique(),
  customer_id: model.text().nullable(),
  ip_address: model.text(),
  user_agent: model.text().nullable(),
  
  // Verification details
  status: model.enum(VerificationStatus).default(VerificationStatus.PENDING),
  method: model.enum(VerificationMethod),
  age_threshold: model.number().default(21), // 18 or 21
  
  // Verification data
  birth_date: model.dateTime().nullable(),
  verified_age: model.number().nullable(),
  verification_data: model.json().nullable(), // Additional data from verification method
  
  // Timing
  verified_at: model.dateTime().nullable(),
  expires_at: model.dateTime(),
  
  // Compliance
  verification_provider: model.text().nullable(), // e.g., "IDology", "Jumio"
  reference_id: model.text().nullable(), // External reference ID
  
  // Metadata
  metadata: model.json().nullable(),
})

export default AgeVerificationSession