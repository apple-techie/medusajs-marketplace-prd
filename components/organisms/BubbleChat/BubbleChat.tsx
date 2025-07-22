import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

// Define bubble variants
const bubbleVariants = cva(
  'relative max-w-[70%] rounded-2xl px-4 py-3 text-sm',
  {
    variants: {
      sender: {
        user: 'bg-primary-600 text-white ml-auto',
        other: 'bg-neutral-100 text-neutral-900',
        system: 'bg-warning-50 text-warning-900 mx-auto max-w-[90%] text-center',
      },
      size: {
        sm: 'text-xs px-3 py-2',
        md: 'text-sm px-4 py-3',
        lg: 'text-base px-5 py-4',
      },
    },
    defaultVariants: {
      sender: 'other',
      size: 'md',
    },
  }
);

// Types
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatMessage {
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

export interface BubbleChatProps extends VariantProps<typeof bubbleVariants> {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage?: (content: string, attachments?: File[]) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (message: ChatMessage) => void;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  groupMessages?: boolean;
  enableActions?: boolean;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
}

// Helper function to format timestamp
const formatTimestamp = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
  return Math.round(bytes / 1048576) + ' MB';
};

// Message status icon
const MessageStatus: React.FC<{ status?: ChatMessage['status'] }> = ({ status }) => {
  if (!status || status === 'sending') return null;

  const icons = {
    sent: 'check',
    delivered: 'checkCheck',
    read: 'checkCheck',
    failed: 'alertCircle',
  };

  const colors = {
    sent: 'text-neutral-400',
    delivered: 'text-neutral-400',
    read: 'text-primary-400',
    failed: 'text-danger-400',
  };

  return (
    <Icon 
      icon={icons[status] || 'check'} 
      size="xs" 
      className={cn('ml-1', colors[status])}
    />
  );
};

