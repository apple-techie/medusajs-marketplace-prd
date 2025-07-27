import { MiddlewaresConfig } from "@medusajs/framework"
import { config as vendorCorsConfig } from "./middlewares/vendor-cors"

// Export the middleware configurations directly
export default vendorCorsConfig.routes