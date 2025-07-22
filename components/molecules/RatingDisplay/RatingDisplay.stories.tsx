import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { RatingDisplay, RatingSummary, ReviewStats } from './RatingDisplay';

const meta = {
  title: 'Molecules/RatingDisplay',
  component: RatingDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Rating value',
    },
    reviewCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of reviews',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'inline'],
      description: 'Display variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Size variant',
    },
    showAverage: {
      control: 'boolean',
      description: 'Show average rating number',
    },
    showReviewCount: {
      control: 'boolean',
      description: 'Show review count',
    },
    showStars: {
      control: 'boolean',
      description: 'Show star rating',
    },
    showDistribution: {
      control: 'boolean',
      description: 'Show rating distribution',
    },
  },
} satisfies Meta<typeof RatingDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic rating display
export const Default: Story = {
  args: {
    rating: 4.5,
    reviewCount: 234,
  },
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default</p>
        <RatingDisplay rating={4.5} reviewCount={234} variant="default" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Compact</p>
        <RatingDisplay rating={4.5} reviewCount={234} variant="compact" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Inline</p>
        <RatingDisplay rating={4.5} reviewCount={234} variant="inline" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Detailed</p>
        <RatingDisplay 
          rating={4.3}
          variant="detailed"
          showDistribution
          distribution={{
            5: 156,
            4: 89,
            3: 23,
            2: 8,
            1: 4,
          }}
        />
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Extra Small</p>
        <RatingDisplay rating={4.5} reviewCount={234} size="xs" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Small</p>
        <RatingDisplay rating={4.5} reviewCount={234} size="sm" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Medium</p>
        <RatingDisplay rating={4.5} reviewCount={234} size="md" />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Large</p>
        <RatingDisplay rating={4.5} reviewCount={234} size="lg" />
      </div>
    </div>
  ),
};

// With distribution
export const WithDistribution: Story = {
  args: {
    rating: 4.3,
    variant: 'detailed',
    showDistribution: true,
    distribution: {
      5: 156,
      4: 89,
      3: 23,
      2: 8,
      1: 4,
    },
  },
};

// Large numbers
export const LargeNumbers: Story = {
  render: () => (
    <div className="space-y-4">
      <RatingDisplay rating={4.8} reviewCount={1234} />
      <RatingDisplay rating={4.2} reviewCount={12345} />
      <RatingDisplay rating={4.6} reviewCount={123456} />
      <RatingDisplay rating={4.9} reviewCount={1234567} />
    </div>
  ),
};

// Interactive
export const Interactive: Story = {
  render: () => {
    const handleReviewClick = () => {
      alert('Reviews clicked!');
    };
    
    return (
      <div className="space-y-4">
        <RatingDisplay 
          rating={4.5} 
          reviewCount={234}
          onReviewClick={handleReviewClick}
        />
        
        <RatingDisplay 
          rating={4.5} 
          reviewCount={234}
          variant="inline"
          onReviewClick={handleReviewClick}
        />
        
        <RatingDisplay 
          rating={4.3}
          variant="detailed"
          showDistribution
          distribution={{
            5: 156,
            4: 89,
            3: 23,
            2: 8,
            1: 4,
          }}
          onReviewClick={handleReviewClick}
        />
      </div>
    );
  },
};

// Custom display options
export const CustomDisplay: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Stars only</p>
        <RatingDisplay 
          rating={4.5} 
          reviewCount={234}
          showAverage={false}
          showReviewCount={false}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">No stars</p>
        <RatingDisplay 
          rating={4.5} 
          reviewCount={234}
          showStars={false}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">No reviews</p>
        <RatingDisplay 
          rating={4.5} 
          showReviewCount={false}
        />
      </div>
      
      <div>
        <p className="text-sm text-neutral-600 mb-2">Custom review text</p>
        <RatingDisplay 
          rating={4.5} 
          reviewCount={234}
          reviewLinkText="customer reviews"
        />
      </div>
    </div>
  ),
};

