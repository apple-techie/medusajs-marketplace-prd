import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChatList, useChatList, type ChatItem } from './ChatList';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/ChatList',
  component: ChatList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
    },
    showSearch: {
      control: 'boolean',
    },
    showStatus: {
      control: 'boolean',
    },
    showTimestamp: {
      control: 'boolean',
    },
    showUnreadBadge: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ChatList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleChats: ChatItem[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Melissa Jasmine',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'online',
    },
    lastMessage: {
      id: 'msg1',
      content: 'Got it! Thank you. I\'ll go ahead and place the order now.',
      timestamp: new Date().toISOString(),
      senderId: 'user1',
    },
    unreadCount: 2,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=8',
      status: 'away',
    },
    lastMessage: {
      id: 'msg2',
      content: 'The shipment has been dispatched and should arrive by tomorrow.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      senderId: 'user2',
    },
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'online',
    },
    lastMessage: {
      id: 'msg3',
      content: 'Can you check if the blue variant is available?',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      senderId: 'user3',
    },
    unreadCount: 1,
    isPinned: true,
  },
  {
    id: '4',
    user: {
      id: 'user4',
      name: 'Tech Support',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'busy',
    },
    lastMessage: {
      id: 'msg4',
      content: 'Your issue has been resolved. Please check and confirm.',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      senderId: 'user4',
    },
    unreadCount: 0,
    isMuted: true,
  },
  {
    id: '5',
    user: {
      id: 'user5',
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=9',
      status: 'offline',
    },
    lastMessage: {
      id: 'msg5',
      content: 'Looking forward to our meeting next week!',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      senderId: 'user5',
    },
    unreadCount: 0,
  },
];

// Basic example
export const Default: Story = {
  args: {
    items: sampleChats,
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const { activeItemId, setActiveItemId } = useChatList();
    const [chats, setChats] = useState(sampleChats);

    const handleItemClick = (item: ChatItem) => {
      setActiveItemId(item.id);
      // Mark as read
      setChats(prev => prev.map(chat => 
        chat.id === item.id ? { ...chat, unreadCount: 0 } : chat
      ));
    };

    const handleItemDelete = (item: ChatItem) => {
      setChats(prev => prev.filter(chat => chat.id !== item.id));
    };

    return (
      <div className="w-96">
        <ChatList
          items={chats}
          activeItemId={activeItemId}
          onItemClick={handleItemClick}
          onItemDelete={handleItemDelete}
          variant="bordered"
        />
        
        {activeItemId && (
          <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
            <p className="text-sm text-neutral-600">
              Active chat: {chats.find(c => c.id === activeItemId)?.user.name}
            </p>
          </div>
        )}
      </div>
    );
  },
};

// With search
export const WithSearch: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    return (
      <div className="w-96">
        <ChatList
          items={sampleChats}
          showSearch={true}
          onSearchChange={setSearchQuery}
        />
        {searchQuery && (
          <div className="mt-2 text-sm text-neutral-600">
            Searching for: "{searchQuery}"
          </div>
        )}
      </div>
    );
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    items: [],
    emptyMessage: 'No conversations yet. Start chatting!',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    items: [],
    loading: true,
  },
};

// With typing indicator
export const WithTypingIndicator: Story = {
  args: {
    items: [
      {
        ...sampleChats[0],
        isTyping: true,
      },
      ...sampleChats.slice(1),
    ],
  },
};

// With draft messages
export const WithDraftMessages: Story = {
  args: {
    items: [
      {
        ...sampleChats[0],
        draftMessage: 'I was thinking about...',
      },
      {
        ...sampleChats[1],
        draftMessage: 'Actually, I wanted to ask you something else regarding the shipment details and delivery',
      },
      ...sampleChats.slice(2),
    ],
  },
};

// Different message types
export const MessageTypes: Story = {
  args: {
    items: [
      {
        id: '1',
        user: {
          id: 'user1',
          name: 'Photo Share',
          avatar: 'https://i.pravatar.cc/150?img=20',
          status: 'online',
        },
        lastMessage: {
          id: 'msg1',
          content: 'vacation-photo.jpg',
          timestamp: new Date().toISOString(),
          senderId: 'user1',
          type: 'image',
        },
        unreadCount: 1,
      },
      {
        id: '2',
        user: {
          id: 'user2',
          name: 'Document Share',
          avatar: 'https://i.pravatar.cc/150?img=21',
        },
        lastMessage: {
          id: 'msg2',
          content: 'project-proposal.pdf',
          timestamp: new Date().toISOString(),
          senderId: 'user2',
          type: 'file',
        },
      },
      {
        id: '3',
        user: {
          id: 'user3',
          name: 'Voice Message',
          avatar: 'https://i.pravatar.cc/150?img=22',
        },
        lastMessage: {
          id: 'msg3',
          content: 'Voice message (0:45)',
          timestamp: new Date().toISOString(),
          senderId: 'user3',
          type: 'voice',
        },
      },
    ],
  },
};

