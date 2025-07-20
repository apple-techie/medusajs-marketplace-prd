# Component Specifications

## Table of Contents
1. [Overview](#overview)
2. [Navigation Components](#navigation-components)
3. [Form Components](#form-components)
4. [Data Display Components](#data-display-components)
5. [Feedback Components](#feedback-components)
6. [Layout Components](#layout-components)
7. [E-commerce Components](#e-commerce-components)
8. [Dashboard Components](#dashboard-components)

---

## 1. Overview

This document provides detailed specifications for all UI components used across the marketplace platform. Each component includes usage guidelines, props, variants, and implementation examples.

### Component Architecture
- **Base Components**: Atomic-level components (buttons, inputs, etc.)
- **Composite Components**: Combinations of base components
- **Feature Components**: Business-specific implementations
- **Layout Components**: Page structure and containers

---

## 2. Navigation Components

### 2.1 Main Navigation

```tsx
// components/navigation/main-nav.tsx
interface MainNavProps {
  user?: User;
  cartItemCount?: number;
}

export function MainNav({ user, cartItemCount = 0 }: MainNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Marketplace
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/products" className="transition-colors hover:text-foreground/80">
            Products
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground/80">
            Categories
          </Link>
          <Link href="/brands" className="transition-colors hover:text-foreground/80">
            Brands
          </Link>
          <Link href="/deals" className="transition-colors hover:text-foreground/80">
            Deals
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <SearchButton />
          <CartButton count={cartItemCount} />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
        
        {/* Mobile Menu */}
        <MobileNav className="md:hidden" />
      </div>
    </header>
  );
}
```

### 2.2 Breadcrumb Navigation

```tsx
// components/navigation/breadcrumbs.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 2.3 Tab Navigation

```tsx
// components/navigation/tabs.tsx
interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onChange 
}: {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
}) {
  return (
    <Tabs value={activeTab} onValueChange={onChange}>
      <TabsList className="grid w-full grid-cols-{tabs.length}">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

---

## 3. Form Components

### 3.1 Form Field

```tsx
// components/forms/form-field.tsx
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  name,
  required,
  error,
  description,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 3.2 Search Input

```tsx
// components/forms/search-input.tsx
export function SearchInput({ 
  placeholder = "Search...",
  onSearch,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => setQuery("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
```

### 3.3 Multi-Select

```tsx
// components/forms/multi-select.tsx
interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0
            ? `${selected.length} selected`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  const newSelected = selected.includes(option.value)
                    ? selected.filter((item) => item !== option.value)
                    : [...selected, option.value];
                  onChange(newSelected);
                }}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  className="mr-2"
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 4. Data Display Components

### 4.1 Data Table

```tsx
// components/data/data-table.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  pagination?: boolean;
  sorting?: boolean;
  selection?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  pagination = true,
  sorting = true,
  selection = false,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: selection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {searchKey && (
          <Input
            placeholder="Search..."
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <DataTableViewOptions table={table} />
      </div>
      
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
```

### 4.2 Stat Card

```tsx
// components/data/stat-card.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  change,
  icon: Icon,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    change.trend === 'up' && "text-green-600",
                    change.trend === 'down' && "text-red-600",
                    change.trend === 'neutral' && "text-muted-foreground"
                  )}
                >
                  {change.trend === 'up' && '↑'}
                  {change.trend === 'down' && '↓'}
                  {change.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-full bg-muted p-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 5. Feedback Components

### 5.1 Alert Banner

```tsx
// components/feedback/alert-banner.tsx
interface AlertBannerProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

export function AlertBanner({
  type,
  title,
  description,
  action,
  dismissible = true,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  };
  
  const Icon = icons[type];
  
  return (
    <Alert variant={type === 'error' ? 'destructive' : 'default'}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      <div className="flex items-center gap-2 mt-2">
        {action && (
          <Button size="sm" variant="outline" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        {dismissible && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="ml-auto"
          >
            Dismiss
          </Button>
        )}
      </div>
    </Alert>
  );
}
```

### 5.2 Loading States

```tsx
// components/feedback/loading-states.tsx
export function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5.3 Empty States

```tsx
// components/feedback/empty-state.tsx
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

---

## 6. Layout Components

### 6.1 Page Header

```tsx
// components/layout/page-header.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-6">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
```

### 6.2 Section

```tsx
// components/layout/section.tsx
interface SectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  actions,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
```

---

## 7. E-commerce Components

### 7.1 Product Card

```tsx
// components/ecommerce/product-card.tsx
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
  };
  onAddToCart?: () => void;
  onQuickView?: () => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
    
  return (
    <Card className="group relative overflow-hidden">
      {discount > 0 && (
        <Badge className="absolute top-2 right-2 z-10">
          -{discount}%
        </Badge>
      )}
      
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2">{product.title}</h3>
        
        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={product.rating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {!product.inStock && (
          <Badge variant="secondary" className="mt-2">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

### 7.2 Cart Item

```tsx
// components/ecommerce/cart-item.tsx
interface CartItemProps {
  item: {
    id: string;
    product: {
      title: string;
      image: string;
      price: number;
    };
    quantity: number;
    variant?: string;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={item.product.image}
          alt={item.product.title}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h4 className="font-medium">{item.product.title}</h4>
            {item.variant && (
              <p className="text-sm text-muted-foreground">{item.variant}</p>
            )}
          </div>
          <p className="font-medium">
            ${(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={onUpdateQuantity}
            min={1}
            max={99}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Dashboard Components

### 8.1 Dashboard Card

```tsx
// components/dashboard/dashboard-card.tsx
interface DashboardCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  loading?: boolean;
}

export function DashboardCard({
  title,
  description,
  actions,
  children,
  loading,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
```

### 8.2 Activity Feed

```tsx
// components/dashboard/activity-feed.tsx
interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'system';
  title: string;
  description?: string;
  timestamp: Date;
  icon?: LucideIcon;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'user': return User;
      case 'product': return Package;
      case 'system': return Settings;
    }
  };
  
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon || getIcon(item.type);
        
        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-muted p-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

### 8.3 Chart Components

```tsx
// components/dashboard/charts.tsx
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function LineChartComponent({ data, dataKey, color = "hsl(var(--primary))" }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ data, dataKey, color = "hsl(var(--primary))" }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: 'hsl(var
