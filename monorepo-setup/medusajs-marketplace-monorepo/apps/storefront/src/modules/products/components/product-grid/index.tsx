import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

type ProductGridProps = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const ProductGrid = ({ products, region }: ProductGridProps) => {
  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="products-list"
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid