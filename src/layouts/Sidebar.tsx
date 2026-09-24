import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { store } from '../services';
import { WorkspacePage, Task } from '../types';
import {
  Home, Sun, FileText, Database, LayoutTemplate,
  CheckSquare, Layers, Target, Repeat, Bookmark, Calendar as CalIcon,
  DollarSign, BarChart3, Settings,
  ChevronDown, ChevronRight, X, BrainCircuit,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { AiCreativeIcon } from '../components/icons/AiCreativeIcon';

/* Inline LifeSync icon — connected life graph */
const LifeSyncIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
  >
    {/* Connection lines */}
    <line x1="16" y1="16" x2="9.5" y2="9"  stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="23"  y2="10" stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="25"  y2="17" stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="8.5" y2="22" stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"/>
    <line x1="16" y1="16" x2="22"  y2="24" stroke="white" strokeWidth="1.4" strokeOpacity="0.75" strokeLinecap="round"/>
    {/* Satellite nodes */}
    <circle cx="9.5"  cy="9"  r="2.6" fill="white" opacity="0.85"/>
    <circle cx="23"   cy="10" r="2.2" fill="white" opacity="0.80"/>
    <circle cx="25"   cy="17" r="1.9" fill="white" opacity="0.75"/>
    <circle cx="8.5"  cy="22" r="2.2" fill="white" opacity="0.80"/>
    <circle cx="22"   cy="24" r="2.6" fill="white" opacity="0.85"/>
    {/* Center hub */}
    <circle cx="16" cy="16" r="3.6" fill="white"/>
  </svg>
);


export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useApp();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false);

  const pages: WorkspacePage[] = store.pages;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `sidebar-nav-item ${active ? 'active' : ''}`;
  };

  const collapsed = isCollapsed;

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`sidebar-container ${isSidebarOpen ? 'open' : ''} ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          {/* Logo badge — always visible */}
          <div className="brand-logo-badge" style={{ flexShrink: 0 }}>
            <LifeSyncIcon size={18} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <h2>LifeSync AI</h2>
              <span>Your Life Operating System</span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setIsCollapsed(c => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>

          {/* Mobile close button */}
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Nav Sections */}
        <nav className="sidebar-nav-scroll">
          {/* HOME Section */}
          {!collapsed && <div className="sidebar-section-title">Home</div>}

          <NavLink to="/" className={navItemClass('/')} title="Home">
            <Home size={17} />
            {!collapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/my-day" className={navItemClass('/my-day')} title="My Day">
            <Sun size={17} />
            {!collapsed && <span>My Day</span>}
          </NavLink>
          <NavLink to="/ai" className={navItemClass('/ai')} title="AI Companion">
            <AiCreativeIcon size={18} glow={isActive('/ai')} />
            {!collapsed && <span style={{ fontWeight: 600 }}>AI Companion</span>}
            {!collapsed && (
              <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: 10 }}>Active</span>
            )}
          </NavLink>

          {/* WORKSPACE Section */}
          {!collapsed && (
            <div className="sidebar-section-title">Workspace</div>
          )}

          {/* Pages with inline caret to toggle nested tree */}
          <div
            className={navItemClass('/workspace/pages')}
            style={{ cursor: 'default' }}
          >
            <NavLink
              to="/workspace/pages"
              title="Pages"
              style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, color: 'inherit' }}
            >
              <FileText size={17} />
              {!collapsed && <span>Pages</span>}
            </NavLink>
            {!collapsed && (
              <button
                onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
                style={{ padding: '0 2px', color: 'var(--text-tertiary)', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
                title={isWorkspaceExpanded ? 'Collapse pages' : 'Expand pages'}
              >
                {isWorkspaceExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
          </div>

          {/* Nested Pages Tree — only when expanded and not collapsed */}
          {!collapsed && isWorkspaceExpanded && (
            <div className="sidebar-nested-tree">
              {pages.map((page: WorkspacePage) => (
                <NavLink
                  key={page.id}
                  to={`/workspace/pages/${page.id}`}
                  className={navItemClass(`/workspace/pages/${page.id}`)}
                  style={{ paddingLeft: page.parentId ? 36 : 28, fontSize: 13 }}
                >
                  <span style={{ fontSize: 14 }}>{page.icon || '📄'}</span>
                  <span className="truncate">{page.title}</span>
                </NavLink>
              ))}
            </div>
          )}

          <NavLink to="/workspace/databases" className={navItemClass('/workspace/databases')} title="Databases">
            <Database size={17} />
            {!collapsed && <span>Databases</span>}
          </NavLink>
          <NavLink to="/workspace/templates" className={navItemClass('/workspace/templates')} title="Templates">
            <LayoutTemplate size={17} />
            {!collapsed && <span>Templates</span>}
          </NavLink>

          {/* LIFE Section */}
          {!collapsed && <div className="sidebar-section-title">Life</div>}
          <NavLink to="/tasks" className={navItemClass('/tasks')} title="Tasks">
            <CheckSquare size={17} />
            {!collapsed && <span>Tasks</span>}
            {!collapsed && (
              <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 11 }}>
                {store.tasks.filter((t: Task) => t.status !== 'completed').length}
              </span>
            )}
          </NavLink>
          <NavLink to="/projects" className={navItemClass('/projects')} title="Projects">
            <Layers size={17} />
            {!collapsed && <span>Projects</span>}
          </NavLink>
          <NavLink to="/goals" className={navItemClass('/goals')} title="Goals">
            <Target size={17} />
            {!collapsed && <span>Goals</span>}
          </NavLink>
          <NavLink to="/habits" className={navItemClass('/habits')} title="Habits">
            <Repeat size={17} />
            {!collapsed && <span>Habits</span>}
          </NavLink>
          <NavLink to="/notes" className={navItemClass('/notes')} title="Notes">
            <Bookmark size={17} />
            {!collapsed && <span>Notes</span>}
          </NavLink>
          <NavLink to="/calendar" className={navItemClass('/calendar')} title="Calendar">
            <CalIcon size={17} />
            {!collapsed && <span>Calendar</span>}
          </NavLink>
          <NavLink to="/expenses" className={navItemClass('/expenses')} title="Expenses">
            <DollarSign size={17} />
            {!collapsed && <span>Expenses</span>}
          </NavLink>
          <NavLink to="/memories" className={navItemClass('/memories')} title="Memories">
            <AiCreativeIcon size={17} color="#8B5CF6" />
            {!collapsed && <span>Memories</span>}
          </NavLink>

          {/* INSIGHTS */}
          {!collapsed && <div className="sidebar-section-title">Intelligence</div>}
          <NavLink to="/insights" className={navItemClass('/insights')} title="Insights">
            <BarChart3 size={17} />
            {!collapsed && <span>Insights</span>}
          </NavLink>
        </nav>

        {/* Footer & User Profile */}
        <div className="sidebar-footer">
          <NavLink to="/settings" className={navItemClass('/settings')} title="Settings">
            <Settings size={17} />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <NavLink to="/profile" className={`sidebar-user-card ${collapsed ? 'sidebar-user-card-collapsed' : ''}`} title="Profile">
            <div className="sidebar-user-avatar">
              <span>PN</span>
            </div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Prajwal Nair</div>
                <div className="sidebar-user-sub">Personal Space</div>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
};
