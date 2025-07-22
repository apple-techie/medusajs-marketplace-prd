import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatList, useChatList, type ChatItem } from './ChatList';
import { renderHook, act } from '@testing-library/react';

describe('ChatList Component', () => {
  const mockItems: ChatItem[] = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://example.com/avatar1.jpg',
        status: 'online',
      },
      lastMessage: {
        id: 'msg1',
        content: 'Hey, how are you doing?',
        timestamp: new Date().toISOString(),
        senderId: 'user1',
      },
      unreadCount: 2,
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Jane Smith',
        avatar: 'https://example.com/avatar2.jpg',
        status: 'away',
      },
      lastMessage: {
        id: 'msg2',
        content: 'Thanks for the help!',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        senderId: 'user2',
      },
      unreadCount: 0,
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Bob Johnson',
        status: 'offline',
      },
      isPinned: true,
    },
  ];

  it('renders chat items', () => {
    render(<ChatList items={mockItems} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('displays message previews', () => {
    render(<ChatList items={mockItems} />);
    
    expect(screen.getByText('Hey, how are you doing?')).toBeInTheDocument();
    expect(screen.getByText('Thanks for the help!')).toBeInTheDocument();
    expect(screen.getByText('No messages yet')).toBeInTheDocument();
  });

  it('shows unread badges', () => {
    render(<ChatList items={mockItems} />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays timestamps correctly', () => {
    render(<ChatList items={mockItems} />);
    
    // Today's message should show time
    const timeRegex = /\d{1,2}:\d{2}\s(AM|PM)/;
    const timeElements = screen.getAllByText(timeRegex);
    expect(timeElements.length).toBeGreaterThan(0);
    
    // Yesterday's message
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
  });

  it('shows status indicators', () => {
    const { container } = render(<ChatList items={mockItems} showStatus={true} />);
    
    // Online status
    const onlineIndicator = container.querySelector('.bg-success-500');
    expect(onlineIndicator).toBeInTheDocument();
    
    // Away status
    const awayIndicator = container.querySelector('.bg-warning-500');
    expect(awayIndicator).toBeInTheDocument();
  });

  it('handles item click', () => {
    const handleItemClick = jest.fn();
    render(<ChatList items={mockItems} onItemClick={handleItemClick} />);
    
    fireEvent.click(screen.getByText('John Doe'));
    expect(handleItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('highlights active item', () => {
    render(<ChatList items={mockItems} activeItemId="1" />);
    
    const activeItem = screen.getByText('John Doe').closest('div[class*="bg-primary"]');
    expect(activeItem).toBeInTheDocument();
  });

  it('shows search input when enabled', () => {
    render(<ChatList items={mockItems} showSearch={true} />);
    
    expect(screen.getByPlaceholderText('Search conversations...')).toBeInTheDocument();
  });

  it('filters items based on search query', async () => {
    const user = userEvent.setup();
    render(<ChatList items={mockItems} showSearch={true} />);
    
    const searchInput = screen.getByPlaceholderText('Search conversations...');
    await user.type(searchInput, 'John');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    });
  });

  it('searches in message content', async () => {
    const user = userEvent.setup();
    render(<ChatList items={mockItems} showSearch={true} />);
    
    const searchInput = screen.getByPlaceholderText('Search conversations...');
    await user.type(searchInput, 'help');
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('calls onSearchChange when searching', async () => {
    const handleSearchChange = jest.fn();
    const user = userEvent.setup();
    
    render(
      <ChatList 
        items={mockItems} 
        showSearch={true}
        onSearchChange={handleSearchChange}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search conversations...');
    await user.type(searchInput, 'test');
    
    expect(handleSearchChange).toHaveBeenCalledWith('test');
  });

  it('sorts pinned items first', () => {
    render(<ChatList items={mockItems} />);
    
    const allNames = screen.getAllByText(/John Doe|Jane Smith|Bob Johnson/);
    expect(allNames[0]).toHaveTextContent('Bob Johnson'); // Pinned item
  });

  it('shows typing indicator', () => {
    const itemsWithTyping = [...mockItems];
    itemsWithTyping[0].isTyping = true;
    
    render(<ChatList items={itemsWithTyping} />);
    
    expect(screen.getByText('Typing...')).toBeInTheDocument();
  });

  it('shows draft message', () => {
    const itemsWithDraft = [...mockItems];
    itemsWithDraft[0].draftMessage = 'This is a draft message';
    
    render(<ChatList items={itemsWithDraft} />);
    
    expect(screen.getByText(/Draft: This is a draft message/)).toBeInTheDocument();
  });

  it('shows different message types', () => {
    const itemsWithTypes = [
      {
        ...mockItems[0],
        lastMessage: {
          ...mockItems[0].lastMessage!,
          type: 'image' as const,
          content: 'Photo',
        },
      },
    ];
    
    render(<ChatList items={itemsWithTypes} />);
    
    expect(screen.getByText('🖼️ Photo')).toBeInTheDocument();
  });

  it('shows pinned icon', () => {
    render(<ChatList items={mockItems} />);
    
    // Check for pin icon near Bob Johnson (who is pinned)
    const bobItem = screen.getByText('Bob Johnson').closest('div');
    expect(bobItem?.querySelector('[class*="pin"]')).toBeTruthy();
  });

  it('shows muted icon', () => {
    const itemsWithMuted = [...mockItems];
    itemsWithMuted[0].isMuted = true;
    
    render(<ChatList items={itemsWithMuted} />);
    
    // Check for volume off icon
    expect(screen.getByLabelText(/mute|volume/i)).toBeTruthy();
  });

  it('handles delete action', () => {
    const handleDelete = jest.fn();
    const { container } = render(
      <ChatList items={mockItems} onItemDelete={handleDelete} />
    );
    
    // Hover over first item to show delete button
    const firstItem = screen.getByText('John Doe').closest('div.group');
    fireEvent.mouseEnter(firstItem!);
    
    const deleteButton = screen.getByLabelText('Delete conversation');
    fireEvent.click(deleteButton);
    
    expect(handleDelete).toHaveBeenCalledWith(mockItems[0]);
  });

  it('shows empty state', () => {
    render(<ChatList items={[]} />);
    
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<ChatList items={[]} emptyMessage="Start a conversation!" />);
    
    expect(screen.getByText('Start a conversation!')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ChatList items={[]} loading={true} />);
    
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('hides elements based on props', () => {
    render(
      <ChatList 
        items={mockItems}
        showSearch={false}
        showStatus={false}
        showTimestamp={false}
        showUnreadBadge={false}
      />
    );
    
    // Search should be hidden
    expect(screen.queryByPlaceholderText('Search conversations...')).not.toBeInTheDocument();
    
    // Unread badge should be hidden
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    
    // Timestamps should be hidden
    const timeRegex = /\d{1,2}:\d{2}\s(AM|PM)/;
    expect(screen.queryByText(timeRegex)).not.toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container: borderedContainer } = render(
      <ChatList items={mockItems} variant="bordered" />
    );
    expect(borderedContainer.firstChild).toHaveClass('border', 'border-neutral-200');

    const { container: elevatedContainer } = render(
      <ChatList items={mockItems} variant="elevated" />
    );
    expect(elevatedContainer.firstChild).toHaveClass('shadow-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChatList items={mockItems} className="custom-list" />
    );
    
    expect(container.firstChild).toHaveClass('custom-list');
  });

  it('applies custom item className', () => {
    render(
      <ChatList items={mockItems} itemClassName="custom-item" />
    );
    
    const items = screen.getAllByText(/John Doe|Jane Smith|Bob Johnson/);
    items.forEach(item => {
      expect(item.closest('div.custom-item')).toBeInTheDocument();
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ChatList items={mockItems} ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useChatList Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useChatList());
    
    expect(result.current.activeItemId).toBe('');
    expect(result.current.searchQuery).toBe('');
  });

  it('updates active item', () => {
    const { result } = renderHook(() => useChatList());
    
    act(() => {
      result.current.setActiveItemId('chat-1');
    });
    
    expect(result.current.activeItemId).toBe('chat-1');
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useChatList());
    
    act(() => {
      result.current.setSearchQuery('test query');
    });
    
    expect(result.current.searchQuery).toBe('test query');
  });

  it('provides markAsRead function', () => {
    const { result } = renderHook(() => useChatList());
    
    // Should not throw
    expect(() => {
      result.current.markAsRead('chat-1');
    }).not.toThrow();
  });

  it('provides deleteItem function', () => {
    const { result } = renderHook(() => useChatList());
    
    // Should not throw
    expect(() => {
      result.current.deleteItem('chat-1');
    }).not.toThrow();
  });
});