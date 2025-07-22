import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating, StarRatingDisplay } from './StarRating';

describe('StarRating Component', () => {
  it('renders correct number of stars', () => {
    render(<StarRating rating={3} maxRating={5} />);
    
    const stars = screen.getAllByRole('img');
    expect(stars).toHaveLength(5);
  });

  it('displays correct rating', () => {
    render(<StarRating rating={3.5} showValue valuePosition="right" />);
    
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('fills correct number of stars', () => {
    const { container } = render(<StarRating rating={3} filledColor="text-yellow-400" />);
    
    const filledStars = container.querySelectorAll('.text-yellow-400');
    expect(filledStars.length).toBe(3);
  });

  it('handles half stars with precision 0.5', () => {
    const { container } = render(
      <StarRating rating={3.5} precision={0.5} filledColor="text-yellow-400" />
    );
    
    const stars = container.querySelectorAll('[class*="relative"]');
    // The 4th star should have both filled and empty icons for half-fill effect
    const fourthStar = stars[3];
    expect(fourthStar.querySelectorAll('svg')).toHaveLength(2);
  });

  it('handles click events when not readOnly', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    const { container } = render(
      <StarRating rating={2} readOnly={false} onChange={handleChange} />
    );
    
    const thirdStar = container.querySelectorAll('[class*="relative"]')[2];
    await user.click(thirdStar);
    
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('does not handle clicks when readOnly', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    const { container } = render(
      <StarRating rating={2} readOnly={true} onChange={handleChange} />
    );
    
    const thirdStar = container.querySelectorAll('[class*="relative"]')[2];
    await user.click(thirdStar);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not handle clicks when disabled', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    const { container } = render(
      <StarRating rating={2} readOnly={false} disabled={true} onChange={handleChange} />
    );
    
    const thirdStar = container.querySelectorAll('[class*="relative"]')[2];
    await user.click(thirdStar);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('handles hover events', async () => {
    const handleHover = jest.fn();
    const { container } = render(
      <StarRating rating={2} readOnly={false} onHover={handleHover} />
    );
    
    const thirdStar = container.querySelectorAll('[class*="relative"]')[2];
    fireEvent.mouseMove(thirdStar, { clientX: 50 });
    
    expect(handleHover).toHaveBeenCalled();
  });

  it('resets hover on mouse leave', () => {
    const handleHover = jest.fn();
    const { container } = render(
      <StarRating rating={2} readOnly={false} onHover={handleHover} />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    fireEvent.mouseLeave(wrapper);
    
    expect(handleHover).toHaveBeenCalledWith(null);
  });

  it('handles keyboard navigation', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <StarRating rating={3} readOnly={false} onChange={handleChange} />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    
    // Arrow right
    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith(4);
    
    // Arrow left
    fireEvent.keyDown(wrapper, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith(2);
    
    // Home
    fireEvent.keyDown(wrapper, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith(1);
    
    // End
    fireEvent.keyDown(wrapper, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('respects maxRating in keyboard navigation', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <StarRating rating={5} maxRating={5} readOnly={false} onChange={handleChange} />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    
    // Try to go beyond max
    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows value on the left when specified', () => {
    render(<StarRating rating={4.5} showValue valuePosition="left" />);
    
    const value = screen.getByText('4.5');
    const stars = screen.getAllByRole('img');
    
    // Value should come before the first star in the DOM
    expect(value.compareDocumentPosition(stars[0])).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('hides value when showValue is false', () => {
    render(<StarRating rating={4.5} showValue={false} />);
    
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { container } = render(<StarRating rating={3} size="lg" />);
    
    expect(container.firstChild).toHaveClass('[&_svg]:w-6', '[&_svg]:h-6');
  });

  it('applies custom class names', () => {
    const { container } = render(
      <StarRating 
        rating={3} 
        className="custom-wrapper"
        starClassName="custom-star"
        valueClassName="custom-value"
        showValue
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-wrapper');
    expect(container.querySelector('.custom-star')).toBeInTheDocument();
    expect(container.querySelector('.custom-value')).toBeInTheDocument();
  });

  it('uses custom icons', () => {
    const { container } = render(
      <StarRating 
        rating={2.5} 
        emptyIcon="starOutline"
        filledIcon="starFilled"
        halfFilledIcon="starHalf"
      />
    );
    
    // Would need to verify the actual icon components are rendered
    // This would depend on how the Icon component works
    expect(container.querySelectorAll('svg')).toHaveLength(5);
  });

  it('has proper ARIA attributes', () => {
    const { container } = render(
      <StarRating rating={3} readOnly={false} aria-label="Product rating" />
    );
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('role', 'radiogroup');
    expect(wrapper).toHaveAttribute('aria-label', 'Product rating');
    expect(wrapper).toHaveAttribute('tabindex', '0');
  });

  it('syncs with external rating prop changes', () => {
    const { rerender } = render(<StarRating rating={2} showValue />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    
    rerender(<StarRating rating={4} showValue />);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});

describe('StarRatingDisplay Component', () => {
  it('renders rating with default props', () => {
    render(<StarRatingDisplay rating={4.5} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('shows review count when provided', () => {
    render(<StarRatingDisplay rating={4.5} count={123} showCount />);
    
    expect(screen.getByText('4.5 (123)')).toBeInTheDocument();
  });

  it('hides value when showValue is false', () => {
    render(<StarRatingDisplay rating={4.5} showValue={false} />);
    
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('shows only count when showValue is false', () => {
    render(<StarRatingDisplay rating={4.5} showValue={false} count={50} showCount />);
    
    expect(screen.getByText('(50)')).toBeInTheDocument();
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
  });

  it('is always read-only', async () => {
    const user = userEvent.setup();
    const { container } = render(<StarRatingDisplay rating={3} />);
    
    const star = container.querySelector('[class*="relative"]');
    await user.click(star!);
    
    // Rating should not change
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });
});