import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'outline'
  | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm';
export type ButtonShape = 'capsule' | 'rounded';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  shine?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      shape = 'capsule',
      shine = true,
      fullWidth = false,
      icon,
      iconRight,
      loading = false,
      disabled = false,
      className = '',
      href,
      target,
      rel,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isIconOnly = size === 'icon' || size === 'icon-sm';

    // Shapes: capsule is rounded-full, rounded is rounded-2xl
    const shapeClasses = isIconOnly
      ? 'rounded-full'
      : shape === 'capsule'
      ? 'rounded-full'
      : 'rounded-2xl';

    // Sizes
    const sizeClasses = {
      sm: 'text-xs py-2 px-4 gap-1.5 min-h-[36px]',
      md: 'text-xs sm:text-sm py-2.5 px-5 sm:px-6 gap-2 min-h-[42px]',
      lg: 'text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 gap-2.5 min-h-[48px]',
      xl: 'text-base sm:text-lg py-4 px-8 gap-3 min-h-[56px]',
      icon: 'w-10 h-10 p-2 min-h-[40px] min-w-[40px]',
      'icon-sm': 'w-8 h-8 p-1.5 min-h-[32px] min-w-[32px]',
    }[size];

    // Variants with 3D tactile glassmorphism styling
    const variantClasses = {
      primary:
        'btn-3d-primary text-white font-extrabold focus-visible:ring-[#215C46]',
      secondary:
        'btn-3d-secondary text-[#10241D] font-bold focus-visible:ring-[#215C46]',
      glass:
        'btn-3d-glass text-[#10241D] font-bold focus-visible:ring-[#215C46]',
      outline:
        'btn-3d-outline text-[#215C46] font-bold focus-visible:ring-[#215C46]',
      ghost:
        'btn-3d-ghost text-[#10241D] font-semibold hover:text-[#215C46] focus-visible:ring-[#215C46]',
      success:
        'btn-3d-success text-white font-extrabold focus-visible:ring-[#215C46]',
      danger:
        'btn-3d-danger text-white font-bold focus-visible:ring-[#DC2626]',
    }[variant];

    // Shine animation toggle
    const shineClass =
      shine && (variant === 'primary' || variant === 'success' || variant === 'danger')
        ? 'btn-shine'
        : '';

    const widthClass = fullWidth ? 'w-full justify-center' : '';
    const disabledClass = disabled || loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

    const combinedClasses = [
      'relative inline-flex items-center justify-center select-none font-sans',
      'transition-all duration-200 ease-out overflow-hidden',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      shapeClasses,
      sizeClasses,
      variantClasses,
      shineClass,
      widthClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const content = (
      <>
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">{icon}</span>
        )}
        {children && <span className="truncate leading-none">{children}</span>}
        {!loading && iconRight && (
          <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{iconRight}</span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={`group ${combinedClasses}`}
          role="button"
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`group ${combinedClasses}`}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Reusable named variants conforming to prompt Section 7
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />;
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />;
}

export function DangerButton(props: ButtonProps) {
  return <Button variant="danger" {...props} />;
}

export function SuccessButton(props: ButtonProps) {
  return <Button variant="success" {...props} />;
}

export function IconButton(props: ButtonProps) {
  return <Button size="icon" {...props} />;
}
