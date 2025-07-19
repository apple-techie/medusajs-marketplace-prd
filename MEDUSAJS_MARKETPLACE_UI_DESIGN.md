# MedusaJS Marketplace - UI/UX Design System

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Library](#component-library)
5. [Page Layouts](#page-layouts)
6. [Animations & Effects](#animations-effects)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)

---

## 1. Design Principles

### Core Principles
- **Minimalist**: Clean, uncluttered interfaces focusing on content
- **Monochromatic**: Black and white primary palette with subtle accents
- **Responsive**: Mobile-first design that scales beautifully
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Optimized for speed and smooth interactions

### Visual Hierarchy
```
Primary Actions    → Black backgrounds, white text
Secondary Actions  → White backgrounds, black borders
Tertiary Actions   → Ghost buttons, minimal styling
Disabled States    → 50% opacity
Hover States       → Subtle scale transforms
Active States      → Inverted colors
```

---

## 2. Color System

### Base Colors
```css
/* CSS Variables for Light/Dark Mode */
:root {
  /* Light Mode (default) */
  --background: 0 0% 100%;          /* #FFFFFF */
  --foreground: 0 0% 3.9%;          /* #0A0A0A */
  
  --card: 0 0% 100%;                /* #FFFFFF */
  --card-foreground: 0 0% 3.9%;     /* #0A0A0A */
  
  --primary: 0 0% 9%;               /* #171717 */
  --primary-foreground: 0 0% 98%;   /* #FAFAFA */
  
  --secondary: 0 0% 96.1%;          /* #F5F5F5 */
  --secondary-foreground: 0 0% 9%;  /* #171717 */
  
  --muted: 0 0% 96.1%;              /* #F5F5F5 */
  --muted-foreground: 0 0% 45.1%;   /* #737373 */
  
  --accent: 0 0% 96.1%;             /* #F5F5F5 */
  --accent-foreground: 0 0% 9%;     /* #171717 */
  
  --border: 0 0% 89.8%;             /* #E5E5E5 */
  --input: 0 0% 89.8%;              /* #E5E5E5 */
  --ring: 0 0% 3.9%;                /* #0A0A0A */
  
  /* Status Colors (minimal use) */
  --success: 142 71% 45%;           /* #22C55E */
  --warning: 38 92% 50%;            /* #F59E0B */
  --error: 0 84% 60%;               /* #EF4444 */
  --info: 217 91% 60%;              /* #3B82F6 */
}

.dark {
  /* Dark Mode */
  --background: 0 0% 3.9%;          /* #0A0A0A */
  --foreground: 0 0% 98%;           /* #FAFAFA */
  
  --card: 0 0% 3.9%;                /* #0A0A0A */
  --card-foreground: 0 0% 98%;      /* #FAFAFA */
  
  --primary: 0 0% 98%;              /* #FAFAFA */
  --primary-foreground: 0 0% 9%;    /* #171717 */
  
  --secondary: 0 0% 14.9%;          /* #262626 */
  --secondary-foreground: 0 0% 98%; /* #FAFAFA */
  
  --muted: 0 0% 14.9%;              /* #262626 */
  --muted-foreground: 0 0% 63.9%;   /* #A3A3A3 */
  
  --accent: 0 0% 14.9%;             /* #262626 */
  --accent-foreground: 0 0% 98%;    /* #FAFAFA */
  
  --border: 0 0% 14.9%;             /* #262626 */
  --input: 0 0% 14.9%;              /* #262626 */
  --ring: 0 0% 83.1%;               /* #D4D4D4 */
}
```

### Gradients & Effects
```css
/* Subtle gradients for depth */
.gradient-fade {
  background: linear-gradient(
    to bottom,
    hsl(var(--background)),
    hsl(var(--background) / 0)
  );
}

.gradient-border {
  background: linear-gradient(
    135deg,
    hsl(var(--foreground) / 0.1),
    hsl(var(--foreground) / 0.05)
  );
}

/* Glassmorphism for overlays */
.glass {
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

---

## 3. Typography

### Font Stack
```css
/* System font stack for performance */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", 
             Consolas, "Courier New", monospace;
```

### Type Scale
```css
/* Fluid typography with clamp() */
.text-xs    { font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); }
.text-sm    { font-size: clamp(0.875rem, 0.8rem + 0.375vw, 1rem); }
.text-base  { font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem); }
.text-lg    { font-size: clamp(1.125rem, 1rem + 0.625vw, 1.25rem); }
.text-xl    { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); }
.text-2xl   { font-size: clamp(1.5rem, 1.3rem + 1vw, 2rem); }
.text-3xl   { font-size: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem); }
.text-4xl   { font-size: clamp(2.25rem, 1.8rem + 2.25vw, 3rem); }
.text-5xl   { font-size: clamp(3rem, 2.4rem + 3vw, 4rem); }
```

---

## 4. Component Library

### Button Component
```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg",
        secondary: "bg-secondary text-secondary-foreground hover:scale-105",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Card Component with Hover Effects
