import React from 'react';
import { render, screen } from '@testing-library/react';
import { Divider, SectionDivider, VerticalDivider, GradientDivider } from './Divider';

describe('Divider Component', () => {
  it('renders horizontal divider by default', () => {
    render(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('w-full', 'h-px');
    expect(divider.tagName).toBe('HR');
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('h-full', 'w-px');
    expect(divider.tagName).toBe('DIV'); // Vertical dividers can't use HR
  });

  it('applies color variants', () => {
    const { rerender } = render(<Divider color="default" />);
    expect(screen.getByRole('separator')).toHaveClass('bg-neutral-200');

    rerender(<Divider color="primary" />);
    expect(screen.getByRole('separator')).toHaveClass('bg-primary-200');

    rerender(<Divider color="muted" />);
    expect(screen.getByRole('separator')).toHaveClass('bg-neutral-100');

    rerender(<Divider color="strong" />);
    expect(screen.getByRole('separator')).toHaveClass('bg-neutral-300');
  });

  it('applies thickness variants', () => {
    const { rerender } = render(<Divider thickness="thin" />);
    expect(screen.getByRole('separator')).toHaveClass('h-px');

    rerender(<Divider thickness="medium" />);
    expect(screen.getByRole('separator')).toHaveClass('h-0.5');

    rerender(<Divider thickness="thick" />);
    expect(screen.getByRole('separator')).toHaveClass('h-1');
  });

  it('applies spacing variants', () => {
    const { rerender } = render(<Divider spacing="none" />);
    expect(screen.getByRole('separator')).toHaveClass('my-0');

    rerender(<Divider spacing="sm" />);
    expect(screen.getByRole('separator')).toHaveClass('my-2');

    rerender(<Divider spacing="lg" />);
    expect(screen.getByRole('separator')).toHaveClass('my-6');
  });

  it('renders dashed variant as bordered div', () => {
    render(<Divider variant="dashed" />);
    
    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('border-t', 'border-dashed');
  });

  it('renders dotted variant as bordered div', () => {
    render(<Divider variant="dotted" />);
    
    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('border-t', 'border-dotted');
  });

  it('renders gradient variant', () => {
    render(<Divider variant="gradient" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('bg-gradient-to-r', 'from-transparent', 'via-neutral-200', 'to-transparent');
  });

  it('renders with text content', () => {
    render(<Divider>Section Title</Divider>);
    
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    // Should render two divider lines
    const dividers = screen.getAllByRole('separator');
    expect(dividers.length).toBeGreaterThan(1);
  });

  it('aligns text correctly', () => {
    const { rerender } = render(<Divider textAlign="left">Text</Divider>);
    let container = screen.getByText('Text').parentElement;
    expect(container).toHaveClass('items-center');

    rerender(<Divider textAlign="center">Text</Divider>);
    container = screen.getByText('Text').parentElement;
    expect(container).toHaveClass('items-center');

    rerender(<Divider textAlign="right">Text</Divider>);
    container = screen.getByText('Text').parentElement;
    expect(container).toHaveClass('items-center');
  });

  it('applies custom className', () => {
    render(<Divider className="custom-divider" />);
    
    expect(screen.getByRole('separator')).toHaveClass('custom-divider');
  });

  it('applies custom textClassName', () => {
    render(<Divider textClassName="custom-text">Text</Divider>);
    
    expect(screen.getByText('Text')).toHaveClass('custom-text');
  });

  it('renders as different elements', () => {
    const { rerender } = render(<Divider as="hr" />);
    expect(screen.getByRole('separator').tagName).toBe('HR');

    rerender(<Divider as="div" />);
    expect(screen.getByRole('separator').tagName).toBe('DIV');
  });

  it('sets aria-orientation', () => {
    const { rerender } = render(<Divider aria-orientation="horizontal" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');

    rerender(<Divider aria-orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('uses orientation as default aria-orientation', () => {
    render(<Divider orientation="vertical" />);
    
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

describe('SectionDivider Component', () => {
  it('renders with icon', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<SectionDivider icon={icon} />);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with text and icon', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<SectionDivider icon={icon}>Section</SectionDivider>);
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Section')).toBeInTheDocument();
  });

  it('applies icon position', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<SectionDivider icon={icon} iconPosition="left" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('applies iconClassName', () => {
    const icon = <span data-testid="icon">★</span>;
    render(<SectionDivider icon={icon} iconClassName="custom-icon" />);
    
    const iconWrapper = screen.getByTestId('icon').parentElement;
    expect(iconWrapper).toHaveClass('custom-icon');
  });

  it('passes through divider props', () => {
    render(<SectionDivider color="primary" thickness="thick" />);
    
    const dividers = screen.getAllByRole('separator');
    expect(dividers[0]).toHaveClass('bg-primary-200');
  });
});

describe('VerticalDivider Component', () => {
  it('always renders as vertical', () => {
    render(<VerticalDivider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('h-full', 'w-px');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies vertical spacing', () => {
    render(<VerticalDivider spacing="md" />);
    
    expect(screen.getByRole('separator')).toHaveClass('mx-4');
  });

  it('applies vertical thickness', () => {
    render(<VerticalDivider thickness="thick" />);
    
    expect(screen.getByRole('separator')).toHaveClass('w-1');
  });
});

describe('GradientDivider Component', () => {
  it('always renders as gradient', () => {
    render(<GradientDivider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('bg-gradient-to-r');
  });

  it('applies gradient color variants', () => {
    const { rerender } = render(<GradientDivider color="default" />);
    expect(screen.getByRole('separator')).toHaveClass('from-transparent', 'via-neutral-200', 'to-transparent');

    rerender(<GradientDivider color="primary" />);
    expect(screen.getByRole('separator')).toHaveClass('from-transparent', 'via-primary-200', 'to-transparent');
  });

  it('works with vertical orientation', () => {
    render(<GradientDivider orientation="vertical" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('h-full', 'w-px', 'bg-gradient-to-r');
  });
});