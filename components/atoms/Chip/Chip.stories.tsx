import type { Meta, StoryObj } from '@storybook/react';
import { Chip, ChipGroup, ChipIcons } from './Chip';

const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selected: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic chips
export const Default: Story = {
  args: {
    children: 'Default Chip',
  },
};

export const Filled: Story = {
  args: {
    children: 'Filled Chip',
    variant: 'filled',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Add Item',
    leftIcon: <ChipIcons.Plus />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Tagged',
    rightIcon: <ChipIcons.Tag />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Add Filter',
    leftIcon: <ChipIcons.Plus />,
    rightIcon: <ChipIcons.Filter />,
  },
};

export const Removable: Story = {
  args: {
    children: 'Removable',
    onRemove: () => console.log('Remove clicked'),
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected',
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Clickable: Story = {
  args: {
    children: 'Clickable',
    onClick: () => console.log('Chip clicked'),
  },
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

// Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip variant="default">Default</Chip>
      <Chip variant="filled">Filled</Chip>
      <Chip variant="primary">Primary</Chip>
      <Chip variant="secondary">Secondary</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="danger">Danger</Chip>
    </div>
  ),
};

// With icons in different variants
export const VariantsWithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip variant="primary" leftIcon={<ChipIcons.Plus />}>
        Add Item
      </Chip>
      <Chip variant="secondary" leftIcon={<ChipIcons.Filter />}>
        Filter
      </Chip>
      <Chip variant="success" leftIcon={<ChipIcons.Check />}>
        Approved
      </Chip>
      <Chip variant="warning" leftIcon={<ChipIcons.Tag />}>
        Tagged
      </Chip>
      <Chip variant="danger" onRemove={() => {}}>
        Remove Me
      </Chip>
    </div>
  ),
};

// Chip groups
export const BasicGroup: Story = {
  render: () => (
    <ChipGroup>
      <Chip>React</Chip>
      <Chip>TypeScript</Chip>
      <Chip>Next.js</Chip>
      <Chip>Tailwind</Chip>
    </ChipGroup>
  ),
};

export const GroupWithSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-neutral-600 mb-2">Tight spacing</p>
        <ChipGroup spacing="tight">
          <Chip>React</Chip>
          <Chip>Vue</Chip>
          <Chip>Angular</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Normal spacing</p>
        <ChipGroup spacing="normal">
          <Chip>React</Chip>
          <Chip>Vue</Chip>
          <Chip>Angular</Chip>
        </ChipGroup>
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Loose spacing</p>
        <ChipGroup spacing="loose">
          <Chip>React</Chip>
          <Chip>Vue</Chip>
          <Chip>Angular</Chip>
        </ChipGroup>
      </div>
    </div>
  ),
};

// E-commerce use cases
export const ProductTags: Story = {
  render: () => (
    <ChipGroup>
      <Chip variant="primary" leftIcon={<ChipIcons.Tag />}>
        New Arrival
      </Chip>
      <Chip variant="success">In Stock</Chip>
      <Chip variant="warning">Limited Edition</Chip>
      <Chip variant="danger">Sale</Chip>
    </ChipGroup>
  ),
};

export const FilterChips: Story = {
  render: () => {
    const filters = ['Electronics', 'Under $50', 'Free Shipping', '4+ Stars'];
    return (
      <ChipGroup>
        {filters.map((filter) => (
          <Chip 
            key={filter}
            onRemove={() => console.log(`Remove filter: ${filter}`)}
          >
            {filter}
          </Chip>
        ))}
      </ChipGroup>
    );
  },
};

export const CategorySelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string[]>(['electronics']);
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];
    
    const toggleCategory = (category: string) => {
      setSelected((prev) =>
        prev.includes(category.toLowerCase())
          ? prev.filter((c) => c !== category.toLowerCase())
          : [...prev, category.toLowerCase()]
      );
    };
    
    return (
      <ChipGroup>
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selected.includes(category.toLowerCase())}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </Chip>
        ))}
      </ChipGroup>
    );
  },
};

export const StatusChips: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Order Status</h3>
        <ChipGroup>
          <Chip variant="secondary">Pending</Chip>
          <Chip variant="primary">Processing</Chip>
          <Chip variant="success">Shipped</Chip>
          <Chip variant="success">Delivered</Chip>
          <Chip variant="danger">Cancelled</Chip>
        </ChipGroup>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Payment Status</h3>
        <ChipGroup>
          <Chip variant="warning">Pending</Chip>
          <Chip variant="success">Paid</Chip>
          <Chip variant="danger">Failed</Chip>
          <Chip variant="secondary">Refunded</Chip>
        </ChipGroup>
      </div>
    </div>
  ),
};

export const VendorBadges: Story = {
  render: () => (
    <ChipGroup>
      <Chip variant="filled" leftIcon={<ChipIcons.Check />}>
        Verified Vendor
      </Chip>
      <Chip variant="primary">
        Gold Tier
      </Chip>
      <Chip variant="secondary">
        Shop Partner
      </Chip>
      <Chip>
        4.8★ Rating
      </Chip>
    </ChipGroup>
  ),
};

export const InteractiveExample: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Next.js']);
    const [inputValue, setInputValue] = React.useState('');
    
    const addTag = () => {
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
        setInputValue('');
      }
    };
    
    const removeTag = (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    };
    
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="Add a tag..."
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button
            onClick={addTag}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
          >
            Add
          </button>
        </div>
        <ChipGroup>
          {tags.map((tag) => (
            <Chip key={tag} onRemove={() => removeTag(tag)}>
              {tag}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    );
  },
};

// Complex examples
export const MixedStates: Story = {
  render: () => (
    <ChipGroup>
      <Chip>Default</Chip>
      <Chip selected>Selected</Chip>
      <Chip disabled>Disabled</Chip>
      <Chip variant="primary" leftIcon={<ChipIcons.Plus />}>
        With Icon
      </Chip>
      <Chip variant="filled" onRemove={() => {}}>
        Removable
      </Chip>
      <Chip variant="success" selected onRemove={() => {}}>
        Selected & Removable
      </Chip>
    </ChipGroup>
  ),
};

export const LoadingExample: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);
    
    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    
    return (
      <Chip 
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Click me'}
      </Chip>
    );
  },
};