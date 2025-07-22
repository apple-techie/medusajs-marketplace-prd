import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../../atoms/Button/Button';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { Badge } from '../../atoms/Badge/Badge';
import { Icon } from '../../atoms/Icon/Icon';

export interface HeroSectionProps {
  // Content
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  description?: string;
  
  // Layout options
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'fullscreen';
  layout?: 'content-left' | 'content-right' | 'content-center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Visual elements
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundGradient?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
  
  // Interactive elements
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  };
  
  // Search integration
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchCategories?: Array<{ label: string; value: string }>;
  onSearch?: (query: string, category?: string) => void;
  
  // Additional elements
  badges?: Array<{ text: string; variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' }>;
  features?: Array<{ icon: string; text: string }>;
  stats?: Array<{ value: string; label: string }>;
  trustedBy?: Array<{ name: string; logo: string }>;
  
  // Styling
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  textAlign?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark' | 'auto';
  
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  
  'aria-label'?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  variant = 'default',
  layout = 'content-center',
  size = 'lg',
  backgroundImage,
  backgroundVideo,
  backgroundGradient = false,
  overlay = true,
  overlayOpacity = 0.5,
  primaryAction,
  secondaryAction,
  showSearch = false,
  searchPlaceholder = 'Search products...',
  searchCategories,
  onSearch,
  badges,
  features,
  stats,
  trustedBy,
  contentWidth = 'medium',
  textAlign = 'center',
  theme = 'auto',
  className,
  contentClassName,
  titleClassName,
  'aria-label': ariaLabel,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'py-12 md:py-16',
      titleSize: 'text-2xl md:text-3xl lg:text-4xl',
      subtitleSize: 'text-lg md:text-xl',
      descSize: 'text-base',
      gap: 'gap-4',
    },
    md: {
      padding: 'py-16 md:py-20',
      titleSize: 'text-3xl md:text-4xl lg:text-5xl',
      subtitleSize: 'text-xl md:text-2xl',
      descSize: 'text-base md:text-lg',
      gap: 'gap-6',
    },
    lg: {
      padding: 'py-20 md:py-28',
      titleSize: 'text-4xl md:text-5xl lg:text-6xl',
      subtitleSize: 'text-2xl md:text-3xl',
      descSize: 'text-lg md:text-xl',
      gap: 'gap-8',
    },
    xl: {
      padding: 'py-28 md:py-36',
      titleSize: 'text-5xl md:text-6xl lg:text-7xl',
      subtitleSize: 'text-3xl md:text-4xl',
      descSize: 'text-xl md:text-2xl',
      gap: 'gap-10',
    },
  };

  const sizes = sizeConfig[size];

  // Content width classes
  const widthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  };

  // Layout classes
  const layoutClasses = {
    'content-left': 'items-start text-left',
    'content-right': 'items-end text-right',
    'content-center': 'items-center text-center',
  };

  // Theme classes
  const themeClasses = theme === 'dark' || (theme === 'auto' && (backgroundImage || backgroundVideo))
    ? 'text-white'
    : 'text-neutral-900 dark:text-white';

  // Base section classes
  const sectionClasses = cn(
    'relative overflow-hidden',
    variant === 'fullscreen' && 'min-h-screen flex items-center',
    sizes.padding,
    className
  );

  // Content container classes
  const containerClasses = cn(
    'relative z-10 container mx-auto px-4 sm:px-6 lg:px-8',
    variant === 'split' && 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'
  );

  // Content classes
  const contentClasses = cn(
    'flex flex-col',
    sizes.gap,
    layoutClasses[layout],
    widthClasses[contentWidth],
    layout === 'content-center' && 'mx-auto',
    themeClasses,
    contentClassName
  );

  // Render background
  const renderBackground = () => {
    if (backgroundVideo) {
      return (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          {overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
            />
          )}
        </>
      );
    }

    if (backgroundImage) {
      return (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden="true"
          />
          {overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
            />
          )}
        </>
      );
    }

    if (backgroundGradient) {
      return (
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700"
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  // Render badges
  const renderBadges = () => {
    if (!badges || badges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {badges.map((badge, index) => (
          <Badge key={index} variant={badge.variant}>
            {badge.text}
          </Badge>
        ))}
      </div>
    );
  };

  // Render actions
  const renderActions = () => {
    if (!primaryAction && !secondaryAction) return null;

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {primaryAction && (
          primaryAction.href ? (
            <Button
              as={Link}
              href={primaryAction.href}
              variant={primaryAction.variant || 'primary'}
              size={size === 'xl' ? 'lg' : size}
            >
              {primaryAction.label}
            </Button>
          ) : (
            <Button
              onClick={primaryAction.onClick}
              variant={primaryAction.variant || 'primary'}
              size={size === 'xl' ? 'lg' : size}
            >
              {primaryAction.label}
            </Button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Button
              as={Link}
              href={secondaryAction.href}
              variant={secondaryAction.variant || 'secondary'}
              size={size === 'xl' ? 'lg' : size}
            >
              {secondaryAction.label}
            </Button>
          ) : (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'secondary'}
              size={size === 'xl' ? 'lg' : size}
            >
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    );
  };

  // Render features
  const renderFeatures = () => {
    if (!features || features.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-6 justify-center">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Icon
              icon={feature.icon}
              size="sm"
              className={cn(
                theme === 'dark' || (theme === 'auto' && (backgroundImage || backgroundVideo))
                  ? 'text-white/80'
                  : 'text-neutral-600 dark:text-neutral-400'
              )}
            />
            <span className="text-sm font-medium">{feature.text}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render stats
  const renderStats = () => {
    if (!stats || stats.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={cn('font-bold', sizes.titleSize)}>{stat.value}</div>
            <div className={cn('mt-1', sizes.descSize, 'opacity-80')}>{stat.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render trusted by section
  const renderTrustedBy = () => {
    if (!trustedBy || trustedBy.length === 0) return null;

    return (
      <div className="mt-12">
        <p className="text-sm font-medium opacity-60 mb-4">Trusted by</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {trustedBy.map((company, index) => (
            <img
              key={index}
              src={company.logo}
              alt={company.name}
              className="h-8 md:h-10 object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    );
  };

  // Main content
  const mainContent = (
    <div className={contentClasses}>
      {renderBadges()}
      
      {subtitle && (
        <div className={cn('font-medium opacity-90', sizes.subtitleSize)}>
          {subtitle}
        </div>
      )}
      
      <h1 className={cn('font-bold leading-tight', sizes.titleSize, titleClassName)}>
        {title}
      </h1>
      
      {description && (
        <p className={cn('opacity-80 max-w-2xl', sizes.descSize, textAlign === 'center' && 'mx-auto')}>
          {description}
        </p>
      )}
      
      {showSearch && (
        <div className="w-full max-w-2xl mx-auto">
          <SearchBar
            placeholder={searchPlaceholder}
            categories={searchCategories}
            onSearch={onSearch}
            size={size === 'xl' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          />
        </div>
      )}
      
      {renderActions()}
      
      {renderFeatures()}
      
      {variant === 'default' && renderStats()}
      
      {renderTrustedBy()}
    </div>
  );

  return (
    <section className={sectionClasses} aria-label={ariaLabel}>
      {renderBackground()}
      
      <div className={containerClasses}>
        {variant === 'split' ? (
          <>
            <div>{mainContent}</div>
            <div className="relative">
              {/* Placeholder for split content like image or video */}
              {backgroundImage && variant === 'split' && (
                <img
                  src={backgroundImage}
                  alt=""
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              )}
            </div>
          </>
        ) : (
          mainContent
        )}
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

// Specialized hero variants
export interface SimpleHeroProps {
  title: string;
  subtitle?: string;
  primaryAction?: HeroSectionProps['primaryAction'];
  secondaryAction?: HeroSectionProps['secondaryAction'];
  className?: string;
}

export const SimpleHero: React.FC<SimpleHeroProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className,
}) => (
  <HeroSection
    title={title}
    subtitle={subtitle}
    variant="minimal"
    size="md"
    primaryAction={primaryAction}
    secondaryAction={secondaryAction}
    className={className}
  />
);

export interface SearchHeroProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchCategories?: HeroSectionProps['searchCategories'];
  onSearch?: HeroSectionProps['onSearch'];
  backgroundImage?: string;
  className?: string;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  title,
  subtitle,
  searchPlaceholder,
  searchCategories,
  onSearch,
  backgroundImage,
  className,
}) => (
  <HeroSection
    title={title}
    subtitle={subtitle}
    showSearch
    searchPlaceholder={searchPlaceholder}
    searchCategories={searchCategories}
    onSearch={onSearch}
    backgroundImage={backgroundImage}
    overlay
    size="xl"
    className={className}
  />
);

export interface MarketplaceHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  stats?: HeroSectionProps['stats'];
  primaryAction?: HeroSectionProps['primaryAction'];
  trustedBy?: HeroSectionProps['trustedBy'];
  className?: string;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  title,
  subtitle,
  description,
  stats,
  primaryAction,
  trustedBy,
  className,
}) => (
  <HeroSection
    title={title}
    subtitle={subtitle}
    description={description}
    stats={stats}
    primaryAction={primaryAction}
    trustedBy={trustedBy}
    variant="default"
    size="lg"
    backgroundGradient
    className={className}
  />
);