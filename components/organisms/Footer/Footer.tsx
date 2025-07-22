import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../../atoms/Icon/Icon';
import { Button } from '../../atoms/Button/Button';

// Define section interfaces
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface AppStoreLink {
  type: 'google' | 'apple';
  url: string;
}

export interface FooterProps {
  companyName?: string;
  tagline?: string;
  sections?: FooterSection[];
  appStoreLinks?: AppStoreLink[];
  qrCodeUrl?: string;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterSubmit?: (email: string) => void;
  className?: string;
  copyrightText?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// Newsletter component
const NewsletterSection: React.FC<{
  title: string;
  description: string;
  onSubmit: (email: string) => void;
}> = ({ title, description, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await onSubmit(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={status === 'loading'}
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={status === 'loading' || !email}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {status === 'success' && (
        <p className="text-sm text-success-600">Successfully subscribed!</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-danger-600">Something went wrong. Please try again.</p>
      )}
    </div>
  );
};

// App download section
const AppDownloadSection: React.FC<{
  title: string;
  description: string;
  appStoreLinks: AppStoreLink[];
  qrCodeUrl?: string;
}> = ({ title, description, appStoreLinks, qrCodeUrl }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
      
      <div className="flex items-start gap-4">
        {qrCodeUrl && (
          <img 
            src={qrCodeUrl} 
            alt="Download QR Code" 
            className="w-24 h-24 rounded-lg"
          />
        )}
        
        <div className="space-y-2">
          {appStoreLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {link.type === 'google' ? (
                <img 
                  src="/google-play-badge.png" 
                  alt="Get it on Google Play" 
                  className="h-10"
                />
              ) : (
                <img 
                  src="/app-store-badge.png" 
                  alt="Download on the App Store" 
                  className="h-10"
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Social links component
const SocialLinks: React.FC<{
  links: FooterProps['socialLinks'];
}> = ({ links }) => {
  if (!links) return null;

  const socialIcons: Record<string, string> = {
    facebook: 'facebook',
    twitter: 'twitter',
    instagram: 'instagram',
    linkedin: 'linkedin',
    youtube: 'youtube',
  };

  return (
    <div className="flex gap-4">
      {Object.entries(links).map(([platform, url]) => 
        url ? (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label={`Visit our ${platform}`}
          >
            <Icon icon={socialIcons[platform] || 'globe'} size="sm" />
          </a>
        ) : null
      )}
    </div>
  );
};

// Default footer sections
const defaultSections: FooterSection[] = [
  {
    title: 'SUPPORT',
    links: [
      { label: 'Become a seller', href: '/become-seller' },
      { label: 'Help Center', href: '/help' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
];

// Main Footer component
export const Footer: React.FC<FooterProps> = ({
  companyName = 'Neo Mart',
  tagline = 'Get exclusive deals, faster checkout, and real-time order updates—right at your fingertips. Download now and enjoy a better shopping experience!',
  sections = defaultSections,
  appStoreLinks = [
    { type: 'google', url: '#' },
    { type: 'apple', url: '#' },
  ],
  qrCodeUrl,
  showNewsletter = false,
  newsletterTitle = 'Subscribe to our Newsletter',
  newsletterDescription = 'Get the latest updates and exclusive offers delivered to your inbox.',
  onNewsletterSubmit = () => {},
  className,
  copyrightText,
  socialLinks,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. All rights reserved.`;

  return (
    <footer className={cn('bg-white border-t border-neutral-200', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Company info and app download */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">
                  {companyName}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {tagline}
                </p>
              </div>

              {/* App download section */}
              <AppDownloadSection
                title="Shop Smarter with Our App"
                description="Get exclusive deals, faster checkout, and real-time order updates—right at your fingertips. Download now and enjoy a better shopping experience!"
                appStoreLinks={appStoreLinks}
                qrCodeUrl={qrCodeUrl}
              />
            </div>

            {/* Footer links */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter section */}
            {showNewsletter && (
              <div className="lg:col-span-3">
                <NewsletterSection
                  title={newsletterTitle}
                  description={newsletterDescription}
                  onSubmit={onNewsletterSubmit}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-6 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-600">
              {copyrightText || defaultCopyright}
            </p>
            {socialLinks && <SocialLinks links={socialLinks} />}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';