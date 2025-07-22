import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { BubbleChat, useBubbleChat, type ChatMessage, type ChatUser } from './BubbleChat';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Organisms/BubbleChat',
  component: BubbleChat,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showAvatar: {
      control: 'boolean',
    },
    showTimestamp: {
      control: 'boolean',
    },
    showStatus: {
      control: 'boolean',
    },
    groupMessages: {
      control: 'boolean',
    },
    enableActions: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof BubbleChat>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample users
const currentUser: ChatUser = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const supportAgent: ChatUser = {
  id: 'user2',
  name: 'Support Agent',
  avatar: 'https://i.pravatar.cc/150?img=2',
};

const systemUser: ChatUser = {
  id: 'system',
  name: 'System',
};

// Sample messages
const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: supportAgent,
    timestamp: new Date(Date.now() - 3600000),
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    content: 'I have a question about my order #12345',
    sender: currentUser,
    timestamp: new Date(Date.now() - 3500000),
    status: 'read',
    type: 'text',
  },
  {
    id: '3',
    content: 'Let me check that for you right away.',
    sender: supportAgent,
    timestamp: new Date(Date.now() - 3400000),
    status: 'read',
    type: 'text',
  },
  {
    id: '4',
    content: 'Order #12345 has been shipped and is on its way!',
    sender: systemUser,
    timestamp: new Date(Date.now() - 3300000),
    type: 'system',
  },
  {
    id: '5',
    content: 'Great! When will it arrive?',
    sender: currentUser,
    timestamp: new Date(Date.now() - 3200000),
    status: 'delivered',
    type: 'text',
  },
  {
    id: '6',
    content: 'Based on your location, it should arrive within 2-3 business days. You\'ll receive a tracking number shortly.',
    sender: supportAgent,
    timestamp: new Date(Date.now() - 3100000),
    status: 'sent',
    type: 'text',
  },
];

// Basic example
export const Default: Story = {
  args: {
    messages: sampleMessages,
    currentUserId: currentUser.id,
  },
};

// Interactive chat
export const InteractiveChat: Story = {
  render: () => {
    const { messages, sendMessage, deleteMessage, editMessage } = useBubbleChat();
    const [localMessages, setLocalMessages] = useState<ChatMessage[]>(sampleMessages);

    const handleSendMessage = (content: string, attachments?: File[]) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        sender: currentUser,
        timestamp: new Date(),
        status: 'sending',
        type: attachments && attachments.length > 0 ? 'file' : 'text',
        attachments: attachments?.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      };

      setLocalMessages(prev => [...prev, newMessage]);

      // Simulate status updates
      setTimeout(() => {
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      }, 500);

      setTimeout(() => {
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 1000);

      // Simulate reply
      setTimeout(() => {
        const replyMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Thanks for your message! I\'ll get back to you shortly.',
          sender: supportAgent,
          timestamp: new Date(),
          type: 'text',
        };
        setLocalMessages(prev => [...prev, replyMessage]);
      }, 2000);
    };

    const handleDeleteMessage = (messageId: string) => {
      setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    const handleEditMessage = (messageId: string, newContent: string) => {
      setLocalMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, isEdited: true }
            : msg
        )
      );
    };

    const handleReaction = (messageId: string, emoji: string) => {
      setLocalMessages(prev => 
        prev.map(msg => {
          if (msg.id === messageId) {
            const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
            if (existingReaction) {
              // Toggle reaction
              if (existingReaction.users.includes(currentUser.id)) {
                existingReaction.users = existingReaction.users.filter(id => id !== currentUser.id);
                if (existingReaction.users.length === 0) {
                  msg.reactions = msg.reactions?.filter(r => r.emoji !== emoji);
                }
              } else {
                existingReaction.users.push(currentUser.id);
              }
            } else {
              // Add new reaction
              msg.reactions = [...(msg.reactions || []), { emoji, users: [currentUser.id] }];
            }
          }
          return msg;
        })
      );
    };

    return (
      <div className="h-[600px] border border-neutral-200 rounded-lg">
        <BubbleChat
          messages={localMessages}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          onEditMessage={handleEditMessage}
          onReaction={handleReaction}
        />
      </div>
    );
  },
};

// Customer support chat
export const CustomerSupport: Story = {
  render: () => {
    const supportMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Welcome to customer support! How can I assist you today?',
        sender: {
          id: 'bot',
          name: 'Support Bot',
          avatar: 'https://i.pravatar.cc/150?img=68',
        },
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
      },
      {
        id: '2',
        content: 'I need help with a refund request',
        sender: currentUser,
        timestamp: new Date(Date.now() - 500000),
        status: 'read',
        type: 'text',
      },
      {
        id: '3',
        content: 'I\'d be happy to help you with your refund. Can you please provide your order number?',
        sender: {
          id: 'agent',
          name: 'Emma Wilson',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        timestamp: new Date(Date.now() - 400000),
        type: 'text',
      },
      {
        id: '4',
        content: 'Sure, it\'s ORDER-2024-789456',
        sender: currentUser,
        timestamp: new Date(Date.now() - 300000),
        status: 'read',
        type: 'text',
      },
      {
        id: '5',
        content: 'Thank you! I\'ve found your order. I can see it was delivered 5 days ago. May I ask the reason for the refund request?',
        sender: {
          id: 'agent',
          name: 'Emma Wilson',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        timestamp: new Date(Date.now() - 200000),
        type: 'text',
      },
    ];

    const [messages, setMessages] = useState(supportMessages);

    const handleSendMessage = (content: string) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        sender: currentUser,
        timestamp: new Date(),
        status: 'sent',
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
    };

    return (
      <div className="h-[600px] flex flex-col">
        <div className="bg-primary-600 text-white p-4 rounded-t-lg">
          <h2 className="font-semibold">Customer Support</h2>
          <p className="text-sm opacity-90">We typically reply within 5 minutes</p>
        </div>
        <div className="flex-1 border-x border-b border-neutral-200 rounded-b-lg">
          <BubbleChat
            messages={messages}
            currentUserId={currentUser.id}
            onSendMessage={handleSendMessage}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    );
  },
};

