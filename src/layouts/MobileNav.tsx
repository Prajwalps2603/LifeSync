import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Home, Sun, CheckSquare, MoreHorizontal,
  Layers, Target, Repeat, Bookmark, Calendar, DollarSign,
  BarChart3, Network, Settings, X
} from 'lucide-react';
import { AiCreativeIcon } from '../components/icons/AiCreativeIcon';

export const MobileNav: React.FC = () => {
  const { openQuickAdd } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  const moreLinks = [
    { to: '/projects', label: 'Projects', icon: <Layers size={18} /> },
    { to: '/goals', label: 'Goals', icon: <Target size={18} /> },
    { to: '/habits', label: 'Habits', icon: <Repeat size={18} /> },
    { to: '/notes', label: 'Notes', icon: <Bookmark size={18} /> },
    { to: '/calendar', label: 'Calendar', icon: <Calendar size={18} /> },
    { to: '/expenses', label: 'Expenses', icon: <DollarSign size={18} /> },
    { to: '/memories', label: 'Memories', icon: <AiCreativeIcon size={18} /> },
    { to: '/insights', label: 'Insights', icon: <BarChart3 size={18} /> },
    { to: '/life-graph', label: 'Life Graph', icon: <Network size={18} /> },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <>
      {/* "More" Bottom Sheet Overlay */}
      {isMoreOpen && (
        <div className="modal-backdrop" onClick={() => setIsMoreOpen(false)}>
          <div
            className="mobile-more-sheet animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>More LifeSync Areas</h3>
              <button className="btn-icon" onClick={() => setIsMoreOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {moreLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMoreOpen(false)}
                  className="mobile-more-item"
                >
                  <div className="mobile-more-icon">{link.icon}</div>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/my-day" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Sun size={20} />
          <span>My Day</span>
        </NavLink>
        
        {/* Center Quick Add Floating Button */}
        <button
          className="mobile-quick-add-btn"
          onClick={() => openQuickAdd('natural')}
          aria-label="Quick Add"
        >
          <AiCreativeIcon size={22} color="#FFFFFF" />
        </button>

        <NavLink to="/tasks" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/ai" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <AiCreativeIcon size={20} />
          <span>AI</span>
        </NavLink>
        <button
          className={`mobile-nav-item ${isMoreOpen ? 'active' : ''}`}
          onClick={() => setIsMoreOpen(prev => !prev)}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
