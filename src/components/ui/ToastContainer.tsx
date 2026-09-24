import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { AiCreativeIcon } from '../icons/AiCreativeIcon';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      {toasts.map(t => {
        const getIcon = () => {
          if (t.type === 'success') return <CheckCircle2 size={18} color="var(--success)" />;
          if (t.type === 'warning') return <AlertCircle size={18} color="var(--warning)" />;
          if (t.type === 'info') return <Info size={18} color="var(--info)" />;
          return <AiCreativeIcon size={18} color="var(--primary)" />;
        };

        return (
          <div
            key={t.id}
            className="animate-fade-in card-glass"
            style={{
              pointerEvents: 'auto',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-lg)',
              borderRadius: 'var(--radius-card)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-primary)',
              minWidth: 260
            }}
          >
            {getIcon()}
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