// With reactions
export const WithReactions: Story = {
  args: {
    messages: [
      {
        ...sampleMessages[0],
        reactions: [
          { emoji: '👍', users: ['user1', 'user3'] },
          { emoji: '❤️', users: ['user4'] },
        ],
      },
      {
        ...sampleMessages[1],
        reactions: [
          { emoji: '🎉', users: ['user2'] },
        ],
      },
      ...sampleMessages.slice(2),
    ],
    currentUserId: currentUser.id,
    enableActions: true,
  },
};

// With attachments
export const WithAttachments: Story = {
  args: {
    messages: [
      ...sampleMessages.slice(0, 2),
      {
        id: 'file1',
        content: 'Here\'s the invoice you requested:',
        sender: supportAgent,
        timestamp: new Date(Date.now() - 2000000),
        type: 'file',
        attachments: [
          {
            url: '#',
            name: 'invoice-2024-001.pdf',
            size: 245760,
            type: 'application/pdf',
          },
        ],
      },
      {
        id: 'img1',
        content: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400',
        sender: currentUser,
        timestamp: new Date(Date.now() - 1800000),
        type: 'image',
        status: 'delivered',
      },
    ],
    currentUserId: currentUser.id,
  },
};

// With replies
export const WithReplies: Story = {
  args: {
    messages: [
      sampleMessages[0],
      {
        ...sampleMessages[1],
        replyTo: sampleMessages[0],
      },
      ...sampleMessages.slice(2),
    ],
    currentUserId: currentUser.id,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    messages: [],
    currentUserId: currentUser.id,
    loading: true,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    messages: [],
    currentUserId: currentUser.id,
  },
};

// Without features
export const Minimal: Story = {
  args: {
    messages: sampleMessages,
    currentUserId: currentUser.id,
    showAvatar: false,
    showTimestamp: false,
    showStatus: false,
    enableActions: false,
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <div className="h-[300px] border border-neutral-200 rounded-lg">
          <BubbleChat
            messages={sampleMessages.slice(0, 3)}
            currentUserId={currentUser.id}
            size="sm"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Medium (Default)</h3>
        <div className="h-[300px] border border-neutral-200 rounded-lg">
          <BubbleChat
            messages={sampleMessages.slice(0, 3)}
            currentUserId={currentUser.id}
            size="md"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <div className="h-[300px] border border-neutral-200 rounded-lg">
          <BubbleChat
            messages={sampleMessages.slice(0, 3)}
            currentUserId={currentUser.id}
            size="lg"
          />
        </div>
      </div>
    </div>
  ),
};

// Vendor communication
export const VendorCommunication: Story = {
  render: () => {
    const vendorMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Hi! I\'m interested in bulk ordering your products.',
        sender: {
          id: 'vendor1',
          name: 'TechStore Pro',
          avatar: 'https://i.pravatar.cc/150?img=60',
        },
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
      },
      {
        id: '2',
        content: 'Hello! Thank you for your interest. We offer special pricing for bulk orders. What quantity are you looking for?',
        sender: currentUser,
        timestamp: new Date(Date.now() - 7000000),
        status: 'read',
        type: 'text',
      },
      {
        id: '3',
        content: 'We\'re looking to order 500 units initially, with potential for monthly reorders.',
        sender: {
          id: 'vendor1',
          name: 'TechStore Pro',
          avatar: 'https://i.pravatar.cc/150?img=60',
        },
        timestamp: new Date(Date.now() - 6800000),
        type: 'text',
      },
      {
        id: '4',
        content: 'Excellent! For orders of 500+ units, we can offer a 25% discount. Let me prepare a quote for you.',
        sender: currentUser,
        timestamp: new Date(Date.now() - 6600000),
        status: 'delivered',
        type: 'text',
      },
    ];

    return (
      <div className="h-[600px] border border-neutral-200 rounded-lg">
        <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
          <h3 className="font-medium">Business Chat - TechStore Pro</h3>
          <p className="text-sm text-neutral-600">Wholesale inquiry</p>
        </div>
        <BubbleChat
          messages={vendorMessages}
          currentUserId={currentUser.id}
          onSendMessage={(content) => console.log('Send:', content)}
        />
      </div>
    );
  },
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    messages: sampleMessages,
    currentUserId: currentUser.id,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 h-screen">
        <div className="h-full [&_.bg-white]:bg-neutral-800 [&_.text-neutral-900]:text-white [&_.bg-neutral-100]:bg-neutral-700 [&_.border-neutral-200]:border-neutral-700 [&_.text-neutral-600]:text-neutral-300 [&_.text-neutral-500]:text-neutral-400 [&_.bg-primary-600]:bg-primary-500">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Mobile responsive
export const Mobile: Story = {
  args: {
    messages: sampleMessages,
    currentUserId: currentUser.id,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
};