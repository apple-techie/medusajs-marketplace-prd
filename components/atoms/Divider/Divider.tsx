import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Divider variants
const dividerVariants = cva(
  'border-0',
  {
    variants: {
      orientation: {
        horizontal: 'w-full h-px',
        vertical: 'h-full w-px',
      },
      variant: {
        solid: '',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
        gradient: 'bg-gradient-to-r',
      },
      color: {
        default: 'bg-neutral-200 dark:bg-neutral-800',
        primary: 'bg-primary-200 dark:bg-primary-800',
        secondary: 'bg-secondary-200 dark:bg-secondary-800',
        muted: 'bg-neutral-100 dark:bg-neutral-900',
        strong: 'bg-neutral-300 dark:bg-neutral-700',
      },
      thickness: {
        thin: '',
        medium: '',
        thick: '',
      },
      spacing: {
        none: '',
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    compoundVariants: [
      // Horizontal thickness
      {
        orientation: 'horizontal',
        thickness: 'thin',
        className: 'h-px',
      },
      {
        orientation: 'horizontal',
        thickness: 'medium',
        className: 'h-0.5',
      },
      {
        orientation: 'horizontal',
        thickness: 'thick',
        className: 'h-1',
      },
      // Vertical thickness
      {
        orientation: 'vertical',
        thickness: 'thin',
        className: 'w-px',
      },
      {
        orientation: 'vertical',
        thickness: 'medium',
        className: 'w-0.5',
      },
      {
        orientation: 'vertical',
        thickness: 'thick',
        className: 'w-1',
      },
      // Horizontal spacing
      {
        orientation: 'horizontal',
        spacing: 'none',
        className: 'my-0',
      },
      {
        orientation: 'horizontal',
        spacing: 'xs',
        className: 'my-1',
      },
      {
        orientation: 'horizontal',
        spacing: 'sm',
        className: 'my-2',
      },
      {
        orientation: 'horizontal',
        spacing: 'md',
        className: 'my-4',
      },
      {
        orientation: 'horizontal',
        spacing: 'lg',
        className: 'my-6',
      },
      {
        orientation: 'horizontal',
        spacing: 'xl',
        className: 'my-8',
      },
      // Vertical spacing
      {
        orientation: 'vertical',
        spacing: 'none',
        className: 'mx-0',
      },
      {
        orientation: 'vertical',
        spacing: 'xs',
        className: 'mx-1',
      },
      {
        orientation: 'vertical',
        spacing: 'sm',
        className: 'mx-2',
      },
      {
        orientation: 'vertical',
        spacing: 'md',
        className: 'mx-4',
      },
      {
        orientation: 'vertical',
        spacing: 'lg',
        className: 'mx-6',
      },
      {
        orientation: 'vertical',
        spacing: 'xl',
        className: 'mx-8',
      },
      // Gradient variants
      {
        variant: 'gradient',
        color: 'default',
        className: 'from-transparent via-neutral-200 to-transparent dark:via-neutral-800',
      },
      {
        variant: 'gradient',
        color: 'primary',
        className: 'from-transparent via-primary-200 to-transparent dark:via-primary-800',
      },
      {
        variant: 'gradient',
        color: 'secondary',
        className: 'from-transparent via-secondary-200 to-transparent dark:via-secondary-800',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'solid',
      color: 'default',
      thickness: 'thin',
      spacing: 'md',
    },
  }
);

export interface DividerProps extends VariantProps<typeof dividerVariants> {
  className?: string;
  children?: React.ReactNode;
  textAlign?: 'left' | 'center' | 'right';
  textClassName?: string;
  as?: 'div' | 'hr';
  'aria-orientation'?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  children,
  textAlign = 'center',
  textClassName,
  as: Component = 'hr',
  'aria-orientation': ariaOrientation,
  orientation = 'horizontal',
  variant,
  color,
  thickness,
  spacing,
}) => {
  // If variant is dashed or dotted, we need to render as a bordered div
  const needsBorder = variant === 'dashed' || variant === 'dotted';
  
  if (children) {
    // Divider with text
    const textAlignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }[textAlign];

    return (
      <div
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
          dividerVariants({ spacing }),
          className
        )}
        role="separator"
        aria-orientation={ariaOrientation || orientation}
      >
        {(textAlign === 'center' || textAlign === 'right') && (
          <div
            className={cn(
              dividerVariants({ orientation, variant, color, thickness }),
              orientation === 'horizontal' ? 'flex-1' : 'flex-1',
              needsBorder && orientation === 'horizontal' && 'border-t',
              needsBorder && orientation === 'vertical' && 'border-l'
            )}
          />
        )}
        
        <span
          className={cn(
            'px-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap',
            orientation === 'vertical' && 'py-3 px-0 writing-mode-vertical',
            textClassName
          )}
        >
          {children}
        </span>
        
        {(textAlign === 'center' || textAlign === 'left') && (
          <div
            className={cn(
              dividerVariants({ orientation, variant, color, thickness }),
              orientation === 'horizontal' ? 'flex-1' : 'flex-1',
              needsBorder && orientation === 'horizontal' && 'border-t',
              needsBorder && orientation === 'vertical' && 'border-l'
            )}
          />
        )}
      </div>
    );
  }

  if (needsBorder) {
    // Render as bordered div for dashed/dotted variants
    return (
      <div
        className={cn(
          dividerVariants({ orientation, variant, color, thickness, spacing }),
          orientation === 'horizontal' ? 'border-t' : 'border-l',
          variant === 'dashed' && 'border-dashed',
          variant === 'dotted' && 'border-dotted',
          color === 'default' && 'border-neutral-200 dark:border-neutral-800',
          color === 'primary' && 'border-primary-200 dark:border-primary-800',
          color === 'secondary' && 'border-secondary-200 dark:border-secondary-800',
          color === 'muted' && 'border-neutral-100 dark:border-neutral-900',
          color === 'strong' && 'border-neutral-300 dark:border-neutral-700',
          className
        )}
        role="separator"
        aria-orientation={ariaOrientation || orientation}
      />
    );
  }

  // Regular divider
  if (Component === 'hr' && orientation === 'horizontal') {
    return (
      <hr
        className={cn(
          dividerVariants({ orientation, variant, color, thickness, spacing }),
          className
        )}
        aria-orientation={ariaOrientation || orientation}
      />
    );
  }

  return (
    <div
      className={cn(
        dividerVariants({ orientation, variant, color, thickness, spacing }),
        className
      )}
      role="separator"
      aria-orientation={ariaOrientation || orientation}
    />
  );
};

Divider.displayName = 'Divider';

// Section divider with optional icon
export interface SectionDividerProps extends DividerProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'center' | 'right';
  iconClassName?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  icon,
  iconPosition = 'center',
  iconClassName,
  children,
  textAlign,
  ...props
}) => {
  const position = children ? textAlign : iconPosition;
  
  return (
    <Divider textAlign={position} {...props}>
      {icon && (
        <span className={cn('inline-flex items-center', iconClassName)}>
          {icon}
        </span>
      )}
      {children}
    </Divider>
  );
};

// Vertical divider helper
export const VerticalDivider: React.FC<Omit<DividerProps, 'orientation'>> = (props) => {
  return <Divider orientation="vertical" {...props} />;
};

// Gradient divider helper
export const GradientDivider: React.FC<Omit<DividerProps, 'variant'>> = (props) => {
  return <Divider variant="gradient" {...props} />;
};