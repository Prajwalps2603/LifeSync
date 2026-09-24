import React from 'react';
import { useApp } from '../../context/AppContext';
import { store } from '../../services';
import { Bell, Clock, Target, CheckCircle, X } from 'lucide-react';
import { AiCreativeIcon } from '../icons/AiCreativeIcon';
import { Button } from '../ui/Button';

export const NotificationsDrawer: React.FC = () => {
  const { isNotificationsOpen, toggleNotifications, refreshKey } = useApp();

  if (!isNotificationsOpen) return null;

  const notifications = store.notifications;

  const markAllRead = () => {
    store.notifications = store.notifications.map(n => ({ ...n, read: true }));
    store.notify();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 68,
        right: 24,
        width: 360,
        maxWidth: 'calc(100vw - 48px)',
        background: 'var(--surface-white)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--outline-soft)',
        zIndex: 1100,
        overflow: 'hidden'
      }}
      className="animate-fade-in"
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderBottom: '1px solid var(--outline-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={markAllRead}
            style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}
          >
            Mark all read
          </button>
          <button className="btn-icon" onClick={toggleNotifications} style={{ width: 28, height: 28 }}>
            <X size={14} />
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              style={{
                padding: '12px 18px',
                display: 'flex',
                gap: 12,
                borderBottom: '1px solid var(--surface-soft)',
                background: n.read ? 'transparent' : 'var(--primary-subtle)',
                transition: 'background var(--transition-fast)'
              }}
            >
              <div style={{ marginTop: 2 }}>
                {n.type === 'ai' ? (
                  <AiCreativeIcon size={16} color="var(--primary)" />
                ) : n.type === 'goal' ? (
                  <Target size={16} color="#059669" />
                ) : (
                  <Clock size={16} color="#D97706" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: n.read ? 600 : 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {n.message}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {n.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
