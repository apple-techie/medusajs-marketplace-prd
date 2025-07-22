import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoyaltyPointsCard } from './LoyaltyPointsCard';

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

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button 
      onClick={onClick}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
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

describe('LoyaltyPointsCard Component', () => {
  const defaultProps = {
    points: 2500,
  };

  it('renders points correctly', () => {
    render(<LoyaltyPointsCard {...defaultProps} />);
    
    expect(screen.getByText('2,500')).toBeInTheDocument();
    expect(screen.getByText('points')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    render(<LoyaltyPointsCard points={1234567} />);
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('displays tier information', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        tier="Gold Member"
        tierIcon="crown"
      />
    );
    
    expect(screen.getByText('Gold Member')).toBeInTheDocument();
    expect(screen.getByTestId('icon-crown')).toBeInTheDocument();
  });

  it('shows expiring points warning', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        expiringPoints={{
          amount: 500,
          date: '2024-02-15',
        }}
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('500 expiring Feb 15, 2024');
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
  });

  it('displays progress to next tier', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        pointsToNextTier={1500}
        nextTier="Platinum"
      />
    );
    
    expect(screen.getByText('Progress to Platinum')).toBeInTheDocument();
    expect(screen.getByText('1,500 points to go')).toBeInTheDocument();
    
    const progress = screen.getByTestId('progress');
    // 2500 / (2500 + 1500) * 100 = 62.5
    expect(progress).toHaveAttribute('data-value', '62.5');
  });

  it('hides progress when showProgress is false', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        pointsToNextTier={1500}
        nextTier="Platinum"
        showProgress={false}
      />
    );
    
    expect(screen.queryByText('Progress to Platinum')).not.toBeInTheDocument();
  });

  it('shows currency value', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        currency="$"
      />
    );
    
    // 2500 / 100 = $25.00
    expect(screen.getByText('≈ $25.00 value')).toBeInTheDocument();
  });

  it('displays recent history', () => {
    const history = [
      {
        id: '1',
        description: 'Purchase reward',
        points: 100,
        date: '2024-01-20',
        type: 'earned' as const,
      },
      {
        id: '2',
        description: 'Redeemed for discount',
        points: 50,
        date: '2024-01-19',
        type: 'redeemed' as const,
      },
    ];
    
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        history={history}
      />
    );
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Purchase reward')).toBeInTheDocument();
    expect(screen.getByText('+100')).toBeInTheDocument();
    expect(screen.getByText('Redeemed for discount')).toBeInTheDocument();
    expect(screen.getByText('-50')).toBeInTheDocument();
  });

  it('limits history items based on historyLimit', () => {
    const history = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      description: `Activity ${i + 1}`,
      points: 100,
      date: '2024-01-20',
      type: 'earned' as const,
    }));
    
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        history={history}
        historyLimit={2}
      />
    );
    
    expect(screen.getByText('Activity 1')).toBeInTheDocument();
    expect(screen.getByText('Activity 2')).toBeInTheDocument();
    expect(screen.queryByText('Activity 3')).not.toBeInTheDocument();
  });

  it('hides history when showHistory is false', () => {
    const history = [
      {
        id: '1',
        description: 'Purchase reward',
        points: 100,
        date: '2024-01-20',
        type: 'earned' as const,
      },
    ];
    
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        history={history}
        showHistory={false}
      />
    );
    
    expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument();
    expect(screen.queryByText('Purchase reward')).not.toBeInTheDocument();
  });

  it('renders action buttons', () => {
    const handleRedeem = jest.fn();
    const handleHistory = jest.fn();
    
    const actions = [
      {
        label: 'Redeem points',
        onClick: handleRedeem,
        icon: 'gift',
      },
      {
        label: 'View history',
        onClick: handleHistory,
        variant: 'outline' as const,
      },
    ];
    
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        actions={actions}
      />
    );
    
    const redeemButton = screen.getByText('Redeem points');
    const historyButton = screen.getByText('View history');
    
    expect(screen.getByTestId('icon-gift')).toBeInTheDocument();
    
    fireEvent.click(redeemButton);
    expect(handleRedeem).toHaveBeenCalled();
    
    fireEvent.click(historyButton);
    expect(handleHistory).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<LoyaltyPointsCard {...defaultProps} loading />);
    
    expect(screen.getByTestId('card').querySelector('.animate-pulse')).toBeInTheDocument();
    expect(screen.queryByText('2,500')).not.toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(
      <LoyaltyPointsCard {...defaultProps} variant="default" />
    );
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('from-primary-50', 'to-primary-100');
    
    rerender(<LoyaltyPointsCard {...defaultProps} variant="premium" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('from-yellow-50', 'to-amber-100');
    
    rerender(<LoyaltyPointsCard {...defaultProps} variant="vip" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('from-purple-50', 'to-indigo-100');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <LoyaltyPointsCard {...defaultProps} size="sm" />
    );
    
    let card = screen.getByTestId('card');
    expect(card).toHaveClass('p-4');
    
    rerender(<LoyaltyPointsCard {...defaultProps} size="md" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('p-6');
    
    rerender(<LoyaltyPointsCard {...defaultProps} size="lg" />);
    card = screen.getByTestId('card');
    expect(card).toHaveClass('p-8');
  });

  it('uses custom points label', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        pointsLabel="rewards"
      />
    );
    
    expect(screen.getByText('rewards')).toBeInTheDocument();
  });

  it('applies earned/redeemed styling to history items', () => {
    const history = [
      {
        id: '1',
        description: 'Earned',
        points: 100,
        date: '2024-01-20',
        type: 'earned' as const,
      },
      {
        id: '2',
        description: 'Redeemed',
        points: 50,
        date: '2024-01-19',
        type: 'redeemed' as const,
      },
    ];
    
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        history={history}
      />
    );
    
    const earnedIcon = screen.getByTestId('icon-plus-circle');
    const redeemedIcon = screen.getByTestId('icon-minus-circle');
    
    expect(earnedIcon).toHaveClass('text-green-600');
    expect(redeemedIcon).toHaveClass('text-red-600');
  });

  it('applies custom className', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        className="custom-class"
      />
    );
    
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('handles dates as Date objects', () => {
    const expiringDate = new Date('2024-02-15');
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        expiringPoints={{
          amount: 500,
          date: expiringDate,
        }}
      />
    );
    
    expect(screen.getByText(/500 expiring Feb 15, 2024/)).toBeInTheDocument();
  });

  it('renders background decoration', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        tierIcon="diamond"
      />
    );
    
    // Should have two instances - one in header and one as decoration
    const icons = screen.getAllByTestId('icon-diamond');
    expect(icons).toHaveLength(1); // Only decoration since tier is not provided
    expect(icons[0].parentElement).toHaveClass('opacity-10');
  });

  it('calculates progress correctly when no next tier', () => {
    render(
      <LoyaltyPointsCard 
        {...defaultProps}
        pointsToNextTier={0}
        nextTier="Max"
      />
    );
    
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('data-value', '0');
  });
});