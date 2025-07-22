import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  ButtonSkeleton,
  CardSkeleton,
  TableSkeleton,
  FormSkeleton,
  ProductSkeleton,
  ListItemSkeleton,
} from './Skeleton';

describe('Skeleton Component', () => {
  it('renders basic skeleton', () => {
    render(<Skeleton />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
  });

  it('applies custom dimensions', () => {
    render(<Skeleton width={200} height={100} />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('accepts string dimensions', () => {
    render(<Skeleton width="50%" height="10rem" />);
    
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '50%', height: '10rem' });
  });

  it('applies variant styles', () => {
    const { rerender } = render(<Skeleton variant="default" />);
    expect(screen.getByRole('status')).toHaveClass('bg-neutral-200');

    rerender(<Skeleton variant="primary" />);
    expect(screen.getByRole('status')).toHaveClass('bg-primary-100');

    rerender(<Skeleton variant="light" />);
    expect(screen.getByRole('status')).toHaveClass('bg-neutral-100');
  });

  it('applies animation variants', () => {
    const { rerender } = render(<Skeleton animation="pulse" />);
    expect(screen.getByRole('status')).toHaveClass('animate-pulse');

    rerender(<Skeleton animation="wave" />);
    expect(screen.getByRole('status')).toHaveClass('animate-shimmer');

    rerender(<Skeleton animation="none" />);
    expect(screen.getByRole('status')).not.toHaveClass('animate-pulse');
  });

  it('applies rounded variants', () => {
    const { rerender } = render(<Skeleton rounded="none" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-none');

    rerender(<Skeleton rounded="full" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-full');
  });

  it('renders as different elements', () => {
    const { rerender } = render(<Skeleton as="div" />);
    expect(screen.getByRole('status').tagName).toBe('DIV');

    rerender(<Skeleton as="span" />);
    expect(screen.getByRole('status').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Skeleton className="custom-skeleton" />);
    
    expect(screen.getByRole('status')).toHaveClass('custom-skeleton');
  });

  it('uses custom aria-label', () => {
    render(<Skeleton aria-label="Please wait..." />);
    
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Please wait...');
  });
});

describe('TextSkeleton Component', () => {
  it('renders multiple lines', () => {
    render(<TextSkeleton lines={3} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
  });

  it('applies custom line height and spacing', () => {
    render(<TextSkeleton lines={2} lineHeight={24} />);
    
    const skeletons = screen.getAllByRole('status');
    skeletons.forEach(skeleton => {
      expect(skeleton).toHaveStyle({ height: '24px' });
    });
  });

  it('applies different width to last line', () => {
    render(<TextSkeleton lines={3} lastLineWidth="60%" />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons[skeletons.length - 1]).toHaveStyle({ width: '60%' });
  });

  it('applies full width to non-last lines', () => {
    render(<TextSkeleton lines={3} width="100%" />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons[0]).toHaveStyle({ width: '100%' });
    expect(skeletons[1]).toHaveStyle({ width: '100%' });
  });
});

describe('AvatarSkeleton Component', () => {
  it('renders with correct size', () => {
    const { rerender } = render(<AvatarSkeleton size="xs" />);
    expect(screen.getByRole('status')).toHaveStyle({ width: '24px', height: '24px' });

    rerender(<AvatarSkeleton size="xl" />);
    expect(screen.getByRole('status')).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('always renders as circle', () => {
    render(<AvatarSkeleton />);
    
    expect(screen.getByRole('status')).toHaveClass('rounded-full');
  });
});

describe('ButtonSkeleton Component', () => {
  it('renders with correct size', () => {
    const { rerender } = render(<ButtonSkeleton size="sm" />);
    expect(screen.getByRole('status')).toHaveStyle({ height: '32px', width: '80px' });

    rerender(<ButtonSkeleton size="lg" />);
    expect(screen.getByRole('status')).toHaveStyle({ height: '48px', width: '120px' });
  });

  it('accepts custom width', () => {
    render(<ButtonSkeleton width={200} />);
    
    expect(screen.getByRole('status')).toHaveStyle({ width: '200px' });
  });
});

describe('CardSkeleton Component', () => {
  it('renders all sections by default', () => {
    render(<CardSkeleton />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThan(5); // Image, title, description lines, buttons
  });

  it('conditionally renders sections', () => {
    render(
      <CardSkeleton 
        showImage={false}
        showTitle={false}
        showDescription={false}
        showActions={false}
      />
    );
    
    const skeletons = screen.queryAllByRole('status');
    expect(skeletons).toHaveLength(0);
  });

  it('renders custom number of description lines', () => {
    render(<CardSkeleton showDescription descriptionLines={5} />);
    
    const container = screen.getByRole('status').parentElement?.parentElement;
    const textSkeletons = container?.querySelectorAll('[role="status"]');
    expect(textSkeletons?.length).toBeGreaterThan(5);
  });

  it('applies padding when enabled', () => {
    render(<CardSkeleton padding={true} />);
    
    const container = screen.getByRole('status').parentElement;
    expect(container?.querySelector('.p-4')).toBeInTheDocument();
  });
});

describe('TableSkeleton Component', () => {
  it('renders correct number of rows and columns', () => {
    render(<TableSkeleton rows={3} columns={4} />);
    
    const skeletons = screen.getAllByRole('status');
    // 4 header + (3 rows * 4 columns) = 16 total
    expect(skeletons).toHaveLength(16);
  });

  it('skips header when showHeader is false', () => {
    render(<TableSkeleton rows={2} columns={3} showHeader={false} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(6); // 2 rows * 3 columns
  });

  it('applies custom column widths', () => {
    render(
      <TableSkeleton 
        rows={1} 
        columns={3} 
        columnWidths={[100, '50%', 200]}
        showHeader={false}
      />
    );
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons[0]).toHaveStyle({ width: '100px' });
    expect(skeletons[1]).toHaveStyle({ width: '50%' });
    expect(skeletons[2]).toHaveStyle({ width: '200px' });
  });
});

describe('FormSkeleton Component', () => {
  it('renders correct number of fields', () => {
    render(<FormSkeleton fields={4} />);
    
    const skeletons = screen.getAllByRole('status');
    // 4 labels + 4 inputs + 1 button = 9 total
    expect(skeletons).toHaveLength(9);
  });

  it('skips labels when showLabels is false', () => {
    render(<FormSkeleton fields={3} showLabels={false} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(4); // 3 inputs + 1 button
  });

  it('skips button when showButton is false', () => {
    render(<FormSkeleton fields={2} showButton={false} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(4); // 2 labels + 2 inputs
  });
});

describe('ProductSkeleton Component', () => {
  it('renders vertical orientation by default', () => {
    render(<ProductSkeleton />);
    
    const container = screen.getByRole('status').parentElement;
    expect(container).toHaveClass('relative');
    expect(container).not.toHaveClass('flex');
  });

  it('renders horizontal orientation', () => {
    render(<ProductSkeleton orientation="horizontal" />);
    
    const container = screen.getAllByRole('status')[0].parentElement;
    expect(container).toHaveClass('flex', 'gap-4');
  });

  it('conditionally shows badge, rating, and price', () => {
    const { rerender } = render(
      <ProductSkeleton showBadge showRating showPrice />
    );
    let skeletons = screen.getAllByRole('status');
    const fullCount = skeletons.length;

    rerender(
      <ProductSkeleton showBadge={false} showRating={false} showPrice={false} />
    );
    skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeLessThan(fullCount);
  });
});

describe('ListItemSkeleton Component', () => {
  it('renders all elements by default', () => {
    render(<ListItemSkeleton />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThanOrEqual(3); // Avatar + primary text + secondary text
  });

  it('conditionally renders avatar', () => {
    render(<ListItemSkeleton showAvatar={false} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(2); // Only text elements
  });

  it('conditionally renders secondary text', () => {
    render(<ListItemSkeleton showSecondaryText={false} />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(2); // Avatar + primary text
  });

  it('conditionally renders action', () => {
    render(<ListItemSkeleton showAction />);
    
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThanOrEqual(4); // Avatar + texts + action
  });
});