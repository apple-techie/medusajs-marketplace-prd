import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ImageGallery } from './ImageGallery';

const meta = {
  title: 'Molecules/ImageGallery',
  component: ImageGallery,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'carousel', 'grid', 'stacked'],
      description: 'Gallery display variant',
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Gallery orientation',
    },
    thumbnailPosition: {
      control: 'select',
      options: ['bottom', 'left', 'right'],
      description: 'Thumbnail position',
    },
    zoomType: {
      control: 'select',
      options: ['hover', 'click', 'magnifier'],
      description: 'Zoom interaction type',
    },
    aspectRatio: {
      control: 'select',
      options: ['1:1', '4:3', '16:9', '9:16', 'auto'],
      description: 'Image aspect ratio',
    },
    objectFit: {
      control: 'select',
      options: ['contain', 'cover', 'fill'],
      description: 'Image object fit',
    },
    showThumbnails: {
      control: 'boolean',
      description: 'Show thumbnail navigation',
    },
    enableZoom: {
      control: 'boolean',
      description: 'Enable image zoom',
    },
    showArrows: {
      control: 'boolean',
      description: 'Show navigation arrows',
    },
    showDots: {
      control: 'boolean',
      description: 'Show dot navigation',
    },
    autoplay: {
      control: 'boolean',
      description: 'Enable autoplay',
    },
    loop: {
      control: 'boolean',
      description: 'Enable loop navigation',
    },
  },
} satisfies Meta<typeof ImageGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample product images
const productImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    alt: 'Wireless headphones on yellow background',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?w=800&q=80',
    alt: 'Headphones close-up detail',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    alt: 'Headphones on wooden surface',
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1496957961599-e35b69ef5d7c?w=800&q=80',
    alt: 'Person wearing headphones',
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1528148343865-51218c4a13e6?w=800&q=80',
    alt: 'Headphones product shot',
  },
];

// Fashion product images
const fashionImages = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    alt: 'White dress on hanger',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    alt: 'Model wearing dress',
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    alt: 'Dress detail close-up',
  },
];

// Basic gallery
export const Default: Story = {
  args: {
    images: productImages,
  },
};

// Single image
export const SingleImage: Story = {
  args: {
    images: [productImages[0]],
  },
};

// Without thumbnails
export const NoThumbnails: Story = {
  args: {
    images: productImages,
    showThumbnails: false,
  },
};

// Thumbnails on left
export const ThumbnailsLeft: Story = {
  args: {
    images: productImages,
    thumbnailPosition: 'left',
  },
};

// Thumbnails on right
export const ThumbnailsRight: Story = {
  args: {
    images: productImages,
    thumbnailPosition: 'right',
  },
};

// Click to zoom
export const ClickZoom: Story = {
  args: {
    images: productImages,
    zoomType: 'click',
  },
};

// Hover to zoom
export const HoverZoom: Story = {
  args: {
    images: productImages,
    zoomType: 'hover',
    zoomLevel: 2.5,
  },
};

// No zoom
export const NoZoom: Story = {
  args: {
    images: productImages,
    enableZoom: false,
  },
};

// With badges
export const WithBadges: Story = {
  args: {
    images: productImages,
    badges: [
      { text: 'New', variant: 'default', position: 'top-left' },
      { text: '-20%', variant: 'destructive', position: 'top-right' },
    ],
  },
};

// Dots navigation
export const DotsNavigation: Story = {
  args: {
    images: productImages,
    showDots: true,
    showThumbnails: false,
  },
};

// Autoplay
export const Autoplay: Story = {
  args: {
    images: productImages,
    autoplay: true,
    autoplayInterval: 3000,
    showDots: true,
  },
};

// No loop
export const NoLoop: Story = {
  args: {
    images: productImages,
    loop: false,
  },
};

// Different aspect ratios
export const SquareAspect: Story = {
  args: {
    images: productImages,
    aspectRatio: '1:1',
  },
};

export const WideAspect: Story = {
  args: {
    images: productImages,
    aspectRatio: '16:9',
  },
};

export const PortraitAspect: Story = {
  args: {
    images: fashionImages,
    aspectRatio: '9:16',
  },
};

// Object fit variations
export const ObjectContain: Story = {
  args: {
    images: productImages,
    objectFit: 'contain',
    aspectRatio: '1:1',
  },
};

export const ObjectCover: Story = {
  args: {
    images: productImages,
    objectFit: 'cover',
    aspectRatio: '1:1',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [selectedImage, setSelectedImage] = useState<number>(0);
    const [isZoomed, setIsZoomed] = useState(false);

    return (
      <div className="space-y-4">
        <ImageGallery
          images={productImages}
          onImageChange={setSelectedImage}
          onZoom={setIsZoomed}
          onImageClick={(image, index) => {
            console.log('Clicked image:', image, 'at index:', index);
          }}
        />
        
        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600">
            Current image: {selectedImage + 1} of {productImages.length}
          </p>
          <p className="text-sm text-neutral-600">
            Zoom status: {isZoomed ? 'Zoomed in' : 'Normal'}
          </p>
        </div>
      </div>
    );
  },
};

// E-commerce product gallery
export const EcommerceProduct: Story = {
  render: () => (
    <div className="max-w-lg">
      <ImageGallery
        images={productImages}
        badges={[
          { text: 'Bestseller', variant: 'success', position: 'top-left' },
        ]}
        enableZoom
        zoomType="hover"
        showThumbnails
        thumbnailPosition="bottom"
      />
    </div>
  ),
};

// Fashion product gallery
export const FashionProduct: Story = {
  render: () => (
    <div className="max-w-md">
      <ImageGallery
        images={fashionImages}
        aspectRatio="9:16"
        objectFit="cover"
        enableZoom
        zoomType="click"
        badges={[
          { text: 'Limited Edition', variant: 'secondary', position: 'top-right' },
        ]}
      />
    </div>
  ),
};

// Mobile-optimized gallery
export const MobileGallery: Story = {
  render: () => (
    <div className="max-w-sm">
      <ImageGallery
        images={productImages}
        showDots
        showThumbnails={false}
        enableZoom={false}
        aspectRatio="1:1"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    images: [],
  },
};

// Loading state simulation
export const LoadingState: Story = {
  render: () => {
    const [images, setImages] = useState<typeof productImages>([]);
    
    React.useEffect(() => {
      // Simulate loading delay
      const timer = setTimeout(() => {
        setImages(productImages);
      }, 2000);
      
      return () => clearTimeout(timer);
    }, []);
    
    return (
      <div className="max-w-lg">
        <ImageGallery images={images} />
        {images.length === 0 && (
          <p className="text-center mt-4 text-neutral-600">Loading images...</p>
        )}
      </div>
    );
  },
};

// All features enabled
export const FullFeatured: Story = {
  args: {
    images: productImages,
    variant: 'default',
    showThumbnails: true,
    thumbnailPosition: 'bottom',
    enableZoom: true,
    zoomType: 'hover',
    zoomLevel: 2,
    showArrows: true,
    showDots: true,
    autoplay: true,
    autoplayInterval: 5000,
    loop: true,
    aspectRatio: '4:3',
    objectFit: 'contain',
    badges: [
      { text: 'Hot', variant: 'destructive', position: 'top-left' },
      { text: 'Free Shipping', variant: 'success', position: 'bottom-right' },
    ],
  },
};

// Dark theme
export const DarkTheme: Story = {
  render: () => (
    <div className="bg-neutral-900 p-8 rounded-lg">
      <div className="max-w-lg">
        <ImageGallery
          images={productImages}
          badges={[
            { text: 'New Arrival', variant: 'default', position: 'top-right' },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};