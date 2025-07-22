# TableCellHeader Component

A flexible table header cell component that provides sorting functionality, icons, alignment options, and styling variants. Perfect for data tables in dashboards, product listings, and order management systems.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { TableCellHeader, TableHeaderRow } from '@/components/molecules/TableCellHeader';

// Basic header
<table>
  <thead>
    <tr>
      <TableCellHeader>Product Name</TableCellHeader>
    </tr>
  </thead>
</table>

// Sortable header
<TableCellHeader 
  sortable
  sortDirection={sortDirection}
  onSort={handleSort}
>
  Price
</TableCellHeader>

// With icon
<TableCellHeader icon={<Icon icon="package" />}>
  Products
</TableCellHeader>

// Using TableHeaderRow helper
<table>
  <thead>
    <TableHeaderRow>
      <TableCellHeader>Name</TableCellHeader>
      <TableCellHeader align="right">Price</TableCellHeader>
      <TableCellHeader align="center">Stock</TableCellHeader>
    </TableHeaderRow>
  </thead>
</table>
```

## TableCellHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'dark' \| 'transparent'` | `'default'` | Visual style variant |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment |
| `sortable` | `boolean` | `false` | Enable sorting functionality |
| `sortDirection` | `'asc' \| 'desc' \| null` | `null` | Current sort direction |
| `onSort` | `() => void` | - | Sort click handler |
| `icon` | `ReactNode` | - | Icon to display |
| `showSortIcon` | `boolean` | `true` | Show sort indicator |
| `width` | `string \| number` | - | Column width |
| `minWidth` | `string \| number` | - | Minimum column width |
| `sticky` | `boolean` | `false` | Sticky positioning |
| `children` | `ReactNode` | - | Header content |

## TableHeaderRow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'dark' \| 'transparent'` | - | Border color variant |
| `children` | `ReactNode` | - | TableCellHeader components |

## Examples

### E-commerce Use Cases

#### Product Table with Sorting
```tsx
function ProductTable() {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(current => {
        if (current === 'asc') return 'desc';
        if (current === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  return (
    <table className="w-full">
      <thead>
        <TableHeaderRow>
          <TableCellHeader>
            Product
          </TableCellHeader>
          <TableCellHeader>
            SKU
          </TableCellHeader>
          <TableCellHeader 
            sortable
            sortDirection={sortKey === 'price' ? sortDirection : null}
            onSort={() => handleSort('price')}
            align="right"
          >
            Price
          </TableCellHeader>
          <TableCellHeader 
            sortable
            sortDirection={sortKey === 'stock' ? sortDirection : null}
            onSort={() => handleSort('stock')}
            align="center"
          >
            Stock
          </TableCellHeader>
        </TableHeaderRow>
      </thead>
      <tbody>
        {/* Table rows */}
      </tbody>
    </table>
  );
}
```

#### Order Management Table
```tsx
function OrdersTable() {
  return (
    <table className="w-full">
      <thead>
        <TableHeaderRow variant="dark">
          <TableCellHeader variant="dark">
            Order ID
          </TableCellHeader>
          <TableCellHeader variant="dark">
            Date
          </TableCellHeader>
          <TableCellHeader variant="dark">
            Customer
          </TableCellHeader>
          <TableCellHeader variant="dark" align="right">
            Total
          </TableCellHeader>
          <TableCellHeader variant="dark" align="center">
            Status
          </TableCellHeader>
        </TableHeaderRow>
      </thead>
      <tbody>
        {/* Order rows */}
      </tbody>
    </table>
  );
}
```

#### Vendor Dashboard
```tsx
function VendorSalesTable() {
  return (
    <table className="w-full">
      <thead>
        <TableHeaderRow>
          <TableCellHeader width="40%">
            Product Name
          </TableCellHeader>
          <TableCellHeader align="center">
            Category
          </TableCellHeader>
          <TableCellHeader align="right">
            Revenue
          </TableCellHeader>
          <TableCellHeader align="right">
            Commission (15%)
          </TableCellHeader>
          <TableCellHeader align="center">
            Actions
          </TableCellHeader>
        </TableHeaderRow>
      </thead>
      <tbody>
        {/* Sales data rows */}
      </tbody>
    </table>
  );
}
```

### Advanced Examples

