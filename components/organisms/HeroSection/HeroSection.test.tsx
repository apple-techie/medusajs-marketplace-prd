import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection, SimpleHero, SearchHero, MarketplaceHero } from './HeroSection';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

// Mock Button component
jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, as: Component = 'button', href, onClick, variant, size, className, ...props }: any) => 
    Component === 'button' ? (
      <button onClick={onClick} data-variant={variant} data-size={size} className={className} {...props}>
        {children}
      </button>
    ) : (
      <Component href={href} data-variant={variant} data-size={size} className={className} {...props}>
        {children}
      </Component>
    ),
}));

// Mock SearchBar component
jest.mock('../../molecules/SearchBar/SearchBar', () => ({
  SearchBar: ({ placeholder, onSearch, size, categories }: any) => (
    <div data-testid="search-bar" data-size={size}>
      <input
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        data-testid="search-input"
      />
      {categories && (
        <select data-testid="search-categories">
          {categories.map((cat: any) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      )}
    </div>
  ),
}));

// Mock Badge component
jest.mock('../../atoms/Badge/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

// Mock Icon component
jest.mock('../../atoms/Icon/Icon', () => ({
  Icon: ({ icon, size, className }: any) => (
    <span data-testid={`icon-${icon}`} data-size={size} className={className}>
      {icon}
    </span>
  ),
}));

describe('HeroSection Component', () => {
  const defaultProps = {
    title: 'Welcome to Our Marketplace',
  };

  it('renders basic hero section', () => {
    render(<HeroSection {...defaultProps} />);
    
    expect(screen.getByText('Welcome to Our Marketplace')).toBeInTheDocument();
  });

  it('renders with subtitle and description', () => {
    render(
      <HeroSection
        {...defaultProps}
        subtitle="Find everything you need"
        description="Browse thousands of products from trusted vendors"
      />
    );
    
    expect(screen.getByText('Find everything you need')).toBeInTheDocument();
    expect(screen.getByText('Browse thousands of products from trusted vendors')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(
      <HeroSection {...defaultProps} variant="centered" />
    );
    expect(screen.getByText('Welcome to Our Marketplace')).toBeInTheDocument();
    
    rerender(<HeroSection {...defaultProps} variant="minimal" />);
    expect(screen.getByText('Welcome to Our Marketplace')).toBeInTheDocument();
    
    rerender(<HeroSection {...defaultProps} variant="fullscreen" />);
    const section = screen.getByText('Welcome to Our Marketplace').closest('section');
    expect(section).toHaveClass('min-h-screen');
  });

  it('renders with background image and overlay', () => {
    const { container } = render(
      <HeroSection
        {...defaultProps}
        backgroundImage="/hero-bg.jpg"
        overlay={true}
        overlayOpacity={0.6}
      />
    );
    
    const bgDiv = container.querySelector('[style*="background-image"]');
    expect(bgDiv).toHaveStyle({ backgroundImage: 'url(/hero-bg.jpg)' });
    
    const overlay = container.querySelector('[style*="opacity: 0.6"]');
    expect(overlay).toBeInTheDocument();
  });

  it('renders with background video', () => {
    const { container } = render(
      <HeroSection
        {...defaultProps}
        backgroundVideo="/hero-video.mp4"
      />
    );
    
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    
    const source = video?.querySelector('source');
    expect(source).toHaveAttribute('src', '/hero-video.mp4');
  });

  it('renders with background gradient', () => {
    const { container } = render(
      <HeroSection
        {...defaultProps}
        backgroundGradient={true}
      />
    );
    
    const gradient = container.querySelector('.bg-gradient-to-br');
    expect(gradient).toBeInTheDocument();
  });

  it('renders primary and secondary actions', () => {
    const handlePrimary = jest.fn();
    const handleSecondary = jest.fn();
    
    render(
      <HeroSection
        {...defaultProps}
        primaryAction={{
          label: 'Get Started',
          onClick: handlePrimary,
        }}
        secondaryAction={{
          label: 'Learn More',
          href: '/about',
        }}
      />
    );
    
    const primaryBtn = screen.getByText('Get Started');
    fireEvent.click(primaryBtn);
    expect(handlePrimary).toHaveBeenCalled();
    
    const secondaryLink = screen.getByText('Learn More').closest('a');
    expect(secondaryLink).toHaveAttribute('href', '/about');
  });

  it('renders with search bar', () => {
    const handleSearch = jest.fn();
    const categories = [
      { label: 'All', value: 'all' },
      { label: 'Electronics', value: 'electronics' },
    ];
    
    render(
      <HeroSection
        {...defaultProps}
        showSearch={true}
        searchPlaceholder="Search products..."
        searchCategories={categories}
        onSearch={handleSearch}
      />
    );
    
    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
    
    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('placeholder', 'Search products...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    expect(handleSearch).toHaveBeenCalledWith('test query');
    
    const categoriesSelect = screen.getByTestId('search-categories');
    expect(categoriesSelect).toBeInTheDocument();
  });

  it('renders badges', () => {
    const badges = [
      { text: 'New', variant: 'success' as const },
      { text: 'Popular', variant: 'primary' as const },
    ];
    
    render(
      <HeroSection
        {...defaultProps}
        badges={badges}
      />
    );
    
    const badgeElements = screen.getAllByTestId('badge');
    expect(badgeElements).toHaveLength(2);
    expect(badgeElements[0]).toHaveTextContent('New');
    expect(badgeElements[0]).toHaveAttribute('data-variant', 'success');
    expect(badgeElements[1]).toHaveTextContent('Popular');
    expect(badgeElements[1]).toHaveAttribute('data-variant', 'primary');
  });

  it('renders features', () => {
    const features = [
      { icon: 'check', text: 'Free Shipping' },
      { icon: 'shield', text: 'Secure Payments' },
      { icon: 'refresh-cw', text: 'Easy Returns' },
    ];
    
    render(
      <HeroSection
        {...defaultProps}
        features={features}
      />
    );
    
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shield')).toBeInTheDocument();
    expect(screen.getByText('Secure Payments')).toBeInTheDocument();
    expect(screen.getByTestId('icon-refresh-cw')).toBeInTheDocument();
    expect(screen.getByText('Easy Returns')).toBeInTheDocument();
  });

  it('renders stats', () => {
    const stats = [
      { value: '10K+', label: 'Products' },
      { value: '5K+', label: 'Vendors' },
      { value: '100K+', label: 'Customers' },
      { value: '4.9', label: 'Rating' },
    ];
    
    render(
      <HeroSection
        {...defaultProps}
        stats={stats}
      />
    );
    
    stats.forEach(stat => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  it('renders trusted by section', () => {
    const trustedBy = [
      { name: 'Company 1', logo: '/logo1.png' },
      { name: 'Company 2', logo: '/logo2.png' },
    ];
    
    render(
      <HeroSection
        {...defaultProps}
        trustedBy={trustedBy}
      />
    );
    
    expect(screen.getByText('Trusted by')).toBeInTheDocument();
    
    const logos = screen.getAllByRole('img');
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute('src', '/logo1.png');
    expect(logos[0]).toHaveAttribute('alt', 'Company 1');
    expect(logos[1]).toHaveAttribute('src', '/logo2.png');
    expect(logos[1]).toHaveAttribute('alt', 'Company 2');
  });

  it('applies different sizes', () => {
    const { rerender } = render(
      <HeroSection {...defaultProps} size="sm" />
    );
    expect(screen.getByText('Welcome to Our Marketplace')).toHaveClass('text-2xl');
    
    rerender(<HeroSection {...defaultProps} size="xl" />);
    expect(screen.getByText('Welcome to Our Marketplace')).toHaveClass('text-5xl');
  });

  it('applies theme classes', () => {
    const { rerender } = render(
      <HeroSection {...defaultProps} theme="light" />
    );
    let title = screen.getByText('Welcome to Our Marketplace');
    expect(title.parentElement).toHaveClass('text-neutral-900');
    
    rerender(<HeroSection {...defaultProps} theme="dark" />);
    title = screen.getByText('Welcome to Our Marketplace');
    expect(title.parentElement).toHaveClass('text-white');
  });

  it('applies custom classes', () => {
    render(
      <HeroSection
        {...defaultProps}
        className="custom-section"
        contentClassName="custom-content"
        titleClassName="custom-title"
      />
    );
    
    const section = screen.getByText('Welcome to Our Marketplace').closest('section');
    expect(section).toHaveClass('custom-section');
    
    const title = screen.getByText('Welcome to Our Marketplace');
    expect(title).toHaveClass('custom-title');
  });

  it('uses aria-label', () => {
    render(
      <HeroSection
        {...defaultProps}
        aria-label="Main hero section"
      />
    );
    
    const section = screen.getByLabelText('Main hero section');
    expect(section).toBeInTheDocument();
  });
});

describe('SimpleHero Component', () => {
  it('renders simple hero variant', () => {
    const handleClick = jest.fn();
    
    render(
      <SimpleHero
        title="Simple Hero Title"
        subtitle="Simple subtitle"
        primaryAction={{
          label: 'Click Me',
          onClick: handleClick,
        }}
      />
    );
    
    expect(screen.getByText('Simple Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Simple subtitle')).toBeInTheDocument();
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('SearchHero Component', () => {
  it('renders search hero variant', () => {
    const handleSearch = jest.fn();
    
    render(
      <SearchHero
        title="Search Our Marketplace"
        subtitle="Find what you need"
        searchPlaceholder="Search here..."
        onSearch={handleSearch}
        backgroundImage="/search-bg.jpg"
      />
    );
    
    expect(screen.getByText('Search Our Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Find what you need')).toBeInTheDocument();
    
    const searchInput = screen.getByTestId('search-input');
    expect(searchInput).toHaveAttribute('placeholder', 'Search here...');
    
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(handleSearch).toHaveBeenCalledWith('test');
  });
});

describe('MarketplaceHero Component', () => {
  it('renders marketplace hero variant', () => {
    const stats = [
      { value: '10K+', label: 'Products' },
      { value: '5K+', label: 'Vendors' },
    ];
    
    const trustedBy = [
      { name: 'Brand 1', logo: '/brand1.png' },
    ];
    
    render(
      <MarketplaceHero
        title="Welcome to Marketplace"
        subtitle="Your one-stop shop"
        description="Find everything you need"
        stats={stats}
        trustedBy={trustedBy}
        primaryAction={{
          label: 'Start Shopping',
          href: '/shop',
        }}
      />
    );
    
    expect(screen.getByText('Welcome to Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Your one-stop shop')).toBeInTheDocument();
    expect(screen.getByText('Find everything you need')).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    
    // Check trusted by
    expect(screen.getByAltText('Brand 1')).toBeInTheDocument();
    
    // Check action
    const link = screen.getByText('Start Shopping').closest('a');
    expect(link).toHaveAttribute('href', '/shop');
  });
});