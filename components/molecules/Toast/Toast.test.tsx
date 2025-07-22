import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Toast, ToastContainer, useToast } from './Toast';
import { renderHook } from '@testing-library/react';

describe('Toast Component', () => {
  it('renders with message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Toast 
        message="Test message" 
        description="Test description" 
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    const { container } = render(<Toast message="Default" />);
    const toast = container.firstChild;
    expect(toast).toHaveClass('bg-neutral-900', 'text-white');
  });

  it('applies variant classes', () => {
    const { container: successContainer } = render(
      <Toast message="Success" variant="success" />
    );
    expect(successContainer.firstChild).toHaveClass('bg-success-600');

    const { container: warningContainer } = render(
      <Toast message="Warning" variant="warning" />
    );
    expect(warningContainer.firstChild).toHaveClass('bg-warning-500');

    const { container: dangerContainer } = render(
      <Toast message="Danger" variant="danger" />
    );
    expect(dangerContainer.firstChild).toHaveClass('bg-danger-600');

    const { container: infoContainer } = render(
      <Toast message="Info" variant="info" />
    );
    expect(infoContainer.firstChild).toHaveClass('bg-primary-600');
  });

  it('shows default icon based on variant', () => {
    const { container } = render(
      <Toast message="Success" variant="success" />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('shows custom icon when provided', () => {
    const CustomIcon = () => <span data-testid="custom-icon">🎉</span>;
    render(
      <Toast message="Custom" icon={<CustomIcon />} />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    const { container } = render(
      <Toast message="No icon" variant="success" showIcon={false} />
    );
    const icon = container.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('shows close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(
      <Toast message="Closeable" onClose={handleClose} />
    );
    const closeButton = screen.getByRole('button', { name: 'Close notification' });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Toast message="Closeable" onClose={handleClose} />
    );
    
    const closeButton = screen.getByRole('button', { name: 'Close notification' });
    fireEvent.click(closeButton);
    
    // Wait for animation to complete
    setTimeout(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    }, 400);
  });

  it('auto-dismisses after duration', async () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    
    render(
      <Toast message="Auto dismiss" duration={1000} onClose={handleClose} />
    );
    
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
    
    jest.useRealTimers();
  });

  it('does not auto-dismiss when persistent', () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    
    render(
      <Toast 
        message="Persistent" 
        duration={1000} 
        persistent={true} 
        onClose={handleClose} 
      />
    );
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByText('Persistent')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('renders action button', () => {
    const handleAction = jest.fn();
    render(
      <Toast 
        message="With action" 
        action={{ label: 'Undo', onClick: handleAction }}
      />
    );
    
    const actionButton = screen.getByText('Undo');
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('applies position classes', () => {
    const positions = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ] as const;

    positions.forEach(position => {
      const { container } = render(
        <Toast message={`Position ${position}`} position={position} />
      );
      const toast = container.firstChild;
      expect(toast).toHaveClass('fixed');
    });
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(<Toast message="Accessible" />);
    const toast = container.firstChild;
    expect(toast).toHaveAttribute('role', 'alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Toast message="Custom" className="custom-toast" />
    );
    expect(container.firstChild).toHaveClass('custom-toast');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Toast ref={ref} message="With ref" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ToastContainer Component', () => {
  it('renders children', () => {
    render(
      <ToastContainer>
        <Toast message="Toast 1" />
        <Toast message="Toast 2" />
      </ToastContainer>
    );
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  it('applies position classes', () => {
    const { container } = render(
      <ToastContainer position="bottom-right">
        <Toast message="Test" />
      </ToastContainer>
    );
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass('bottom-4', 'right-4');
  });

  it('stacks toasts correctly for bottom positions', () => {
    const { container } = render(
      <ToastContainer position="bottom-center">
        <Toast message="Test" />
      </ToastContainer>
    );
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass('flex-col-reverse');
  });
});

describe('useToast Hook', () => {
  it('initializes with empty toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toHaveLength(0);
  });

  it('adds toast with unique id', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      const id = result.current.addToast({
        message: 'New toast',
        variant: 'success',
      });
      expect(typeof id).toBe('string');
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('New toast');
    expect(result.current.toasts[0].variant).toBe('success');
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('removes toast by id', () => {
    const { result } = renderHook(() => useToast());
    
    let toastId: string;
    act(() => {
      toastId = result.current.addToast({ message: 'Toast 1' });
      result.current.addToast({ message: 'Toast 2' });
    });
    
    expect(result.current.toasts).toHaveLength(2);
    
    act(() => {
      result.current.removeToast(toastId);
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Toast 2');
  });

  it('clears all toasts', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.addToast({ message: 'Toast 1' });
      result.current.addToast({ message: 'Toast 2' });
      result.current.addToast({ message: 'Toast 3' });
    });
    
    expect(result.current.toasts).toHaveLength(3);
    
    act(() => {
      result.current.clearToasts();
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });
});