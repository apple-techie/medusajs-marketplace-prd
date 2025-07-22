import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingDisplay, RatingSummary, ReviewStats } from './RatingDisplay';

// Mock the atom components
jest.mock('../../atoms/StarRating/StarRating', () => ({
  StarRating: ({ rating, maxRating, size }: any) => (
    <div data-testid="star-rating" data-rating={rating} data-max={maxRating} data-size={size}>
      {rating} stars
    </div>
  ),
}));

jest.mock('../../atoms/ProgressBar/ProgressBar', () => ({
  ProgressBar: ({ value, variant }: any) => (
    <div data-testid="progress-bar" data-value={value} data-variant={variant}>
      {value}%
    </div>
  ),
}));

describe('RatingDisplay Component', () => {
  const defaultProps = {
    rating: 4.5,
    reviewCount: 123,
  };

  it('renders default variant with stars and review count', () => {
    render(<RatingDisplay {...defaultProps} />);
    
    expect(screen.getByTestId('star-rating')).toHaveAttribute('data-rating', '4.5');
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('123 reviews')).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<RatingDisplay {...defaultProps} variant="compact" />);
    
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('renders inline variant', () => {
    render(<RatingDisplay {...defaultProps} variant="inline" />);
    
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(123 reviews)')).toBeInTheDocument();
  });

  it('renders detailed variant with distribution', () => {
    const distribution = {
      5: 80,
      4: 30,
      3: 10,
      2: 2,
      1: 1,
    };
    
    render(
      <RatingDisplay 
        {...defaultProps}
        variant="detailed"
        showDistribution
        distribution={distribution}
      />
    );
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('123 reviews')).toBeInTheDocument();
    
    // Check distribution bars
    const progressBars = screen.getAllByTestId('progress-bar');
    expect(progressBars).toHaveLength(5);
  });

  it('formats large review counts', () => {
    const { rerender } = render(<RatingDisplay rating={4.5} reviewCount={1234} />);
    expect(screen.getByText('1.2K reviews')).toBeInTheDocument();
    
    rerender(<RatingDisplay rating={4.5} reviewCount={1234567} />);
    expect(screen.getByText('1.2M reviews')).toBeInTheDocument();
  });

  it('hides elements based on props', () => {
    render(
      <RatingDisplay 
        rating={4.5}
        reviewCount={123}
        showAverage={false}
        showReviewCount={false}
        showStars={false}
      />
    );
    
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    expect(screen.queryByText(/reviews/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('star-rating')).not.toBeInTheDocument();
  });

  it('handles review click', () => {
    const handleClick = jest.fn();
    render(
      <RatingDisplay 
        {...defaultProps}
        onReviewClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('123 reviews'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('disables review button when no click handler', () => {
    render(<RatingDisplay {...defaultProps} />);
    
    const reviewButton = screen.getByText('123 reviews');
    expect(reviewButton).toBeDisabled();
  });

  it('applies size variants', () => {
    const { rerender } = render(<RatingDisplay {...defaultProps} size="xs" />);
    expect(screen.getByTestId('star-rating')).toHaveAttribute('data-size', 'xs');
    
    rerender(<RatingDisplay {...defaultProps} size="lg" />);
    expect(screen.getByTestId('star-rating')).toHaveAttribute('data-size', 'lg');
  });

  it('applies custom class names', () => {
    render(
      <RatingDisplay 
        {...defaultProps}
        className="custom-container"
        ratingClassName="custom-rating"
        reviewCountClassName="custom-review"
      />
    );
    
    expect(screen.getByLabelText(/4.5 out of 5 stars/)).toHaveClass('custom-container');
    expect(screen.getByText('4.5')).toHaveClass('custom-rating');
    expect(screen.getByText('123 reviews')).toHaveClass('custom-review');
  });

  it('uses custom review link text', () => {
    render(
      <RatingDisplay 
        {...defaultProps}
        reviewLinkText="customer reviews"
      />
    );
    
    expect(screen.getByText('123 customer reviews')).toBeInTheDocument();
  });

  it('calculates total reviews from distribution', () => {
    const distribution = {
      5: 50,
      4: 30,
      3: 15,
      2: 3,
      1: 2,
    };
    
    render(
      <RatingDisplay 
        rating={4.5}
        distribution={distribution}
        showDistribution
      />
    );
    
    // Total should be 100 (50+30+15+3+2)
    expect(screen.getByText('100 reviews')).toBeInTheDocument();
  });

  it('applies custom aria-label', () => {
    render(
      <RatingDisplay 
        {...defaultProps}
        aria-label="Product rating"
      />
    );
    
    expect(screen.getByLabelText('Product rating')).toBeInTheDocument();
  });
});

describe('RatingSummary Component', () => {
  const mockRatings = [
    { label: 'Quality', rating: 4.5 },
    { label: 'Value', rating: 4.2 },
    { label: 'Comfort', rating: 4.8 },
  ];

  it('renders multiple rating categories', () => {
    render(<RatingSummary ratings={mockRatings} />);
    
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Comfort')).toBeInTheDocument();
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('shows overall rating when provided', () => {
    render(<RatingSummary ratings={mockRatings} overallRating={4.5} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Overall Rating')).toBeInTheDocument();
  });

  it('shows progress bars by default', () => {
    render(<RatingSummary ratings={mockRatings} />);
    
    const progressBars = screen.getAllByTestId('progress-bar');
    expect(progressBars).toHaveLength(3);
  });

  it('hides progress bars when showBars is false', () => {
    render(<RatingSummary ratings={mockRatings} showBars={false} />);
    
    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(<RatingSummary ratings={mockRatings} size="sm" />);
    expect(screen.getByText('Quality')).toHaveClass('text-sm');
    
    rerender(<RatingSummary ratings={mockRatings} size="lg" />);
    expect(screen.getByText('Quality')).toHaveClass('text-lg');
  });

  it('uses custom maxRating for calculations', () => {
    const ratingsWithMax = [
      { label: 'Score', rating: 8, maxRating: 10 },
    ];
    
    render(<RatingSummary ratings={ratingsWithMax} />);
    
    // Should show 80% on progress bar (8/10)
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '80');
  });
});

describe('ReviewStats Component', () => {
  const baseProps = {
    averageRating: 4.5,
    totalReviews: 1234,
  };

  it('renders basic stats', () => {
    render(<ReviewStats {...baseProps} />);
    
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('/ 5')).toBeInTheDocument();
    
    expect(screen.getByText('Total Reviews')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders optional stats when provided', () => {
    render(
      <ReviewStats 
        {...baseProps}
        recommendationRate={92}
        verifiedPurchases={1000}
        helpfulVotes={567}
      />
    );
    
    expect(screen.getByText('Would Recommend')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
    
    expect(screen.getByText('Verified Purchases')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    
    expect(screen.getByText('Helpful Votes')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('applies size variants', () => {
    const { rerender } = render(<ReviewStats {...baseProps} size="sm" />);
    expect(screen.getByText('4.5').parentElement).toHaveClass('text-lg');
    
    rerender(<ReviewStats {...baseProps} size="lg" />);
    expect(screen.getByText('4.5').parentElement).toHaveClass('text-3xl');
  });

  it('formats large numbers with commas', () => {
    render(
      <ReviewStats 
        averageRating={4.5}
        totalReviews={1234567}
        verifiedPurchases={987654}
        helpfulVotes={123456}
      />
    );
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
    expect(screen.getByText('123,456')).toBeInTheDocument();
  });
});