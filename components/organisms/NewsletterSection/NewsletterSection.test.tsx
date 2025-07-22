import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterSection, SimpleNewsletter } from './NewsletterSection';

// Mock components
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, type, variant, size, disabled, className }: any) => (
    <button 
      onClick={onClick} 
      type={type}
      data-variant={variant} 
      data-size={size} 
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant, size, className }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size} className={className}>
      {children}
    </span>
  ),
}));

jest.mock('../../atoms/Divider/Divider', () => ({
  Divider: ({ className }: any) => <hr className={className} />,
}));

describe('NewsletterSection Component', () => {
  it('renders with default props', () => {
    render(<NewsletterSection />);
    
    expect(screen.getByText('Stay in the Loop')).toBeInTheDocument();
    expect(screen.getByText(/Get the latest updates/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('renders custom content', () => {
    render(
      <NewsletterSection
        title="Subscribe Now"
        subtitle="Special Offers"
        description="Get exclusive deals"
        placeholder="Your email"
        buttonText="Sign Up"
      />
    );
    
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    expect(screen.getByText('Special Offers')).toBeInTheDocument();
    expect(screen.getByText('Get exclusive deals')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('validates email input', async () => {
    render(<NewsletterSection />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    // Submit with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('handles successful submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    render(<NewsletterSection onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
    
    expect(screen.getByText(/Thanks for subscribing/)).toBeInTheDocument();
    expect(emailInput).toHaveValue('');
  });

  it('handles submission error', async () => {
    const mockSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
    render(<NewsletterSection onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const mockSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<NewsletterSection onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Subscribing...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.queryByText('Subscribing...')).not.toBeInTheDocument();
    });
  });

  it('renders name field when enabled', () => {
    render(<NewsletterSection showNameField />);
    
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('renders preferences when enabled', () => {
    const preferences = [
      { label: 'Daily Deals', value: 'deals' },
      { label: 'New Products', value: 'products' },
      { label: 'Blog Posts', value: 'blog' },
    ];
    
    render(<NewsletterSection showPreferences preferences={preferences} />);
    
    expect(screen.getByText("I'm interested in:")).toBeInTheDocument();
    expect(screen.getByText('Daily Deals')).toBeInTheDocument();
    expect(screen.getByText('New Products')).toBeInTheDocument();
    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
  });

  it('handles preference selection', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    const preferences = [
      { label: 'Daily Deals', value: 'deals' },
      { label: 'New Products', value: 'products' },
    ];
    
    render(
      <NewsletterSection 
        showPreferences 
        preferences={preferences}
        onSubmit={mockSubmit}
      />
    );
    
    const dealsCheckbox = screen.getByLabelText('Daily Deals');
    const productsCheckbox = screen.getByLabelText('New Products');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    fireEvent.click(dealsCheckbox);
    fireEvent.click(productsCheckbox);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        preferences: ['deals', 'products'],
      });
    });
  });

  it('renders benefits list', () => {
    const benefits = [
      'Exclusive discounts',
      'Early access',
      'Expert tips',
    ];
    
    render(<NewsletterSection benefits={benefits} />);
    
    benefits.forEach(benefit => {
      expect(screen.getByText(benefit)).toBeInTheDocument();
    });
  });

  it('renders default benefits when none provided', () => {
    render(<NewsletterSection />);
    
    expect(screen.getByText('Exclusive discounts and early access')).toBeInTheDocument();
    expect(screen.getByText('New product announcements')).toBeInTheDocument();
  });

  it('hides benefits in minimal variant', () => {
    render(<NewsletterSection variant="minimal" />);
    
    expect(screen.queryByText('Exclusive discounts and early access')).not.toBeInTheDocument();
  });

  it('renders subscriber count', () => {
    render(<NewsletterSection subscriberCount={10000} />);
    
    expect(screen.getByText('Join 10,000+ subscribers')).toBeInTheDocument();
  });

  it('renders testimonial', () => {
    const testimonial = {
      text: 'Great newsletter!',
      author: 'John Doe',
      role: 'Customer',
      avatar: 'avatar.jpg',
    };
    
    render(<NewsletterSection testimonial={testimonial} />);
    
    expect(screen.getByText('"Great newsletter!"')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', 'avatar.jpg');
  });

  it('renders privacy text and links', () => {
    render(
      <NewsletterSection
        privacyText="We value your privacy"
        privacyLink="/privacy"
        termsLink="/terms"
      />
    );
    
    expect(screen.getByText('We value your privacy')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/privacy');
    expect(screen.getByText('Terms of Service')).toHaveAttribute('href', '/terms');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<NewsletterSection variant="minimal" />);
    expect(screen.queryByTestId('icon-mail')).not.toBeInTheDocument();
    
    rerender(<NewsletterSection variant="centered" />);
    expect(screen.getByText('Stay in the Loop').parentElement).toHaveClass('text-center');
    
    rerender(<NewsletterSection variant="split" />);
    expect(screen.getByText('Stay in the Loop').closest('.grid')).toBeInTheDocument();
    
    rerender(<NewsletterSection variant="inline" />);
    expect(screen.getByText('Stay in the Loop').closest('.flex')).toBeInTheDocument();
  });

  it('renders different themes correctly', () => {
    const { rerender } = render(<NewsletterSection theme="dark" />);
    const section = screen.getByLabelText('Newsletter signup');
    expect(section).toHaveClass('bg-neutral-900', 'text-white');
    
    rerender(<NewsletterSection theme="gradient" />);
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('renders with background image', () => {
    render(<NewsletterSection backgroundImage="bg.jpg" />);
    
    const section = screen.getByLabelText('Newsletter signup');
    expect(section).toHaveStyle({ backgroundImage: 'url(bg.jpg)' });
  });

  it('renders with background gradient', () => {
    render(<NewsletterSection backgroundGradient="linear-gradient(to right, #000, #fff)" />);
    
    const section = screen.getByLabelText('Newsletter signup');
    expect(section).toHaveStyle({ background: 'linear-gradient(to right, #000, #fff)' });
  });

  it('handles horizontal layout', () => {
    render(<NewsletterSection layout="horizontal" />);
    
    const form = screen.getByRole('button', { name: 'Subscribe' }).closest('form');
    expect(form).toHaveClass('flex', 'gap-2');
  });

  it('applies custom classes', () => {
    render(
      <NewsletterSection
        className="custom-section"
        contentClassName="custom-content"
        formClassName="custom-form"
      />
    );
    
    const section = screen.getByLabelText('Newsletter signup');
    expect(section).toHaveClass('custom-section');
  });

  it('uses aria-label', () => {
    render(<NewsletterSection aria-label="Email signup form" />);
    
    expect(screen.getByLabelText('Email signup form')).toBeInTheDocument();
  });
});

describe('SimpleNewsletter Component', () => {
  it('renders with minimal props', () => {
    render(<SimpleNewsletter />);
    
    expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('handles custom props', () => {
    const mockSubmit = jest.fn();
    
    render(
      <SimpleNewsletter
        title="Get Updates"
        placeholder="Email address"
        buttonText="Sign Me Up"
        onSubmit={mockSubmit}
      />
    );
    
    expect(screen.getByText('Get Updates')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Me Up' })).toBeInTheDocument();
  });

  it('handles email submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    
    render(<SimpleNewsletter onSubmit={mockSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('test@example.com');
    });
  });
});