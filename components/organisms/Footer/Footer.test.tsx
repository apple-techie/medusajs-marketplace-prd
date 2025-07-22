import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from './Footer';

describe('Footer Component', () => {
  const defaultProps = {
    companyName: 'Test Company',
    tagline: 'Test tagline for the company',
  };

  it('renders company name and tagline', () => {
    render(<Footer {...defaultProps} />);
    
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Test tagline for the company')).toBeInTheDocument();
  });

  it('renders default sections when no sections provided', () => {
    render(<Footer {...defaultProps} />);
    
    expect(screen.getByText('SUPPORT')).toBeInTheDocument();
    expect(screen.getByText('COMPANY')).toBeInTheDocument();
    expect(screen.getByText('LEGAL')).toBeInTheDocument();
  });

  it('renders custom sections', () => {
    const customSections = [
      {
        title: 'CUSTOM SECTION',
        links: [
          { label: 'Custom Link 1', href: '/custom1' },
          { label: 'Custom Link 2', href: '/custom2' },
        ],
      },
    ];

    render(<Footer {...defaultProps} sections={customSections} />);
    
    expect(screen.getByText('CUSTOM SECTION')).toBeInTheDocument();
    expect(screen.getByText('Custom Link 1')).toBeInTheDocument();
    expect(screen.getByText('Custom Link 2')).toBeInTheDocument();
  });

  it('renders links with correct href attributes', () => {
    render(<Footer {...defaultProps} />);
    
    const becomeSellerLink = screen.getByText('Become a seller');
    expect(becomeSellerLink).toHaveAttribute('href', '/become-seller');
    
    const aboutLink = screen.getByText('About Us');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders external links with correct attributes', () => {
    const sectionsWithExternalLinks = [
      {
        title: 'EXTERNAL',
        links: [
          { label: 'External Link', href: 'https://external.com', external: true },
        ],
      },
    ];

    render(<Footer {...defaultProps} sections={sectionsWithExternalLinks} />);
    
    const externalLink = screen.getByText('External Link');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders app download section', () => {
    render(<Footer {...defaultProps} />);
    
    expect(screen.getByText('Shop Smarter with Our App')).toBeInTheDocument();
    expect(screen.getByAltText('Get it on Google Play')).toBeInTheDocument();
    expect(screen.getByAltText('Download on the App Store')).toBeInTheDocument();
  });

  it('renders QR code when provided', () => {
    render(<Footer {...defaultProps} qrCodeUrl="/qr-code.png" />);
    
    const qrCode = screen.getByAltText('Download QR Code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('src', '/qr-code.png');
  });

  it('shows newsletter section when enabled', () => {
    render(
      <Footer 
        {...defaultProps} 
        showNewsletter={true}
        newsletterTitle="Subscribe"
        newsletterDescription="Get updates"
      />
    );
    
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
    expect(screen.getByText('Get updates')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('handles newsletter submission', async () => {
    const handleNewsletterSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(
      <Footer 
        {...defaultProps} 
        showNewsletter={true}
        onNewsletterSubmit={handleNewsletterSubmit}
      />
    );
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(handleNewsletterSubmit).toHaveBeenCalledWith('test@example.com');
    
    await waitFor(() => {
      expect(screen.getByText('Successfully subscribed!')).toBeInTheDocument();
    });
  });

  it('handles newsletter submission error', async () => {
    const handleNewsletterSubmit = jest.fn().mockRejectedValue(new Error('Failed'));
    const user = userEvent.setup();

    render(
      <Footer 
        {...defaultProps} 
        showNewsletter={true}
        onNewsletterSubmit={handleNewsletterSubmit}
      />
    );
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button when email is empty', () => {
    render(
      <Footer 
        {...defaultProps} 
        showNewsletter={true}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    expect(submitButton).toBeDisabled();
  });

  it('renders social links when provided', () => {
    const socialLinks = {
      facebook: 'https://facebook.com/test',
      twitter: 'https://twitter.com/test',
      instagram: 'https://instagram.com/test',
    };

    render(<Footer {...defaultProps} socialLinks={socialLinks} />);
    
    const facebookLink = screen.getByLabelText('Visit our facebook');
    expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/test');
    
    const twitterLink = screen.getByLabelText('Visit our twitter');
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/test');
  });

  it('renders custom copyright text', () => {
    render(<Footer {...defaultProps} copyrightText="Custom copyright 2024" />);
    
    expect(screen.getByText('Custom copyright 2024')).toBeInTheDocument();
  });

  it('renders default copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer {...defaultProps} />);
    
    expect(screen.getByText(`© ${currentYear} Test Company. All rights reserved.`)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Footer {...defaultProps} className="custom-footer" />);
    
    expect(container.querySelector('footer')).toHaveClass('custom-footer');
  });

  it('renders app store links with correct attributes', () => {
    const appStoreLinks = [
      { type: 'google' as const, url: 'https://play.google.com/test' },
      { type: 'apple' as const, url: 'https://apps.apple.com/test' },
    ];

    render(<Footer {...defaultProps} appStoreLinks={appStoreLinks} />);
    
    const googlePlayLink = screen.getByAltText('Get it on Google Play').closest('a');
    expect(googlePlayLink).toHaveAttribute('href', 'https://play.google.com/test');
    expect(googlePlayLink).toHaveAttribute('target', '_blank');
    
    const appStoreLink = screen.getByAltText('Download on the App Store').closest('a');
    expect(appStoreLink).toHaveAttribute('href', 'https://apps.apple.com/test');
    expect(appStoreLink).toHaveAttribute('target', '_blank');
  });

  it('is responsive', () => {
    const { container } = render(<Footer {...defaultProps} />);
    
    // Check for responsive grid classes
    expect(container.querySelector('.grid-cols-1')).toBeInTheDocument();
    expect(container.querySelector('.lg\\:grid-cols-12')).toBeInTheDocument();
    expect(container.querySelector('.sm\\:grid-cols-3')).toBeInTheDocument();
  });
});

describe('Footer Accessibility', () => {
  it('has proper heading hierarchy', () => {
    render(<Footer companyName="Test Company" />);
    
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Test Company');
    
    const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(sectionHeadings.length).toBeGreaterThan(0);
  });

  it('has accessible form elements', () => {
    render(<Footer companyName="Test" showNewsletter={true} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toHaveAttribute('type', 'email');
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('has proper link labels for social icons', () => {
    const socialLinks = {
      facebook: 'https://facebook.com/test',
      twitter: 'https://twitter.com/test',
    };

    render(<Footer companyName="Test" socialLinks={socialLinks} />);
    
    expect(screen.getByLabelText('Visit our facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit our twitter')).toBeInTheDocument();
  });
});