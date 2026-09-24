import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, UserRole } from '../../types';
import {
  Shield, Users, Activity, ToggleLeft, ToggleRight,
  Settings, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Database, Cpu, Globe, Lock
} from 'lucide-react';

// ─── Mock user list (Firebase will replace) ──────────────────────────────────
const MOCK_USERS: UserProfile[] = [
  {
    uid: 'admin-001',
    email: 'admin@lifesync.app',
    displayName: 'LifeSync Admin',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    uid: 'user-001',
    email: 'prajwal@lifesync.app',
    displayName: 'Prajwal Nair',
    role: 'user',
    createdAt: '2026-02-15T00:00:00Z',
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    isActive: true,
  },
  {
    uid: 'guest-001',
    email: 'guest@lifesync.app',
    displayName: 'Guest User',
    role: 'guest',
    createdAt: '2026-03-01T00:00:00Z',
    lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
  },
];

// ─── Feature Flags ────────────────────────────────────────────────────────────
interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { key: 'ai_companion', label: 'AI Companion', description: 'Enable the AI chat assistant for all users', enabled: true, icon: <Cpu size={15} /> },
  { key: 'rag_search', label: 'RAG / Smart Search', description: 'Enable Gemini-powered contextual search over user data', enabled: true, icon: <Globe size={15} /> },
  { key: 'guest_access', label: 'Guest Access', description: 'Allow guest users to browse limited pages', enabled: true, icon: <Lock size={15} /> },
  { key: 'new_signup', label: 'New Sign-Ups', description: 'Allow new users to create accounts', enabled: true, icon: <Users size={15} /> },
  { key: 'expenses_module', label: 'Expenses Module', description: 'Enable the expenses tracking feature', enabled: true, icon: <Database size={15} /> },
];

