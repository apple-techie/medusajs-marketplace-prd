import { defineMiddlewares } from "@medusajs/framework/http"
import { vendorCors } from "./middlewares/vendor-cors"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/vendor/**",
      middlewares: [vendorCors],
    },
  ],
})