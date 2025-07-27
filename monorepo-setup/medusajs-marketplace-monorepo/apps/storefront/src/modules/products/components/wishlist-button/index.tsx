"use client"

import { Heart } from "@medusajs/icons"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useWishlist } from "@lib/hooks/use-wishlist"

type WishlistButtonProps = {
  productId: string
  className?: string
}

const WishlistButton = ({ productId, className }: WishlistButtonProps) => {
  const router = useRouter()
  const { isInWishlist, addToWishlist, removeFromWishlist, isAuthenticated } = useWishlist()
  const inWishlist = isInWishlist(productId)

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/account")
      return
    }

    if (inWishlist) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleWishlistToggle}
      className={className}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={inWishlist ? "fill-current" : ""}
        color={inWishlist ? "red" : "currentColor"}
      />
    </Button>
  )
}

export default WishlistButton