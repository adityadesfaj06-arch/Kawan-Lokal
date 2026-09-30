import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'horizontal' | 'mark' | 'card';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'light' | 'dark';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  showTagline = false,
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFF8EE' : '#54382B';
  const roofColor = '#CA9344';
  const leafColor = '#637848';

  // Mark only (House + window + leaves)
  if (variant === 'mark') {
    const markSize = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    }[size];

    return (
      <div className={`relative inline-flex items-center justify-center ${markSize} ${className}`}>
        <svg viewBox="0 0 100 85" className="w-full h-full drop-shadow-sm" fill="none">
          {/* Peaked roof */}
          <path
            d="M 12 44 C 28 40, 43 28, 50 16 C 57 28, 72 40, 88 44"
            stroke={roofColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 4 Window dots */}
          <rect x="42" y="38" width="6" height="6" rx="1.5" fill={roofColor} />
          <rect x="52" y="38" width="6" height="6" rx="1.5" fill={roofColor} />
          <rect x="42" y="48" width="6" height="6" rx="1.5" fill={roofColor} />
          <rect x="52" y="48" width="6" height="6" rx="1.5" fill={roofColor} />
          {/* Leaf accent */}
          <path
            d="M 80 50 C 93 50, 96 64, 82 70 C 79 63, 78 55, 80 50 Z"
            fill={leafColor}
          />
          <path
            d="M 77 74 C 95 74, 95 84, 78 85 C 77 80, 75 76, 77 74 Z"
            fill={leafColor}
          />
        </svg>
      </div>
    );
  }

  // Full stacked badge (just like the user's uploaded image with the card look)
  if (variant === 'card' || variant === 'full') {
    const cardScale = {
      xs: 'w-28',
      sm: 'w-36',
      md: 'w-48 sm:w-56',
      lg: 'w-64 sm:w-72',
      xl: 'w-80 sm:w-96',
    }[size];

    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl ${
          variant === 'card'
            ? 'bg-[#FAF5ED] border border-[#E8DCC9] shadow-[0_8px_30px_rgb(84,56,43,0.06)]'
            : ''
        } ${cardScale} ${className}`}
      >
        <svg viewBox="0 0 320 280" className="w-full h-auto max-w-full" fill="none">
          {/* Peaked roof */}
          <path
            d="M 100 84 C 130 78, 150 56, 160 40 C 170 56, 190 78, 220 84"
            stroke={roofColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4 Window dots */}
          <rect x="146" y="80" width="10" height="10" rx="2.5" fill={roofColor} />
          <rect x="164" y="80" width="10" height="10" rx="2.5" fill={roofColor} />
          <rect x="146" y="98" width="10" height="10" rx="2.5" fill={roofColor} />
          <rect x="164" y="98" width="10" height="10" rx="2.5" fill={roofColor} />

          {/* Kawan */}
          <text
            x="160"
            y="160"
            textAnchor="middle"
            fill={textColor}
            style={{ fontFamily: "'Fredoka', 'Comfortaa', 'Baloo 2', system-ui, sans-serif" }}
            className="font-bold text-[56px] select-none"
          >
            Kawan
          </text>

          {/* Lokal */}
          <text
            x="142"
            y="218"
            textAnchor="middle"
            fill={textColor}
            style={{ fontFamily: "'Fredoka', 'Comfortaa', 'Baloo 2', system-ui, sans-serif" }}
            className="font-bold text-[58px] select-none"
          >
            Lokal
          </text>

          {/* Leaves */}
          <path
            d="M 232 144 C 252 146, 256 166, 234 175 C 230 164, 228 152, 232 144 Z"
            fill={leafColor}
          />
          <path
            d="M 228 181 C 255 181, 255 197, 230 199 C 228 191, 226 185, 228 181 Z"
            fill={leafColor}
          />

          {/* Underline */}
          <path
            d="M 104 240 C 146 228, 192 222, 232 220"
            stroke={leafColor}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>

        {showTagline && (
          <p
            className={`mt-1 text-center font-medium tracking-wide text-xs sm:text-sm ${
              isDark ? 'text-[#E8DCC9]' : 'text-[#846754]'
            }`}
          >
            Jajanan Viral &amp; Bubuk Minuman
          </p>
        )}
      </div>
    );
  }

  // Horizontal variant (default for navbar & inline headers)
  const fontSizes = {
    xs: 'text-base',
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Visual House & Dots Mark */}
      <div className={`relative flex-shrink-0 ${iconSizes}`}>
        <svg viewBox="0 0 100 90" className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105" fill="none">
          {/* Peaked roof */}
          <path
            d="M 14 42 C 30 38, 44 26, 50 14 C 56 26, 70 38, 86 42"
            stroke={roofColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 4 Window dots */}
          <rect x="42" y="38" width="6.5" height="6.5" rx="1.8" fill={roofColor} />
          <rect x="52" y="38" width="6.5" height="6.5" rx="1.8" fill={roofColor} />
          <rect x="42" y="48" width="6.5" height="6.5" rx="1.8" fill={roofColor} />
          <rect x="52" y="48" width="6.5" height="6.5" rx="1.8" fill={roofColor} />
          {/* Two small green leaves */}
          <path
            d="M 80 46 C 92 46, 95 58, 82 64 C 79 58, 78 51, 80 46 Z"
            fill={leafColor}
          />
          <path
            d="M 77 68 C 93 68, 93 78, 78 79 C 77 75, 75 71, 77 68 Z"
            fill={leafColor}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span
            style={{
              fontFamily: "'Fredoka', 'Comfortaa', 'Baloo 2', system-ui, sans-serif",
              color: textColor,
            }}
            className={`font-bold tracking-tight ${fontSizes}`}
          >
            Kawan Lokal
          </span>
          {/* Leaf mark next to text */}
          <span className="inline-flex -mt-1 text-[#637848] text-xs sm:text-sm font-bold">🌿</span>
        </div>
        {/* Subtle decorative green underline indicator */}
        <div className="w-11/12 h-[2.5px] bg-[#637848] rounded-full mt-0.5 opacity-85 transition-all duration-300 group-hover:w-full group-hover:bg-[#CA9344]" />
      </div>
    </div>
  );
};
