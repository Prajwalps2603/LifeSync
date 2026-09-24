import React from 'react';

export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ width = '100%', height = 20, borderRadius = 'var(--radius-sm)', className = '', style = {} }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton height={24} width="40%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="60%" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Skeleton height={28} width={80} borderRadius="9999px" />
        <Skeleton height={28} width={60} borderRadius="9999px" />
      </div>
    </div>
  );
};
