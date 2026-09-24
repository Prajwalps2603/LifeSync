import React from 'react';

interface AiCreativeIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  glow?: boolean;
}

/**
 * AiCreativeIcon — LifeSync AI brand mark.
 *
 * Matches the user's angular geometric symbol:
 *   • Two left-facing chevron blades (upper + lower)
 *   • One right-pointing solid arrowhead body
 * All made of flat sharp polygons — no curves, no gradients by default.
 */
export const AiCreativeIcon: React.FC<AiCreativeIconProps> = ({
  size = 20,
  className = '',
  style = {},
  color,
  glow = false,
}) => {
  const fillColor = color ?? 'currentColor';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: glow ? `drop-shadow(0 0 5px rgba(139, 92, 246, 0.65))` : 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Upper-left chevron blade */}
      <polygon points="6,12  42,30  32,50  6,12" fill={fillColor} />

      {/* Lower-left chevron blade */}
      <polygon points="6,88  42,70  32,50  6,88" fill={fillColor} />

      {/* Right arrowhead — main body pointing right */}
      <polygon points="42,24  94,50  42,76  54,50" fill={fillColor} />
    </svg>
  );
};

export default AiCreativeIcon;