```tsx
// components/ui/card.tsx
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        className
      )}
      {...props}
    />
  )
}

// Product Card with Advanced Effects
export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group relative overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      {/* Image with zoom effect */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
            Quick View
          </Button>
        </div>
      </CardContent>
      
      {/* Restricted badge with blur */}
      {product.restricted && (
        <div className="absolute top-2 right-2 z-20">
          <Badge variant="secondary" className="backdrop-blur-sm">
            <Lock className="h-3 w-3 mr-1" />
            Members Only
          </Badge>
        </div>
      )}
    </Card>
  )
}
```

### Navigation Component
```tsx
// components/navigation.tsx
export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with hover effect */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="h-8 w-8 rounded-full bg-primary transition-transform group-hover:rotate-180 duration-500" />
          <span className="font-bold text-xl">Marketplace</span>
        </Link>
        
        {/* Navigation items */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/products">Products</NavLink>
          <NavLink href="/brands">Brands</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          <Button>Sign In</Button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium transition-colors hover:text-primary group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  )
}
```

### Theme Toggle with Animation
```tsx
// components/theme-toggle.tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## 5. Page Layouts

### Homepage Layout
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-float" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Premium Vape
            <span className="block text-primary">Marketplace</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Discover premium products from verified brands and distributors
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Button size="lg" className="group">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              Become a Partner
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>
      
      {/* Category Grid with Hover Effects */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Brands Carousel */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Brands</h2>
          <BrandCarousel brands={featuredBrands} />
        </div>
      </section>
      
      {/* Product Grid with Filters */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popular Products</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Select defaultValue="popular">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ProductGrid products={popularProducts} />
        </div>
      </section>
    </div>
  )
}
```

### Category Card Component
```tsx
function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="group cursor-pointer relative overflow-hidden h-48">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        </div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          <p className="text-sm opacity-90">{category.productCount} products</p>
        </div>
        
        {/* Hover effect border */}
        <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </Link>
  )
}
```

### Product Listing Page
```tsx
// app/products/page.tsx
export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex gap-8">
          {/* Filters sidebar */}
          <aside className={cn(
            "w-64 shrink-0 space-y-6",
            !showFilters && "hidden lg:block"
          )}>
            <FilterSection title="Categories" options={categoryOptions} />
            <FilterSection title="Brands" options={brandOptions} />
            <FilterSection title="Price Range">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                className="mt-4"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>$0</span>
                <span>$100+</span>
              </div>
            </FilterSection>
            <FilterSection title="Availability">
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span className="text-sm">In Stock Only</span>
              </label>
            </FilterSection>
          </aside>
          
          {/* Product grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <p className="text-sm text-muted-foreground">
                Showing 1-20 of 156 products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid3x3 className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {/* Products */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Load more */}
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Shop Dashboard
```tsx
// app/vendor/shop/dashboard/page.tsx
export default function ShopDashboard() {
  return (
    <div className="min-h-screen bg-secondary/20">
      <VendorNav />
      
      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Today's Sales"
            value="$2,543"
            change="+12%"
            icon={<DollarSign />}
          />
          <StatCard
            title="Commission Earned"
            value="$508"
            change="+8%"
            icon={<TrendingUp />}
          />
          <StatCard
            title="Active Referrals"
            value="234"
            change="+23"
            icon={<Users />}
          />
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            change="+0.4%"
            icon={<Target />}
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <SalesChart />
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <TopProductsList />
          </Card>
        </div>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Orders from your referral links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
            {React.cloneElement(icon, { className: "h-6 w-6" })}
          </div>
          <span className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </span>
        </div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
      
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
    </Card>
  )
}
```

---

## 6. Animations & Effects

### Framer Motion Animations
```tsx
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Loading States
```tsx
// components/ui/skeleton.tsx
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}

// Product skeleton loader
export function ProductSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-square" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </CardContent>
    </Card>
  )
}
```

### Interactive Effects
```tsx
// Magnetic button effect
export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current!.getBoundingClientRect()
    
    const x = (clientX - left - width / 2) * 0.1
    const y = (clientY - top - height / 2) * 0.1
    
    setPosition({ x, y })
  }
  
  const reset = () => setPosition({ x: 0, y: 0 })
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// Parallax scroll effect
export function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const [scrollY, setScrollY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const speed = offset / 100
        setScrollY(rect.top * speed)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])
  
  return (
    <div ref={ref} style={{ transform: `translateY(${scrollY}px)` }}>
      {children}
    </div>
  )
}
```

