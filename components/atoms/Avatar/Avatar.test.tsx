import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar Component', () => {
  it('renders with image', () => {
    render(<Avatar src="/user.jpg" alt="John Doe" />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/user.jpg');
  });

  it('renders initials when no image', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('generates initials from alt text', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('generates single initial from single word', () => {
    render(<Avatar alt="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('shows fallback on image error', async () => {
    const { container } = render(<Avatar src="/invalid.jpg" alt="User" />);
    const img = container.querySelector('img');
    
    fireEvent.error(img!);
    
    await waitFor(() => {
      expect(screen.getByText('U')).toBeInTheDocument();
    });
  });

  it('renders custom fallback', () => {
    render(<Avatar fallback={<span>FB</span>} />);
    expect(screen.getByText('FB')).toBeInTheDocument();
  });

  it('renders icon avatar', () => {
    const Icon = () => <svg data-testid="test-icon" />;
    render(<Avatar icon={<Icon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container: xsContainer } = render(<Avatar size="xs" initials="A" />);
    expect(xsContainer.firstChild).toHaveClass('h-6', 'w-6');

    const { container: lgContainer } = render(<Avatar size="lg" initials="A" />);
    expect(lgContainer.firstChild).toHaveClass('h-12', 'w-12');
  });

  it('applies color variants', () => {
    const { container: primaryContainer } = render(<Avatar variant="primary" initials="A" />);
    expect(primaryContainer.firstChild).toHaveClass('bg-primary-100', 'text-primary-700');

    const { container: dangerContainer } = render(<Avatar variant="danger" initials="A" />);
    expect(dangerContainer.firstChild).toHaveClass('bg-danger-100', 'text-danger-700');
  });

  it('shows status indicator', () => {
    render(<Avatar initials="A" showStatus status="online" />);
    const status = screen.getByLabelText('Status: online');
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass('bg-success-500');
  });

  it('hides status indicator when showStatus is false', () => {
    render(<Avatar initials="A" status="online" />);
    expect(screen.queryByLabelText('Status: online')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = render(<Avatar loading />);
    const loadingElement = container.querySelector('.animate-pulse');
    expect(loadingElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar className="custom-class" initials="A" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Avatar ref={ref} initials="A" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles image loading state', async () => {
    const { container } = render(<Avatar src="/user.jpg" alt="User" />);
    const img = container.querySelector('img');
    
    // Initially shows loading
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    
    // After load, loading disappears
    fireEvent.load(img!);
    await waitFor(() => {
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  it('shows question mark for empty alt', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});

describe('AvatarGroup Component', () => {
  const avatars = [
    <Avatar key="1" initials="A" />,
    <Avatar key="2" initials="B" />,
    <Avatar key="3" initials="C" />,
    <Avatar key="4" initials="D" />,
    <Avatar key="5" initials="E" />,
  ];

  it('renders all children when within max', () => {
    render(<AvatarGroup max={5}>{avatars}</AvatarGroup>);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('shows remaining count when exceeding max', () => {
    render(<AvatarGroup max={3}>{avatars}</AvatarGroup>);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
    expect(screen.queryByText('E')).not.toBeInTheDocument();
  });

  it('applies size to all avatars', () => {
    render(
      <AvatarGroup size="lg">
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>
    );
    
    const avatars = screen.getAllByText(/[AB]/);
    avatars.forEach(avatar => {
      expect(avatar.parentElement).toHaveClass('h-12', 'w-12');
    });
  });

  it('applies spacing variants', () => {
    const { container: tightContainer } = render(
      <AvatarGroup spacing="tight">{avatars}</AvatarGroup>
    );
    expect(tightContainer.firstChild).toHaveClass('-space-x-2');

    const { container: looseContainer } = render(
      <AvatarGroup spacing="loose">{avatars}</AvatarGroup>
    );
    expect(looseContainer.firstChild).toHaveClass('-space-x-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AvatarGroup className="custom-group">{avatars}</AvatarGroup>
    );
    expect(container.firstChild).toHaveClass('custom-group');
  });

  it('handles non-Avatar children', () => {
    render(
      <AvatarGroup>
        <Avatar initials="A" />
        <div>Custom</div>
      </AvatarGroup>
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('applies correct z-index for stacking', () => {
    const { container } = render(
      <AvatarGroup max={3}>{avatars}</AvatarGroup>
    );
    
    const wrappers = container.querySelectorAll('.relative.inline-block');
    expect(wrappers[0]).toHaveStyle({ zIndex: '3' });
    expect(wrappers[1]).toHaveStyle({ zIndex: '2' });
    expect(wrappers[2]).toHaveStyle({ zIndex: '1' });
  });
});