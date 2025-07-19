# MedusaJS Marketplace - UI Component Examples

## Component Showcase

### 1. Button Variants

```tsx
// Primary Button (Black background, white text)
<Button>Browse Products</Button>

// Secondary Button (Light gray background)
<Button variant="secondary">View Details</Button>

// Outline Button (White background, black border)
<Button variant="outline">Learn More</Button>

// Ghost Button (Transparent, minimal)
<Button variant="ghost">Cancel</Button>

// With Icons
<Button>
  <ShoppingCart className="mr-2 h-4 w-4" />
  Add to Cart
</Button>

// Loading State
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Processing...
</Button>
```

### 2. Product Card Component

```tsx
export function ProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative overflow-hidden cursor-pointer">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.isRestricted && !isAuthenticated ? (
            // Blurred/Restricted State
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-white/80 dark:bg-black/80">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Members Only</p>
                <p className="text-xs text-muted-foreground">Sign in to view</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Quick Actions (visible on hover) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Badges */}
          {product.isNew && (
            <Badge className="absolute top-4 left-4 bg-black text-white">
              New
            </Badge>
          )}
          {product.discount && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white">
              -{product.discount}%
            </Badge>
          )}
        </div>
        
        {/* Product Info */}
        <CardContent className="p-4">
          <div className="space-y-1">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.isRestricted && !isAuthenticated ? "Premium Product" : product.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {product.brand}
            </p>
          </div>
          
          <div className="mt-3 flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              <p className="text-lg font-semibold">
                ${product.price}
              </p>
            </div>
            
            <Button size="sm" variant="outline" className="h-8">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

### 3. Navigation Header

```tsx
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-black dark:bg-white" />
          <span className="font-bold">Marketplace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm">
          <NavItem href="/products">Products</NavItem>
          <NavItem href="/brands">Brands</NavItem>
          <NavItem href="/categories">Categories</NavItem>
          <NavItem href="/deals">Deals</NavItem>
        </nav>
        
        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          
          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
```

### 4. Hero Section

```tsx
export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" />
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-200 dark:text-gray-700"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4" variant="outline">
              New Collection Available
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Premium Vape
              <span className="block text-gray-500">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover authentic products from verified brands. 
              Fast delivery, competitive prices, and exclusive member benefits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                Become a Partner
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Verified Products</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

### 5. Category Grid

```tsx
export function CategoryGrid() {
  const categories = [
    { name: "E-Liquids", count: 234, icon: "🧪", color: "from-blue-500 to-purple-500" },
    { name: "Devices", count: 156, icon: "📱", color: "from-green-500 to-teal-500" },
    { name: "Accessories", count: 89, icon: "🔧", color: "from-orange-500 to-red-500" },
    { name: "Disposables", count: 312, icon: "♻️", color: "from-pink-500 to-rose-500" },
  ]
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/categories/${category.name.toLowerCase()}`}>
                <Card className="group cursor-pointer overflow-hidden">
                  <div className={cn(
                    "aspect-square relative bg-gradient-to-br p-8",
                    category.color
                  )}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="relative h-full flex flex-col items-center justify-center text-white">
                      <span className="text-5xl mb-4">{category.icon}</span>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} products</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### 6. Shop Dashboard Stats

```tsx
export function DashboardStats() {
  const stats = [
    {
      title: "Today's Sales",
      value: "$2,543",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Commission Earned",
      value: "$508",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Active Referrals",
      value: "234",
      change: "+23",
      trend: "up",
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      trend: "down",
      icon: Target,
    },
  ]
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={cn(
                    stat.trend === "up" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  )}
                >
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
```

### 7. Authentication Modal

```tsx
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to access your account and exclusive member benefits" 
              : "Join our marketplace to start shopping and earning rewards"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={isLogin ? "login" : "register"} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
              Login
            </TabsTrigger>
            <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span className="text-sm">Remember me</span>
              </label>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>
            <Button className="w-full">Sign In</Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerEmail">Email</Label>
              <Input id="registerEmail" type="email" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerPassword">Password</Label>
              <Input id="registerPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Button variant="link" className="p-0 h-auto">
                  terms and conditions
                </Button>
              </label>
            </div>
            <Button className="w-full">Create Account</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
```

### 8. Product Filter Sidebar

```tsx
export function ProductFilters() {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {["E-Liquids", "Devices", "Accessories", "Disposables"].map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <Checkbox />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 100]}
            max={200}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span>$0</span>
            <span>$200+</span>
          </div>
        </div>
      </div>
      
      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {[
              "Premium Vapes",
              "Cloud Factory",
              "Vapor Tech",
              "Elite Liquids",
              "Nexus Devices",
            ].map((brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <Checkbox />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <Checkbox defaultChecked />
            <span className="text-sm">In Stock</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox />
            <span className="text-sm">Pre-order</span>
          </label>
        </div>
      </div>
      
      {/* Clear Filters */}
      <Button variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}
```

### 9. Loading States

```tsx
// Product Grid Skeleton
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Dashboard Loading
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 10. Toast Notifications

```tsx
// Success Toast
toast({
  title: "Product Added",
  description: "Premium Vape Juice has been added to your cart.",
  action: (
    <ToastAction altText="View cart">View Cart</ToastAction>
  ),
})

// Error Toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong. Please try again.",
})

// Custom Toast Component
export function CustomToast() {
  return (
    <div className="flex items-center space-x-4">
      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">Order Confirmed</p>
        <p className="text-sm text-muted-foreground">
          Your order #12345 has been confirmed
        </p>
      </div>
    </div>
  )
}
```

## Color Palette Reference

### Light Mode
- **Background**: #FFFFFF (white)
- **Foreground**: #0A0A0A (near black)
- **Primary**: #171717 (charcoal)
- **Secondary**: #F5F5F5 (light gray)
- **Muted**: #737373 (medium gray)
- **Border**: #E5E5E5 (light gray)

### Dark Mode
- **Background**: #0A0A0A (near black)
- **Foreground**: #FAFAFA (near white)
- **Primary**: #FAFAFA (near white)
- **Secondary**: #262626 (dark gray)
- **Muted**: #A3A3A3 (medium gray)
- **Border**: #262626 (dark gray)

### Status Colors (Used Sparingly)
- **Success**: #22C55E (green)
- **Warning**: #F59E0B (amber)
- **Error**: #EF4444 (red)
- **Info**: #3B82F6 (blue)

## Animation Guidelines

1. **Hover Effects**: Scale transforms (1.05) and opacity changes
2. **Page Transitions**: Fade in with slight Y movement
3. **Loading States**: Skeleton screens with shimmer effect
4. **Interactive Elements**: Spring animations for natural feel
5. **Scroll Animations**: Parallax effects for depth

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1280px
- **Large Desktop**: > 1280px

## Accessibility Checklist

- ✅ All interactive elements have focus states
- ✅ Color contrast meets WCAG AA standards
- ✅ Keyboard navigation fully supported
- ✅ Screen reader friendly with ARIA labels
- ✅ Touch targets minimum 44x44px
- ✅ Reduced motion preferences respected
