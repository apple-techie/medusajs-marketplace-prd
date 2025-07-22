# BubbleChat Component

A comprehensive chat messaging interface component with bubble-style messages, reactions, replies, editing capabilities, and file attachments. Perfect for customer support systems, vendor communication, team messaging, and real-time chat applications.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { BubbleChat, useBubbleChat } from '@/components/organisms/BubbleChat';

// Basic usage
<BubbleChat
  messages={[
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: {
        id: 'agent1',
        name: 'Support Agent',
        avatar: 'https://example.com/avatar.jpg',
      },
      timestamp: new Date(),
      type: 'text',
    },
  ]}
  currentUserId="user1"
/>

// With state management
function ChatInterface() {
  const { messages, sendMessage } = useBubbleChat();
  
  return (
    <BubbleChat
      messages={messages}
      currentUserId="user1"
      onSendMessage={(content, attachments) => {
        sendMessage(content, 'user1', currentUser);
      }}
    />
  );
}
```

## Component Props

### BubbleChat Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | `ChatMessage[]` | - | **Required**. Array of chat messages |
| `currentUserId` | `string` | - | **Required**. ID of the current user |
| `onSendMessage` | `(content: string, attachments?: File[]) => void` | - | Called when sending a message |
| `onDeleteMessage` | `(messageId: string) => void` | - | Called when deleting a message |
| `onEditMessage` | `(messageId: string, newContent: string) => void` | - | Called when editing a message |
| `onReaction` | `(messageId: string, emoji: string) => void` | - | Called when adding a reaction |
| `onReply` | `(message: ChatMessage) => void` | - | Called when replying to a message |
| `showAvatar` | `boolean` | `true` | Show user avatars |
| `showTimestamp` | `boolean` | `true` | Show message timestamps |
| `showStatus` | `boolean` | `true` | Show message status |
| `groupMessages` | `boolean` | `true` | Group consecutive messages from same sender |
| `enableActions` | `boolean` | `true` | Enable message actions (edit, delete, reply, react) |
| `placeholder` | `string` | `'Type a message...'` | Input placeholder text |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Message bubble size |
| `className` | `string` | - | Additional CSS classes for messages container |
| `containerClassName` | `string` | - | Additional CSS classes for main container |
| `inputClassName` | `string` | - | Additional CSS classes for input area |

### ChatMessage Interface

```tsx
interface ChatMessage {
  id: string;
  content: string;
  sender: ChatUser;
  timestamp: Date | string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  type?: 'text' | 'image' | 'file' | 'system';
  attachments?: {
    url: string;
    name: string;
    size?: number;
    type: string;
  }[];
  replyTo?: ChatMessage;
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  isEdited?: boolean;
}
```

### ChatUser Interface

```tsx
interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}
```

### useBubbleChat Hook

```tsx
const {
  messages,          // Current messages array
  loading,          // Loading state
  setMessages,      // Update messages
  setLoading,       // Update loading state
  sendMessage,      // Send a new message
  deleteMessage,    // Delete a message
  editMessage,      // Edit a message
} = useBubbleChat();
```

## Examples

### Customer Support Chat

```tsx
function CustomerSupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Welcome to customer support! How can I help you today?',
      sender: {
        id: 'bot',
        name: 'Support Bot',
        avatar: '/bot-avatar.png',
      },
      timestamp: new Date(),
      type: 'text',
    },
  ]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    // Add customer message
    const customerMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: {
        id: 'customer1',
        name: 'John Doe',
        avatar: '/customer-avatar.png',
      },
      timestamp: new Date(),
      status: 'sent',
      type: attachments?.length > 0 ? 'file' : 'text',
      attachments: attachments?.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };
    
    setMessages(prev => [...prev, customerMessage]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I\'ll help you with that right away!',
        sender: {
          id: 'agent1',
          name: 'Emma Wilson',
          avatar: '/agent-avatar.png',
        },
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  return (
    <div className="h-[600px] border rounded-lg">
      <div className="bg-primary-600 text-white p-4 rounded-t-lg">
        <h2 className="font-semibold">Customer Support</h2>
        <p className="text-sm opacity-90">We typically reply within 5 minutes</p>
      </div>
      <BubbleChat
        messages={messages}
        currentUserId="customer1"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
```

### Vendor Communication

```tsx
function VendorChat() {
  const { messages, sendMessage, editMessage, deleteMessage } = useBubbleChat();
  const [vendorInfo] = useState({
    id: 'vendor1',
    name: 'TechStore Pro',
    avatar: '/vendor-logo.png',
  });

  return (
    <div className="h-screen flex">
      <div className="w-96 border-r">
        {/* Vendor info sidebar */}
        <div className="p-6 border-b">
          <Avatar src={vendorInfo.avatar} size="lg" />
          <h3 className="font-semibold mt-3">{vendorInfo.name}</h3>
          <p className="text-sm text-neutral-600">Wholesale Partner</p>
        </div>
      </div>
      
      <div className="flex-1">
        <BubbleChat
          messages={messages}
          currentUserId="brand1"
          onSendMessage={(content, attachments) => {
            sendMessage(content, 'brand1', {
              id: 'brand1',
              name: 'Your Brand',
              avatar: '/brand-logo.png',
            });
          }}
          onEditMessage={editMessage}
          onDeleteMessage={deleteMessage}
          enableActions={true}
        />
      </div>
    </div>
  );
}
```

### With Reactions and Replies

```tsx
function InteractiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.users.includes(currentUserId)) {
            existingReaction.users = existingReaction.users.filter(
              id => id !== currentUserId
            );
          } else {
            existingReaction.users.push(currentUserId);
          }
        } else {
          // Add new reaction
          msg.reactions = [
            ...(msg.reactions || []),
            { emoji, users: [currentUserId] }
          ];
        }
      }
      return msg;
    }));
  };

  const handleReply = (replyTo: ChatMessage) => {
    // Set up reply context
    console.log('Replying to:', replyTo);
  };

  return (
    <BubbleChat
      messages={messages}
      currentUserId={currentUserId}
      onReaction={handleReaction}
      onReply={handleReply}
      enableActions={true}
    />
  );
}
```

### With File Attachments

```tsx
function FileShareChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (attachments && attachments.length > 0) {
      // Handle file uploads
      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          // Upload to server
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          
          return {
            url: data.url,
            name: file.name,
            size: file.size,
            type: file.type,
          };
        })
      );
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        content: content || 'Shared files',
        sender: currentUser,
        timestamp: new Date(),
        type: 'file',
        attachments: uploadedFiles,
        status: 'sent',
      };
      
      setMessages(prev => [...prev, message]);
    }
  };

  return (
    <BubbleChat
      messages={messages}
      currentUserId={currentUser.id}
      onSendMessage={handleSendMessage}
      placeholder="Type a message or drop files..."
    />
  );
}
```

### System Messages

```tsx
const systemMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Chat started',
    sender: { id: 'system', name: 'System' },
    timestamp: new Date(),
    type: 'system',
  },
  {
    id: '2',
    content: 'Agent Emma has joined the chat',
    sender: { id: 'system', name: 'System' },
    timestamp: new Date(),
    type: 'system',
  },
  // Regular messages...
  {
    id: '10',
    content: 'This chat has been marked as resolved',
    sender: { id: 'system', name: 'System' },
    timestamp: new Date(),
    type: 'system',
  },
];
```

### Different Sizes

```tsx
// Small bubbles for compact interfaces
<BubbleChat
  messages={messages}
  currentUserId={userId}
  size="sm"