#### Multi-Column Sorting
```tsx
function AdvancedTable() {
  const [sorts, setSorts] = useState<Record<string, SortDirection>>({});
  
  const handleSort = (column: string) => {
    setSorts(current => ({
      ...current,
      [column]: current[column] === 'asc' ? 'desc' : 
                current[column] === 'desc' ? null : 'asc'
    }));
  };
  
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
  ];
  
  return (
    <table>
      <thead>
        <TableHeaderRow>
          {columns.map(col => (
            <TableCellHeader
              key={col.key}
              sortable={col.sortable}
              sortDirection={sorts[col.key] || null}
              onSort={col.sortable ? () => handleSort(col.key) : undefined}
            >
              {col.label}
            </TableCellHeader>
          ))}
        </TableHeaderRow>
      </thead>
    </table>
  );
}
```

#### Sticky Headers with Scroll
```tsx
function ScrollableTable() {
  return (
    <div className="h-96 overflow-auto">
      <table className="w-full">
        <thead>
          <TableHeaderRow>
            <TableCellHeader sticky>
              Product
            </TableCellHeader>
            <TableCellHeader sticky align="right">
              Price
            </TableCellHeader>
            <TableCellHeader sticky align="center">
              Stock
            </TableCellHeader>
          </TableHeaderRow>
        </thead>
        <tbody>
          {/* Many rows that scroll */}
        </tbody>
      </table>
    </div>
  );
}
```

#### Custom Column Widths
```tsx
function ResponsiveTable() {
  return (
    <table className="w-full">
      <thead>
        <TableHeaderRow>
          <TableCellHeader width="50%">
            Product Name
          </TableCellHeader>
          <TableCellHeader width="100px">
            SKU
          </TableCellHeader>
          <TableCellHeader minWidth="150px">
            Category
          </TableCellHeader>
          <TableCellHeader>
            Price
          </TableCellHeader>
        </TableHeaderRow>
      </thead>
    </table>
  );
}
```

### Styling Examples

#### Variants
```tsx
// Default light variant
<TableCellHeader variant="default">
  Light Header
</TableCellHeader>

// Dark variant
<TableCellHeader variant="dark">
  Dark Header
</TableCellHeader>

// Transparent variant
<TableCellHeader variant="transparent">
  Transparent Header
</TableCellHeader>
```

#### With Icons
```tsx
<TableHeaderRow>
  <TableCellHeader icon={<Icon icon="package" />}>
    Products
  </TableCellHeader>
  <TableCellHeader icon={<Icon icon="users" />}>
    Customers
  </TableCellHeader>
  <TableCellHeader icon={<Icon icon="dollarSign" />}>
    Revenue
  </TableCellHeader>
</TableHeaderRow>
```

## Accessibility

- Sortable headers have `role="button"` and are keyboard accessible
- Sort direction is communicated via `aria-sort` attribute
- Headers use semantic `<th>` elements
- Proper focus indicators for keyboard navigation
- Screen reader friendly with uppercase text preserved semantically

## Best Practices

1. **Use semantic markup** - Always use within `<table>`, `<thead>`, and `<tr>` elements
2. **Provide clear labels** - Keep header text concise and descriptive
3. **Indicate sortable columns** - Use sort icons to show which columns can be sorted
4. **Show sort direction** - Clearly indicate current sort state
5. **Consider mobile** - Use horizontal scroll or responsive tables on small screens
6. **Group related columns** - Use column groups for better organization
7. **Sticky headers** - Use sticky positioning for long tables

## Common Patterns

### Data Table Template
```tsx
function DataTable({ columns, data, onSort }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <TableHeaderRow>
            {columns.map(column => (
              <TableCellHeader
                key={column.id}
                sortable={column.sortable}
                sortDirection={column.sortDirection}
                onSort={() => onSort(column.id)}
                align={column.align}
                width={column.width}
                icon={column.icon}
              >
                {column.label}
              </TableCellHeader>
            ))}
          </TableHeaderRow>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-neutral-50">
              {/* Render cells */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Responsive Table Wrapper
```tsx
function ResponsiveTable({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  );
}
```

### Table with Actions
```tsx
function ActionsTable() {
  return (
    <table>
      <thead>
        <TableHeaderRow>
          <TableCellHeader>Item</TableCellHeader>
          <TableCellHeader align="right">Value</TableCellHeader>
          <TableCellHeader align="center" width="100px">
            Actions
          </TableCellHeader>
        </TableHeaderRow>
      </thead>
      <tbody>
        {/* Rows with action buttons */}
      </tbody>
    </table>
  );
}
```