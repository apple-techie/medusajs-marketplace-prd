import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VariantSelector } from './VariantSelector';

// Mock components
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/RadioButton/RadioButton', () => ({
  RadioButton: ({ checked, onChange, disabled, ...props }: any) => (
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  ),
}));

describe('VariantSelector Component', () => {
  const mockColorGroup = {
    id: 'color',
    name: 'Color',
    type: 'color' as const,
    options: [
      { value: 'red', label: 'Red', color: '#FF0000', available: true },
      { value: 'blue', label: 'Blue', color: '#0000FF', available: true },
      { value: 'green', label: 'Green', color: '#00FF00', available: false },
    ],
  };

  const mockSizeGroup = {
    id: 'size',
    name: 'Size',
    type: 'size' as const,
    options: [
      { value: 'small', label: 'S', available: true, stock: 10 },
      { value: 'medium', label: 'M', available: true, stock: 3 },
      { value: 'large', label: 'L', available: true, stock: 0 },
      { value: 'xlarge', label: 'XL', available: false },
    ],
  };

  const mockImageGroup = {
    id: 'style',
    name: 'Style',
    type: 'image' as const,
    options: [
      { value: 'classic', label: 'Classic', image: 'classic.jpg', available: true },
      { value: 'modern', label: 'Modern', image: 'modern.jpg', available: true },
      { value: 'vintage', label: 'Vintage', available: false },
    ],
  };

  it('renders single group', () => {
    render(<VariantSelector groups={[mockColorGroup]} />);
    
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Green Out of stock')).toBeInTheDocument();
  });

  it('renders multiple groups', () => {
    render(<VariantSelector groups={[mockColorGroup, mockSizeGroup]} />);
    
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('handles color selection', () => {
    const handleChange = jest.fn();
    render(
      <VariantSelector 
        groups={[mockColorGroup]} 
        onChange={handleChange}
      />
    );
    
    const redButton = screen.getByLabelText('Red');
    fireEvent.click(redButton);
    
    expect(handleChange).toHaveBeenCalledWith('color', 'red');
  });

  it('handles size selection', () => {
    const handleChange = jest.fn();
    render(
      <VariantSelector 
        groups={[mockSizeGroup]} 
        onChange={handleChange}
      />
    );
    
    const mediumButton = screen.getByLabelText('M');
    fireEvent.click(mediumButton);
    
    expect(handleChange).toHaveBeenCalledWith('size', 'medium');
  });

  it('shows selected state', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup]} 
        selected={{ color: 'blue' }}
      />
    );
    
    const blueButton = screen.getByLabelText('Blue');
    expect(blueButton).toHaveAttribute('aria-pressed', 'true');
    expect(blueButton).toHaveClass('border-primary-500');
  });

  it('disables unavailable options when disableUnavailable is true', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup]} 
        disableUnavailable
      />
    );
    
    const greenButton = screen.getByLabelText('Green Out of stock');
    expect(greenButton).toBeDisabled();
    expect(greenButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('shows stock information', () => {
    render(
      <VariantSelector 
        groups={[mockSizeGroup]} 
        showStock
      />
    );
    
    expect(screen.getByText('Low stock (3)')).toBeInTheDocument();
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('shows price information', () => {
    const priceGroup = {
      ...mockSizeGroup,
      options: [
        { value: 'small', label: 'S', available: true, price: 29.99 },
        { value: 'medium', label: 'M', available: true, price: 34.99 },
      ],
    };
    
    render(
      <VariantSelector 
        groups={[priceGroup]} 
        showPrice
        variant="inline"
      />
    );
    
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$34.99')).toBeInTheDocument();
  });

  it('renders image variants', () => {
    render(
      <VariantSelector 
        groups={[mockImageGroup]} 
        showImages
      />
    );
    
    const classicImg = screen.getByAltText('Classic');
    expect(classicImg).toHaveAttribute('src', 'classic.jpg');
    
    // Vintage has no image, should show text
    expect(screen.getByText('Vintage')).toBeInTheDocument();
  });

  it('hides images when showImages is false', () => {
    render(
      <VariantSelector 
        groups={[mockImageGroup]} 
        showImages={false}
      />
    );
    
    expect(screen.queryByAltText('Classic')).not.toBeInTheDocument();
    // Should render as regular buttons instead
    expect(screen.getByLabelText('Classic')).toBeInTheDocument();
  });

  it('calls onComplete when all required groups are selected', () => {
    const handleComplete = jest.fn();
    render(
      <VariantSelector 
        groups={[mockColorGroup, mockSizeGroup]} 
        onComplete={handleComplete}
      />
    );
    
    // Select color
    fireEvent.click(screen.getByLabelText('Red'));
    expect(handleComplete).not.toHaveBeenCalled();
    
    // Select size - should trigger onComplete
    fireEvent.click(screen.getByLabelText('S'));
    expect(handleComplete).toHaveBeenCalledWith({
      color: 'red',
      size: 'small',
    });
  });

  it('handles optional groups', () => {
    const optionalGroup = {
      ...mockColorGroup,
      required: false,
    };
    
    const handleComplete = jest.fn();
    render(
      <VariantSelector 
        groups={[optionalGroup, mockSizeGroup]} 
        onComplete={handleComplete}
      />
    );
    
    // Select only required group (size)
    fireEvent.click(screen.getByLabelText('S'));
    expect(handleComplete).toHaveBeenCalledWith({
      size: 'small',
    });
  });

  it('shows required indicator', () => {
    const optionalGroup = {
      ...mockColorGroup,
      required: false,
    };
    
    render(
      <VariantSelector 
        groups={[mockColorGroup, optionalGroup]} 
      />
    );
    
    const requiredLabels = screen.getAllByLabelText('required');
    expect(requiredLabels).toHaveLength(1);
  });

  it('renders compact variant', () => {
    render(
      <VariantSelector 
        groups={[mockSizeGroup]} 
        variant="compact"
      />
    );
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('text-sm');
    });
  });

  it('renders inline variant with radio buttons', () => {
    const textGroup = {
      id: 'material',
      name: 'Material',
      type: 'text' as const,
      options: [
        { value: 'cotton', label: 'Cotton', available: true },
        { value: 'polyester', label: 'Polyester', available: true },
      ],
    };
    
    render(
      <VariantSelector 
        groups={[textGroup]} 
        variant="inline"
      />
    );
    
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);
  });

  it('shows selection summary', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup, mockSizeGroup]} 
        selected={{ color: 'red', size: 'medium' }}
      />
    );
    
    expect(screen.getByText(/Select:.*Red, M/)).toBeInTheDocument();
  });

  it('applies different image sizes', () => {
    const { rerender } = render(
      <VariantSelector 
        groups={[mockImageGroup]} 
        imageSize="sm"
      />
    );
    
    let imageButtons = screen.getAllByRole('button');
    expect(imageButtons[0]).toHaveClass('w-12 h-12');
    
    rerender(
      <VariantSelector 
        groups={[mockImageGroup]} 
        imageSize="lg"
      />
    );
    
    imageButtons = screen.getAllByRole('button');
    expect(imageButtons[0]).toHaveClass('w-20 h-20');
  });

  it('applies different color sizes', () => {
    const { rerender } = render(
      <VariantSelector 
        groups={[mockColorGroup]} 
        colorSize="sm"
      />
    );
    
    let colorButtons = screen.getAllByRole('button');
    expect(colorButtons[0]).toHaveClass('w-8 h-8');
    
    rerender(
      <VariantSelector 
        groups={[mockColorGroup]} 
        colorSize="lg"
      />
    );
    
    colorButtons = screen.getAllByRole('button');
    expect(colorButtons[0]).toHaveClass('w-12 h-12');
  });

  it('renders single group mode', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup]} 
        singleGroup
      />
    );
    
    // Should not show group name in single group mode
    expect(screen.queryByText('Color')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Red')).toBeInTheDocument();
  });

  it('customizes stock labels', () => {
    render(
      <VariantSelector 
        groups={[mockSizeGroup]} 
        showStock
        outOfStockLabel="Sold out"
        lowStockLabel="Only few left"
        lowStockThreshold={5}
      />
    );
    
    expect(screen.getByText('Only few left (3)')).toBeInTheDocument();
    expect(screen.getByText('Sold out')).toBeInTheDocument();
  });

  it('applies custom classes', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup]}
        className="custom-selector"
        groupClassName="custom-group"
        optionClassName="custom-option"
      />
    );
    
    const selector = screen.getByLabelText('Select product variants');
    expect(selector).toHaveClass('custom-selector');
  });

  it('uses aria-label', () => {
    render(
      <VariantSelector 
        groups={[mockColorGroup]}
        aria-label="Choose product options"
      />
    );
    
    expect(screen.getByLabelText('Choose product options')).toBeInTheDocument();
  });
});