# Avatar Component

A versatile avatar component for displaying user profile images, initials, or icons. Includes support for status indicators and group displays.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { Avatar, AvatarGroup } from '@/components/atoms/Avatar';

// With image
<Avatar 
  src="/user.jpg" 
  alt="John Doe" 
/>

// With initials
<Avatar initials="JD" />

// Auto-generated initials from alt text
<Avatar alt="Jane Smith" />

// With icon
<Avatar icon={<Icon icon="user" />} />

// With status indicator
<Avatar 
  initials="JD"
  showStatus
  status="online"
/>

// Avatar group
<AvatarGroup max={3}>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar src="/user3.jpg" alt="User 3" />
  <Avatar src="/user4.jpg" alt="User 4" />
</AvatarGroup>
```

## Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'neutral'` | Color variant |
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text (used for initials) |
| `initials` | `string` | - | Custom initials |
| `icon` | `ReactNode` | - | Icon to display |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | - | Status indicator |
| `showStatus` | `boolean` | `false` | Show status indicator |
| `fallback` | `ReactNode` | - | Custom fallback content |
| `loading` | `boolean` | `false` | Loading state |

## AvatarGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | `number` | `3` | Maximum avatars to show |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size for all avatars |
| `spacing` | `'tight' \| 'normal' \| 'loose'` | `'normal'` | Overlap spacing |
| `children` | `ReactNode` | - | Avatar components |

## Examples

### E-commerce Use Cases

#### User Profile
```tsx
function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src="/user.jpg"
        alt="John Doe"
        size="lg"
        showStatus
        status="online"
      />
      <div>
        <h3 className="font-medium">John Doe</h3>
        <p className="text-sm text-neutral-600">Premium Member</p>
      </div>
    </div>
  );
}
```

#### Vendor List
```tsx
function VendorList() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar
          src="/vendor1.jpg"
          alt="Tech Store"
          showStatus
          status="online"
        />
        <div>
          <h4 className="font-medium">Tech Store</h4>
          <p className="text-sm text-neutral-600">Shop Partner • Gold Tier</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar
          initials="FS"
          variant="primary"
          showStatus
          status="away"
        />
        <div>
          <h4 className="font-medium">Fashion Store</h4>
          <p className="text-sm text-neutral-600">Brand Partner</p>
        </div>
      </div>
    </div>
  );
}
```

#### Customer Reviews
```tsx
function ReviewItem({ review }) {
  return (
    <div className="flex gap-3">
      <Avatar
        src={review.avatar}
        alt={review.name}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{review.name}</span>
          <span className="text-xs text-neutral-500">{review.date}</span>
        </div>
        <div className="flex mb-2">
          {/* Star rating */}
        </div>
        <p className="text-sm">{review.comment}</p>
      </div>
    </div>
  );
}
```

#### Team Members
```tsx
function TeamMembers({ members }) {
  return (
    <div>
      <h3 className="font-medium mb-3">Team Members</h3>
      <AvatarGroup max={5}>
        {members.map((member) => (
          <Avatar
            key={member.id}
            src={member.avatar}
            alt={member.name}
          />
        ))}
      </AvatarGroup>
    </div>
  );
}
```

#### Chat List
```tsx
function ChatListItem({ chat }) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-lg">
      <Avatar
        src={chat.avatar}
        alt={chat.name}
        showStatus
        status={chat.status}
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">{chat.name}</h4>
          <span className="text-xs text-neutral-500">{chat.time}</span>
        </div>
        <p className="text-sm text-neutral-600 truncate">
          {chat.lastMessage}
        </p>
      </div>
      {chat.unread && (
        <span className="h-2 w-2 bg-primary-500 rounded-full" />
      )}
    </div>
  );
}
```

### Size Examples
```tsx
<div className="flex items-center gap-4">
  <Avatar size="xs" initials="XS" />
  <Avatar size="sm" initials="SM" />
  <Avatar size="md" initials="MD" />
  <Avatar size="lg" initials="LG" />
  <Avatar size="xl" initials="XL" />
</div>
```

### Variant Examples
```tsx
<div className="flex items-center gap-4">
  <Avatar variant="primary" initials="P" />
  <Avatar variant="secondary" initials="S" />
  <Avatar variant="success" initials="S" />
  <Avatar variant="warning" initials="W" />
  <Avatar variant="danger" initials="D" />
  <Avatar variant="neutral" initials="N" />
</div>
```

### Status Indicators
```tsx
<div className="flex items-center gap-4">
  <Avatar initials="ON" showStatus status="online" />
  <Avatar initials="OF" showStatus status="offline" />
  <Avatar initials="BU" showStatus status="busy" />
  <Avatar initials="AW" showStatus status="away" />
</div>
```

### Avatar Types
```tsx
// Image avatar
<Avatar src="/user.jpg" alt="User Name" />

// Initial avatar
<Avatar initials="UN" />

// Auto-generated initials
<Avatar alt="User Name" /> // Shows "UN"

// Icon avatar
<Avatar icon={<Icon icon="user" size="sm" />} />

// Custom fallback
<Avatar fallback={<span>?</span>} />
```

## Avatar Group Examples

### Basic Group
```tsx
<AvatarGroup>
  <Avatar src="/user1.jpg" alt="User 1" />
  <Avatar src="/user2.jpg" alt="User 2" />
  <Avatar src="/user3.jpg" alt="User 3" />
</AvatarGroup>
```

### With Overflow
```tsx
<AvatarGroup max={3}>
  <Avatar initials="A" />
  <Avatar initials="B" />
  <Avatar initials="C" />
  <Avatar initials="D" />
  <Avatar initials="E" />
</AvatarGroup>
// Shows: A, B, C, +2
```

### Different Spacing
```tsx
// Tight spacing
<AvatarGroup spacing="tight">
  <Avatar initials="A" />
  <Avatar initials="B" />
  <Avatar initials="C" />
</AvatarGroup>

// Loose spacing
<AvatarGroup spacing="loose">
  <Avatar initials="A" />
  <Avatar initials="B" />
  <Avatar initials="C" />
</AvatarGroup>
```

## Accessibility

- Images include alt text for screen readers
- Status indicators have aria-labels
- Proper color contrast for all variants
- Fallback to initials when images fail to load

## Best Practices

1. **Always provide alt text** - Used for accessibility and initial generation
2. **Use appropriate sizes** - Match avatar size to context
3. **Show status thoughtfully** - Only when relevant to user interaction
4. **Handle loading states** - Show skeleton while images load
5. **Provide fallbacks** - Ensure avatars display even without images
6. **Group efficiently** - Use AvatarGroup for multiple avatars
7. **Consider performance** - Optimize image sizes for avatars