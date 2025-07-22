import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Banner, PersistentBanner, useBanner } from './Banner';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Banner Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('renders with heading and subheading', () => {
    render(
      <Banner 
        heading="Important Notice" 
        subheading="Please read this carefully"
      />
    );
    
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
    expect(screen.getByText('Please read this carefully')).toBeInTheDocument();
  });

  it('renders with children content', () => {
    render(
      <Banner>
        <p>Custom banner content</p>
      </Banner>
    );
    
    expect(screen.getByText('Custom banner content')).toBeInTheDocument();
  });

  it('shows default icon when showIcon is true', () => {
    const { container } = render(<Banner heading="Test" showIcon={true} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    const { container } = render(<Banner heading="Test" showIcon={false} />);
    const icon = container.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(
      <Banner 
        heading="Test" 
        icon={<span data-testid="custom-icon">🎉</span>}
      />
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('handles dismiss action', () => {
    const handleDismiss = jest.fn();
    render(
      <Banner 
        heading="Dismissible Banner" 
        onDismiss={handleDismiss}
        dismissible={true}
      />
    );
    
    const dismissButton = screen.getByLabelText('Dismiss banner');
    fireEvent.click(dismissButton);
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Dismissible Banner')).not.toBeInTheDocument();
  });

  it('hides dismiss button when dismissible is false', () => {
    render(
      <Banner 
        heading="Non-dismissible Banner" 
        dismissible={false}
      />
    );
    
    expect(screen.queryByLabelText('Dismiss banner')).not.toBeInTheDocument();
  });

  it('renders action button', () => {
    const handleAction = jest.fn();
    render(
      <Banner 
        heading="Banner with Action"
        action={{
          label: 'Learn More',
          onClick: handleAction,
        }}
      />
    );
    
    const actionButton = screen.getByText('Learn More');
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles', () => {
    const { container: successContainer } = render(
      <Banner heading="Success" variant="success" />
    );
    expect(successContainer.firstChild).toHaveClass('bg-success-50', 'border-success-500');

    const { container: warningContainer } = render(
      <Banner heading="Warning" variant="warning" />
    );
    expect(warningContainer.firstChild).toHaveClass('bg-warning-50', 'border-warning-500');

    const { container: dangerContainer } = render(
      <Banner heading="Danger" variant="danger" />
    );
    expect(dangerContainer.firstChild).toHaveClass('bg-danger-50', 'border-danger-500');
  });

  it('applies size variants', () => {
    const { container: smContainer } = render(
      <Banner heading="Small" size="sm" />
    );
    expect(smContainer.firstChild).toHaveClass('px-4', 'py-3');

    const { container: lgContainer } = render(
      <Banner heading="Large" size="lg" />
    );
    expect(lgContainer.firstChild).toHaveClass('px-8', 'py-5');
  });

  it('renders correct icon for each variant', () => {
    const variants = ['success', 'warning', 'danger', 'info', 'neutral'];
    
    variants.forEach(variant => {
      const { container } = render(
        <Banner heading={variant} variant={variant as any} />
      );
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <Banner heading="Custom Class" className="custom-banner" />
    );
    expect(container.firstChild).toHaveClass('custom-banner');
  });

  it('sets correct ARIA attributes', () => {
    render(
      <Banner 
        heading="Accessible Banner"
        aria-label="Important announcement"
        aria-live="assertive"
      />
    );
    
    const banner = screen.getByRole('alert');
    expect(banner).toHaveAttribute('aria-label', 'Important announcement');
    expect(banner).toHaveAttribute('aria-live', 'assertive');
  });

  it('defaults to polite aria-live', () => {
    render(<Banner heading="Default ARIA" />);
    
    const banner = screen.getByRole('alert');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Banner ref={ref} heading="Ref Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('PersistentBanner Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('renders when not previously dismissed', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <PersistentBanner 
        heading="Persistent Banner"
        storageKey="test-banner"
      />
    );
    
    expect(screen.getByText('Persistent Banner')).toBeInTheDocument();
  });

  it('does not render when previously dismissed', () => {
    localStorageMock.getItem.mockReturnValue('dismissed');
    
    render(
      <PersistentBanner 
        heading="Previously Dismissed"
        storageKey="test-banner"
      />
    );
    
    expect(screen.queryByText('Previously Dismissed')).not.toBeInTheDocument();
  });

  it('saves dismissal to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <PersistentBanner 
        heading="Save Dismissal"
        storageKey="test-banner"
      />
    );
    
    const dismissButton = screen.getByLabelText('Dismiss banner');
    fireEvent.click(dismissButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-banner', 'dismissed');
    expect(screen.queryByText('Save Dismissal')).not.toBeInTheDocument();
  });

  it('works without storageKey', () => {
    render(
      <PersistentBanner 
        heading="No Storage Key"
      />
    );
    
    expect(screen.getByText('No Storage Key')).toBeInTheDocument();
    
    const dismissButton = screen.getByLabelText('Dismiss banner');
    fireEvent.click(dismissButton);
    
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(screen.queryByText('No Storage Key')).not.toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <PersistentBanner 
        ref={ref} 
        heading="Ref Test"
        storageKey="ref-test"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useBanner Hook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useBanner());
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.message).toEqual({});
  });

  it('initializes with custom initial state', () => {
    const { result } = renderHook(() => useBanner(false));
    
    expect(result.current.isVisible).toBe(false);
  });

  it('shows banner with message', () => {
    const { result } = renderHook(() => useBanner(false));
    
    act(() => {
      result.current.show('New Message', 'Details here', 'success');
    });
    
    expect(result.current.isVisible).toBe(true);
    expect(result.current.message).toEqual({
      heading: 'New Message',
      subheading: 'Details here',
      variant: 'success',
    });
  });

  it('hides banner', () => {
    const { result } = renderHook(() => useBanner(true));
    
    act(() => {
      result.current.hide();
    });
    
    expect(result.current.isVisible).toBe(false);
  });

  it('toggles banner visibility', () => {
    const { result } = renderHook(() => useBanner(true));
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isVisible).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('updates message directly', () => {
    const { result } = renderHook(() => useBanner());
    
    act(() => {
      result.current.setMessage({
        heading: 'Updated Heading',
        subheading: 'Updated Subheading',
        variant: 'warning',
      });
    });
    
    expect(result.current.message).toEqual({
      heading: 'Updated Heading',
      subheading: 'Updated Subheading',
      variant: 'warning',
    });
  });

  it('shows banner with partial message', () => {
    const { result } = renderHook(() => useBanner());
    
    act(() => {
      result.current.show('Heading Only');
    });
    
    expect(result.current.message).toEqual({
      heading: 'Heading Only',
      subheading: undefined,
      variant: undefined,
    });
  });
});