// ─── System Health ─────────────────────────────────────────────────────────────
const HEALTH_METRICS = [
  { label: 'API Server', status: 'online', value: '99.9%', icon: <Activity size={14} /> },
  { label: 'Firebase', status: 'standby', value: 'Standby', icon: <Database size={14} /> },
  { label: 'Frontend', status: 'online', value: 'Vite 6', icon: <Globe size={14} /> },
  { label: 'Auth', status: 'online', value: 'Active', icon: <Shield size={14} /> },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'features' | 'health'>('overview');

  const toggleFlag = (key: string) => {
    setFlags(fs => fs.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const changeUserRole = (uid: string, role: UserRole) => {
    setUsers(us => us.map(u => u.uid === uid ? { ...u, role } : u));
  };

  const toggleUserActive = (uid: string) => {
    setUsers(us => us.map(u => u.uid === uid ? { ...u, isActive: !u.isActive } : u));
  };

  const roleColor = (role: UserRole) => {
    if (role === 'admin') return '#f59e0b';
    if (role === 'user') return '#6366f1';
    return '#64748b';
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }
    catch { return iso; }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="admin-badge">
            <Shield size={16} />
            <span>Admin Panel</span>
          </div>
          <h1 className="admin-title">Master Controls</h1>
          <p className="admin-subtitle">Logged in as <strong>{user?.displayName}</strong> · {user?.email}</p>
        </div>
        <div className="admin-stats-row">
          <div className="admin-stat-chip">
            <Users size={14} />
            <span>{users.length} Users</span>
          </div>
          <div className="admin-stat-chip admin-stat-chip--green">
            <CheckCircle size={14} />
            <span>{users.filter(u => u.isActive).length} Active</span>
          </div>
          <div className="admin-stat-chip admin-stat-chip--yellow">
            <AlertTriangle size={14} />
            <span>{flags.filter(f => !f.enabled).length} Disabled Features</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {(['overview', 'users', 'features', 'health'] as const).map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <TrendingUp size={14} />}
            {tab === 'users' && <Users size={14} />}
            {tab === 'features' && <ToggleRight size={14} />}
            {tab === 'health' && <Activity size={14} />}
            <span style={{ textTransform: 'capitalize' }}>{tab}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="admin-content">
          <div className="admin-overview-grid">
            <div className="admin-overview-card">
              <div className="admin-overview-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                <Users size={22} />
              </div>
              <div className="admin-overview-info">
                <span className="admin-overview-value">{users.length}</span>
                <span className="admin-overview-label">Total Users</span>
              </div>
            </div>
            <div className="admin-overview-card">
              <div className="admin-overview-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                <CheckCircle size={22} />
              </div>
              <div className="admin-overview-info">
                <span className="admin-overview-value">{users.filter(u => u.isActive).length}</span>
                <span className="admin-overview-label">Active Users</span>
              </div>
            </div>
            <div className="admin-overview-card">
              <div className="admin-overview-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                <Shield size={22} />
              </div>
              <div className="admin-overview-info">
                <span className="admin-overview-value">{users.filter(u => u.role === 'admin').length}</span>
                <span className="admin-overview-label">Admins</span>
              </div>
            </div>
            <div className="admin-overview-card">
              <div className="admin-overview-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                <Settings size={22} />
              </div>
              <div className="admin-overview-info">
                <span className="admin-overview-value">{flags.filter(f => f.enabled).length}/{flags.length}</span>
                <span className="admin-overview-label">Features On</span>
              </div>
            </div>
          </div>

          <div className="admin-section-title">Recent Activity</div>
          <div className="admin-activity-list">
            {users.map(u => (
              <div key={u.uid} className="admin-activity-item">
                <div className="admin-activity-avatar" style={{ background: `${roleColor(u.role)}22`, color: roleColor(u.role) }}>
                  {u.displayName[0].toUpperCase()}
                </div>
                <div className="admin-activity-info">
                  <span className="admin-activity-name">{u.displayName}</span>
                  <span className="admin-activity-meta">Last login · {formatDate(u.lastLoginAt)}</span>
                </div>
                <span className="admin-role-badge" style={{ background: `${roleColor(u.role)}22`, color: roleColor(u.role) }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <div className="admin-section-title">User Management</div>
          <div className="admin-user-list">
            {users.map(u => (
              <div key={u.uid} className={`admin-user-card ${!u.isActive ? 'admin-user-card--inactive' : ''}`}>
                <div className="admin-user-avatar" style={{ background: `${roleColor(u.role)}22`, color: roleColor(u.role) }}>
                  {u.displayName[0].toUpperCase()}
                </div>
                <div className="admin-user-info">
                  <div className="admin-user-name">{u.displayName}</div>
                  <div className="admin-user-email">{u.email}</div>
                  <div className="admin-user-meta">
                    <Clock size={11} />
                    {formatDate(u.lastLoginAt)}
                  </div>
                </div>
                <div className="admin-user-controls">
                  {/* Role selector */}
                  <select
                    className="admin-role-select"
                    value={u.role}
                    onChange={e => changeUserRole(u.uid, e.target.value as UserRole)}
                    disabled={u.uid === user?.uid} // can't change own role
                    style={{ borderColor: roleColor(u.role) + '66' }}
                  >
                    <option value="admin">👑 Admin</option>
                    <option value="user">👤 User</option>
                    <option value="guest">👁️ Guest</option>
                  </select>
                  {/* Toggle active */}
                  <button
                    className={`admin-toggle-btn ${u.isActive ? 'admin-toggle-btn--active' : ''}`}
                    onClick={() => toggleUserActive(u.uid)}
                    disabled={u.uid === user?.uid}
                    title={u.isActive ? 'Deactivate user' : 'Activate user'}
                  >
                    {u.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feature Flags ── */}
      {activeTab === 'features' && (
        <div className="admin-content">
          <div className="admin-section-title">Feature Flags</div>
          <p className="admin-section-desc">Toggle features on or off for all users without deploying code.</p>
          <div className="admin-flags-list">
            {flags.map(flag => (
              <div key={flag.key} className="admin-flag-card">
                <div className="admin-flag-icon">{flag.icon}</div>
                <div className="admin-flag-info">
                  <div className="admin-flag-label">{flag.label}</div>
                  <div className="admin-flag-desc">{flag.description}</div>
                </div>
                <button
                  className={`admin-flag-toggle ${flag.enabled ? 'on' : 'off'}`}
                  onClick={() => toggleFlag(flag.key)}
                >
                  {flag.enabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── System Health ── */}
      {activeTab === 'health' && (
        <div className="admin-content">
          <div className="admin-section-title">System Health</div>
          <div className="admin-health-grid">
            {HEALTH_METRICS.map(m => (
              <div key={m.label} className="admin-health-card">
                <div className={`admin-health-dot admin-health-dot--${m.status}`} />
                <div className="admin-health-icon">{m.icon}</div>
                <div className="admin-health-label">{m.label}</div>
                <div className={`admin-health-value admin-health-value--${m.status}`}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="admin-section-title" style={{ marginTop: 32 }}>Environment</div>
          <div className="admin-env-list">
            {[
              { key: 'Node.js Runtime', value: 'v24.14.1' },
              { key: 'React Version', value: '19.0.0' },
              { key: 'Vite', value: '6.x (Dev Server)' },
              { key: 'Express', value: '5.x (Port 5000)' },
              { key: 'Firebase', value: 'Standby — set FIREBASE_ENABLED=true to connect' },
              { key: 'Auth Method', value: 'Stub (Firebase Auth ready)' },
              { key: 'RAG Engine', value: 'Gemini 1.5 Flash (RAG Context Injection Ready)' },
            ].map(item => (
              <div key={item.key} className="admin-env-row">
                <span className="admin-env-key">{item.key}</span>
                <span className="admin-env-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
