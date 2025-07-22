import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { StarRating, StarRatingDisplay } from './StarRating';

const meta = {
  title: 'Atoms/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
    },
    maxRating: {
      control: { type: 'number', min: 1, max: 10 },
    },
    precision: {
      control: 'select',
      options: [0.5, 1],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    valuePosition: {
      control: 'select',
      options: ['left', 'right', 'none'],
    },
    readOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    showValue: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default read-only rating
export const Default: Story = {
  args: {
    rating: 4.5,
  },
};

// Interactive rating
export const Interactive: Story = {
  args: {
    rating: 3,
    readOnly: false,
  },
};

// With value display
export const WithValue: Story = {
  args: {
    rating: 4.2,
    showValue: true,
    valuePosition: 'right',
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Extra Small:</span>
        <StarRating rating={4} size="xs" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Small:</span>
        <StarRating rating={4} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Medium:</span>
        <StarRating rating={4} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Large:</span>
        <StarRating rating={4} size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-sm">Extra Large:</span>
        <StarRating rating={4} size="xl" />
      </div>
    </div>
  ),
};

// Half star precision
export const HalfStars: Story = {
  args: {
    rating: 3.5,
    precision: 0.5,
    showValue: true,
  },
};

// Interactive with state
export const InteractiveWithState: Story = {
  render: () => {
    const [rating, setRating] = useState(3.5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    return (
      <div className="space-y-4">
        <StarRating
          rating={rating}
          readOnly={false}
          precision={0.5}
          onChange={setRating}
          onHover={setHoverRating}
          size="lg"
        />
        <div className="text-sm text-neutral-600">
          <p>Current Rating: {rating}</p>
          <p>Hover Rating: {hoverRating || 'None'}</p>
        </div>
      </div>
    );
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    rating: 3,
    readOnly: false,
    disabled: true,
  },
};

// Custom colors
export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4">
      <StarRating rating={4} filledColor="text-primary-500" emptyColor="text-primary-200" />
      <StarRating rating={4} filledColor="text-green-500" emptyColor="text-green-200" />
      <StarRating rating={4} filledColor="text-red-500" emptyColor="text-red-200" />
      <StarRating rating={4} filledColor="text-purple-500" emptyColor="text-purple-200" />
    </div>
  ),
};

// Different max ratings
export const DifferentMaxRatings: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-1">Out of 3:</p>
        <StarRating rating={2} maxRating={3} showValue />
      </div>
      <div>
        <p className="text-sm mb-1">Out of 5 (default):</p>
        <StarRating rating={3.5} maxRating={5} showValue />
      </div>
      <div>
        <p className="text-sm mb-1">Out of 10:</p>
        <StarRating rating={7.5} maxRating={10} showValue />
      </div>
    </div>
  ),
};

// Value positions
export const ValuePositions: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-1">Value on left:</p>
        <StarRating rating={4.5} showValue valuePosition="left" />
      </div>
      <div>
        <p className="text-sm mb-1">Value on right:</p>
        <StarRating rating={4.5} showValue valuePosition="right" />
      </div>
      <div>
        <p className="text-sm mb-1">No value:</p>
        <StarRating rating={4.5} showValue={false} />
      </div>
    </div>
  ),
};

// StarRatingDisplay examples
export const DisplayVariant: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-1">Basic display:</p>
        <StarRatingDisplay rating={4.5} />
      </div>
      <div>
        <p className="text-sm mb-1">With review count:</p>
        <StarRatingDisplay rating={4.2} count={156} showCount />
      </div>
      <div>
        <p className="text-sm mb-1">Only stars:</p>
        <StarRatingDisplay rating={3.8} showValue={false} />
      </div>
      <div>
        <p className="text-sm mb-1">Large size:</p>
        <StarRatingDisplay rating={4.7} size="lg" count={42} showCount />
      </div>
    </div>
  ),
};

// Product card integration
export const ProductCardExample: Story = {
  render: () => (
    <div className="border rounded-lg p-4 max-w-sm">
      <img 
        src="https://via.placeholder.com/300x200" 
        alt="Product" 
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="font-semibold mb-2">Sample Product</h3>
      <div className="flex items-center justify-between mb-2">
        <StarRatingDisplay rating={4.3} count={89} showCount />
        <span className="text-lg font-bold">$29.99</span>
      </div>
      <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">
        Add to Cart
      </button>
    </div>
  ),
};

// Review form example
export const ReviewForm: Story = {
  render: () => {
    const [ratings, setRatings] = useState({
      overall: 0,
      quality: 0,
      value: 0,
      shipping: 0,
    });

    const updateRating = (category: keyof typeof ratings, rating: number) => {
      setRatings(prev => ({ ...prev, [category]: rating }));
    };

    return (
      <div className="space-y-4 p-6 bg-neutral-50 rounded-lg max-w-md">
        <h3 className="font-semibold text-lg mb-4">Rate this product</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Rating</span>
            <StarRating 
              rating={ratings.overall} 
              readOnly={false}
              onChange={(rating) => updateRating('overall', rating)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Quality</span>
            <StarRating 
              rating={ratings.quality} 
              readOnly={false}
              onChange={(rating) => updateRating('quality', rating)}
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Value for Money</span>
            <StarRating 
              rating={ratings.value} 
              readOnly={false}
              onChange={(rating) => updateRating('value', rating)}
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Shipping</span>
            <StarRating 
              rating={ratings.shipping} 
              readOnly={false}
              onChange={(rating) => updateRating('shipping', rating)}
              size="sm"
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-sm text-neutral-600">
            Average: {((ratings.overall + ratings.quality + ratings.value + ratings.shipping) / 4).toFixed(1)}
          </p>
        </div>
      </div>
    );
  },
};

// Comparison table
export const ComparisonTable: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="font-medium">Product</div>
        <div className="font-medium">Rating</div>
        <div className="font-medium">Price</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center py-2 border-t">
        <div>Product A</div>
        <div><StarRatingDisplay rating={4.5} count={234} showCount /></div>
        <div>$49.99</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center py-2 border-t">
        <div>Product B</div>
        <div><StarRatingDisplay rating={3.8} count={156} showCount /></div>
        <div>$39.99</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 items-center py-2 border-t">
        <div>Product C</div>
        <div><StarRatingDisplay rating={4.9} count={567} showCount /></div>
        <div>$59.99</div>
      </div>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  args: {
    rating: 4.5,
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <div className="[&_.text-neutral-600]:text-neutral-300">
          <Story />
        </div>
      </div>
    ),
  ],
};