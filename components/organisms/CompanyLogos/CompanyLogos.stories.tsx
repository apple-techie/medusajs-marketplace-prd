import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
  CompanyLogos, 
  ShippingPartnerLogos, 
  PaymentPartnerLogos, 
  BrandPartnerLogos,
  defaultShippingLogos,
  defaultPaymentLogos,
  defaultBrandLogos,
  type Logo 
} from './CompanyLogos';

const meta = {
  title: 'Organisms/CompanyLogos',
  component: CompanyLogos,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'grid'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    alignment: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    logoSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    grayscale: {
      control: 'boolean',
    },
    interactive: {
      control: 'boolean',
    },
    showTitle: {
      control: 'boolean',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4, 5, 6, 'auto'],
    },
  },
} satisfies Meta<typeof CompanyLogos>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample logos for stories
const techCompanyLogos: Logo[] = [
  { id: 'google', name: 'Google', src: 'https://www.vectorlogo.zone/logos/google/google-icon.svg' },
  { id: 'microsoft', name: 'Microsoft', src: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg' },
  { id: 'apple', name: 'Apple', src: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg' },
  { id: 'amazon', name: 'Amazon', src: 'https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg' },
  { id: 'meta', name: 'Meta', src: 'https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg' },
  { id: 'netflix', name: 'Netflix', src: 'https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg' },
];

// Default story
export const Default: Story = {
  args: {
    logos: defaultShippingLogos,
  },
};

// Shipping partners
export const ShippingPartners: Story = {
  render: () => <ShippingPartnerLogos showTitle={true} />,
};

// Payment methods
export const PaymentMethods: Story = {
  render: () => <PaymentPartnerLogos showTitle={true} />,
};

// Brand partners
export const BrandPartners: Story = {
  render: () => <BrandPartnerLogos showTitle={true} />,
};

// Tech companies
export const TechCompanies: Story = {
  args: {
    logos: techCompanyLogos,
    showTitle: true,
    title: 'Technology Partners',
    description: 'Powered by industry leaders',
  },
};

// Interactive logos
export const Interactive: Story = {
  args: {
    logos: techCompanyLogos,
    interactive: true,
    showTitle: true,
    title: 'Click to visit',
    description: 'Click on any logo to learn more',
    onLogoClick: (logo) => {
      alert(`Clicked on ${logo.name}`);
    },
  },
};

// Grid layout
export const GridLayout: Story = {
  args: {
    logos: [...defaultPaymentLogos, ...defaultBrandLogos],
    layout: 'grid',
    columns: 4,
    showTitle: true,
    title: 'Our Partners',
    size: 'lg',
  },
};

// Vertical layout
export const VerticalLayout: Story = {
  args: {
    logos: defaultShippingLogos.slice(0, 3),
    layout: 'vertical',
    showTitle: true,
    title: 'Delivery Partners',
    alignment: 'center',
  },
};

// Without grayscale
export const ColoredLogos: Story = {
  args: {
    logos: techCompanyLogos,
    grayscale: false,
    showTitle: true,
    title: 'Full Color Display',
  },
};

// Different sizes
export const LogoSizes: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-sm font-medium mb-4">Small</h3>
        <CompanyLogos logos={defaultPaymentLogos} logoSize="sm" size="sm" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Medium (Default)</h3>
        <CompanyLogos logos={defaultPaymentLogos} logoSize="md" size="md" />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Large</h3>
        <CompanyLogos logos={defaultPaymentLogos} logoSize="lg" size="lg" />
      </div>
    </div>
  ),
};

// Different alignments
export const Alignments: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-4xl">
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Start</h3>
        <CompanyLogos logos={defaultShippingLogos.slice(0, 3)} alignment="start" />
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Center</h3>
        <CompanyLogos logos={defaultShippingLogos.slice(0, 3)} alignment="center" />
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">End</h3>
        <CompanyLogos logos={defaultShippingLogos.slice(0, 3)} alignment="end" />
      </div>
      
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium mb-2">Space Between</h3>
        <CompanyLogos logos={defaultShippingLogos.slice(0, 3)} alignment="between" />
      </div>
    </div>
  ),
};

// Combined sections
export const CombinedSections: Story = {
  render: () => (
    <div className="space-y-16 max-w-6xl">
      <ShippingPartnerLogos showTitle={true} />
      <PaymentPartnerLogos showTitle={true} />
      <BrandPartnerLogos showTitle={true} />
    </div>
  ),
};

// Responsive grid
export const ResponsiveGrid: Story = {
  args: {
    logos: [...techCompanyLogos, ...defaultPaymentLogos],
    layout: 'grid',
    columns: 'auto',
    showTitle: true,
    title: 'Responsive Grid Layout',
    description: 'Adjusts columns based on screen size',
  },
};

// Loading state with placeholder
export const LoadingState: Story = {
  render: () => {
    const placeholderLogos: Logo[] = Array.from({ length: 6 }, (_, i) => ({
      id: `placeholder-${i}`,
      name: `Loading ${i + 1}`,
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="50"%3E%3Crect width="100" height="50" fill="%23e5e5e5"/%3E%3C/svg%3E',
    }));

    return (
      <div className="animate-pulse">
        <CompanyLogos 
          logos={placeholderLogos} 
          grayscale={false}
          showTitle={true}
          title="Loading partners..."
        />
      </div>
    );
  },
};

// Dark background
export const OnDarkBackground: Story = {
  args: {
    logos: defaultShippingLogos,
    showTitle: true,
    title: 'Trusted Delivery Partners',
    grayscale: false,
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900 p-8 rounded-lg">
        <div className="[&_h2]:text-white [&_p]:text-neutral-300">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    logos: techCompanyLogos,
    showTitle: true,
    title: 'Premium Partners',
    className: 'border-2 border-primary-200 rounded-lg p-6 bg-primary-50',
    logoClassName: 'border border-neutral-200 rounded-lg p-2 bg-white shadow-sm',
    containerClassName: 'max-w-4xl mx-auto',
  },
};

// Footer integration example
export const FooterIntegration: Story = {
  render: () => (
    <footer className="bg-white border-t border-neutral-200 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Trusted by Leading Companies
          </h2>
        </div>
        <CompanyLogos 
          logos={[...defaultShippingLogos, ...defaultPaymentLogos]}
          grayscale={true}
          interactive={false}
          alignment="evenly"
        />
      </div>
    </footer>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Hero section integration
export const HeroIntegration: Story = {
  render: () => (
    <section className="bg-gradient-to-b from-primary-50 to-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Welcome to Neo Mart
        </h1>
        <p className="text-xl text-neutral-600 mb-12">
          Your trusted marketplace with reliable partners
        </p>
        <CompanyLogos 
          logos={techCompanyLogos}
          grayscale={false}
          size="lg"
          logoSize="lg"
        />
      </div>
    </section>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};