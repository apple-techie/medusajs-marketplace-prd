import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { 
  DiscountBadge, 
  SaleBadge, 
  LimitedTimeBadge, 
  NewBadge, 
  HotBadge 
} from './DiscountBadge';

// Mock the Icon component
jest.mock('../Icon/Icon', () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
}));

describe('DiscountBadge Component', () => {
  it('renders percentage discount', () => {
    render(<DiscountBadge value={25} type="percentage" />);
    
    expect(screen.getByText('-25%')).toBeInTheDocument();
  });

  it('renders fixed discount', () => {
    render(<DiscountBadge value={10} type="fixed" currency="$" />);
    
    expect(screen.getByText('-$10')).toBeInTheDocument();
  });

  it('renders text discount', () => {
    render(<DiscountBadge value="Special Offer" type="text" />);
    
    expect(screen.getByText('Special Offer')).toBeInTheDocument();
  });

  it('renders with prefix and suffix', () => {
    render(
      <DiscountBadge 
        value={30} 
        type="percentage" 
        prefix="Save" 
        suffix="today" 
      />
    );
    
    expect(screen.getByText('Save -30% today')).toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(
      <DiscountBadge value={0} type="text">
        Custom Content
      </DiscountBadge>
    );
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <DiscountBadge 
        value={50} 
        type="percentage" 
        showIcon 
        icon="tag" 
      />
    );
    
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(
      <DiscountBadge value={25} variant="filled" color="red" />
    );
    let badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('bg-red-600');

    rerender(<DiscountBadge value={25} variant="outlined" color="green" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('border-green-600', 'text-green-600');

    rerender(<DiscountBadge value={25} variant="gradient" color="orange" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('bg-gradient-to-r', 'from-orange-600', 'to-orange-700');

    rerender(<DiscountBadge value={25} variant="subtle" color="purple" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('bg-purple-100', 'text-purple-700');
  });

  it('applies size variants', () => {
    const { rerender } = render(<DiscountBadge value={25} size="xs" />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('text-xs');

    rerender(<DiscountBadge value={25} size="lg" />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('text-lg');
  });

  it('applies shape variants', () => {
    const { rerender } = render(<DiscountBadge value={25} shape="rounded" />);
    let badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('rounded');

    rerender(<DiscountBadge value={25} shape="square" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('rounded-none');

    rerender(<DiscountBadge value={25} shape="pill" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('rounded-full');

    rerender(<DiscountBadge value={25} shape="flag" />);
    badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('rounded-r-full');
  });

  it('applies position variants', () => {
    const { rerender } = render(<DiscountBadge value={25} position="top-left" />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('absolute', 'top-2', 'left-2');

    rerender(<DiscountBadge value={25} position="bottom-right" />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('absolute', 'bottom-2', 'right-2');
  });

  it('applies animation classes', () => {
    const { rerender } = render(<DiscountBadge value={25} animate />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('animate-bounce-slow');

    rerender(<DiscountBadge value={25} pulse />);
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('animate-pulse');

    rerender(<DiscountBadge value={25} animate pulse />);
    const badge = screen.getByLabelText(/Discount: -25%/);
    expect(badge).toHaveClass('animate-bounce-slow', 'animate-pulse');
  });

  it('applies custom className', () => {
    render(<DiscountBadge value={25} className="custom-class" />);
    
    expect(screen.getByLabelText(/Discount: -25%/)).toHaveClass('custom-class');
  });

  it('uses custom aria-label', () => {
    render(<DiscountBadge value={25} aria-label="Special discount" />);
    
    expect(screen.getByLabelText('Special discount')).toBeInTheDocument();
  });
});

describe('SaleBadge Component', () => {
  it('calculates percentage discount', () => {
    render(<SaleBadge originalPrice={100} salePrice={75} />);
    
    expect(screen.getByText('-25%')).toBeInTheDocument();
  });

  it('shows amount saved when showAmount is true', () => {
    render(
      <SaleBadge 
        originalPrice={100} 
        salePrice={60} 
        showAmount 
        currency="€" 
      />
    );
    
    expect(screen.getByText('Save -€40')).toBeInTheDocument();
  });

  it('passes through other props', () => {
    render(
      <SaleBadge 
        originalPrice={100} 
        salePrice={70} 
        color="green"
        size="lg"
      />
    );
    
    const badge = screen.getByLabelText(/Discount: -30%/);
    expect(badge).toHaveClass('bg-green-600', 'text-lg');
  });
});

describe('LimitedTimeBadge Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders default text without endTime', () => {
    render(<LimitedTimeBadge />);
    
    expect(screen.getByText('Limited Time')).toBeInTheDocument();
  });

  it('shows time remaining with endTime', async () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    
    render(<LimitedTimeBadge endTime={endTime} />);
    
    await waitFor(() => {
      expect(screen.getByText('2h 0m')).toBeInTheDocument();
    });
  });

  it('shows days when more than 24 hours remain', async () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 26 * 60 * 60 * 1000); // 26 hours from now
    
    render(<LimitedTimeBadge endTime={endTime} />);
    
    await waitFor(() => {
      expect(screen.getByText('1d 2h')).toBeInTheDocument();
    });
  });

  it('shows minutes when less than 1 hour remains', async () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 45 * 60 * 1000); // 45 minutes from now
    
    render(<LimitedTimeBadge endTime={endTime} />);
    
    await waitFor(() => {
      expect(screen.getByText('45m')).toBeInTheDocument();
    });
  });

  it('shows expired when time has passed', async () => {
    const now = new Date();
    const endTime = new Date(now.getTime() - 1000); // 1 second ago
    
    render(<LimitedTimeBadge endTime={endTime} />);
    
    await waitFor(() => {
      expect(screen.getByText('Expired')).toBeInTheDocument();
    });
  });

  it('updates time every minute', async () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 90 * 60 * 1000); // 90 minutes from now
    
    render(<LimitedTimeBadge endTime={endTime} />);
    
    expect(screen.getByText('1h 30m')).toBeInTheDocument();
    
    // Advance time by 1 minute
    jest.advanceTimersByTime(60000);
    
    await waitFor(() => {
      expect(screen.getByText('1h 29m')).toBeInTheDocument();
    });
  });

  it('shows icon by default', () => {
    render(<LimitedTimeBadge />);
    
    expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
  });

  it('uses custom text and props', () => {
    render(
      <LimitedTimeBadge 
        text="Flash Sale" 
        icon="bolt"
        color="red"
        animate={false}
      />
    );
    
    expect(screen.getByText('Flash Sale')).toBeInTheDocument();
    expect(screen.getByTestId('icon-bolt')).toBeInTheDocument();
    expect(screen.getByLabelText(/Flash Sale/)).toHaveClass('bg-red-600');
    expect(screen.getByLabelText(/Flash Sale/)).not.toHaveClass('animate-bounce-slow');
  });
});