/>

// Large bubbles for accessibility
<BubbleChat
  messages={messages}
  currentUserId={userId}
  size="lg"
/>
```

## Features

### Message Types
- **Text**: Regular text messages with formatting support
- **Image**: Inline image display with lightbox support
- **File**: File attachments with download capability
- **System**: Centered system notifications

### Message Status
- **Sending**: Message being sent (no icon)
- **Sent**: Single check mark
- **Delivered**: Double check mark (gray)
- **Read**: Double check mark (blue)
- **Failed**: Error icon with retry option

### Interactive Features
- **Reactions**: Click to add emoji reactions
- **Reply**: Reply to specific messages with context
- **Edit**: Edit your own messages (shows edited indicator)
- **Delete**: Delete your own messages
- **File Upload**: Drag-and-drop or click to attach files

### Smart Features
- **Message Grouping**: Groups consecutive messages from same sender
- **Auto-scroll**: Scrolls to latest message automatically
- **Typing Indicators**: Can show when someone is typing
- **Timestamp Formatting**: Smart relative timestamps
- **File Size Formatting**: Human-readable file sizes

## Styling

### Message Bubble Variants

```tsx
// Sender types
- user: Primary color bubble (right-aligned)
- other: Neutral color bubble (left-aligned)
- system: Warning color bubble (center-aligned)

// Sizes
- sm: Compact bubbles with smaller text
- md: Default size
- lg: Larger bubbles with bigger text
```

### Custom Styling

```tsx
// Dark theme
<div className="dark">
  <BubbleChat
    containerClassName="bg-gray-900"
    className="text-white"
    inputClassName="bg-gray-800 border-gray-700"
  />
</div>

// Custom height
<BubbleChat
  containerClassName="h-[80vh]"
  messages={messages}
  currentUserId={userId}
/>

// Custom colors
<style>
  .custom-chat .bg-primary-600 {
    background-color: #your-color;
  }
</style>
```

## Accessibility

- Semantic HTML structure with proper roles
- Keyboard navigation for all interactive elements
- Screen reader announcements for new messages
- Focus management for editing and actions
- High contrast mode support
- Proper ARIA labels and descriptions

## Best Practices

1. **Message IDs**: Use unique, stable IDs for messages
2. **Timestamps**: Use ISO strings or Date objects for consistency
3. **User Data**: Cache user information to avoid redundancy
4. **File Uploads**: Implement proper validation and size limits
5. **Real-time Updates**: Use WebSocket for live message updates
6. **Optimistic UI**: Show messages immediately, update status async
7. **Error Handling**: Provide retry mechanisms for failed messages
8. **Performance**: Virtualize long message lists for better performance
9. **Security**: Sanitize user input and validate file types
10. **Persistence**: Save draft messages and conversation state