// Rating summary
export const RatingSummaryExample: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Rating Summary</h3>
        <RatingSummary
          overallRating={4.5}
          ratings={[
            { label: 'Quality', rating: 4.7 },
            { label: 'Value for Money', rating: 4.2 },
            { label: 'Comfort', rating: 4.8 },
            { label: 'Design', rating: 4.6 },
            { label: 'Durability', rating: 4.3 },
          ]}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Without Bars</h3>
        <RatingSummary
          ratings={[
            { label: 'Customer Service', rating: 4.9 },
            { label: 'Shipping Speed', rating: 4.5 },
            { label: 'Product Quality', rating: 4.7 },
          ]}
          showBars={false}
          size="lg"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Different Scale</h3>
        <RatingSummary
          ratings={[
            { label: 'Performance', rating: 8.5, maxRating: 10 },
            { label: 'Battery Life', rating: 7.8, maxRating: 10 },
            { label: 'Build Quality', rating: 9.2, maxRating: 10 },
          ]}
        />
      </div>
    </div>
  ),
};

// Review statistics
export const ReviewStatsExample: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Stats</h3>
        <ReviewStats
          averageRating={4.5}
          totalReviews={1234}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Full Stats</h3>
        <ReviewStats
          averageRating={4.7}
          totalReviews={5678}
          recommendationRate={92}
          verifiedPurchases={4523}
          helpfulVotes={1234}
          size="lg"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Stats</h3>
        <ReviewStats
          averageRating={4.2}
          totalReviews={234}
          recommendationRate={85}
          size="sm"
        />
      </div>
    </div>
  ),
};

// Real-world examples
export const ProductCard: Story = {
  render: () => (
    <div className="border rounded-lg p-4 max-w-sm">
      <img 
        src="https://via.placeholder.com/300x200" 
        alt="Product" 
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold mb-2">Premium Wireless Headphones</h3>
      
      <RatingDisplay 
        rating={4.5} 
        reviewCount={234}
        variant="inline"
        size="sm"
        onReviewClick={() => console.log('Reviews clicked')}
      />
      
      <div className="mt-3 text-2xl font-bold">$79.99</div>
    </div>
  ),
};

export const ProductPage: Story = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        
        <RatingDisplay 
          rating={4.3}
          variant="detailed"
          showDistribution
          distribution={{
            5: 342,
            4: 156,
            3: 67,
            2: 23,
            1: 12,
          }}
          onReviewClick={() => console.log('Filter by rating')}
        />
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
        <RatingSummary
          ratings={[
            { label: 'Quality', rating: 4.7 },
            { label: 'Value', rating: 4.2 },
            { label: 'Comfort', rating: 4.8 },
            { label: 'Design', rating: 4.6 },
          ]}
        />
      </div>
      
      <div className="border-t pt-6">
        <ReviewStats
          averageRating={4.3}
          totalReviews={600}
          recommendationRate={88}
          verifiedPurchases={523}
          helpfulVotes={1847}
        />
      </div>
    </div>
  ),
};

export const ComparisonTable: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2">Basic Model</h4>
          <RatingDisplay 
            rating={4.2} 
            reviewCount={123}
            variant="compact"
            size="sm"
          />
        </div>
        
        <div className="border rounded p-4 ring-2 ring-primary-500">
          <h4 className="font-semibold mb-2">Pro Model</h4>
          <RatingDisplay 
            rating={4.7} 
            reviewCount={456}
            variant="compact"
            size="sm"
          />
        </div>
        
        <div className="border rounded p-4">
          <h4 className="font-semibold mb-2">Premium Model</h4>
          <RatingDisplay 
            rating={4.9} 
            reviewCount={89}
            variant="compact"
            size="sm"
          />
        </div>
      </div>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Dark Theme Ratings</h3>
          
          <div className="space-y-4">
            <RatingDisplay rating={4.5} reviewCount={234} />
            <RatingDisplay rating={4.5} reviewCount={234} variant="compact" />
            <RatingDisplay rating={4.5} reviewCount={234} variant="inline" />
          </div>
        </div>
        
        <div>
          <RatingDisplay 
            rating={4.3}
            variant="detailed"
            showDistribution
            distribution={{
              5: 156,
              4: 89,
              3: 23,
              2: 8,
              1: 4,
            }}
          />
        </div>
        
        <div className="border-t border-neutral-700 pt-6">
          <ReviewStats
            averageRating={4.5}
            totalReviews={1234}
            recommendationRate={92}
            verifiedPurchases={1000}
          />
        </div>
      </div>
    </div>
  ),
};