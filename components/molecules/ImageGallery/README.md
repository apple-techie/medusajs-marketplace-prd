# ImageGallery Component

A versatile image gallery component for product images with zoom functionality, thumbnails, and navigation. Perfect for e-commerce product detail pages.

## Installation

```bash
npm install class-variance-authority clsx tailwind-merge
```

## Usage

```tsx
import { ImageGallery } from '@/components/molecules/ImageGallery';

// Basic gallery
<ImageGallery
  images={[
    { id: '1', url: 'product1.jpg', alt: 'Product front view' },
    { id: '2', url: 'product2.jpg', alt: 'Product side view' },
    { id: '3', url: 'product3.jpg', alt: 'Product detail' }
  ]}
/>

// With zoom and badges
<ImageGallery
  images={productImages}
  enableZoom
  zoomType="hover"
  badges={[
    { text: 'New', variant: 'default', position: 'top-left' }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImageGalleryImage[]` | - | **Required**. Array of images to display |
| `alt` | `string` | `'Product image'` | Default alt text for images |
| `variant` | `'default' \| 'carousel' \| 'grid' \| 'stacked'` | `'default'` | Gallery display variant |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Gallery orientation |
| `showThumbnails` | `boolean` | `true` | Show thumbnail navigation |
| `thumbnailPosition` | `'bottom' \| 'left' \| 'right'` | `'bottom'` | Thumbnail position |
| `enableZoom` | `boolean` | `true` | Enable image zoom |
| `zoomType` | `'hover' \| 'click' \| 'magnifier'` | `'hover'` | Zoom interaction type |
| `zoomLevel` | `number` | `2` | Zoom magnification level |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `showDots` | `boolean` | `false` | Show dot navigation |
| `autoplay` | `boolean` | `false` | Enable autoplay |
| `autoplayInterval` | `number` | `5000` | Autoplay interval (ms) |
| `loop` | `boolean` | `true` | Enable loop navigation |
| `aspectRatio` | `'1:1' \| '4:3' \| '16:9' \| '9:16' \| 'auto'` | `'1:1'` | Image aspect ratio |
| `objectFit` | `'contain' \| 'cover' \| 'fill'` | `'contain'` | Image object fit |
| `rounded` | `boolean` | `true` | Apply rounded corners |
| `badges` | `Array<Badge>` | `[]` | Badges to display |
| `onImageChange` | `(index: number) => void` | - | Image change callback |
| `onImageClick` | `(image, index) => void` | - | Image click callback |
| `onZoom` | `(isZoomed: boolean) => void` | - | Zoom state callback |
| `className` | `string` | - | Gallery CSS classes |
| `imageClassName` | `string` | - | Image container CSS classes |
| `thumbnailClassName` | `string` | - | Thumbnail container CSS classes |
| `aria-label` | `string` | - | Accessibility label |

## Types

### ImageGalleryImage

```typescript
interface ImageGalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}
```

### Badge

```typescript
interface Badge {
  text: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'success';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
```

## Examples

### Basic Product Gallery

```tsx
<ImageGallery
  images={[
    { id: '1', url: 'front.jpg', alt: 'Product front' },
    { id: '2', url: 'back.jpg', alt: 'Product back' },
    { id: '3', url: 'side.jpg', alt: 'Product side' }
  ]}
/>
```

### Gallery with Hover Zoom

```tsx
<ImageGallery
  images={images}
  enableZoom
  zoomType="hover"
  zoomLevel={2.5}
/>
```

### Click to Zoom

```tsx
<ImageGallery
  images={images}
  enableZoom
  zoomType="click"
  onZoom={(isZoomed) => console.log('Zoomed:', isZoomed)}
/>
```

### Thumbnails on Side

```tsx
<ImageGallery
  images={images}
  thumbnailPosition="left"
  orientation="vertical"
/>
```

### With Badges

```tsx
<ImageGallery
  images={images}
  badges={[
    { text: 'New', variant: 'default', position: 'top-left' },
    { text: '-20%', variant: 'destructive', position: 'top-right' },
    { text: 'Eco', variant: 'success', position: 'bottom-left' }
  ]}
/>
```

### Autoplay Gallery

```tsx
<ImageGallery
  images={images}
  autoplay
  autoplayInterval={3000}
  showDots
  showThumbnails={false}
/>
```

### Mobile Optimized

```tsx
<ImageGallery
  images={images}
  showDots
  showThumbnails={false}
  enableZoom={false}
  aspectRatio="1:1"
/>
```

### Different Aspect Ratios

```tsx
// Square (Instagram-style)
<ImageGallery
  images={images}
  aspectRatio="1:1"
  objectFit="cover"
/>

// Wide (YouTube-style)
<ImageGallery
  images={images}
  aspectRatio="16:9"
  objectFit="contain"
/>

// Portrait (Story-style)
<ImageGallery
  images={images}
  aspectRatio="9:16"
  objectFit="cover"
/>
```

### No Loop Navigation

```tsx
<ImageGallery
  images={images}
  loop={false}
  showArrows
/>
```

### Custom Styling

```tsx
<ImageGallery
  images={images}
  className="shadow-xl"
  imageClassName="border-2 border-gray-200"
  thumbnailClassName="gap-4"
/>
```

### With Callbacks

```tsx
<ImageGallery
  images={images}
  onImageChange={(index) => {
    console.log('Viewing image:', index + 1);
    trackProductView(images[index].id);
  }}
  onImageClick={(image, index) => {
    openLightbox(image, index);
  }}
  onZoom={(isZoomed) => {
    trackZoomUsage(isZoomed);
  }}
/>
```

## Zoom Behavior

### Hover Zoom
- Hover over image to zoom
- Zoom follows mouse position
- Automatic zoom out on mouse leave

### Click Zoom
- Click to toggle zoom
- Zoomed view follows mouse movement
- Click again to zoom out

### Zoom Customization

```tsx
<ImageGallery
  images={images}
  enableZoom
  zoomType="hover"
  zoomLevel={3} // 3x magnification
/>
```

## Navigation

### Arrow Navigation
- Previous/Next buttons
- Disabled at boundaries when loop is false
- Keyboard support (when focused)

### Thumbnail Navigation
- Click thumbnails to jump to image
- Current image highlighted
- Scrollable when many images

### Dot Navigation
- Minimal dot indicators
- Click to navigate
- Shows current position

## Accessibility

- Keyboard navigation support
- ARIA labels for all controls
- Alt text for all images
- Screen reader announcements
- Focus indicators
- Reduced motion support

## Performance

- Lazy loading support
- Optimized re-renders
- Efficient event handling
- Image preloading
- Smooth transitions

## Best Practices

1. **Image Quality**: Use high-resolution images for zoom
2. **Alt Text**: Provide descriptive alt text
3. **Consistent Sizing**: Use same aspect ratio for all images
4. **Loading States**: Show skeleton while images load
5. **Mobile**: Disable zoom on small screens
6. **Thumbnails**: Limit to 5-7 visible thumbnails
7. **Badges**: Use sparingly for important info
8. **Performance**: Optimize images before upload