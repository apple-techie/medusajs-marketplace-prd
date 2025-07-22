import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  CompanyLogos, 
  ShippingPartnerLogos, 
  PaymentPartnerLogos, 
  BrandPartnerLogos,
  defaultShippingLogos,
  defaultPaymentLogos,
  type Logo 
} from './CompanyLogos';

describe('CompanyLogos Component', () => {
  const mockLogos: Logo[] = [
    {
      id: 'logo1',
      name: 'Company 1',
      src: '/logo1.svg',
    },
    {
      id: 'logo2',
      name: 'Company 2',
      src: '/logo2.svg',
      href: 'https://company2.com',
    },
    {
      id: 'logo3',
      name: 'Company 3',
      src: '/logo3.svg',
    },
  ];

  it('renders all logos', () => {
    render(<CompanyLogos logos={mockLogos} />);
    
    expect(screen.getByAltText('Company 1')).toBeInTheDocument();
    expect(screen.getByAltText('Company 2')).toBeInTheDocument();
    expect(screen.getByAltText('Company 3')).toBeInTheDocument();
  });

  it('renders title and description when showTitle is true', () => {
    render(
      <CompanyLogos 
        logos={mockLogos} 
        showTitle={true}
        title="Test Partners"
        description="Test description"
      />
    );
    
    expect(screen.getByText('Test Partners')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('does not render title when showTitle is false', () => {
    render(
      <CompanyLogos 
        logos={mockLogos} 
        showTitle={false}
        title="Test Partners"
      />
    );
    
    expect(screen.queryByText('Test Partners')).not.toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    const { container, rerender } = render(
      <CompanyLogos logos={mockLogos} layout="horizontal" />
    );
    
    expect(container.querySelector('.flex-row')).toBeInTheDocument();
    
    rerender(<CompanyLogos logos={mockLogos} layout="vertical" />);
    expect(container.querySelector('.flex-col')).toBeInTheDocument();
    
    rerender(<CompanyLogos logos={mockLogos} layout="grid" />);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(
      <CompanyLogos logos={mockLogos} size="sm" />
    );
    
    expect(container.querySelector('.gap-6')).toBeInTheDocument();
    
    rerender(<CompanyLogos logos={mockLogos} size="md" />);
    expect(container.querySelector('.gap-8')).toBeInTheDocument();
    
    rerender(<CompanyLogos logos={mockLogos} size="lg" />);
    expect(container.querySelector('.gap-12')).toBeInTheDocument();
  });

  it('applies grayscale effect when enabled', () => {
    const { container } = render(
      <CompanyLogos logos={mockLogos} grayscale={true} />
    );
    
    const logos = container.querySelectorAll('.grayscale');
    expect(logos.length).toBe(mockLogos.length);
  });

  it('handles logo click when interactive', () => {
    const handleLogoClick = jest.fn();
    
    render(
      <CompanyLogos 
        logos={mockLogos} 
        interactive={true}
        onLogoClick={handleLogoClick}
      />
    );
    
    const firstLogo = screen.getByAltText('Company 1').parentElement;
    fireEvent.click(firstLogo!);
    
    expect(handleLogoClick).toHaveBeenCalledWith(mockLogos[0]);
  });

  it('opens link in new tab when logo has href and is interactive', () => {
    const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation();
    
    render(
      <CompanyLogos 
        logos={mockLogos} 
        interactive={true}
      />
    );
    
    const logoWithHref = screen.getByAltText('Company 2').parentElement;
    fireEvent.click(logoWithHref!);
    
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://company2.com',
      '_blank',
      'noopener,noreferrer'
    );
    
    windowOpenSpy.mockRestore();
  });

  it('does not make logos clickable when not interactive', () => {
    const handleLogoClick = jest.fn();
    
    render(
      <CompanyLogos 
        logos={mockLogos} 
        interactive={false}
        onLogoClick={handleLogoClick}
      />
    );
    
    const firstLogo = screen.getByAltText('Company 1').parentElement;
    fireEvent.click(firstLogo!);
    
    expect(handleLogoClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CompanyLogos 
        logos={mockLogos} 
        className="custom-class"
        containerClassName="custom-container"
        logoClassName="custom-logo"
      />
    );
    
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
    expect(container.querySelector('.custom-logo')).toBeInTheDocument();
  });

  it('applies grid columns correctly', () => {
    const { container } = render(
      <CompanyLogos 
        logos={mockLogos} 
        layout="grid"
        columns={3}
      />
    );
    
    expect(container.querySelector('.grid-cols-3')).toBeInTheDocument();
  });

  it('applies auto grid columns with responsive classes', () => {
    const { container } = render(
      <CompanyLogos 
        logos={mockLogos} 
        layout="grid"
        columns="auto"
      />
    );
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2');
    expect(grid).toHaveClass('sm:grid-cols-3');
    expect(grid).toHaveClass('md:grid-cols-4');
    expect(grid).toHaveClass('lg:grid-cols-6');
  });

  it('renders logos with custom dimensions', () => {
    const logosWithDimensions: Logo[] = [
      {
        id: 'logo1',
        name: 'Custom Logo',
        src: '/logo.svg',
        width: 100,
        height: 50,
      },
    ];
    
    const { container } = render(
      <CompanyLogos logos={logosWithDimensions} />
    );
    
    const img = container.querySelector('img');
    expect(img?.style.maxWidth).toBe('100px');
    expect(img?.style.maxHeight).toBe('50px');
  });

  it('has proper accessibility attributes', () => {
    render(<CompanyLogos logos={mockLogos} interactive={true} />);
    
    mockLogos.forEach(logo => {
      const logoElement = screen.getByAltText(logo.name).parentElement;
      expect(logoElement).toHaveAttribute('aria-label', logo.name);
      expect(logoElement).toHaveAttribute('title', logo.name);
    });
  });
});

describe('Preset Components', () => {
  it('renders ShippingPartnerLogos with default logos', () => {
    render(<ShippingPartnerLogos />);
    
    expect(screen.getByAltText('DHL')).toBeInTheDocument();
    expect(screen.getByAltText('FedEx')).toBeInTheDocument();
    expect(screen.getByAltText('Pos Indonesia')).toBeInTheDocument();
    expect(screen.getByAltText('JNE Express')).toBeInTheDocument();
  });

  it('renders ShippingPartnerLogos with custom logos', () => {
    const customLogos: Logo[] = [
      { id: 'ups', name: 'UPS', src: '/ups.svg' },
    ];
    
    render(<ShippingPartnerLogos logos={customLogos} />);
    
    expect(screen.getByAltText('UPS')).toBeInTheDocument();
    expect(screen.queryByAltText('DHL')).not.toBeInTheDocument();
  });

  it('renders PaymentPartnerLogos with default logos', () => {
    render(<PaymentPartnerLogos />);
    
    expect(screen.getByAltText('Visa')).toBeInTheDocument();
    expect(screen.getByAltText('Mastercard')).toBeInTheDocument();
    expect(screen.getByAltText('PayPal')).toBeInTheDocument();
  });

  it('renders BrandPartnerLogos with default logos', () => {
    render(<BrandPartnerLogos />);
    
    expect(screen.getByAltText('Nike')).toBeInTheDocument();
    expect(screen.getByAltText('Adidas')).toBeInTheDocument();
    expect(screen.getByAltText('Apple')).toBeInTheDocument();
    expect(screen.getByAltText('Samsung')).toBeInTheDocument();
  });

  it('passes through props to base component', () => {
    render(
      <ShippingPartnerLogos 
        showTitle={true}
        grayscale={false}
        size="lg"
      />
    );
    
    expect(screen.getByText('Shipping Partners')).toBeInTheDocument();
    expect(screen.getByText('Fast and reliable delivery with our trusted partners')).toBeInTheDocument();
  });
});