### Toast Notifications
```tsx
// components/ui/toast.tsx
export function Toast({ title, description, action, ...props }: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
        "data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0",
        "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
        "bg-background text-foreground",
        props.className
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
    </div>
  )
}
```

---

## 7. Responsive Design

### Breakpoint System
```css
/* Tailwind CSS default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

### Mobile-First Components
```tsx
// Responsive navigation with mobile menu
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Mobile menu sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-8">
            <MobileNavLink href="/products" onClick={() => setIsOpen(false)}>
              Products
            </MobileNavLink>
            <MobileNavLink href="/brands" onClick={() => setIsOpen(false)}>
              Brands
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>
              About
            </MobileNavLink>
            <Separator />
            <Button className="w-full">Sign In</Button>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

// Responsive grid system
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {children}
    </div>
  )
}

// Responsive table
export function ResponsiveTable({ data }: { data: any[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.total}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {data.map((row) => (
          <Card key={row.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold">{row.id}</span>
              <Badge>{row.status}</Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">{row.date}</p>
              <p>{row.customer}</p>
              <p className="font-semibold">{row.total}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
```

### Touch-Optimized Interactions
```tsx
// Swipeable product carousel
export function SwipeableCarousel({ items }: { items: any[] }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex"
        drag="x"
        dragConstraints={{ left: -((items.length - 1) * 300), right: 0 }}
        dragElastic={0.2}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="min-w-[300px] px-2"
            whileTap={{ scale: 0.95 }}
          >
            <Card className="h-full">
              {/* Card content */}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// Touch-friendly buttons
export function TouchButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "min-h-[44px] min-w-[44px]", // iOS touch target size
        "active:scale-95 transition-transform",
        props.className
      )}
    >
      {children}
    </Button>
  )
}
```

---

## 8. Accessibility

### ARIA Labels and Roles
```tsx
// Accessible product card
export function AccessibleProductCard({ product }: { product: Product }) {
  return (
    <article
      role="article"
      aria-label={`${product.name} by ${product.brand}`}
      className="group"
    >
      <Card>
        <div className="aspect-square relative">
          <img
            src={product.image}
            alt={`Product image of ${product.name}`}
            loading="lazy"
            className="object-cover w-full h-full"
          />
          {product.restricted && (
            <div
              role="status"
              aria-label="This product requires authentication to view"
              className="absolute inset-0 backdrop-blur-md flex items-center justify-center"
            >
              <Lock className="h-8 w-8" aria-hidden="true" />
              <span className="sr-only">Members only product</span>
            </div>
          )}
        </div>
        <CardContent>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <div className="mt-2 flex items-center justify-between">
            <span aria-label={`Price: ${product.price} dollars`}>
              ${product.price}
            </span>
            <Button
              size="sm"
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </article>
  )
}

// Skip navigation link
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background text-foreground p-2 rounded-md z-50"
    >
      Skip to main content
    </a>
  )
}

// Accessible form
export function AccessibleForm() {
  return (
    <form aria-label="Contact form">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">
            Email
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-describedby="email-error"
          />
          <span id="email-error" className="text-sm text-red-500" role="alert">
            {/* Error message */}
          </span>
        </div>
      </div>
    </form>
  )
}
```

### Keyboard Navigation
```tsx
// Keyboard navigable dropdown
export function KeyboardDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const options = ['Option 1', 'Option 2', 'Option 3']
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }
  
  return (
    <div className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        {options[selectedIndex]}
      </button>
      
      {isOpen && (
        <ul role="listbox" className="absolute top-full mt-1 w-full">
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === selectedIndex}
              className={cn(
                "px-3 py-2 cursor-pointer",
                index === selectedIndex && "bg-accent"
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Focus trap for modals
export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!isActive) return
    
    const element = ref.current
    if (!element) return
    
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    firstFocusable?.focus()
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable?.focus()
          e.preventDefault()
        }
      }
    }
    
    element.addEventListener('keydown', handleTabKey)
    return () => element.removeEventListener('keydown', handleTabKey)
  }, [isActive])
  
  return <div ref={ref}>{children}</div>
}
```

---

## 9. Visual Mockups

### Homepage Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] Marketplace    Products  Brands  About    🌓 🔍 🛒 [Sign In] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                    Premium Vape                             │
│                   MARKETPLACE                               │
│                                                             │
│         Discover premium products from verified             │
│              brands and distributors                        │
│                                                             │
│         [Browse Products →]  [Become a Partner]            │
│                                                             │
│                         ⌄                                   │
└─────────────────────────────────────────────────────────────┘
```

