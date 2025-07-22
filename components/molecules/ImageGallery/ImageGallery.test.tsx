import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageGallery } from './ImageGallery';

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

jest.mock('../../atoms/Button/Button', () => ({
  Button: ({ children, onClick, variant, size, disabled, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant} 
      data-size={size} 
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('ImageGallery Component', () => {
  const mockImages = [
    { id: '1', url: 'image1.jpg', alt: 'Product image 1' },
    { id: '2', url: 'image2.jpg', alt: 'Product image 2' },
    { id: '3', url: 'image3.jpg', alt: 'Product image 3' },
  ];

  it('renders with single image', () => {
    const singleImage = [mockImages[0]];
    render(<ImageGallery images={singleImage} />);
    
    const img = screen.getByAltText('Product image 1');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'image1.jpg');
  });

  it('renders empty state when no images', () => {
    render(<ImageGallery images={[]} />);
    
    expect(screen.getByTestId('icon-image')).toBeInTheDocument();
  });

  it('renders multiple images with thumbnails', () => {
    render(<ImageGallery images={mockImages} />);
    
    // Main image
    expect(screen.getByAltText('Product image 1')).toBeInTheDocument();
    
    // Thumbnails
    expect(screen.getByAltText('Thumbnail 1')).toBeInTheDocument();
    expect(screen.getByAltText('Thumbnail 2')).toBeInTheDocument();
    expect(screen.getByAltText('Thumbnail 3')).toBeInTheDocument();
  });

  it('navigates between images with arrows', () => {
    const handleImageChange = jest.fn();
    render(
      <ImageGallery 
        images={mockImages} 
        onImageChange={handleImageChange}
      />
    );
    
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByAltText('Product image 2')).toBeInTheDocument();
    expect(handleImageChange).toHaveBeenCalledWith(1);
    
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);
    
    expect(screen.getByAltText('Product image 1')).toBeInTheDocument();
    expect(handleImageChange).toHaveBeenCalledWith(0);
  });

  it('navigates by clicking thumbnails', () => {
    render(<ImageGallery images={mockImages} />);
    
    const thumbnail3 = screen.getByLabelText('View image 3');
    fireEvent.click(thumbnail3);
    
    expect(screen.getByAltText('Product image 3')).toBeInTheDocument();
  });

  it('loops when enabled', () => {
    render(<ImageGallery images={mockImages} loop />);
    
    // Go to last image
    const lastThumbnail = screen.getByLabelText('View image 3');
    fireEvent.click(lastThumbnail);
    
    // Click next to loop to first
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByAltText('Product image 1')).toBeInTheDocument();
  });

  it('disables navigation buttons when loop is false', () => {
    render(<ImageGallery images={mockImages} loop={false} />);
    
    const prevButton = screen.getByLabelText('Previous image');
    expect(prevButton).toBeDisabled();
    
    // Go to last image
    const lastThumbnail = screen.getByLabelText('View image 3');
    fireEvent.click(lastThumbnail);
    
    const nextButton = screen.getByLabelText('Next image');
    expect(nextButton).toBeDisabled();
  });

  it('renders badges', () => {
    const badges = [
      { text: 'New', variant: 'default' as const, position: 'top-left' as const },
      { text: 'Sale', variant: 'destructive' as const, position: 'top-right' as const },
    ];
    
    render(<ImageGallery images={mockImages} badges={badges} />);
    
    const newBadge = screen.getByText('New');
    expect(newBadge).toBeInTheDocument();
    expect(newBadge.parentElement).toHaveClass('top-0 left-0');
    
    const saleBadge = screen.getByText('Sale');
    expect(saleBadge).toBeInTheDocument();
    expect(saleBadge.parentElement).toHaveClass('top-0 right-0');
  });

  it('shows image counter', () => {
    render(<ImageGallery images={mockImages} showDots={false} />);
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('renders dots navigation', () => {
    render(<ImageGallery images={mockImages} showDots />);
    
    const dots = screen.getAllByRole('button', { name: /Go to image/i });
    expect(dots).toHaveLength(3);
    
    fireEvent.click(dots[2]);
    expect(screen.getByAltText('Product image 3')).toBeInTheDocument();
  });

  it('handles image click callback', () => {
    const handleImageClick = jest.fn();
    render(
      <ImageGallery 
        images={mockImages} 
        onImageClick={handleImageClick}
        enableZoom={false}
      />
    );
    
    const mainImage = screen.getByAltText('Product image 1');
    fireEvent.click(mainImage.parentElement!);
    
    expect(handleImageClick).toHaveBeenCalledWith(mockImages[0], 0);
  });

  it('enables zoom on click', () => {
    const handleZoom = jest.fn();
    render(
      <ImageGallery 
        images={mockImages} 
        enableZoom
        zoomType="click"
        onZoom={handleZoom}
      />
    );
    
    const imageContainer = screen.getByAltText('Product image 1').parentElement!;
    expect(imageContainer).toHaveClass('cursor-pointer');
    
    fireEvent.click(imageContainer);
    expect(handleZoom).toHaveBeenCalledWith(true);
    
    expect(imageContainer).toHaveClass('cursor-zoom-out');
    
    fireEvent.click(imageContainer);
    expect(handleZoom).toHaveBeenCalledWith(false);
  });

  it('enables zoom on hover', () => {
    render(
      <ImageGallery 
        images={mockImages} 
        enableZoom
        zoomType="hover"
      />
    );
    
    const imageContainer = screen.getByAltText('Product image 1').parentElement!;
    const image = screen.getByAltText('Product image 1');
    
    expect(imageContainer).toHaveClass('cursor-zoom-in');
    
    fireEvent.mouseEnter(imageContainer);
    expect(image).toHaveClass('scale-150');
    
    fireEvent.mouseLeave(imageContainer);
    expect(image).not.toHaveClass('scale-150');
  });

  it('hides thumbnails when disabled', () => {
    render(<ImageGallery images={mockImages} showThumbnails={false} />);
    
    expect(screen.queryByAltText('Thumbnail 1')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Thumbnail 2')).not.toBeInTheDocument();
  });

  it('hides arrows when disabled', () => {
    render(<ImageGallery images={mockImages} showArrows={false} />);
    
    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('applies different aspect ratios', () => {
    const { rerender } = render(
      <ImageGallery images={mockImages} aspectRatio="1:1" />
    );
    
    const container = screen.getByAltText('Product image 1').parentElement!;
    expect(container).toHaveClass('aspect-square');
    
    rerender(<ImageGallery images={mockImages} aspectRatio="16:9" />);
    expect(container).toHaveClass('aspect-video');
  });

  it('applies different object fit styles', () => {
    const { rerender } = render(
      <ImageGallery images={mockImages} objectFit="contain" />
    );
    
    const image = screen.getByAltText('Product image 1');
    expect(image).toHaveClass('object-contain');
    
    rerender(<ImageGallery images={mockImages} objectFit="cover" />);
    expect(image).toHaveClass('object-cover');
  });

  it('positions thumbnails correctly', () => {
    const { rerender } = render(
      <ImageGallery images={mockImages} thumbnailPosition="bottom" />
    );
    
    const gallery = screen.getByLabelText(/Image gallery/);
    expect(gallery).toHaveClass('flex-col');
    
    rerender(<ImageGallery images={mockImages} thumbnailPosition="left" />);
    expect(gallery).toHaveClass('flex-row-reverse');
    
    rerender(<ImageGallery images={mockImages} thumbnailPosition="right" />);
    expect(gallery).toHaveClass('flex-row');
  });

  it('highlights current thumbnail', () => {
    render(<ImageGallery images={mockImages} />);
    
    const thumbnails = screen.getAllByRole('button', { name: /View image/i });
    expect(thumbnails[0]).toHaveClass('ring-2 ring-primary-500');
    expect(thumbnails[1]).not.toHaveClass('ring-2');
    
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[0]).not.toHaveClass('ring-2');
    expect(thumbnails[1]).toHaveClass('ring-2 ring-primary-500');
  });

  it('applies custom classes', () => {
    render(
      <ImageGallery 
        images={mockImages}
        className="custom-gallery"
        imageClassName="custom-image"
        thumbnailClassName="custom-thumbnails"
      />
    );
    
    const gallery = screen.getByLabelText(/Image gallery/);
    expect(gallery).toHaveClass('custom-gallery');
  });

  it('uses aria-label', () => {
    render(
      <ImageGallery 
        images={mockImages}
        aria-label="Product photo gallery"
      />
    );
    
    expect(screen.getByLabelText('Product photo gallery')).toBeInTheDocument();
  });
});