import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define logo variants
const companyLogosVariants = cva(
  'flex items-center justify-center',
  {
    variants: {
      layout: {
        horizontal: 'flex-row flex-wrap',
        vertical: 'flex-col',
        grid: 'grid',
      },
      size: {
        sm: 'gap-6',
        md: 'gap-8',
        lg: 'gap-12',
      },
      alignment: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      size: 'md',
      alignment: 'center',
    },
  }
);

const logoVariants = cva(
  'relative flex items-center justify-center transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-auto',
        md: 'h-11 w-auto',
        lg: 'h-14 w-auto',
      },
      grayscale: {
        true: 'grayscale hover:grayscale-0',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-110',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      grayscale: true,
      interactive: false,
    },
  }
);

// Logo interface
export interface Logo {
  id: string;
  name: string;
  src: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface CompanyLogosProps extends VariantProps<typeof companyLogosVariants> {
  logos: Logo[];
  title?: string;
  description?: string;
  showTitle?: boolean;
  logoSize?: VariantProps<typeof logoVariants>['size'];
  grayscale?: boolean;
  interactive?: boolean;
  columns?: 2 | 3 | 4 | 5 | 6 | 'auto';
  className?: string;
  logoClassName?: string;
  containerClassName?: string;
  onLogoClick?: (logo: Logo) => void;
}

// Default shipping partner logos
export const defaultShippingLogos: Logo[] = [
  {
    id: 'dhl',
    name: 'DHL',
    src: '/logos/dhl.svg',
    href: 'https://www.dhl.com',
  },
  {
    id: 'fedex',
    name: 'FedEx',
    src: '/logos/fedex.svg',
    href: 'https://www.fedex.com',
  },
  {
    id: 'pos-indonesia',
    name: 'Pos Indonesia',
    src: '/logos/pos-indonesia.svg',
    href: 'https://www.posindonesia.co.id',
  },
  {
    id: 'jne',
    name: 'JNE Express',
    src: '/logos/jne.svg',
    href: 'https://www.jne.co.id',
  },
];

// Default payment partner logos
export const defaultPaymentLogos: Logo[] = [
  {
    id: 'visa',
    name: 'Visa',
    src: '/logos/visa.svg',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    src: '/logos/mastercard.svg',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    src: '/logos/paypal.svg',
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    src: '/logos/apple-pay.svg',
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    src: '/logos/google-pay.svg',
  },
];

// Default brand partner logos
export const defaultBrandLogos: Logo[] = [
  {
    id: 'nike',
    name: 'Nike',
    src: '/logos/nike.svg',
  },
  {
    id: 'adidas',
    name: 'Adidas',
    src: '/logos/adidas.svg',
  },
  {
    id: 'apple',
    name: 'Apple',
    src: '/logos/apple.svg',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    src: '/logos/samsung.svg',
  },
];

// Logo component
const LogoItem: React.FC<{
  logo: Logo;
  size?: VariantProps<typeof logoVariants>['size'];
  grayscale?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: (logo: Logo) => void;
}> = ({ logo, size, grayscale, interactive, className, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(logo);
    } else if (logo.href && interactive) {
      window.open(logo.href, '_blank', 'noopener,noreferrer');
    }
  };

  const LogoWrapper = logo.href || interactive ? 'button' : 'div';

  return (
    <LogoWrapper
      className={cn(
        logoVariants({ size, grayscale, interactive }),
        className
      )}
      onClick={interactive ? handleClick : undefined}
      aria-label={logo.name}
      title={logo.name}
    >
      <img
        src={logo.src}
        alt={logo.name}
        className="h-full w-auto object-contain"
        style={{
          maxWidth: logo.width ? `${logo.width}px` : undefined,
          maxHeight: logo.height ? `${logo.height}px` : undefined,
        }}
      />
    </LogoWrapper>
  );
};

// Main CompanyLogos component
export const CompanyLogos: React.FC<CompanyLogosProps> = ({
  logos,
  title = 'Our Partners',
  description = 'Trusted by leading companies worldwide',
  showTitle = false,
  layout = 'horizontal',
  size = 'md',
  alignment = 'center',
  logoSize = 'md',
  grayscale = true,
  interactive = false,
  columns = 'auto',
  className,
  logoClassName,
  containerClassName,
  onLogoClick,
}) => {
  const gridColumns = columns === 'auto' 
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
    : `grid-cols-${columns}`;

  return (
    <div className={cn('w-full', containerClassName)}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-neutral-600">{description}</p>
          )}
        </div>
      )}

      <div
        className={cn(
          companyLogosVariants({ layout, size, alignment }),
          layout === 'grid' && gridColumns,
          className
        )}
      >
        {logos.map((logo) => (
          <LogoItem
            key={logo.id}
            logo={logo}
            size={logoSize}
            grayscale={grayscale}
            interactive={interactive}
            className={logoClassName}
            onClick={onLogoClick}
          />
        ))}
      </div>
    </div>
  );
};

// Preset components for common use cases
export const ShippingPartnerLogos: React.FC<Omit<CompanyLogosProps, 'logos'> & { logos?: Logo[] }> = ({
  logos = defaultShippingLogos,
  title = 'Shipping Partners',
  description = 'Fast and reliable delivery with our trusted partners',
  ...props
}) => {
  return <CompanyLogos logos={logos} title={title} description={description} {...props} />;
};

export const PaymentPartnerLogos: React.FC<Omit<CompanyLogosProps, 'logos'> & { logos?: Logo[] }> = ({
  logos = defaultPaymentLogos,
  title = 'Payment Methods',
  description = 'Secure payments accepted',
  ...props
}) => {
  return <CompanyLogos logos={logos} title={title} description={description} {...props} />;
};

export const BrandPartnerLogos: React.FC<Omit<CompanyLogosProps, 'logos'> & { logos?: Logo[] }> = ({
  logos = defaultBrandLogos,
  title = 'Featured Brands',
  description = 'Shop from top brands',
  ...props
}) => {
  return <CompanyLogos logos={logos} title={title} description={description} {...props} />;
};

CompanyLogos.displayName = 'CompanyLogos';