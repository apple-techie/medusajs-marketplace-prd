# SubMenuTreeItem Component

A hierarchical tree navigation component for displaying nested menu structures. Perfect for sidebars, file explorers, settings panels, and any interface requiring expandable/collapsible navigation. Includes both individual tree item component and a full tree component with state management.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { SubMenuTreeItem, SubMenuTree, useSubMenuTree } from '@/components/molecules/SubMenuTreeItem';

// Single tree item
<SubMenuTreeItem
  item={{
    id: 'products',
    label: 'Products',
    icon: 'package',
    children: [
      { id: 'all', label: 'All Products', icon: 'list' },
      { id: 'add', label: 'Add Product', icon: 'plus' },
    ],
  }}
/>

// Full tree with state management
function Navigation() {
  const {
    expandedItemIds,
    activeItemId,
    setActiveItemId,
    toggleItem,
  } = useSubMenuTree(menuItems);

  return (
    <SubMenuTree
      items={menuItems}
      activeItemId={activeItemId}
      expandedItemIds={expandedItemIds}
      onItemClick={(item) => setActiveItemId(item.id)}
      onItemToggle={toggleItem}
    />
  );
}
```

## Component Props

### SubMenuTreeItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `TreeItem` | - | **Required**. The tree item data |
| `level` | `number` | `0` | Nesting level (for indentation) |
| `isExpanded` | `boolean` | - | Controlled expanded state |
| `isActive` | `boolean` | - | Active/selected state |
| `onToggle` | `(item: TreeItem) => void` | - | Called when expand/collapse toggled |
| `onClick` | `(item: TreeItem) => void` | - | Called when item is clicked |
| `onActiveChange` | `(itemId: string) => void` | - | Called when active state changes |
| `expandIcon` | `string` | `'chevronRight'` | Icon for collapsed state |
| `collapseIcon` | `string` | `'chevronDown'` | Icon for expanded state |
| `showExpandIcon` | `boolean` | `true` | Show expand/collapse icon |
| `indentSize` | `number` | `24` | Pixels per indent level |
| `showConnectors` | `boolean` | `false` | Show connecting lines |
| `variant` | `'default' \| 'rounded' \| 'minimal'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `className` | `string` | - | Additional CSS classes |

### TreeItem Interface

```tsx
interface TreeItem {
  id: string;                    // Unique identifier
  label: string;                 // Display text
  icon?: string;                 // Icon name
  href?: string;                 // Link URL
  badge?: string | number;       // Badge content
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  disabled?: boolean;            // Disabled state
  children?: TreeItem[];         // Nested items
  metadata?: Record<string, any>; // Custom data
}
```

### SubMenuTree Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TreeItem[]` | - | **Required**. Array of tree items |
| `activeItemId` | `string` | - | ID of active item |
| `expandedItemIds` | `Set<string>` | - | Set of expanded item IDs |
| `onItemClick` | `(item: TreeItem) => void` | - | Item click handler |
| `onItemToggle` | `(item: TreeItem) => void` | - | Toggle handler |
| `onActiveChange` | `(itemId: string) => void` | - | Active change handler |
| `showExpandIcon` | `boolean` | `true` | Show expand icons |
| `indentSize` | `number` | `24` | Indent size in pixels |
| `showConnectors` | `boolean` | `false` | Show connector lines |
| `variant` | `string` | - | Visual variant |
| `size` | `string` | - | Size variant |
| `className` | `string` | - | Additional CSS classes |

### useSubMenuTree Hook

```tsx
const {
  expandedItemIds,      // Set of expanded item IDs
  activeItemId,         // Currently active item ID
  setActiveItemId,      // Set active item
  toggleItem,           // Toggle item expansion
  expandAll,            // Expand all items
  collapseAll,          // Collapse all items
  expandToItem,         // Expand path to specific item
} = useSubMenuTree(items, defaultExpandedIds);
```

## Examples

### Basic Navigation Menu

```tsx
function BasicMenu() {
  const menuItems: TreeItem[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'package' },
    { id: 'orders', label: 'Orders', icon: 'shoppingBag', badge: '5' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <SubMenuTree
      items={menuItems}
      onItemClick={(item) => console.log('Navigate to:', item.id)}
    />
  );
}
```

### Nested Menu with State

```tsx
function NestedNavigation() {
  const {
    expandedItemIds,
    activeItemId,
    setActiveItemId,
    toggleItem,
    expandAll,
    collapseAll,
  } = useSubMenuTree(menuItems, ['products']); // Default expanded

  const menuItems: TreeItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
    },
    {
      id: 'products',
      label: 'Products',
      icon: 'package',
      badge: '12',
      children: [
        { id: 'all-products', label: 'All Products', icon: 'list' },
        { id: 'add-product', label: 'Add Product', icon: 'plus' },
        {
          id: 'categories',
          label: 'Categories',
          icon: 'folder',
          children: [
            { id: 'electronics', label: 'Electronics' },
            { id: 'clothing', label: 'Clothing' },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" onClick={expandAll}>Expand All</Button>
        <Button size="sm" onClick={collapseAll}>Collapse All</Button>
      </div>
      
      <SubMenuTree
        items={menuItems}
        activeItemId={activeItemId}
        expandedItemIds={expandedItemIds}
        onItemClick={(item) => !item.children && setActiveItemId(item.id)}
        onItemToggle={toggleItem}
      />
    </div>
  );
}
```

