import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function segmentLoader({
  container,
}: {
  container: MedusaContainer
}): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    // Register the segment module in medusa-config.ts instead
    logger.info("Segment module loaded successfully")
  } catch (error) {
    logger.error("Failed to load Segment module", error)
  }
}