// Single message bubble component
const MessageBubble: React.FC<{
  message: ChatMessage;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showStatus?: boolean;
  enableActions?: boolean;
  isGrouped?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onReaction?: (emoji: string) => void;
  onReply?: () => void;
  size?: VariantProps<typeof bubbleVariants>['size'];
}> = ({ 
  message, 
  isCurrentUser, 
  showAvatar = true,
  showTimestamp = true,
  showStatus = true,
  enableActions = true,
  isGrouped = false,
  onDelete,
  onEdit,
  onReaction,
  onReply,
  size,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    onEdit?.();
    setIsEditing(false);
  };

  const bubbleSender = message.type === 'system' ? 'system' : (isCurrentUser ? 'user' : 'other');

  return (
    <div
      className={cn(
        'group relative flex gap-2 mb-1',
        isCurrentUser && 'flex-row-reverse',
        isGrouped && 'mt-0.5'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isCurrentUser && !isGrouped && message.type !== 'system' && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          size="sm"
          fallback={message.sender.name.charAt(0)}
          className="flex-shrink-0 mt-auto"
        />
      )}
      {showAvatar && !isCurrentUser && isGrouped && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message content */}
      <div className={cn('flex flex-col', isCurrentUser && 'items-end')}>
        {/* Sender name (for other users) */}
        {!isCurrentUser && !isGrouped && message.type !== 'system' && (
          <span className="text-xs text-neutral-600 mb-1 ml-1">
            {message.sender.name}
          </span>
        )}

        {/* Reply to */}
        {message.replyTo && (
          <div className={cn(
            'text-xs px-3 py-1 mb-1 rounded-lg opacity-70',
            isCurrentUser ? 'bg-primary-700 text-primary-100' : 'bg-neutral-200'
          )}>
            <div className="font-medium">{message.replyTo.sender.name}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
        )}

        {/* Bubble */}
        <div className={cn('relative', isEditing && 'w-full')}>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <Button size="sm" onClick={handleEdit}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <div className={cn(bubbleVariants({ sender: bubbleSender, size }))}>
              {/* Message content */}
              {message.type === 'text' ? (
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                  {message.isEdited && (
                    <span className="text-xs opacity-70 ml-1">(edited)</span>
                  )}
                </p>
              ) : message.type === 'image' ? (
                <img 
                  src={message.content} 
                  alt="Shared image" 
                  className="rounded-lg max-w-full"
                />
              ) : message.type === 'file' && message.attachments ? (
                <div className="space-y-2">
                  {message.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                      <Icon icon="file" size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        {file.size && (
                          <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
                        )}
                      </div>
                      <Icon icon="download" size="sm" className="cursor-pointer" />
                    </div>
                  ))}
                </div>
              ) : (
                <p>{message.content}</p>
              )}

              {/* Timestamp and status */}
              {(showTimestamp || showStatus) && (
                <div className={cn(
                  'flex items-center gap-1 mt-1',
                  isCurrentUser ? 'justify-end' : 'justify-start'
                )}>
                  {showTimestamp && (
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  )}
                  {showStatus && isCurrentUser && (
                    <MessageStatus status={message.status} />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn(
              'absolute -bottom-3 flex gap-1',
              isCurrentUser ? 'right-0' : 'left-0'
            )}>
              {message.reactions.map((reaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2 py-1 bg-white border border-neutral-200 rounded-full text-xs shadow-sm cursor-pointer hover:bg-neutral-50"
                  onClick={() => onReaction?.(reaction.emoji)}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-neutral-600">{reaction.users.length}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions menu */}
        {enableActions && showActions && !isEditing && (
          <div className={cn(
            'absolute top-0 flex items-center gap-1 bg-white shadow-md rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'
          )}>
            <button
              onClick={() => onReaction?.('👍')}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
              title="React"
            >
              <Icon icon="smile" size="xs" />
            </button>
            <button
              onClick={onReply}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
              title="Reply"
            >
              <Icon icon="cornerUpLeft" size="xs" />
            </button>
            {isCurrentUser && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title="Edit"
                >
                  <Icon icon="edit" size="xs" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors text-danger-600"
                  title="Delete"
                >
                  <Icon icon="trash" size="xs" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Chat input component
const ChatInput: React.FC<{
  onSendMessage: (content: string, attachments?: File[]) => void;
  placeholder?: string;
  replyingTo?: ChatMessage;
  onCancelReply?: () => void;
  className?: string;
}> = ({ onSendMessage, placeholder = 'Type a message...', replyingTo, onCancelReply, className }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  return (
    <div className={cn('border-t border-neutral-200 p-4', className)}>
      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center justify-between mb-2 p-2 bg-neutral-100 rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-600">Replying to {replyingTo.sender.name}</p>
            <p className="text-sm truncate">{replyingTo.content}</p>
          </div>
          <button onClick={onCancelReply} className="p-1">
            <Icon icon="x" size="xs" />
          </button>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-lg text-sm">
              <Icon icon="file" size="xs" />
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                className="p-0.5 hover:bg-neutral-200 rounded"
              >
                <Icon icon="x" size="xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Icon icon="paperclip" size="sm" />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[40px] max-h-[120px]"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className={cn(
            'p-2 rounded-lg transition-colors',
            message.trim() || attachments.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          )}
        >
          <Icon icon="send" size="sm" />
        </button>
      </div>
    </div>
  );
};

// Main BubbleChat component
export const BubbleChat = React.forwardRef<HTMLDivElement, BubbleChatProps>(
  ({
    messages,
    currentUserId,
    onSendMessage,
    onDeleteMessage,
    onEditMessage,
    onReaction,
    onReply,
    showAvatar = true,
    showTimestamp = true,
    showStatus = true,
    groupMessages = true,
    enableActions = true,
    placeholder,
    loading = false,
    size,
    className,
    containerClassName,
    inputClassName,
    ...props
  }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    // Group consecutive messages from same sender
    const groupedMessages = groupMessages
      ? messages.reduce<{ message: ChatMessage; isGrouped: boolean }[]>((acc, message, idx) => {
          const prevMessage = messages[idx - 1];
          const isGrouped = prevMessage &&
            prevMessage.sender.id === message.sender.id &&
            message.type !== 'system' &&
            new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 60000; // Within 1 minute

          acc.push({ message, isGrouped: !!isGrouped });
          return acc;
        }, [])
      : messages.map(message => ({ message, isGrouped: false }));

    const handleSendMessage = (content: string, attachments?: File[]) => {
      onSendMessage?.(content, attachments);
      setReplyingTo(undefined);
    };

    const handleReply = (message: ChatMessage) => {
      setReplyingTo(message);
      onReply?.(message);
    };

    return (
      <div ref={ref} className={cn('flex flex-col h-full', containerClassName)} {...props}>
        {/* Messages */}
        <div className={cn('flex-1 overflow-y-auto p-4', className)}>
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={cn('flex gap-2', i % 2 === 0 && 'flex-row-reverse')}>
                  <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse" />
                  <div className={cn(
                    'w-2/3 h-16 bg-neutral-200 rounded-2xl animate-pulse',
                    i % 2 === 0 && 'bg-primary-200'
                  )} />
                </div>
              ))}
            </div>
          ) : groupedMessages.length > 0 ? (
            <div className="space-y-1">
              {groupedMessages.map(({ message, isGrouped }, idx) => {
                const isCurrentUser = message.sender.id === currentUserId;
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                    showAvatar={showAvatar}
                    showTimestamp={showTimestamp}
                    showStatus={showStatus}
                    enableActions={enableActions}
                    isGrouped={isGrouped}
                    onDelete={() => onDeleteMessage?.(message.id)}
                    onEdit={() => onEditMessage?.(message.id, message.content)}
                    onReaction={(emoji) => onReaction?.(message.id, emoji)}
                    onReply={() => handleReply(message)}
                    size={size}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon icon="messageSquare" size="lg" className="text-neutral-300 mb-3" />
              <p className="text-neutral-500">No messages yet</p>
              <p className="text-sm text-neutral-400 mt-1">Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Input */}
        {onSendMessage && (
          <ChatInput
            onSendMessage={handleSendMessage}
            placeholder={placeholder}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(undefined)}
            className={inputClassName}
          />
        )}
      </div>
    );
  }
);

BubbleChat.displayName = 'BubbleChat';

// Hook for managing chat state
export const useBubbleChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = (content: string, senderId: string, sender: ChatUser) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 500);
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    );
  };

  return {
    messages,
    loading,
    setMessages,
    setLoading,
    sendMessage,
    deleteMessage,
    editMessage,
  };
};

export { bubbleVariants };