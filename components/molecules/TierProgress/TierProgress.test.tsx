import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TierProgress, Tier } from './TierProgress';

// Mock components
jest.mock('../../atoms/Card/Card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, className }: any) => (
    <span data-testid={`icon-${icon}`} className={className}>{icon}</span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Progress/Progress', () => ({
  Progress: ({ value, className }: any) => (
    <div 
      data-testid="progress" 
      data-value={value} 
      className={className}
      role="progressbar"
      aria-valuenow={value}
    />
  ),
}));

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button 
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('TierProgress Component', () => {
  const mockCurrentTier: Tier = {
    id: 'gold',
    name: 'Gold',
    minRevenue: 10000,
    maxRevenue: 25000,
    commissionRate: 20,
    benefits: ['Priority support', 'Featured listings'],
    icon: 'star',
  };

  const mockNextTier: Tier = {
    id: 'platinum',
    name: 'Platinum',
    minRevenue: 25000,
    commissionRate: 25,
    icon: 'crown',
  };

  const mockTiers: Tier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      minRevenue: 0,
      maxRevenue: 5000,
      commissionRate: 15,
      icon: 'shield',
    },
    {
      id: 'silver',
      name: 'Silver',
      minRevenue: 5000,
      maxRevenue: 10000,
      commissionRate: 18,
      icon: 'medal',
    },
    mockCurrentTier,
    mockNextTier,
  ];

  const defaultProps = {
    currentTier: mockCurrentTier,
    nextTier: mockNextTier,
    currentRevenue: 15000,
  };

  it('renders current tier information', () => {
    render(<TierProgress {...defaultProps} />);
    
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('20% commission')).toBeInTheDocument();
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
  });

  it('displays current revenue', () => {
    render(<TierProgress {...defaultProps} />);
    
    expect(screen.getByText('$15,000')).toBeInTheDocument();
  });

  it('shows period label', () => {
    render(<TierProgress {...defaultProps} period="This month" />);
    
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('calculates and displays progress correctly', () => {
    render(<TierProgress {...defaultProps} />);
    
    // Progress: (15000 - 10000) / (25000 - 10000) * 100 = 33.33%
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('data-value', '33.333333333333336');
    
    // Revenue to next: 25000 - 15000 = 10000
    expect(screen.getByText('$10,000 to go')).toBeInTheDocument();
  });

  it('shows 100% progress when no next tier', () => {
    render(
      <TierProgress 
        currentTier={mockNextTier}
        currentRevenue={30000}
      />
    );
    
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('displays benefits in detailed variant', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        showBenefits
      />
    );
    
    expect(screen.getByText('Current Benefits')).toBeInTheDocument();
    expect(screen.getByText('Priority support')).toBeInTheDocument();
    expect(screen.getByText('Featured listings')).toBeInTheDocument();
  });

  it('shows all tiers when showAllTiers is true', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        tiers={mockTiers}
        showAllTiers
      />
    );
    
    expect(screen.getByText('All Tiers')).toBeInTheDocument();
    expect(screen.getByText('Bronze')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Platinum')).toBeInTheDocument();
    
    // Check commission rates
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('18%')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('marks tiers with correct status', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        tiers={mockTiers}
        showAllTiers
      />
    );
    
    // Current tier should have "Current" badge
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('handles tier click events', () => {
    const handleTierClick = jest.fn();
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        tiers={mockTiers}
        showAllTiers
        onTierClick={handleTierClick}
      />
    );
    
    // Click on achieved tier (Silver)
    const silverTier = screen.getByText('Silver').closest('div[class*="cursor-pointer"]');
    fireEvent.click(silverTier!);
    
    expect(handleTierClick).toHaveBeenCalledWith(mockTiers[1]);
  });

  it('shows projection when enabled', () => {
    render(
      <TierProgress 
        {...defaultProps}
        showProjection
        projectedRevenue={20000}
      />
    );
    
    expect(screen.getByText('Projected:')).toBeInTheDocument();
    expect(screen.getByText('$20,000')).toBeInTheDocument();
  });

  it('indicates when projection reaches next tier', () => {
    render(
      <TierProgress 
        {...defaultProps}
        showProjection
        projectedRevenue={26000}
      />
    );
    
    expect(screen.getByText('(Reaches Platinum)')).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="compact"
      />
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('p-4');
    
    // Should show simplified info
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('$10,000 to Platinum (25%)')).toBeInTheDocument();
  });

  it('renders detailed variant', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
      />
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('p-6');
    
    expect(screen.getByText('Commission Tier Progress')).toBeInTheDocument();
    expect(screen.getByText('Current Revenue')).toBeInTheDocument();
  });

  it('shows projected revenue in detailed variant', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        showProjection
        projectedRevenue={22000}
      />
    );
    
    expect(screen.getByText('Projected')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
  });

  it('displays learn more button when provided', () => {
    const handleLearnMore = jest.fn();
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        onLearnMore={handleLearnMore}
      />
    );
    
    const button = screen.getByText('Learn more about tiers');
    fireEvent.click(button);
    
    expect(handleLearnMore).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<TierProgress {...defaultProps} loading variant="detailed" />);
    
    expect(screen.getByTestId('card').querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('Gold')).not.toBeInTheDocument();
  });

  it('handles different currencies', () => {
    render(
      <TierProgress 
        {...defaultProps}
        currency="€"
      />
    );
    
    expect(screen.getByText('€15,000')).toBeInTheDocument();
  });

  it('applies status styles', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        status="achieved"
      />
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-green-50', 'border-green-200');
  });

  it('hides benefits when showBenefits is false', () => {
    render(
      <TierProgress 
        {...defaultProps}
        variant="detailed"
        showBenefits={false}
      />
    );
    
    expect(screen.queryByText('Current Benefits')).not.toBeInTheDocument();
  });

  it('calculates progress correctly at tier boundary', () => {
    render(
      <TierProgress 
        currentTier={mockCurrentTier}
        nextTier={mockNextTier}
        currentRevenue={25000}
      />
    );
    
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('data-value', '100');
    expect(screen.getByText('$0 to go')).toBeInTheDocument();
  });

  it('handles tiers without minRevenue', () => {
    const baseTier: Tier = {
      id: 'base',
      name: 'Base',
      minRevenue: 0,
      commissionRate: 10,
    };
    
    render(
      <TierProgress 
        currentTier={baseTier}
        nextTier={mockCurrentTier}
        currentRevenue={5000}
        variant="detailed"
        tiers={[baseTier, ...mockTiers]}
        showAllTiers
      />
    );
    
    expect(screen.getByText('Base tier')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TierProgress 
        {...defaultProps}
        className="custom-class"
      />
    );
    
    const container = screen.getByText('Gold').closest('div.space-y-4');
    expect(container).toHaveClass('custom-class');
  });

  it('uses custom tier icons', () => {
    const customTier: Tier = {
      ...mockCurrentTier,
      icon: 'diamond',
    };
    
    render(
      <TierProgress 
        currentTier={customTier}
        nextTier={mockNextTier}
        currentRevenue={15000}
      />
    );
    
    expect(screen.getByTestId('icon-diamond')).toBeInTheDocument();
  });

  it('applies locked styling to future tiers', () => {
    render(
      <TierProgress 
        currentTier={mockTiers[0]}
        currentRevenue={2000}
        variant="detailed"
        tiers={mockTiers}
        showAllTiers
      />
    );
    
    // Platinum tier should be locked
    const platinumTier = screen.getByText('Platinum').closest('div');
    expect(platinumTier?.parentElement).toHaveClass('opacity-60');
  });
});