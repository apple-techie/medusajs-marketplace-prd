import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricCard } from './MetricCard';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

describe('MetricCard Component', () => {
  it('renders with basic props', () => {
    render(
      <MetricCard
        title="Total Sales"
        value="$12,345"
      />
    );
    
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <MetricCard
        title="Orders"
        value="156"
        subtitle="this month"
      />
    );
    
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('this month')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <MetricCard
        title="Revenue"
        value="$45,678"
        icon="dollar-sign"
      />
    );
    
    expect(screen.getByTestId('icon-dollar-sign')).toBeInTheDocument();
  });

  it('renders trend indicators', () => {
    render(
      <MetricCard
        title="Growth"
        value="23%"
        trend="up"
        change="+5%"
      />
    );
    
    expect(screen.getByTestId('icon-trending-up')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByText('from last period')).toBeInTheDocument();
  });

  it('renders down trend', () => {
    render(
      <MetricCard
        title="Bounce Rate"
        value="45%"
        trend="down"
        change="-3%"
      />
    );
    
    expect(screen.getByTestId('icon-trending-down')).toBeInTheDocument();
    expect(screen.getByText('-3%')).toBeInTheDocument();
  });

  it('renders neutral trend', () => {
    render(
      <MetricCard
        title="Visitors"
        value="1,234"
        trend="neutral"
        change="0%"
      />
    );
    
    expect(screen.getByTestId('icon-minus')).toBeInTheDocument();
  });

  it('renders with custom change label', () => {
    render(
      <MetricCard
        title="Sales"
        value="$10,000"
        trend="up"
        change="15%"
        changeLabel="vs last week"
      />
    );
    
    expect(screen.getByText('vs last week')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(
      <MetricCard
        title="Status"
        value="Active"
        badge={{ text: 'Live', variant: 'success' }}
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('Live');
    expect(badge).toHaveAttribute('data-variant', 'success');
  });

  it('renders progress bar', () => {
    render(
      <MetricCard
        title="Storage"
        value="75GB"
        progress={{
          value: 75,
          max: 100,
          label: 'Used',
          showPercentage: true
        }}
      />
    );
    
    expect(screen.getByText('Used')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders detailed variant with description', () => {
    render(
      <MetricCard
        title="Conversion Rate"
        value="3.2%"
        subtitle="Average"
        description="Based on last 30 days of data"
        variant="detailed"
      />
    );
    
    expect(screen.getByText('Based on last 30 days of data')).toBeInTheDocument();
  });

  it('renders minimal variant', () => {
    render(
      <MetricCard
        title="Users"
        value="1,234"
        icon="users"
        change="+10%"
        variant="minimal"
      />
    );
    
    // Icon and change should not be rendered in minimal variant
    expect(screen.queryByTestId('icon-users')).not.toBeInTheDocument();
    expect(screen.queryByText('+10%')).not.toBeInTheDocument();
  });

  it('renders comparison in detailed variant', () => {
    render(
      <MetricCard
        title="Performance"
        value="98.5%"
        variant="detailed"
        comparison={{
          label: 'Industry average',
          value: '92%',
          trend: 'better'
        }}
      />
    );
    
    expect(screen.getByText('Industry average')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrow-up')).toBeInTheDocument();
  });

  it('renders footer action', () => {
    const handleClick = jest.fn();
    render(
      <MetricCard
        title="Active Users"
        value="5,678"
        footerAction={{
          label: 'View details',
          onClick: handleClick
        }}
      />
    );
    
    const button = screen.getByText('View details →');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders as clickable when onClick provided', () => {
    const handleClick = jest.fn();
    render(
      <MetricCard
        title="Clickable"
        value="123"
        onClick={handleClick}
      />
    );
    
    const card = screen.getByLabelText('Clickable: 123');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders as link when href provided', () => {
    render(
      <MetricCard
        title="Link Card"
        value="456"
        href="/dashboard/details"
      />
    );
    
    const link = screen.getByLabelText('Link Card: 456');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/dashboard/details');
  });

  it('renders different sizes', () => {
    const { rerender } = render(
      <MetricCard title="Small" value="123" size="sm" icon="chart" />
    );
    
    expect(screen.getByTestId('icon-chart')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByText('123')).toHaveClass('text-xl');
    
    rerender(
      <MetricCard title="Large" value="456" size="lg" icon="chart" />
    );
    
    expect(screen.getByTestId('icon-chart')).toHaveAttribute('data-size', 'lg');
    expect(screen.getByText('456')).toHaveClass('text-3xl');
  });

  it('renders loading state', () => {
    render(<MetricCard title="Loading" value="---" loading />);
    
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(screen.queryByText('---')).not.toBeInTheDocument();
    expect(screen.getByText('', { selector: '.animate-pulse' })).toBeInTheDocument();
  });

  it('renders sparkline when provided', () => {
    render(
      <MetricCard
        title="Trend"
        value="123"
        sparkline={[10, 20, 15, 25, 30, 28, 35]}
      />
    );
    
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg.tagName).toBe('svg');
    expect(svg.querySelector('polyline')).toBeInTheDocument();
  });

  it('does not render sparkline with insufficient data', () => {
    render(
      <MetricCard
        title="Trend"
        value="123"
        sparkline={[10]}
      />
    );
    
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <MetricCard
        title="Custom"
        value="123"
        className="custom-card"
        valueClassName="custom-value"
        iconClassName="custom-icon"
        icon="star"
      />
    );
    
    const card = screen.getByLabelText('Custom: 123');
    expect(card).toHaveClass('custom-card');
    expect(screen.getByText('123')).toHaveClass('custom-value');
  });

  it('uses custom icon color', () => {
    render(
      <MetricCard
        title="Colored"
        value="123"
        icon="heart"
        iconColor="text-red-500"
      />
    );
    
    expect(screen.getByTestId('icon-heart')).toHaveClass('text-red-500');
  });

  it('hides icon background when disabled', () => {
    render(
      <MetricCard
        title="No Background"
        value="123"
        icon="star"
        iconBackground={false}
      />
    );
    
    const iconContainer = screen.getByTestId('icon-star').parentElement;
    expect(iconContainer).not.toHaveClass('bg-primary-100');
  });

  it('uses aria-label', () => {
    render(
      <MetricCard
        title="Revenue"
        value="$50K"
        aria-label="Total revenue for the month: $50,000"
      />
    );
    
    expect(screen.getByLabelText('Total revenue for the month: $50,000')).toBeInTheDocument();
  });
});