describe('NewBadge Component', () => {
  it('renders with default text', () => {
    render(<NewBadge />);
    
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<NewBadge>Just Arrived</NewBadge>);
    
    expect(screen.getByText('Just Arrived')).toBeInTheDocument();
  });

  it('uses green color by default', () => {
    render(<NewBadge />);
    
    expect(screen.getByLabelText(/New/)).toHaveClass('bg-green-600');
  });

  it('accepts custom props', () => {
    render(<NewBadge color="purple" size="lg" />);
    
    const badge = screen.getByLabelText(/New/);
    expect(badge).toHaveClass('bg-purple-600', 'text-lg');
  });
});

describe('HotBadge Component', () => {
  it('renders with default text', () => {
    render(<HotBadge />);
    
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<HotBadge>Trending Now</HotBadge>);
    
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  it('shows flame icon by default', () => {
    render(<HotBadge />);
    
    expect(screen.getByTestId('icon-flame')).toBeInTheDocument();
  });

  it('uses orange color by default', () => {
    render(<HotBadge />);
    
    expect(screen.getByLabelText(/Hot/)).toHaveClass('bg-orange-600');
  });

  it('has animation by default', () => {
    render(<HotBadge />);
    
    expect(screen.getByLabelText(/Hot/)).toHaveClass('animate-bounce-slow');
  });

  it('accepts custom props', () => {
    render(
      <HotBadge 
        color="red" 
        size="xl" 
        icon="fire"
        animate={false}
      />
    );
    
    const badge = screen.getByLabelText(/Hot/);
    expect(badge).toHaveClass('bg-red-600', 'text-xl');
    expect(badge).not.toHaveClass('animate-bounce-slow');
    expect(screen.getByTestId('icon-fire')).toBeInTheDocument();
  });
});