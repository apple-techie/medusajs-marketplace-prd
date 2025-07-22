import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ShoppingCart, ArrowRight, Heart, Download, Plus } from 'lucide-react';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'primaryDark', 'ghost', 'ghostDark', 'outline', 'outlineDark', 'outlineNeutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary buttons
export const Primary: Story = {
  args: {
    children: 'Button Base',
    variant: 'primary',
  },
};

export const PrimaryDark: Story = {
  args: {
    children: 'Button Base',
    variant: 'primaryDark',
  },
};

// With Icons
export const WithLeftIcon: Story = {
  args: {
    children: 'Button Base',
    leftIcon: <ShoppingCart className="h-5 w-5" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Button Base',
    rightIcon: <ArrowRight className="h-5 w-5" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Button Base',
    leftIcon: <ShoppingCart className="h-5 w-5" />,
    rightIcon: <ArrowRight className="h-5 w-5" />,
  },
};

// Ghost variants
export const Ghost: Story = {
  args: {
    children: 'Button Base',
    variant: 'ghost',
  },
};

export const GhostWithIcon: Story = {
  args: {
    children: 'Button Base',
    variant: 'ghost',
    leftIcon: <Heart className="h-5 w-5" />,
  },
};

// Outline variants
export const Outline: Story = {
  args: {
    children: 'Button Base',
    variant: 'outline',
  },
};

export const OutlineDark: Story = {
  args: {
    children: 'Button Base',
    variant: 'outlineDark',
  },
};

export const OutlineNeutral: Story = {
  args: {
    children: 'Button Base',
    variant: 'outlineNeutral',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Button Base',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Button Base',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Button Base',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    children: 'Button Base',
    size: 'xl',
  },
};

// States
export const Disabled: Story = {
  args: {
    children: 'Button Base',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Button Base',
    isLoading: true,
  },
};

export const LoadingWithText: Story = {
  args: {
    children: 'Button Base',
    isLoading: true,
    loadingText: 'Processing...',
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    children: 'Button Base',
    fullWidth: true,
  },
};

// Use cases
export const AddToCart: Story = {
  args: {
    children: 'Add to Cart',
    leftIcon: <ShoppingCart className="h-5 w-5" />,
  },
};

export const Download: Story = {
  args: {
    children: 'Download Report',
    variant: 'outline',
    leftIcon: <Download className="h-5 w-5" />,
  },
};

export const CreateNew: Story = {
  args: {
    children: 'Create Product',
    variant: 'primary',
    leftIcon: <Plus className="h-5 w-5" />,
  },
};