### Product Card States
```
Normal State:              Hover State:               Restricted State:
┌─────────────┐           ┌─────────────┐            ┌─────────────┐
│             │           │      ↗️      │            │   🔒        │
│   [Image]   │           │   [Image]   │            │  [Blurred]  │
│             │           │   (scaled)  │            │             │
├─────────────┤           ├─────────────┤            ├─────────────┤
│ Product Name│           │ Product Name│            │ ████████    │
│ Brand       │           │ Brand       │            │ ████        │
│             │           │             │            │             │
│ $29.99      │           │ $29.99 [👁️] │            │ Members Only│
└─────────────┘           └─────────────┘            └─────────────┘
```

### Shop Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Shop Dashboard                              Profile ▼      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Today's  │  │Commission│  │ Active   │  │Conversion│  │
│  │ Sales    │  │ Earned   │  │Referrals │  │  Rate    │  │
│  │          │  │          │  │          │  │          │  │
│  │ $2,543   │  │  $508    │  │   234    │  │  3.2%    │  │
│  │  +12%    │  │   +8%    │  │   +23    │  │  +0.4%   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │    Sales Overview       │  │    Top Products         │ │
│  │                         │  │                         │ │
│  │    [Chart Area]         │  │  1. Product A    $450   │ │
│  │                         │  │  2. Product B    $380   │ │
│  │                         │  │  3. Product C    $290   │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│  Recent Orders                                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Order ID   Date      Customer    Total    Status    │  │
│  │ #12345     Today     John D.     $89.99   ✓        │  │
│  │ #12344     Today     Sarah M.    $124.50  ✓        │  │
│  │ #12343     Yesterday Mike R.     $67.80   ✓        │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Navigation
```
Closed:                    Open:
┌─────────────┐           ┌─────────────┐
│ ☰ Logo   🛒 │           │ ✕ Menu      │
└─────────────┘           ├─────────────┤
                          │ Products    │
                          │ Brands      │
                          │ About       │
                          │─────────────│
                          │ [Sign In]   │
                          └─────────────┘
```

---

## 10. CSS Animations

### Custom Animations
```css
/* Grid float animation for hero background */
@keyframes grid-float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.1;
  }
  33% {
    transform: translate(30px, -30px) rotate(1deg);
    opacity: 0.15;
  }
  66% {
    transform: translate(-20px, 20px) rotate(-1deg);
    opacity: 0.1;
  }
}

.animate-grid-float {
  animation: grid-float 20s ease-in-out infinite;
}

/* Shimmer effect for loading states */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 0%,
    hsl(var(--muted) / 0.5) 50%,
    hsl(var(--muted)) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Pulse animation for notifications */
@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px hsl(var(--primary) / 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 hsl(var(--primary) / 0);
  }
}

.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 11. Implementation Guidelines

### File Structure
```
src/
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   │   ├── navigation.tsx
│   │   ├── footer.tsx
│   │   └── sidebar.tsx
│   ├── features/          # Feature-specific components
│   │   ├── product-card.tsx
│   │   ├── shop-dashboard.tsx
│   │   └── vendor-nav.tsx
│   └── shared/            # Shared components
│       ├── loading.tsx
│       ├── error-boundary.tsx
│       └── seo.tsx
├── styles/
│   ├── globals.css        # Global styles and CSS variables
│   └── animations.css     # Custom animations
├── lib/
│   ├── utils.ts          # Utility functions
│   └── animations.ts     # Animation variants
└── hooks/
    ├── use-theme.ts      # Theme hook
    ├── use-media-query.ts # Responsive hook
    └── use-intersection.ts # Scroll animations
```

### Performance Optimization
1. **Lazy Loading**: Use dynamic imports for heavy components
2. **Image Optimization**: Use Next.js Image component with proper sizing
3. **Font Loading**: Use font-display: swap for custom fonts
4. **CSS-in-JS**: Minimize runtime styles, prefer Tailwind classes
5. **Animation Performance**: Use transform and opacity for animations

### Best Practices
1. **Component Composition**: Build complex UIs from simple, reusable components
2. **Accessibility First**: Always include ARIA labels and keyboard navigation
3. **Mobile First**: Design for mobile, then enhance for desktop
4. **Dark Mode**: Test all components in both light and dark modes
5. **Performance**: Monitor bundle size and optimize critical rendering path

---

## Conclusion

This UI/UX design system provides a comprehensive foundation for building the MedusaJS marketplace platform with:

- **Consistent Design Language**: Black and white color scheme with smooth transitions
- **Responsive Components**: Mobile-first approach with desktop enhancements
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Performance**: Optimized animations and lazy loading
- **Developer Experience**: Well-structured components with TypeScript support

The design system emphasizes minimalism while providing rich interactions through subtle animations and effects, creating a premium feel that matches the marketplace's positioning.
