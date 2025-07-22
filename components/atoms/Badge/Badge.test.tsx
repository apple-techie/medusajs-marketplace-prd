import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge, BadgeIcons } from './Badge';

describe('Badge Component', () => {
  it('renders with text content', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    const { container } = render(<Badge>Default</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-neutral-200', 'text-neutral-900');
    expect(badge).toHaveClass('px-2', 'py-1', 'text-sm');
  });

  it('applies primary variant', () => {
    const { container } = render(<Badge variant="primary">Primary</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-primary-500', 'text-white');
  });

  it('applies secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-primary-50', 'text-primary-900');
  });

  it('applies success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-success-50', 'text-success-900');
  });

  it('applies warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-warning-50', 'text-warning-900');
  });

  it('applies danger variant', () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-danger-50', 'text-danger-900');
  });

  it('applies outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('border', 'border-neutral-300', 'bg-transparent');
  });

  it('applies small size', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('px-1.5', 'py-0.5', 'text-xs');
  });

  it('applies large size', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    const badge = container.firstChild;
    expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
  });

  it('renders with left icon', () => {
    const { container } = render(
      <Badge leftIcon={<BadgeIcons.Plus />}>With Icon</Badge>
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.parentElement).toHaveClass('h-4', 'w-4');
  });

  it('renders with right icon', () => {
    const { container } = render(
      <Badge rightIcon={<BadgeIcons.Check />}>With Icon</Badge>
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders with both icons', () => {
    const { container } = render(
      <Badge 
        leftIcon={<BadgeIcons.Plus />} 
        rightIcon={<BadgeIcons.Check />}
      >
        Both Icons
      </Badge>
    );
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('renders removable badge', () => {
    const handleRemove = jest.fn();
    render(
      <Badge removable onRemove={handleRemove}>
        Removable
      </Badge>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('removable overrides right icon', () => {
    const { container } = render(
      <Badge 
        rightIcon={<BadgeIcons.Check />} 
        removable 
        onRemove={() => {}}
      >
        Removable
      </Badge>
    );
    
    // Should only have the X icon, not the check icon
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom</Badge>
    );
    const badge = container.firstChild;
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('stops propagation on remove click', () => {
    const handleClick = jest.fn();
    const handleRemove = jest.fn();
    
    render(
      <div onClick={handleClick}>
        <Badge removable onRemove={handleRemove}>
          Removable
        </Badge>
      </div>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove' });
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('passes through HTML attributes', () => {
    render(
      <Badge data-testid="test-badge" title="Badge tooltip">
        HTML Attrs
      </Badge>
    );
    
    const badge = screen.getByTestId('test-badge');
    expect(badge).toHaveAttribute('title', 'Badge tooltip');
  });

  it('adjusts icon size based on badge size', () => {
    const { container: smallContainer } = render(
      <Badge size="sm" leftIcon={<BadgeIcons.Plus />}>Small</Badge>
    );
    const smallIcon = smallContainer.querySelector('svg')?.parentElement;
    expect(smallIcon).toHaveClass('h-3', 'w-3');

    const { container: largeContainer } = render(
      <Badge size="lg" leftIcon={<BadgeIcons.Plus />}>Large</Badge>
    );
    const largeIcon = largeContainer.querySelector('svg')?.parentElement;
    expect(largeIcon).toHaveClass('h-5', 'w-5');
  });
});