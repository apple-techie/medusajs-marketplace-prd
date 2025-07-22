import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard, FeatureCardGrid, FeatureComparison } from './FeatureCard';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock Icon component
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

// Mock Badge component
jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size, className }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size} className={className}>
      {children}
    </span>
  ),
}));

describe('FeatureCard Component', () => {
  const defaultProps = {
    title: 'Feature Title',
    description: 'Feature description goes here',
  };

  it('renders basic feature card', () => {
    render(<FeatureCard {...defaultProps} />);
    
    expect(screen.getByText('Feature Title')).toBeInTheDocument();
    expect(screen.getByText('Feature description goes here')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<FeatureCard {...defaultProps} icon="star" />);
    
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
  });

  it('renders with image instead of icon', () => {
    render(
      <FeatureCard 
        {...defaultProps} 
        icon="star"
        image="/feature-image.jpg"
      />
    );
    
    const img = screen.getByAltText('Feature Title');
    expect(img).toHaveAttribute('src', '/feature-image.jpg');
    expect(screen.queryByTestId('icon-star')).not.toBeInTheDocument();
  });

  it('renders with badge', () => {
    render(
      <FeatureCard 
        {...defaultProps} 
        badge="New"
        badgeVariant="success"
      />
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('New');
    expect(badge).toHaveAttribute('data-variant', 'success');
  });

  it('renders features list', () => {
    const features = ['Feature 1', 'Feature 2', 'Feature 3'];
    render(
      <FeatureCard 
        {...defaultProps} 
        features={features}
      />
    );
    
    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
    // Check marks for each feature
    expect(screen.getAllByTestId('icon-check')).toHaveLength(3);
  });

  it('renders action link', () => {
    render(
      <FeatureCard 
        {...defaultProps} 
        action={{ label: 'Learn More', href: '/learn-more' }}
      />
    );
    
    const link = screen.getByText('Learn More').closest('a');
    expect(link).toHaveAttribute('href', '/learn-more');
    expect(screen.getByTestId('icon-arrow-right')).toBeInTheDocument();
  });

  it('renders action button', () => {
    const handleClick = jest.fn();
    render(
      <FeatureCard 
        {...defaultProps} 
        action={{ label: 'Get Started', onClick: handleClick }}
      />
    );
    
    const button = screen.getByText('Get Started').closest('button');
    fireEvent.click(button!);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <FeatureCard {...defaultProps} variant="centered" />
    );
    expect(screen.getByText('Feature Title').parentElement?.parentElement).toHaveClass('items-center');
    
    rerender(<FeatureCard {...defaultProps} variant="horizontal" icon="star" />);
    expect(screen.getByText('Feature Title').parentElement?.parentElement).toHaveClass('flex', 'items-start');
    
    rerender(<FeatureCard {...defaultProps} variant="minimal" />);
    expect(screen.getByText('Feature Title')).toBeInTheDocument();
    
    rerender(<FeatureCard {...defaultProps} variant="detailed" icon="star" badge="Pro" />);
    expect(screen.getByText('Feature Title')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    const { rerender } = render(
      <FeatureCard {...defaultProps} size="sm" />
    );
    expect(screen.getByText('Feature Title')).toHaveClass('text-base');
    
    rerender(<FeatureCard {...defaultProps} size="lg" />);
    expect(screen.getByText('Feature Title')).toHaveClass('text-xl');
  });

  it('applies alignment', () => {
    const { rerender } = render(
      <FeatureCard {...defaultProps} variant="minimal" align="center" />
    );
    expect(screen.getByText('Feature Title').parentElement?.parentElement).toHaveClass('text-center');
    
    rerender(<FeatureCard {...defaultProps} variant="minimal" align="right" />);
    expect(screen.getByText('Feature Title').parentElement?.parentElement).toHaveClass('text-right');
  });

  it('handles icon customization', () => {
    render(
      <FeatureCard 
        {...defaultProps} 
        icon="star"
        iconColor="text-red-500"
        iconBackground={false}
      />
    );
    
    const icon = screen.getByTestId('icon-star');
    expect(icon).toHaveClass('text-red-500');
    // No background wrapper when iconBackground is false
    expect(icon.parentElement).not.toHaveClass('bg-primary-100');
  });

  it('applies styling options', () => {
    render(
      <FeatureCard 
        {...defaultProps}
        border={false}
        shadow={true}
        hover={false}
      />
    );
    
    const card = screen.getByText('Feature Title').parentElement?.parentElement;
    expect(card).not.toHaveClass('border');
    expect(card).toHaveClass('shadow-lg');
    expect(card).not.toHaveClass('hover:shadow-xl');
  });

  it('applies custom classes', () => {
    render(
      <FeatureCard 
        {...defaultProps}
        className="custom-card"
        iconClassName="custom-icon"
        contentClassName="custom-content"
        icon="star"
      />
    );
    
    expect(screen.getByText('Feature Title').parentElement?.parentElement).toHaveClass('custom-card');
    expect(screen.getByText('Feature Title').parentElement).toHaveClass('custom-content');
  });

  it('uses aria-label', () => {
    render(
      <FeatureCard 
        {...defaultProps}
        aria-label="Custom feature description"
      />
    );
    
    expect(screen.getByLabelText('Custom feature description')).toBeInTheDocument();
  });
});

describe('FeatureCardGrid Component', () => {
  const mockFeatures = [
    { id: 1, title: 'Feature 1', description: 'Description 1', icon: 'star' },
    { id: 2, title: 'Feature 2', description: 'Description 2', icon: 'heart' },
    { id: 3, title: 'Feature 3', description: 'Description 3', icon: 'zap' },
  ];

  it('renders grid of feature cards', () => {
    render(<FeatureCardGrid features={mockFeatures} />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('applies column classes', () => {
    const { rerender } = render(
      <FeatureCardGrid features={mockFeatures} columns={2} />
    );
    const grid = screen.getByText('Feature 1').parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    
    rerender(<FeatureCardGrid features={mockFeatures} columns={4} />);
    const grid4 = screen.getByText('Feature 1').parentElement?.parentElement?.parentElement;
    expect(grid4).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
  });

  it('applies gap classes', () => {
    const { rerender } = render(
      <FeatureCardGrid features={mockFeatures} gap="sm" />
    );
    const grid = screen.getByText('Feature 1').parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('gap-4');
    
    rerender(<FeatureCardGrid features={mockFeatures} gap="lg" />);
    const gridLg = screen.getByText('Feature 1').parentElement?.parentElement?.parentElement;
    expect(gridLg).toHaveClass('gap-8');
  });

  it('passes size prop to cards', () => {
    render(<FeatureCardGrid features={mockFeatures} size="sm" />);
    
    expect(screen.getByText('Feature 1')).toHaveClass('text-base');
  });
});

describe('FeatureComparison Component', () => {
  const mockFeatures = [
    { name: 'Feature 1', basic: true, pro: true, enterprise: true },
    { name: 'Feature 2', basic: false, pro: true, enterprise: true },
    { name: 'Feature 3', basic: '10', pro: '100', enterprise: 'Unlimited' },
    { name: 'Feature 4', basic: false, pro: false, enterprise: true },
  ];

  it('renders comparison table', () => {
    render(<FeatureComparison features={mockFeatures} />);
    
    expect(screen.getByText('Feature')).toBeInTheDocument();
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('renders feature rows', () => {
    render(<FeatureComparison features={mockFeatures} />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByText('Feature 4')).toBeInTheDocument();
  });

  it('renders check marks for true values', () => {
    render(<FeatureComparison features={mockFeatures} />);
    
    const checkIcons = screen.getAllByTestId('icon-check');
    expect(checkIcons.length).toBeGreaterThan(0);
  });

  it('renders X marks for false values', () => {
    render(<FeatureComparison features={mockFeatures} />);
    
    const xIcons = screen.getAllByTestId('icon-x');
    expect(xIcons.length).toBeGreaterThan(0);
  });

  it('renders string values', () => {
    render(<FeatureComparison features={mockFeatures} />);
    
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Unlimited')).toBeInTheDocument();
  });

  it('renders with title and description', () => {
    render(
      <FeatureComparison 
        title="Compare Plans"
        description="Choose the plan that's right for you"
        features={mockFeatures}
      />
    );
    
    expect(screen.getByText('Compare Plans')).toBeInTheDocument();
    expect(screen.getByText("Choose the plan that's right for you")).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <FeatureComparison 
        features={mockFeatures}
        className="custom-comparison"
      />
    );
    
    const container = screen.getByText('Feature').closest('div');
    expect(container).toHaveClass('custom-comparison');
  });
});