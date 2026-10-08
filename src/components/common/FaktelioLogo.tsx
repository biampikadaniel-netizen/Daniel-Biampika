import React from 'react';

interface FaktelioLogoProps {
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white';
  className?: string;
}

export function FaktelioLogo({
  iconOnly = false,
  size = 'md',
  variant = 'default',
  className = '',
}: FaktelioLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        className={`${iconSizes[size]} shrink-0`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="8"
          y="8"
          width="104"
          height="104"
          rx="26"
          fill={variant === 'white' ? '#FFFFFF' : '#1E4F91'}
        />
        <rect
          x="12"
          y="12"
          width="96"
          height="96"
          rx="22"
          stroke={variant === 'white' ? '#1E4F91' : '#2D5FA8'}
          strokeWidth="2"
          strokeOpacity="0.4"
        />
        <path
          d="M36 32C36 28.6863 38.6863 26 42 26H78C81.3137 26 84 28.6863 84 32V38C84 40.2091 82.2091 42 80 42H50V54H72C74.2091 54 76 55.7909 76 58V64C76 66.2091 74.2091 68 72 68H50V88C50 91.3137 47.3137 94 44 94H42C38.6863 94 36 91.3137 36 88V32Z"
          fill={variant === 'white' ? '#1E4F91' : '#FFFFFF'}
        />
        <circle cx="80" cy="80" r="20" fill="#F47B20" />
        <path
          d="M72 80.5L77.5 86L89 74.5"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!iconOnly && (
        <span className={`font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
          <span className={variant === 'white' ? 'text-white' : 'text-[#1E4F91]'}>FAKTE</span>
          <span className="text-[#F47B20]">LIO</span>
        </span>
      )}
    </span>
  );
}
