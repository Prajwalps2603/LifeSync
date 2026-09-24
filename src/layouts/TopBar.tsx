import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Search, Bell,
  Command
} from 'lucide-react';
import { AiCreativeIcon } from '../components/icons/AiCreativeIcon';

export const TopBar: React.FC = () => {
  const {
    openSearch,
    toggleNotifications, unreadNotificationsCount
  } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Home Dashboard';
    if (p === '/my-day') return 'My Day';
    if (p === '/ai') return 'AI Companion';
    if (p.startsWith('/workspace/pages')) return 'Workspace Pages';
    if (p.startsWith('/workspace/databases')) return 'Databases';
    if (p.startsWith('/workspace/templates')) return 'Templates';
    if (p.startsWith('/tasks')) return 'Tasks & Actions';
    if (p.startsWith('/projects')) return 'Projects';
    if (p.startsWith('/goals')) return 'Goals & Milestones';
    if (p.startsWith('/habits')) return 'Habit Tracker';
    if (p.startsWith('/notes')) return 'Notes & Knowledge';
    if (p.startsWith('/calendar')) return 'Calendar Schedule';
    if (p.startsWith('/expenses')) return 'Personal Finance';
    if (p.startsWith('/memories')) return 'Memory Bank';
    if (p.startsWith('/insights')) return 'Life Insights';
    if (p.startsWith('/life-graph')) return 'Connected Life Graph';
    if (p.startsWith('/settings')) return 'Settings';
    if (p.startsWith('/profile')) return 'Profile';
    return 'LifeSync AI';
  };

  return (
    <header className="topbar-container">
      {/* Left: current page title */}
      <div className="topbar-left">
        <div className="topbar-page-breadcrumb">
          <span className="topbar-page-name">{getPageTitle()}</span>
        </div>
      </div>

      {/* Center Search Pill */}
      <div className="topbar-center">
        <button
          className="topbar-search-bar"
          onClick={openSearch}
          aria-label="Global Search"
        >
          <Search size={16} color="var(--text-tertiary)" />
          <span className="topbar-search-text">Search everything or ask LifeSync...</span>
          <span className="topbar-search-shortcut">
            <Command size={11} style={{ marginRight: 2 }} /> K
          </span>
        </button>
      </div>

      {/* Right controls */}
      <div className="topbar-right">

        {/* AI Shortcut */}
        <button
          className="btn-icon topbar-ai-btn"
          onClick={() => navigate('/ai')}
          title="Open AI Companion"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <AiCreativeIcon size={19} glow />
        </button>

        {/* Notifications */}
        <button
          className="btn-icon topbar-notif-btn"
          onClick={toggleNotifications}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span className="notif-indicator">{unreadNotificationsCount}</span>
          )}
        </button>

        {/* User avatar */}
        <button
          className="topbar-avatar-btn"
          onClick={() => navigate('/profile')}
          title={user?.displayName ? `${user.displayName} (Profile)` : 'View Profile'}
        >
          <span>
            {user?.displayName
              ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : 'U'}
          </span>
        </button>
      </div>
    </header>
  );
};
