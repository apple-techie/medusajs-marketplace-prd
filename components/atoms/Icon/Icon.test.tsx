import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon, icons } from './Icon';

describe('Icon Component', () => {
  it('renders icon correctly', () => {
    const { container } = render(<Icon icon="plus" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies default size', () => {
    const { container } = render(<Icon icon="search" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-5', 'w-5');
  });

  it('applies custom size', () => {
    const { container } = render(<Icon icon="close" size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('h-6', 'w-6');
  });

  it('applies color variant', () => {
    const { container } = render(<Icon icon="check" color="primary" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-primary-600');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon icon="user" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });

  it('renders with accessibility label', () => {
    render(<Icon icon="bell" label="Notifications" />);
    const icon = screen.getByLabelText('Notifications');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('role', 'img');
  });

  it('does not have role when no label', () => {
    const { container } = render(<Icon icon="settings" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('role');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<Icon icon="home" ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('passes through SVG props', () => {
    const { container } = render(
      <Icon 
        icon="cart" 
        onClick={() => {}} 
        data-testid="cart-icon"
        style={{ cursor: 'pointer' }}
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-testid', 'cart-icon');
    expect(svg).toHaveStyle({ cursor: 'pointer' });
  });

  it('handles non-existent icon gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(<Icon icon={'nonexistent' as any} />);
    
    expect(container.firstChild).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Icon "nonexistent" not found');
    
    consoleSpy.mockRestore();
  });

  // Test all size variants
  describe('Size Variants', () => {
    it('applies xs size', () => {
      const { container } = render(<Icon icon="plus" size="xs" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-3', 'w-3');
    });

    it('applies sm size', () => {
      const { container } = render(<Icon icon="minus" size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4', 'w-4');
    });

    it('applies md size', () => {
      const { container } = render(<Icon icon="search" size="md" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-5', 'w-5');
    });

    it('applies lg size', () => {
      const { container } = render(<Icon icon="close" size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-6', 'w-6');
    });

    it('applies xl size', () => {
      const { container } = render(<Icon icon="user" size="xl" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-8', 'w-8');
    });
  });

  // Test all color variants
  describe('Color Variants', () => {
    it('applies current color', () => {
      const { container } = render(<Icon icon="bell" color="current" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-current');
    });

    it('applies primary color', () => {
      const { container } = render(<Icon icon="star" color="primary" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-primary-600');
    });

    it('applies secondary color', () => {
      const { container } = render(<Icon icon="info" color="secondary" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-neutral-600');
    });

    it('applies success color', () => {
      const { container } = render(<Icon icon="check" color="success" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-success-600');
    });

    it('applies warning color', () => {
      const { container } = render(<Icon icon="alert" color="warning" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-warning-600');
    });

    it('applies danger color', () => {
      const { container } = render(<Icon icon="trash" color="danger" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-danger-600');
    });

    it('applies neutral color', () => {
      const { container } = render(<Icon icon="settings" color="neutral" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-neutral-900');
    });

    it('applies white color', () => {
      const { container } = render(<Icon icon="menu" color="white" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-white');
    });
  });

  // Test that all icons exist
  describe('Icon Library', () => {
    Object.keys(icons).forEach((iconName) => {
      it(`renders ${iconName} icon`, () => {
        const { container } = render(<Icon icon={iconName as keyof typeof icons} />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      });
    });
  });

  // Test icon stroke properties
  it('applies consistent stroke properties', () => {
    const { container } = render(<Icon icon="search" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
  });
});