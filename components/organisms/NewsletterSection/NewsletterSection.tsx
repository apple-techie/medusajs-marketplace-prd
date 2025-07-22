import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import { Badge } from '../../atoms/Badge/Badge';
import { Divider } from '../../atoms/Divider/Divider';

export interface NewsletterSectionProps {
  // Content
  title?: string;
  subtitle?: string;
  description?: string;
  
  // Form options
  variant?: 'default' | 'minimal' | 'centered' | 'split' | 'inline';
  layout?: 'stacked' | 'horizontal';
  showNameField?: boolean;
  showPreferences?: boolean;
  preferences?: Array<{ label: string; value: string }>;
  
  // Visual options
  theme?: 'light' | 'dark' | 'gradient' | 'custom';
  backgroundImage?: string;
  backgroundGradient?: string;
  showIcon?: boolean;
  icon?: string;
  
  // Benefits/features
  benefits?: string[];
  showBenefits?: boolean;
  
  // Social proof
  subscriberCount?: number;
  showSubscriberCount?: boolean;
  testimonial?: {
    text: string;
    author: string;
    role?: string;
    avatar?: string;
  };
  
  // Legal
  privacyText?: string;
  privacyLink?: string;
  termsLink?: string;
  
  // Form configuration
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
  loading?: boolean;
  
  // Callbacks
  onSubmit?: (data: { email: string; name?: string; preferences?: string[] }) => Promise<void> | void;
  
  // Styling
  className?: string;
  contentClassName?: string;
  formClassName?: string;
  
  'aria-label'?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = 'Stay in the Loop',
  subtitle,
  description = 'Get the latest updates, exclusive offers, and insider news delivered straight to your inbox.',
  variant = 'default',
  layout = 'stacked',
  showNameField = false,
  showPreferences = false,
  preferences = [],
  theme = 'light',
  backgroundImage,
  backgroundGradient,
  showIcon = true,
  icon = 'mail',
  benefits = [],
  showBenefits = true,
  subscriberCount,
  showSubscriberCount = true,
  testimonial,
  privacyText = 'We respect your privacy and will never spam you.',
  privacyLink,
  termsLink,
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing! Check your email to confirm.',
  errorMessage = 'Something went wrong. Please try again.',
  loading = false,
  onSubmit,
  className,
  contentClassName,
  formClassName,
  'aria-label': ariaLabel,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [touched, setTouched] = useState(false);

  // Default benefits if not provided
  const defaultBenefits = [
    'Exclusive discounts and early access',
    'New product announcements',
    'Expert tips and guides',
    'No spam, unsubscribe anytime',
  ];

  const displayBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      await onSubmit?.({
        email,
        ...(showNameField && { name }),
        ...(showPreferences && { preferences: selectedPreferences }),
      });
      
