import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';

// Define chat list variants
const chatListVariants = cva(
  'flex flex-col overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-white',
        bordered: 'bg-white border border-neutral-200 rounded-lg',
        elevated: 'bg-white shadow-lg rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Define chat item variants
const chatItemVariants = cva(
  'flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200',
  {
    variants: {
      state: {
        default: 'hover:bg-neutral-50',
        active: 'bg-primary-50 hover:bg-primary-100',
        unread: 'bg-neutral-50 hover:bg-neutral-100',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// Types
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date | string;
  isRead?: boolean;
  senderId: string;
  type?: 'text' | 'image' | 'file' | 'voice';
}

export interface ChatItem {
  id: string;
  user: ChatUser;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isTyping?: boolean;
  draftMessage?: string;
}

export interface ChatListProps extends VariantProps<typeof chatListVariants> {
  items: ChatItem[];
  activeItemId?: string;
  onItemClick?: (item: ChatItem) => void;
  onItemDelete?: (item: ChatItem) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  showStatus?: boolean;
  showTimestamp?: boolean;
  showUnreadBadge?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  itemClassName?: string;
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    // Today - show time
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    // This week - show day name
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

// Helper function to truncate message
const truncateMessage = (message: string, maxLength: number = 50): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength).trim() + '...';
};

// Status indicator component
const StatusIndicator: React.FC<{ status?: ChatUser['status'] }> = ({ status }) => {
  if (!status || status === 'offline') return null;

  const statusColors = {
    online: 'bg-success-500',
    away: 'bg-warning-500',
    busy: 'bg-danger-500',
  };

  return (
    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white">
      <div className={cn('h-full w-full rounded-full', statusColors[status] || statusColors.online)} />
    </div>
  );
};

// Search input component
const SearchInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder = 'Search conversations...', value = '', onChange }) => {
  return (
    <div className="relative px-4 py-3 border-b border-neutral-200">
      <Icon 
        icon="search" 
        size="sm" 
        className="absolute left-7 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-neutral-50 rounded-lg text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
      />
    </div>
  );
};

// Chat item component
const ChatItemComponent: React.FC<{
  item: ChatItem;
  isActive?: boolean;
  showStatus?: boolean;
  showTimestamp?: boolean;
  showUnreadBadge?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}> = ({ 
  item, 
  isActive, 
  showStatus = true,
  showTimestamp = true,
  showUnreadBadge = true,
  onClick, 
  onDelete,
  className 
}) => {
  const hasUnread = item.unreadCount && item.unreadCount > 0;
  const state = isActive ? 'active' : (hasUnread ? 'unread' : 'default');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={cn(
        chatItemVariants({ state }),
        'group relative',
        className
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={item.user.avatar}
          alt={item.user.name}
          size="md"
          fallback={item.user.name.charAt(0)}
        />
        {showStatus && <StatusIndicator status={item.user.status} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className={cn(
            'text-sm font-medium truncate',
            hasUnread ? 'text-neutral-900' : 'text-neutral-700'
          )}>
            {item.user.name}
          </h3>
          {showTimestamp && item.lastMessage && (
            <span className={cn(
              'text-xs flex-shrink-0 ml-2',
              hasUnread ? 'text-primary-600 font-medium' : 'text-neutral-500'
            )}>
              {formatTimestamp(item.lastMessage.timestamp)}
            </span>
          )}
        </div>

        {/* Message preview or typing indicator */}
        <div className="flex items-center justify-between">
          <p className={cn(
            'text-sm truncate flex-1',
            hasUnread ? 'text-neutral-700' : 'text-neutral-600'
          )}>
            {item.isTyping ? (
              <span className="italic text-primary-600">Typing...</span>
            ) : item.draftMessage ? (
              <span className="text-danger-600">Draft: {truncateMessage(item.draftMessage)}</span>
            ) : item.lastMessage ? (
              <>
                {item.lastMessage.type === 'image' && '🖼️ '}
                {item.lastMessage.type === 'file' && '📎 '}
                {item.lastMessage.type === 'voice' && '🎤 '}
                {truncateMessage(item.lastMessage.content)}
              </>
            ) : (
              <span className="italic text-neutral-500">No messages yet</span>
            )}
          </p>
          
          {/* Badges and indicators */}
          <div className="flex items-center gap-2 ml-2">
            {item.isPinned && (
              <Icon icon="pin" size="xs" className="text-neutral-400" />
            )}
            {item.isMuted && (
              <Icon icon="volumeX" size="xs" className="text-neutral-400" />
            )}
            {showUnreadBadge && hasUnread && (
              <Badge variant="primary" size="xs" className="min-w-[20px]">
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Delete button (shown on hover) */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-neutral-100 rounded"
          aria-label="Delete conversation"
        >
          <Icon icon="trash" size="xs" className="text-neutral-500" />
        </button>
      )}
    </div>
  );
};

// Main ChatList component
export const ChatList = React.forwardRef<HTMLDivElement, ChatListProps>(
  ({
    items,
    activeItemId,
    onItemClick,
    onItemDelete,
    showSearch = true,
    searchPlaceholder,
    onSearchChange,
    showStatus = true,
    showTimestamp = true,
    showUnreadBadge = true,
    emptyMessage = 'No conversations yet',
    loading = false,
    variant,
    className,
    itemClassName,
    ...props
  }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    // Filter items based on search query
    useEffect(() => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const filtered = items.filter(item => 
          item.user.name.toLowerCase().includes(query) ||
          item.lastMessage?.content.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
      } else {
        setFilteredItems(items);
      }
    }, [searchQuery, items]);

    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      onSearchChange?.(value);
    };

    // Sort items: pinned first, then by last message timestamp
    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (!a.lastMessage || !b.lastMessage) return 0;
      
      const dateA = new Date(a.lastMessage.timestamp);
      const dateB = new Date(b.lastMessage.timestamp);
      return dateB.getTime() - dateA.getTime();
    });

    return (
      <div
        ref={ref}
        className={cn(chatListVariants({ variant }), className)}
        {...props}
      >
        {/* Search */}
        {showSearch && (
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        )}

        {/* Chat items */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading skeleton
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-neutral-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedItems.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {sortedItems.map(item => (
                <ChatItemComponent
                  key={item.id}
                  item={item}
                  isActive={item.id === activeItemId}
                  showStatus={showStatus}
                  showTimestamp={showTimestamp}
                  showUnreadBadge={showUnreadBadge}
                  onClick={() => onItemClick?.(item)}
                  onDelete={onItemDelete ? () => onItemDelete(item) : undefined}
                  className={itemClassName}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Icon icon="messageSquare" size="lg" className="text-neutral-300 mb-3" />
              <p className="text-sm text-neutral-500 text-center">{emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatList.displayName = 'ChatList';

// Hook for managing chat list state
export const useChatList = () => {
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const markAsRead = (itemId: string) => {
    // Implementation would update the unread count
    console.log('Mark as read:', itemId);
  };

  const deleteItem = (itemId: string) => {
    // Implementation would remove the item
    console.log('Delete item:', itemId);
  };

  return {
    activeItemId,
    searchQuery,
    setActiveItemId,
    setSearchQuery,
    markAsRead,
    deleteItem,
  };
};

export { chatListVariants, chatItemVariants };