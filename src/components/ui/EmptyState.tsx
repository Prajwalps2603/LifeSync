import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { AiCreativeIcon } from '../icons/AiCreativeIcon';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  aiSuggestedAction?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <AiCreativeIcon size={32} color="var(--primary)" />,
  title,
  description,
  actionLabel,
  onAction,
  aiSuggestedAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        background: 'var(--surface-white)',
        borderRadius: 'var(--radius-card)',
        border: '1px dashed var(--outline-soft)',
        margin: '16px 0'
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--primary-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      <p style={{ maxWidth: 440, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
        {description}
      </p>
      {aiSuggestedAction && (
        <div
          style={{
            background: 'var(--surface-soft)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: 13,
            color: 'var(--primary)',
            fontWeight: 500,
            marginBottom: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <AiCreativeIcon size={14} /> {aiSuggestedAction}
        </div>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" icon={<Plus size={16} />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
