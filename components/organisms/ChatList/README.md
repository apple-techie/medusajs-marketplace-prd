# ChatList Component

A comprehensive chat list component for displaying conversations in messaging interfaces. Features include search functionality, unread badges, online status indicators, message previews, timestamps, and interactive states. Perfect for customer support chats, team messaging, and marketplace communication.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ChatList, useChatList } from '@/components/organisms/ChatList';

// Basic usage
<ChatList
  items={[
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg',
        status: 'online',
      },
      lastMessage: {
        id: 'msg1',
        content: 'Hey, how are you?',
        timestamp: new Date().toISOString(),
        senderId: 'user1',
      },
      unreadCount: 2,
    },
  ]}
/>

// With state management
function MessagingInterface() {
  const { activeItemId, setActiveItemId } = useChatList();
  
  const handleItemClick = (item) => {
    setActiveItemId(item.id);
    // Open conversation
  };
  
  return (
    <ChatList
      items={chatItems}
      activeItemId={activeItemId}
      onItemClick={handleItemClick}
    />
  );
}
```

## Component Props

### ChatList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ChatItem[]` | - | **Required**. Array of chat items |
| `activeItemId` | `string` | - | ID of the currently active chat |
| `onItemClick` | `(item: ChatItem) => void` | - | Called when a chat item is clicked |
| `onItemDelete` | `(item: ChatItem) => void` | - | Called when delete button is clicked |
| `showSearch` | `boolean` | `true` | Show search input |
| `searchPlaceholder` | `string` | `'Search conversations...'` | Search input placeholder |
| `onSearchChange` | `(query: string) => void` | - | Called when search query changes |
| `showStatus` | `boolean` | `true` | Show online status indicators |
| `showTimestamp` | `boolean` | `true` | Show message timestamps |
| `showUnreadBadge` | `boolean` | `true` | Show unread count badges |
| `emptyMessage` | `string` | `'No conversations yet'` | Message when list is empty |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `variant` | `'default' \| 'bordered' \| 'elevated'` | `'default'` | Visual variant |
| `className` | `string` | - | Additional CSS classes |
| `itemClassName` | `string` | - | Additional CSS classes for items |

### ChatItem Interface

```tsx
interface ChatItem {
  id: string;
  user: ChatUser;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isTyping?: boolean;
  draftMessage?: string;
}
```

### ChatUser Interface

```tsx
interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}
```

### ChatMessage Interface

```tsx
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date | string;
  isRead?: boolean;
  senderId: string;
  type?: 'text' | 'image' | 'file' | 'voice';
}
```

### useChatList Hook

```tsx
const {
  activeItemId,      // Currently active chat ID
  searchQuery,       // Current search query
  setActiveItemId,   // Set active chat
  setSearchQuery,    // Set search query
  markAsRead,        // Mark chat as read
  deleteItem,        // Delete chat item
} = useChatList();
```

## Examples

### Customer Support Chat

```tsx
function CustomerSupport() {
  const { activeItemId, setActiveItemId } = useChatList();
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: '1',
      user: {
        id: 'customer1',
        name: 'Order #12345 - John D.',
        avatar: 'https://example.com/avatar1.jpg',
        status: 'online',
      },
      lastMessage: {
        id: 'msg1',
        content: 'My order hasn\'t arrived yet',
        timestamp: new Date().toISOString(),
        senderId: 'customer1',
      },
      unreadCount: 3,
      isPinned: true,
    },
    // ... more support tickets
  ]);

  const handleItemClick = (item: ChatItem) => {
    setActiveItemId(item.id);
    // Mark as read
    setChats(prev => prev.map(chat => 
      chat.id === item.id ? { ...chat, unreadCount: 0 } : chat
    ));
  };

  return (
    <div className="h-screen flex">
      <div className="w-96 border-r">
        <div className="bg-primary-600 text-white p-4">
          <h2 className="font-semibold">Support Chat</h2>
          <p className="text-sm opacity-90">
            {chats.filter(c => c.unreadCount > 0).length} unread
          </p>
        </div>
        <ChatList
          items={chats}
          activeItemId={activeItemId}
          onItemClick={handleItemClick}
          variant="default"
        />
      </div>
      
      <div className="flex-1">
        {/* Chat conversation view */}
      </div>
    </div>
  );
}
```

### Team Messaging