### File Explorer

```tsx
function FileExplorer() {
  const fileTree: TreeItem[] = [
    {
      id: 'src',
      label: 'src',
      icon: 'folder',
      children: [
        {
          id: 'components',
          label: 'components',
          icon: 'folder',
          children: [
            { id: 'Button.tsx', label: 'Button.tsx', icon: 'file' },
            { id: 'Input.tsx', label: 'Input.tsx', icon: 'file' },
          ],
        },
        { id: 'App.tsx', label: 'App.tsx', icon: 'file' },
      ],
    },
    { id: 'package.json', label: 'package.json', icon: 'package' },
  ];

  const { expandedItemIds, activeItemId, setActiveItemId, toggleItem } = 
    useSubMenuTree(fileTree);

  return (
    <div className="bg-neutral-900 text-white p-4 rounded">
      <SubMenuTree
        items={fileTree}
        activeItemId={activeItemId}
        expandedItemIds={expandedItemIds}
        onItemClick={(item) => !item.children && setActiveItemId(item.id)}
        onItemToggle={toggleItem}
        variant="minimal"
        size="sm"
        showConnectors={true}
      />
    </div>
  );
}
```

### Settings Panel

```tsx
function SettingsPanel() {
  const settingsItems: TreeItem[] = [
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: 'user',
      children: [
        { id: 'edit-profile', label: 'Edit Profile', icon: 'edit' },
        { id: 'privacy', label: 'Privacy', icon: 'lock' },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      badge: 'New',
      badgeVariant: 'success',
      children: [
        { id: 'email', label: 'Email Preferences' },
        { id: 'push', label: 'Push Notifications' },
      ],
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'shield',
      disabled: true,
    },
  ];

  return (
    <SubMenuTree
      items={settingsItems}
      variant="rounded"
      expandedItemIds={new Set(['notifications'])}
    />
  );
}
```

### With Links

```tsx
<SubMenuTree
  items={[
    {
      id: 'docs',
      label: 'Documentation',
      icon: 'book',
      children: [
        { id: 'start', label: 'Getting Started', href: '/docs/start' },
        { id: 'api', label: 'API Reference', href: '/docs/api' },
        { id: 'examples', label: 'Examples', href: '/docs/examples' },
      ],
    },
  ]}
/>
```

### Programmatic Control

```tsx
function ProgrammaticTree() {
  const { expandToItem, setActiveItemId } = useSubMenuTree(items);

  const navigateToItem = (itemId: string) => {
    expandToItem(itemId);     // Expand path to item
    setActiveItemId(itemId);  // Set as active
  };

  return (
    <>
      <Button onClick={() => navigateToItem('deeply.nested.item')}>
        Go to Nested Item
      </Button>
      <SubMenuTree items={items} />
    </>
  );
}
```

## Styling

### Variants

```tsx
// Default - hover background
<SubMenuTree variant="default" />

// Rounded - rounded corners on hover
<SubMenuTree variant="rounded" />

// Minimal - text color change on hover
<SubMenuTree variant="minimal" />
```

### Sizes

```tsx
// Small - compact items
<SubMenuTree size="sm" />

// Medium - default size
<SubMenuTree size="md" />

// Large - spacious items
<SubMenuTree size="lg" />
```

### Custom Styling

```tsx
// Dark theme
<div className="bg-neutral-900 text-white">
  <SubMenuTree 
    className="[&_.hover\\:bg-neutral-50:hover]:bg-neutral-800"
    variant="minimal"
  />
</div>

// Custom indentation
<SubMenuTree indentSize={32} />

// With connector lines
<SubMenuTree showConnectors={true} />
```

## Features

### Expand/Collapse
- Smooth animations for expand/collapse
- Controlled and uncontrolled modes
- Expand/collapse all functionality
- Auto-expand to active item

### Active State Management
- Visual indication of active item
- Parent items show active when child is active
- Programmatic active state control

### Badges
- Support for badges with counts or text
- Multiple badge variants
- Works with all item states

### Links
- Items can have href for navigation
- Works with React Router or Next.js Link
- Prevents expand/collapse on link items

### Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure

## Best Practices

1. **Keep nesting reasonable** - Limit to 3-4 levels for usability
2. **Use clear labels** - Keep item labels concise and descriptive
3. **Logical grouping** - Group related items together
4. **Icons for clarity** - Use icons to help users identify item types
5. **Active state** - Always show which item is currently active
6. **Expand important sections** - Default expand frequently used sections
7. **Responsive design** - Consider mobile layouts for deep nesting
8. **Performance** - Use memoization for large trees