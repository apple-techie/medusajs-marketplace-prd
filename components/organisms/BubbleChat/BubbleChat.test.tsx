import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BubbleChat, useBubbleChat, type ChatMessage } from './BubbleChat';
import { renderHook, act } from '@testing-library/react';

describe('BubbleChat Component', () => {
  const currentUserId = 'user1';
  
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: {
        id: 'user2',
        name: 'Support Agent',
        avatar: 'https://example.com/avatar1.jpg',
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      content: 'I have a question about my order',
      sender: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar2.jpg',
      },
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      content: 'Order update: Your package has been shipped!',
      sender: {
        id: 'system',
        name: 'System',
      },
      timestamp: new Date(Date.now() - 3000000),
      type: 'system',
    },
  ];

  it('renders messages correctly', () => {
    render(
      <BubbleChat 
        messages={mockMessages} 
        currentUserId={currentUserId}
      />
    );
    
    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    expect(screen.getByText('I have a question about my order')).toBeInTheDocument();
    expect(screen.getByText('Order update: Your package has been shipped!')).toBeInTheDocument();
  });

  it('displays sender names for other users', () => {
    render(
      <BubbleChat 
        messages={mockMessages} 
        currentUserId={currentUserId}
      />
    );
    
    expect(screen.getByText('Support Agent')).toBeInTheDocument();
  });

  it('shows avatars when enabled', () => {
    render(
      <BubbleChat 
        messages={mockMessages} 
        currentUserId={currentUserId}
        showAvatar={true}
      />
    );
    
    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBeGreaterThan(0);
  });

  it('hides avatars when disabled', () => {
    render(
      <BubbleChat 
        messages={[mockMessages[0]]} 
        currentUserId={currentUserId}
        showAvatar={false}
      />
    );
    
    const avatars = screen.queryAllByRole('img');
    expect(avatars.length).toBe(0);
  });

  it('shows timestamps when enabled', () => {
    render(
      <BubbleChat 
        messages={mockMessages} 
        currentUserId={currentUserId}
        showTimestamp={true}
      />
    );
    
    // Should show relative timestamps like "1h ago"
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it('shows message status for current user messages', () => {
    render(
      <BubbleChat 
        messages={mockMessages} 
        currentUserId={currentUserId}
        showStatus={true}
      />
    );
    
    // Check for status icon (read status uses double check)
    const statusIcons = screen.getAllByTestId(/check/i);
    expect(statusIcons.length).toBeGreaterThan(0);
  });

  it('handles send message', async () => {
    const handleSendMessage = jest.fn();
    const user = userEvent.setup();
    
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    );
    
    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Test message');
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    expect(handleSendMessage).toHaveBeenCalledWith('Test message', undefined);
  });

  it('handles enter key to send message', async () => {
    const handleSendMessage = jest.fn();
    const user = userEvent.setup();
    
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    );
    
    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Test message{Enter}');
    
    expect(handleSendMessage).toHaveBeenCalledWith('Test message', undefined);
  });

  it('does not send empty messages', async () => {
    const handleSendMessage = jest.fn();
    const user = userEvent.setup();
    
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    );
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    expect(handleSendMessage).not.toHaveBeenCalled();
  });

  it('shows empty state when no messages', () => {
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
      />
    );
    
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
    expect(screen.getByText('Start the conversation!')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
        loading={true}
      />
    );
    
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles file attachments', async () => {
    const handleSendMessage = jest.fn();
    const user = userEvent.setup();
    
    render(
      <BubbleChat 
        messages={[]}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    );
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(fileInput, file);
    
    // File should appear in the UI
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    
    // Send with attachment
    const sendButton = screen.getByRole('button', { name: /send/i });
    await user.click(sendButton);
    
    expect(handleSendMessage).toHaveBeenCalledWith('', [file]);
  });

  it('shows reply indicator', async () => {
    const handleReply = jest.fn();
    const { container } = render(
      <BubbleChat 
        messages={mockMessages}
        currentUserId={currentUserId}
        onReply={handleReply}
        onSendMessage={jest.fn()}
        enableActions={true}
      />
    );
    
    // Hover over message to show actions
    const firstMessage = screen.getByText('Hello! How can I help you today?');
    const messageContainer = firstMessage.closest('.group');
    fireEvent.mouseEnter(messageContainer!);
    
    // Click reply button
    const replyButton = screen.getByTitle('Reply');
    fireEvent.click(replyButton);
    
    expect(handleReply).toHaveBeenCalled();
    
    // Check if reply indicator shows
    await waitFor(() => {
      expect(screen.getByText('Replying to Support Agent')).toBeInTheDocument();
    });
  });

  it('handles message editing for current user', async () => {
    const handleEditMessage = jest.fn();
    const user = userEvent.setup();
    
    render(
      <BubbleChat 
        messages={mockMessages}
        currentUserId={currentUserId}
        onEditMessage={handleEditMessage}
        enableActions={true}
      />
    );
    
    // Hover over current user's message
    const userMessage = screen.getByText('I have a question about my order');
    const messageContainer = userMessage.closest('.group');
    fireEvent.mouseEnter(messageContainer!);
    
    // Click edit button
    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);
    
    // Edit input should appear
    const editInput = screen.getByDisplayValue('I have a question about my order');
    await user.clear(editInput);
    await user.type(editInput, 'Updated message');
    
    // Save edit
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);
    
    expect(handleEditMessage).toHaveBeenCalledWith('2', 'I have a question about my order');
  });

  it('handles message deletion', async () => {
    const handleDeleteMessage = jest.fn();
    
    render(
      <BubbleChat 
        messages={mockMessages}
        currentUserId={currentUserId}
        onDeleteMessage={handleDeleteMessage}
        enableActions={true}
      />
    );
    
    // Hover over current user's message
    const userMessage = screen.getByText('I have a question about my order');
    const messageContainer = userMessage.closest('.group');
    fireEvent.mouseEnter(messageContainer!);
    
    // Click delete button
    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);
    
    expect(handleDeleteMessage).toHaveBeenCalledWith('2');
  });

  it('handles reactions', async () => {
    const handleReaction = jest.fn();
    
    render(
      <BubbleChat 
        messages={mockMessages}
        currentUserId={currentUserId}
        onReaction={handleReaction}
        enableActions={true}
      />
    );
    
    // Hover over message
    const message = screen.getByText('Hello! How can I help you today?');
    const messageContainer = message.closest('.group');
    fireEvent.mouseEnter(messageContainer!);
    
    // Click react button
    const reactButton = screen.getByTitle('React');
    fireEvent.click(reactButton);
    
    expect(handleReaction).toHaveBeenCalledWith('1', '👍');
  });

  it('displays existing reactions', () => {
    const messageWithReactions = {
      ...mockMessages[0],
      reactions: [
        { emoji: '👍', users: ['user1', 'user2'] },
        { emoji: '❤️', users: ['user3'] },
      ],
    };
    
    render(
      <BubbleChat 
        messages={[messageWithReactions]}
        currentUserId={currentUserId}
      />
    );
    
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // reaction count
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // reaction count
  });

  it('displays edited indicator', () => {
    const editedMessage = {
      ...mockMessages[0],
      isEdited: true,
    };
    
    render(
      <BubbleChat 
        messages={[editedMessage]}
        currentUserId={currentUserId}
      />
    );
    
    expect(screen.getByText('(edited)')).toBeInTheDocument();
  });

  it('groups consecutive messages from same sender', () => {
    const consecutiveMessages = [
      {
        ...mockMessages[0],
        id: '1',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        ...mockMessages[0],
        id: '2',
        content: 'Second message from same sender',
        timestamp: new Date(Date.now() - 30000),
      },
    ];
    
    render(
      <BubbleChat 
        messages={consecutiveMessages}
        currentUserId={currentUserId}
        groupMessages={true}
      />
    );
    
    // Second message should not show sender name again
    const senderNames = screen.getAllByText('Support Agent');
    expect(senderNames.length).toBe(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <BubbleChat 
        messages={mockMessages}
        currentUserId={currentUserId}
        containerClassName="custom-container"
        className="custom-messages"
        inputClassName="custom-input"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-container');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <BubbleChat 
        ref={ref}
        messages={mockMessages}
        currentUserId={currentUserId}
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useBubbleChat Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useBubbleChat());
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('sends a message', () => {
    const { result } = renderHook(() => useBubbleChat());
    
    act(() => {
      result.current.sendMessage(
        'Test message',
        'user1',
        { id: 'user1', name: 'John Doe' }
      );
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Test message');
    expect(result.current.messages[0].status).toBe('sending');
  });

  it('deletes a message', () => {
    const { result } = renderHook(() => useBubbleChat());
    
    // Add a message first
    act(() => {
      result.current.setMessages([
        {
          id: '1',
          content: 'Test message',
          sender: { id: 'user1', name: 'John' },
          timestamp: new Date(),
          type: 'text',
        },
      ]);
    });
    
    act(() => {
      result.current.deleteMessage('1');
    });
    
    expect(result.current.messages).toHaveLength(0);
  });

  it('edits a message', () => {
    const { result } = renderHook(() => useBubbleChat());
    
    // Add a message first
    act(() => {
      result.current.setMessages([
        {
          id: '1',
          content: 'Original message',
          sender: { id: 'user1', name: 'John' },
          timestamp: new Date(),
          type: 'text',
        },
      ]);
    });
    
    act(() => {
      result.current.editMessage('1', 'Edited message');
    });
    
    expect(result.current.messages[0].content).toBe('Edited message');
    expect(result.current.messages[0].isEdited).toBe(true);
  });
});