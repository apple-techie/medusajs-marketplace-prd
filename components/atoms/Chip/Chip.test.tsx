import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip, ChipGroup, ChipIcons } from './Chip';

describe('Chip Component', () => {
  it('renders with text content', () => {
    render(<Chip>Test Chip</Chip>);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    const { container } = render(<Chip>Default</Chip>);
    const chip = container.firstChild;
    expect(chip).toHaveClass('border', 'border-neutral-300', 'bg-white');
    expect(chip).toHaveClass('px-3', 'py-2', 'text-sm');
  });

  it('applies filled variant', () => {
    const { container } = render(<Chip variant="filled">Filled</Chip>);
    const chip = container.firstChild;
    expect(chip).toHaveClass('bg-neutral-900', 'text-white');
  });

  it('applies primary variant', () => {
    const { container } = render(<Chip variant="primary">Primary</Chip>);
    const chip = container.firstChild;
    expect(chip).toHaveClass('border-primary-300', 'bg-primary-50', 'text-primary-700');
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(<Chip size="sm">Small</Chip>);
    expect(smContainer.firstChild).toHaveClass('px-2', 'py-1', 'text-xs');

    const { container: lgContainer } = render(<Chip size="lg">Large</Chip>);
    expect(lgContainer.firstChild).toHaveClass('px-4', 'py-2.5', 'text-base');
  });

  it('renders with left icon', () => {
    const { container } = render(
      <Chip leftIcon={<ChipIcons.Plus />}>With Icon</Chip>
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const { container } = render(
      <Chip rightIcon={<ChipIcons.Tag />}>With Icon</Chip>
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders with both icons', () => {
    const { container } = render(
      <Chip 
        leftIcon={<ChipIcons.Plus />} 
        rightIcon={<ChipIcons.Check />}
      >
        Both Icons
      </Chip>
    );
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <Chip onClick={handleClick}>
        Clickable
      </Chip>
    );
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders remove button when onRemove is provided', () => {
    const handleRemove = jest.fn();
    render(
      <Chip onRemove={handleRemove}>
        Removable
      </Chip>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove chip' });
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('remove button overrides right icon', () => {
    const { container } = render(
      <Chip 
        rightIcon={<ChipIcons.Check />} 
        onRemove={() => {}}
      >
        Removable
      </Chip>
    );
    
    // Should only have the X icon button, not the check icon
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Remove chip' })).toBeInTheDocument();
  });

  it('stops propagation on remove click', () => {
    const handleClick = jest.fn();
    const handleRemove = jest.fn();
    
    render(
      <Chip onClick={handleClick} onRemove={handleRemove}>
        Removable
      </Chip>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove chip' });
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies selected state', () => {
    const { container } = render(<Chip selected>Selected</Chip>);
    const chip = container.firstChild;
    expect(chip).toHaveClass('ring-2', 'ring-primary-500');
    expect(chip).toHaveAttribute('aria-selected', 'true');
  });

  it('applies disabled state', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <Chip disabled onClick={handleClick}>
        Disabled
      </Chip>
    );
    
    const chip = container.firstChild;
    expect(chip).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(chip).toHaveAttribute('aria-disabled', 'true');
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disables remove button when chip is disabled', () => {
    const handleRemove = jest.fn();
    render(
      <Chip disabled onRemove={handleRemove}>
        Disabled
      </Chip>
    );
    
    const removeButton = screen.getByRole('button', { name: 'Remove chip' });
    expect(removeButton).toBeDisabled();
    
    fireEvent.click(removeButton);
    expect(handleRemove).not.toHaveBeenCalled();
  });

  it('applies clickable cursor when interactive', () => {
    const { container: clickableContainer } = render(
      <Chip onClick={() => {}}>Clickable</Chip>
    );
    expect(clickableContainer.firstChild).toHaveClass('cursor-pointer');

    const { container: removableContainer } = render(
      <Chip onRemove={() => {}}>Removable</Chip>
    );
    expect(removableContainer.firstChild).toHaveClass('cursor-pointer');

    const { container: staticContainer } = render(
      <Chip>Static</Chip>
    );
    expect(staticContainer.firstChild).toHaveClass('cursor-default');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Chip className="custom-class">Custom</Chip>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Chip ref={ref}>Ref Chip</Chip>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has correct role and tabIndex when clickable', () => {
    const { container } = render(
      <Chip onClick={() => {}}>Clickable</Chip>
    );
    const chip = container.firstChild;
    expect(chip).toHaveAttribute('role', 'button');
    expect(chip).toHaveAttribute('tabIndex', '0');
  });

  it('does not have role when not clickable', () => {
    const { container } = render(<Chip>Static</Chip>);
    const chip = container.firstChild;
    expect(chip).not.toHaveAttribute('role');
    expect(chip).not.toHaveAttribute('tabIndex');
  });
});

describe('ChipGroup Component', () => {
  const chips = [
    <Chip key="1">Chip 1</Chip>,
    <Chip key="2">Chip 2</Chip>,
    <Chip key="3">Chip 3</Chip>,
  ];

  it('renders all children', () => {
    render(<ChipGroup>{chips}</ChipGroup>);
    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
    expect(screen.getByText('Chip 3')).toBeInTheDocument();
  });

  it('applies spacing variants', () => {
    const { container: tightContainer } = render(
      <ChipGroup spacing="tight">{chips}</ChipGroup>
    );
    expect(tightContainer.firstChild).toHaveClass('gap-1');

    const { container: normalContainer } = render(
      <ChipGroup spacing="normal">{chips}</ChipGroup>
    );
    expect(normalContainer.firstChild).toHaveClass('gap-2');

    const { container: looseContainer } = render(
      <ChipGroup spacing="loose">{chips}</ChipGroup>
    );
    expect(looseContainer.firstChild).toHaveClass('gap-3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ChipGroup className="custom-group">{chips}</ChipGroup>
    );
    expect(container.firstChild).toHaveClass('custom-group');
  });

  it('wraps chips with flex-wrap', () => {
    const { container } = render(
      <ChipGroup>{chips}</ChipGroup>
    );
    expect(container.firstChild).toHaveClass('flex', 'flex-wrap');
  });
});