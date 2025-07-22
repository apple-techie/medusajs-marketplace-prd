import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider, SectionDivider, VerticalDivider, GradientDivider } from './Divider';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted', 'gradient'],
      description: 'Visual style variant',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'muted', 'strong'],
      description: 'Color variant',
    },
    thickness: {
      control: 'select',
      options: ['thin', 'medium', 'thick'],
      description: 'Line thickness',
    },
    spacing: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spacing around divider',
    },
    textAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment when children present',
    },
    children: {
      control: 'text',
      description: 'Text content to display in divider',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic divider
export const Default: Story = {
  args: {},
};

// Different variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Solid (default)</p>
        <Divider variant="solid" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Dashed</p>
        <Divider variant="dashed" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Dotted</p>
        <Divider variant="dotted" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Gradient</p>
        <Divider variant="gradient" />
      </div>
    </div>
  ),
};

// Different colors
export const Colors: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default</p>
        <Divider color="default" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Primary</p>
        <Divider color="primary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Secondary</p>
        <Divider color="secondary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Muted</p>
        <Divider color="muted" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Strong</p>
        <Divider color="strong" />
      </div>
    </div>
  ),
};

// Different thicknesses
export const Thickness: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Thin (1px)</p>
        <Divider thickness="thin" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Medium (2px)</p>
        <Divider thickness="medium" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Thick (4px)</p>
        <Divider thickness="thick" />
      </div>
    </div>
  ),
};

// Different spacing
export const Spacing: Story = {
  render: () => (
    <div className="max-w-md">
      <p className="text-sm text-neutral-600">Content above</p>
      <Divider spacing="none" />
      <p className="text-sm text-neutral-600">No spacing</p>
      
      <p className="text-sm text-neutral-600 mt-8">Content above</p>
      <Divider spacing="sm" />
      <p className="text-sm text-neutral-600">Small spacing</p>
      
      <p className="text-sm text-neutral-600 mt-8">Content above</p>
      <Divider spacing="md" />
      <p className="text-sm text-neutral-600">Medium spacing (default)</p>
      
      <p className="text-sm text-neutral-600 mt-8">Content above</p>
      <Divider spacing="xl" />
      <p className="text-sm text-neutral-600">Extra large spacing</p>
    </div>
  ),
};

// With text
export const WithText: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Center aligned (default)</p>
        <Divider>Section Title</Divider>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Left aligned</p>
        <Divider textAlign="left">Section Title</Divider>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Right aligned</p>
        <Divider textAlign="right">Section Title</Divider>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">With custom styling</p>
        <Divider 
          textClassName="text-primary-600 font-semibold uppercase text-xs tracking-wider"
        >
          Premium Section
        </Divider>
      </div>
    </div>
  ),
};

// Section dividers with icons
export const SectionDividers: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Icon only</p>
        <SectionDivider icon={<Icon icon="star" size="sm" />} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Icon with text</p>
        <SectionDivider icon={<Icon icon="sparkles" size="sm" />}>
          Featured Products
        </SectionDivider>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Multiple icons</p>
        <SectionDivider 
          icon={
            <div className="flex gap-1">
              <Icon icon="star" size="sm" />
              <Icon icon="star" size="sm" />
              <Icon icon="star" size="sm" />
            </div>
          }
        />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Custom icon styling</p>
        <SectionDivider 
          icon={<Icon icon="heart" size="sm" />}
          iconClassName="text-danger-500"
          color="primary"
        >
          Customer Favorites
        </SectionDivider>
      </div>
    </div>
  ),
};

// Vertical dividers
export const VerticalDividers: Story = {
  render: () => (
    <div className="flex items-center h-20 gap-4">
      <span className="text-sm">Item 1</span>
      <VerticalDivider />
      <span className="text-sm">Item 2</span>
      <VerticalDivider thickness="medium" />
      <span className="text-sm">Item 3</span>
      <VerticalDivider thickness="thick" color="primary" />
      <span className="text-sm">Item 4</span>
      <VerticalDivider variant="dashed" />
      <span className="text-sm">Item 5</span>
    </div>
  ),
};

// Gradient dividers
export const GradientDividers: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Default gradient</p>
        <GradientDivider />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Primary gradient</p>
        <GradientDivider color="primary" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Thick gradient</p>
        <GradientDivider thickness="thick" />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Gradient with text</p>
        <GradientDivider>Gradient Section</GradientDivider>
      </div>
    </div>
  ),
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-12">
      {/* Login form divider */}
      <div className="max-w-sm mx-auto">
        <button className="w-full py-2 border rounded">Sign in with Google</button>
        <Divider className="my-6">or</Divider>
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-3" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
      </div>
      
      {/* Navigation with vertical dividers */}
      <nav className="flex items-center justify-center">
        <a href="#" className="px-4 text-sm">Home</a>
        <VerticalDivider spacing="none" />
        <a href="#" className="px-4 text-sm">Products</a>
        <VerticalDivider spacing="none" />
        <a href="#" className="px-4 text-sm">About</a>
        <VerticalDivider spacing="none" />
        <a href="#" className="px-4 text-sm">Contact</a>
      </nav>
      
      {/* Product sections */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Best Sellers</h2>
          <p>Our most popular products</p>
        </div>
        
        <SectionDivider 
          icon={<Icon icon="fire" size="sm" />}
          color="primary"
          thickness="medium"
        >
          Hot Deals
        </SectionDivider>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Limited Time Offers</h2>
          <p>Don't miss out on these special prices</p>
        </div>
      </div>
      
      {/* Footer divider */}
      <footer>
        <Divider variant="gradient" thickness="medium" />
        <div className="text-center py-8">
          <p className="text-sm text-neutral-600">© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  ),
};

// Pricing tiers
export const PricingTiers: Story = {
  render: () => (
    <div className="flex justify-center gap-8">
      <div className="text-center">
        <h3 className="font-semibold mb-2">Basic</h3>
        <p className="text-3xl font-bold mb-4">$9</p>
        <ul className="space-y-2 text-sm">
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </div>
      
      <VerticalDivider thickness="medium" spacing="none" />
      
      <div className="text-center">
        <h3 className="font-semibold mb-2">Pro</h3>
        <p className="text-3xl font-bold mb-4">$29</p>
        <ul className="space-y-2 text-sm">
          <li>Everything in Basic</li>
          <li>Feature 3</li>
          <li>Feature 4</li>
        </ul>
      </div>
      
      <VerticalDivider thickness="medium" spacing="none" />
      
      <div className="text-center">
        <h3 className="font-semibold mb-2">Enterprise</h3>
        <p className="text-3xl font-bold mb-4">$99</p>
        <ul className="space-y-2 text-sm">
          <li>Everything in Pro</li>
          <li>Feature 5</li>
          <li>Feature 6</li>
        </ul>
      </div>
    </div>
  ),
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 text-white p-8 rounded-lg">
      <div className="space-y-8 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Dark Theme Dividers</h3>
          <Divider />
        </div>
        
        <div>
          <p className="text-neutral-400 mb-2">Different variants</p>
          <Divider variant="dashed" className="mb-4" />
          <Divider variant="dotted" className="mb-4" />
          <Divider variant="gradient" />
        </div>
        
        <SectionDivider 
          icon={<Icon icon="moon" size="sm" />}
          textClassName="text-neutral-300"
        >
          Night Mode
        </SectionDivider>
        
        <div className="flex items-center gap-4">
          <span>Option 1</span>
          <VerticalDivider />
          <span>Option 2</span>
          <VerticalDivider />
          <span>Option 3</span>
        </div>
      </div>
    </div>
  ),
};