```tsx
function TeamChat() {
  const channels: ChatItem[] = [
    {
      id: 'general',
      user: {
        id: 'general',
        name: '#general',
        avatar: '/channel-general.png',
      },
      lastMessage: {
        id: 'msg1',
        content: 'Team meeting at 3 PM',
        timestamp: new Date().toISOString(),
        senderId: 'admin',
      },
      unreadCount: 5,
    },
    {
      id: 'development',
      user: {
        id: 'dev',
        name: '#development',
        avatar: '/channel-dev.png',
      },
      lastMessage: {
        id: 'msg2',
        content: 'New PR ready for review',
        timestamp: new Date().toISOString(),
        senderId: 'dev1',
      },
      unreadCount: 2,
    },
  ];

  return (
    <ChatList
      items={channels}
      showStatus={false} // Channels don't have status
      variant="bordered"
    />
  );
}
```

### With Search and Filters

```tsx
function SearchableChat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  
  const filteredChats = useMemo(() => {
    let filtered = chatItems;
    
    // Apply filter
    if (filter === 'unread') {
      filtered = filtered.filter(chat => chat.unreadCount > 0);
    } else if (filter === 'pinned') {
      filtered = filtered.filter(chat => chat.isPinned);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(chat => 
        chat.user.name.toLowerCase().includes(query) ||
        chat.lastMessage?.content.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, filter]);

  return (
    <div>
      <div className="flex gap-2 p-4 border-b">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread
        </Button>
        <Button
          variant={filter === 'pinned' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('pinned')}
        >
          Pinned
        </Button>
      </div>
      
      <ChatList
        items={filteredChats}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search chats..."
      />
    </div>
  );
}
```

### With Typing Indicator

```tsx
function LiveChat() {
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  
  // Simulate typing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      
      // Show typing
      setChats(prev => prev.map(chat => 
        chat.id === randomChat.id ? { ...chat, isTyping: true } : chat
      ));
      
      // Hide typing after 3 seconds
      setTimeout(() => {
        setChats(prev => prev.map(chat => 
          chat.id === randomChat.id ? { ...chat, isTyping: false } : chat
        ));
      }, 3000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [chats]);

  return <ChatList items={chats} />;
}
```

### With Message Types

```tsx
const multimediaChats: ChatItem[] = [
  {
    id: '1',
    user: { id: 'u1', name: 'Photo Share' },
    lastMessage: {
      id: 'm1',
      content: 'vacation-photo.jpg',
      timestamp: new Date().toISOString(),
      senderId: 'u1',
      type: 'image',
    },
  },
  {
    id: '2',
    user: { id: 'u2', name: 'Document Share' },
    lastMessage: {
      id: 'm2',
      content: 'project-proposal.pdf',
      timestamp: new Date().toISOString(),
      senderId: 'u2',
      type: 'file',
    },
  },
  {
    id: '3',
    user: { id: 'u3', name: 'Voice Message' },
    lastMessage: {
      id: 'm3',
      content: 'Voice message (0:45)',
      timestamp: new Date().toISOString(),
      senderId: 'u3',
      type: 'voice',
    },
  },
];

<ChatList items={multimediaChats} />
```

## Styling

### Variants

```tsx
// Default - no border
<ChatList variant="default" />

// Bordered - with border and rounded corners
<ChatList variant="bordered" />

// Elevated - with shadow
<ChatList variant="elevated" />
```

### Custom Styling

```tsx
// Dark theme
<div className="dark">
  <ChatList 
    className="bg-gray-900 text-white"
    itemClassName="hover:bg-gray-800"
  />
</div>

// Custom height
<ChatList 
  className="h-[600px]"
  items={chats}
/>
```

## Features

### Smart Timestamps
- Today: Shows time (e.g., "2:30 PM")
- Yesterday: Shows "Yesterday"
- This week: Shows day name (e.g., "Mon")
- Older: Shows date (e.g., "Jan 15")

### Status Indicators
- Online (green dot)
- Away (yellow dot)
- Busy (red dot)
- Offline (no indicator)

### Message States
- Unread count badges
- Typing indicators
- Draft messages
- Message type icons (image, file, voice)

### Interactions
- Click to select conversation
- Hover to show delete button
- Search filters results in real-time
- Pinned items appear first

### Sorting
- Pinned items first
- Then by last message timestamp (newest first)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for interactive elements
- Focus indicators
- Screen reader friendly
- High contrast support

## Best Practices

1. **Limit visible items** - Use virtualization for large lists
2. **Real-time updates** - Update typing indicators and online status
3. **Optimistic updates** - Update UI immediately on user actions
4. **Persistent state** - Save active chat and read status
5. **Search debouncing** - Debounce search input for performance
6. **Mobile responsiveness** - Full width on mobile devices
7. **Loading states** - Show skeletons while loading
8. **Error handling** - Handle failed message loads gracefully