      setStatus('success');
      setEmail('');
      setName('');
      setSelectedPreferences([]);
      setTouched(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      
      // Reset error message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  // Handle preference toggle
  const togglePreference = (value: string) => {
    setSelectedPreferences(prev =>
      prev.includes(value)
        ? prev.filter(p => p !== value)
        : [...prev, value]
    );
  };

  // Theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-neutral-900 text-white';
      case 'gradient':
        return 'bg-gradient-to-br from-primary-500 to-primary-700 text-white';
      case 'custom':
        return '';
      default:
        return 'bg-neutral-50 dark:bg-neutral-900';
    }
  };

  // Render form fields
  const renderFormFields = () => {
    const isHorizontal = layout === 'horizontal' && !showNameField && !showPreferences;

    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          'w-full',
          isHorizontal ? 'flex gap-2' : 'space-y-4',
          formClassName
        )}
      >
        {showNameField && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-white dark:bg-neutral-800',
              'border border-neutral-200 dark:border-neutral-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'placeholder-neutral-400'
            )}
          />
        )}

        <div className={cn(isHorizontal && 'flex-1')}>
          <input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched && status === 'error') {
                setStatus('idle');
              }
            }}
            onBlur={() => setTouched(true)}
            required
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-white dark:bg-neutral-800',
              'border border-neutral-200 dark:border-neutral-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'placeholder-neutral-400',
              touched && !validateEmail(email) && 'border-red-500',
              isHorizontal && 'rounded-r-none'
            )}
            aria-invalid={touched && !validateEmail(email)}
            aria-describedby="email-error"
          />
          {touched && !validateEmail(email) && (
            <p id="email-error" className="text-sm text-red-500 mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>

        {showPreferences && preferences.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">I'm interested in:</p>
            <div className="space-y-2">
              {preferences.map((pref) => (
                <label key={pref.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPreferences.includes(pref.value)}
                    onChange={() => togglePreference(pref.value)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading || status === 'loading'}
          className={cn(
            'w-full',
            isHorizontal && 'w-auto rounded-l-none'
          )}
        >
          {loading || status === 'loading' ? (
            <>
              <Icon icon="loader" size="sm" className="mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            buttonText
          )}
        </Button>

        {(status === 'success' || status === 'error') && (
          <div
            className={cn(
              'p-3 rounded-lg text-sm',
              status === 'success' && 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400',
              status === 'error' && 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            )}
            role="alert"
          >
            <Icon
              icon={status === 'success' ? 'check-circle' : 'alert-circle'}
              size="sm"
              className="inline mr-2"
            />
            {status === 'success' ? successMessage : errorMessage}
          </div>
        )}
      </form>
    );
  };

  // Render benefits
  const renderBenefits = () => {
    if (!showBenefits || variant === 'minimal') return null;

    return (
      <ul className="space-y-2 text-sm">
        {displayBenefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2">
            <Icon
              icon="check"
              size="xs"
              className="text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0"
            />
            <span className="text-neutral-700 dark:text-neutral-300">{benefit}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Render testimonial
  const renderTestimonial = () => {
    if (!testimonial) return null;

    return (
      <div className="mt-6 p-4 bg-white/50 dark:bg-white/10 rounded-lg">
        <p className="text-sm italic mb-2">"{testimonial.text}"</p>
        <div className="flex items-center gap-2">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium">{testimonial.author}</p>
            {testimonial.role && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {testimonial.role}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render content based on variant
  const renderContent = () => {
    const header = (
      <>
        {showIcon && variant !== 'minimal' && (
          <div className="mb-4">
            <div className={cn(
              'inline-flex items-center justify-center w-12 h-12 rounded-full',
              theme === 'dark' || theme === 'gradient'
                ? 'bg-white/10'
                : 'bg-primary-100 dark:bg-primary-900/20'
            )}>
              <Icon
                icon={icon}
                size="lg"
                className={
                  theme === 'dark' || theme === 'gradient'
                    ? 'text-white'
                    : 'text-primary-600 dark:text-primary-400'
                }
              />
            </div>
          </div>
        )}

        {title && (
          <h2 className={cn(
            'font-bold mb-2',
            variant === 'minimal' ? 'text-xl' : 'text-2xl md:text-3xl'
          )}>
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-lg font-medium mb-2 text-primary-600 dark:text-primary-400">
            {subtitle}
          </p>
        )}

        {description && variant !== 'minimal' && (
          <p className={cn(
            'mb-6',
            theme === 'dark' || theme === 'gradient'
              ? 'text-white/80'
              : 'text-neutral-600 dark:text-neutral-400'
          )}>
            {description}
          </p>
        )}

        {showSubscriberCount && subscriberCount && (
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="users" size="sm" />
            <span className="text-sm font-medium">
              Join {subscriberCount.toLocaleString()}+ subscribers
            </span>
          </div>
        )}
      </>
    );

    switch (variant) {
      case 'minimal':
        return (
          <div className={contentClassName}>
            {header}
            {renderFormFields()}
          </div>
        );

      case 'centered':
        return (
          <div className={cn('text-center max-w-2xl mx-auto', contentClassName)}>
            {header}
            {renderFormFields()}
            {renderBenefits()}
            {renderTestimonial()}
          </div>
        );

      case 'split':
        return (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={contentClassName}>
              {header}
              {renderBenefits()}
              {renderTestimonial()}
            </div>
            <div>
              {renderFormFields()}
            </div>
          </div>
        );

      case 'inline':
        return (
          <div className={cn('flex flex-col md:flex-row items-center gap-6', contentClassName)}>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              {description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {description}
                </p>
              )}
            </div>
            <div className="w-full md:w-auto">
              {renderFormFields()}
            </div>
          </div>
        );

      default:
        return (
          <div className={cn('max-w-xl', contentClassName)}>
            {header}
            {renderFormFields()}
            {renderBenefits()}
            {renderTestimonial()}
          </div>
        );
    }
  };

  // Privacy and terms
  const renderPrivacy = () => {
    if (!privacyText && !privacyLink && !termsLink) return null;

    return (
      <div className="mt-6 text-xs text-neutral-600 dark:text-neutral-400 text-center">
        {privacyText && <p className="mb-1">{privacyText}</p>}
        {(privacyLink || termsLink) && (
          <p>
            {privacyLink && (
              <a
                href={privacyLink}
                className="underline hover:text-primary-600 dark:hover:text-primary-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            )}
            {privacyLink && termsLink && ' • '}
            {termsLink && (
              <a
                href={termsLink}
                className="underline hover:text-primary-600 dark:hover:text-primary-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            )}
          </p>
        )}
      </div>
    );
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        getThemeClasses(),
        className
      )}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        background: backgroundGradient,
      }}
      aria-label={ariaLabel || 'Newsletter signup'}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {renderContent()}
        {renderPrivacy()}
      </div>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';

// Simple newsletter component
export interface SimpleNewsletterProps {
  title?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void> | void;
  className?: string;
}

export const SimpleNewsletter: React.FC<SimpleNewsletterProps> = ({
  title = 'Subscribe to our newsletter',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  onSubmit,
  className,
}) => (
  <NewsletterSection
    title={title}
    variant="inline"
    layout="horizontal"
    showIcon={false}
    showBenefits={false}
    placeholder={placeholder}
    buttonText={buttonText}
    onSubmit={onSubmit ? (data) => onSubmit(data.email) : undefined}
    className={className}
  />
);