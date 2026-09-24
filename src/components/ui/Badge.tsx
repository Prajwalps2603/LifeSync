import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
  icon
}) => {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </span>
  );
};
