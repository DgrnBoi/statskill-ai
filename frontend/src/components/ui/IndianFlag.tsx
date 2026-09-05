import React from 'react';

interface IndianFlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'flag' | 'circular' | 'shield';
}

/**
 * Authentic Indian National Flag (Tiranga) SVG Component
 * Built according to the Flag Code of India specifications:
 * - 3:2 Aspect Ratio with three equal horizontal tricolour stripes
 * - India Saffron (#FF9933), Pure White (#FFFFFF), India Green (#138808)
 * - Centered Navy Blue (#000080) Ashoka Chakra with exactly 24 radial spokes
 */
export function IndianFlag({
  className = '',
  width,
  height,
  variant = 'flag',
  ...props
}: IndianFlagProps) {
  // Generate exact 24 radial spokes at 15-degree increments (360 / 24 = 15)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  if (variant === 'circular') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        width={width || 40}
        height={height || 40}
        role="img"
        aria-label="National Flag of India (Circular Emblem)"
        {...props}
      >
        <defs>
          <clipPath id="circle-clip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        {/* Outer Gold/Border Ring */}
        <circle cx="50" cy="50" r="49" fill="none" stroke="#D97706" strokeWidth="1.5" />

        <g clipPath="url(#circle-clip)">
          {/* Top: Saffron */}
          <rect x="0" y="0" width="100" height="33.33" fill="#FF9933" />
          {/* Middle: White */}
          <rect x="0" y="33.33" width="100" height="33.34" fill="#FFFFFF" />
          {/* Bottom: Green */}
          <rect x="0" y="66.67" width="100" height="33.33" fill="#138808" />

          {/* Centered Ashoka Chakra */}
          <g transform="translate(50, 50)">
            {/* Outer Rim */}
            <circle cx="0" cy="0" r="14" fill="none" stroke="#000080" strokeWidth="1.2" />
            {/* Inner Hub */}
            <circle cx="0" cy="0" r="2.8" fill="#000080" />
            <circle cx="0" cy="0" r="1.4" fill="#FFFFFF" />

            {/* 24 Spokes */}
            {spokes.map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2="-14" stroke="#000080" strokeWidth="0.8" />
                <circle cx="0" cy="-14" r="0.6" fill="#000080" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    );
  }

  if (variant === 'shield') {
    return (
      <svg
        viewBox="0 0 100 120"
        className={className}
        width={width || 40}
        height={height || 48}
        role="img"
        aria-label="National Flag of India (Sovereign Shield)"
        {...props}
      >
        <defs>
          <clipPath id="shield-clip">
            <path d="M 50 4 Q 85 4 94 20 Q 94 75 50 116 Q 6 75 6 20 Q 15 4 50 4 Z" />
          </clipPath>
        </defs>

        <path
          d="M 50 4 Q 85 4 94 20 Q 94 75 50 116 Q 6 75 6 20 Q 15 4 50 4 Z"
          fill="#FFFFFF"
          stroke="#D97706"
          strokeWidth="2"
        />

        <g clipPath="url(#shield-clip)">
          {/* Top: Saffron */}
          <rect x="0" y="0" width="100" height="40" fill="#FF9933" />
          {/* Middle: White */}
          <rect x="0" y="40" width="100" height="40" fill="#FFFFFF" />
          {/* Bottom: Green */}
          <rect x="0" y="80" width="100" height="40" fill="#138808" />

          {/* Centered Ashoka Chakra */}
          <g transform="translate(50, 60)">
            <circle cx="0" cy="0" r="15" fill="none" stroke="#000080" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3" fill="#000080" />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />

            {spokes.map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line x1="0" y1="0" x2="0" y2="-15" stroke="#000080" strokeWidth="0.9" />
                <circle cx="0" cy="-15" r="0.7" fill="#000080" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    );
  }

  // Default Standard 3:2 Rectangular Indian National Flag
  return (
    <svg
      viewBox="0 0 900 600"
      className={`rounded shadow-xs border border-slate-200/80 ${className}`}
      width={width || 36}
      height={height || 24}
      role="img"
      aria-label="National Flag of India (Tiranga)"
      {...props}
    >
      {/* Top Stripe: India Saffron (Kesari) */}
      <rect x="0" y="0" width="900" height="200" fill="#FF9933" />

      {/* Middle Stripe: White (Shwet) */}
      <rect x="0" y="200" width="900" height="200" fill="#FFFFFF" />

      {/* Bottom Stripe: India Green (Hara) */}
      <rect x="0" y="400" width="900" height="200" fill="#138808" />

      {/* Ashoka Chakra in Center of White Stripe */}
      <g transform="translate(450, 300)">
        {/* Outer Circular Ring */}
        <circle cx="0" cy="0" r="80" fill="none" stroke="#000080" strokeWidth="6.5" />

        {/* Central Hub Ring and Disc */}
        <circle cx="0" cy="0" r="16" fill="#000080" />
        <circle cx="0" cy="0" r="7.5" fill="#FFFFFF" />

        {/* 24 Radial Spokes with Triangular Tapering and Edge Beads */}
        {spokes.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            {/* Tapered Radial Spoke */}
            <polygon points="-2.5,0 2.5,0 0.8,-76 -0.8,-76" fill="#000080" />
            {/* Outer Rim Tooth / Node */}
            <circle cx="0" cy="-77" r="3.2" fill="#000080" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default IndianFlag;
