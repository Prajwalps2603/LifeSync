import React from 'react';

/**
 * AiIcon — LifeSync's custom AI mark.
 *
 * Geometric angular logo: two left-facing chevron blades + right-pointing arrow body,
 * matching the sharp origami-style symbol the user specified.
 */
export const AiIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ size = 16, color = 'currentColor', className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {/* Upper-left chevron blade */}
    <polygon points="8,14  40,32  30,50  8,14"  fill={color} />

    {/* Lower-left chevron blade */}
    <polygon points="8,86  40,68  30,50  8,86"  fill={color} />

    {/* Right arrowhead — the main body pointing right */}
    <polygon points="40,26  92,50  40,74  52,50" fill={color} />
  </svg>
);

export default AiIcon;