// Without features
export const Minimal: Story = {
  args: {
    items: sampleChats,
    showSearch: false,
    showStatus: false,
    showTimestamp: false,
    showUnreadBadge: false,
  },
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Default</h3>
        <div className="w-96">
          <ChatList items={sampleChats.slice(0, 3)} variant="default" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Bordered</h3>
        <div className="w-96">
          <ChatList items={sampleChats.slice(0, 3)} variant="bordered" />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Elevated</h3>
        <div className="w-96">
          <ChatList items={sampleChats.slice(0, 3)} variant="elevated" />
        </div>
      </div>
    </div>
  ),
};

// E-commerce support chat
export const EcommerceSupport: Story = {
  render: () => {
    const supportChats: ChatItem[] = [
      {
        id: '1',
        user: {
          id: 'customer1',
          name: 'Order #12345 - John D.',
          avatar: 'https://i.pravatar.cc/150?img=33',
          status: 'online',
        },
        lastMessage: {
          id: 'msg1',
          content: 'My order hasn\'t arrived yet. Can you help?',
          timestamp: new Date().toISOString(),
          senderId: 'customer1',
        },
        unreadCount: 3,
        isPinned: true,
      },
      {
        id: '2',
        user: {
          id: 'customer2',
          name: 'Return Request - Sarah M.',
          avatar: 'https://i.pravatar.cc/150?img=44',
          status: 'online',
        },
        lastMessage: {
          id: 'msg2',
          content: 'I\'d like to return the blue shirt I ordered.',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          senderId: 'customer2',
        },
        unreadCount: 1,
      },
      {
        id: '3',
        user: {
          id: 'vendor1',
          name: 'Vendor: TechStore Pro',
          avatar: 'https://i.pravatar.cc/150?img=55',
          status: 'away',
        },
        lastMessage: {
          id: 'msg3',
          content: 'Stock update: Wireless keyboards back in stock',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          senderId: 'vendor1',
        },
        unreadCount: 0,
      },
    ];

    const { activeItemId, setActiveItemId } = useChatList();

    return (
      <div className="w-96">
        <div className="bg-primary-600 text-white p-4 rounded-t-lg">
          <h2 className="font-semibold">Support Chat</h2>
          <p className="text-sm opacity-90">3 active conversations</p>
        </div>
        <ChatList
          items={supportChats}
          activeItemId={activeItemId}
          onItemClick={(item) => setActiveItemId(item.id)}
          showSearch={true}
          searchPlaceholder="Search conversations..."
          className="rounded-b-lg"
        />
      </div>
    );
  },
};

// Team chat
export const TeamChat: Story = {
  render: () => {
    const teamChats: ChatItem[] = [
      {
        id: '1',
        user: {
          id: 'team1',
          name: '#general',
          avatar: 'https://i.pravatar.cc/150?img=60',
        },
        lastMessage: {
          id: 'msg1',
          content: 'Team meeting at 3 PM today',
          timestamp: new Date().toISOString(),
          senderId: 'admin',
        },
        unreadCount: 5,
      },
      {
        id: '2',
        user: {
          id: 'team2',
          name: '#development',
          avatar: 'https://i.pravatar.cc/150?img=61',
        },
        lastMessage: {
          id: 'msg2',
          content: 'New PR ready for review',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          senderId: 'dev1',
        },
        unreadCount: 2,
      },
      {
        id: '3',
        user: {
          id: 'team3',
          name: '#design',
          avatar: 'https://i.pravatar.cc/150?img=62',
        },
        lastMessage: {
          id: 'msg3',
          content: 'Updated mockups in Figma',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          senderId: 'designer1',
        },
        unreadCount: 0,
        isMuted: true,
      },
    ];

    return (
      <div className="w-96">
        <ChatList
          items={teamChats}
          variant="bordered"
          showStatus={false}
        />
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    items: sampleChats.slice(0, 3),
    variant: 'bordered',
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <div className="[&_.bg-white]:bg-neutral-800 [&_.border-neutral-200]:border-neutral-700 [&_.text-neutral-900]:text-white [&_.text-neutral-700]:text-neutral-200 [&_.text-neutral-600]:text-neutral-300 [&_.text-neutral-500]:text-neutral-400 [&_.bg-neutral-50]:bg-neutral-700 [&_.bg-neutral-100]:bg-neutral-700 [&_.hover\\:bg-neutral-50:hover]:bg-neutral-700 [&_.hover\\:bg-neutral-100:hover]:bg-neutral-600 [&_.divide-neutral-100]:divide-neutral-700">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    items: sampleChats,
    variant: 'default',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full h-screen">
        <Story />
      </div>
    ),
  ],
};