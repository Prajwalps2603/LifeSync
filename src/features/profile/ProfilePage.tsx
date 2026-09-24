import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { store } from '../../services';
import {
  User, Shield, Mail, Calendar, CheckCircle2, Award,
  LogOut, Sparkles, ExternalLink, Activity, ArrowRight, Eye, KeyRound
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully', 'info');
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const completedTasks = store.tasks?.filter(t => t.status === 'completed').length ?? 0;
  const activeGoals = store.goals?.filter(g => g.status === 'active').length ?? 0;
  const totalHabits = store.habits?.length ?? 0;
  const totalMemories = store.memories?.length ?? 0;

  const isAdmin = hasRole('admin');
  const isGuest = hasRole('guest');

  return (
    <div className="animate-fade-in" style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* Header with Title and Sign Out Button */}
      <div className="page-header" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div className="page-title-group">
          <h1>Profile Space</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Personal profile, identity, and account credentials.
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<LogOut size={16} />}
          onClick={handleLogout}
          style={{
            color: '#f87171',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.08)'
          }}
        >
          Sign Out
        </Button>
      </div>

      {/* Main Identity Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: isAdmin
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-bright) 100%)',
            color: '#fff',
            fontSize: 26,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-primary)',
            flexShrink: 0
          }}>
            {getInitials(user?.displayName)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user?.displayName ?? 'LifeSync User'}</h2>
              {isAdmin && (
                <span className="badge" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={12} /> Administrator
                </span>
              )}
              {!isAdmin && !isGuest && (
                <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <User size={12} /> Standard Member
                </span>
              )}
              {isGuest && (
                <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={12} /> Guest Mode
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              {user?.email ?? 'No email associated'}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-neutral" style={{ fontSize: 11 }}>UID: {user?.uid ?? 'guest'}</span>
              <span className="badge badge-neutral" style={{ fontSize: 11 }}>Active Session</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Button
            variant="secondary"
            icon={<Shield size={15} />}
            onClick={() => navigate('/admin')}
            style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24' }}
          >
            Admin Panel
          </Button>
        )}
      </div>

      {/* System Stats Overview */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{completedTasks}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Tasks Completed</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{activeGoals}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Active Goals</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{totalHabits}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>Habits Tracked</div>
        </div>
      </div>

      {/* Account Details & Session Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <KeyRound size={16} style={{ color: 'var(--primary)' }} />
          Account & Authentication Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Full Name</span>
            <span style={{ fontWeight: 600 }}>{user?.displayName ?? 'Not set'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Email Address</span>
            <span style={{ fontWeight: 600 }}>{user?.email ?? 'N/A'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Account Role</span>
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user?.role ?? 'User'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Session Status</span>
            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
              Active
            </span>
          </div>
        </div>

        {/* Danger zone / Logout */}
        <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Sign Out of Current Session</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
              Clear current local session credentials and return to login page.
            </div>
          </div>
          <Button
            variant="secondary"
            icon={<LogOut size={15} />}
            onClick={handleLogout}
            style={{
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)'
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
