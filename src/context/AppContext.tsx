import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { store, taskService, habitService, goalService } from '../services';
import confetti from 'canvas-confetti';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'primary';
}

interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isQuickAddOpen: boolean;
  openQuickAdd: (defaultType?: string) => void;
  closeQuickAdd: () => void;
  quickAddType: string;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isNotificationsOpen: boolean;
  toggleNotifications: () => void;
  unreadNotificationsCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  triggerConfetti: () => void;
  refreshKey: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('task');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Subscribe to central data changes
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setRefreshKey(k => k + 1);
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut listener: Cmd/Ctrl+K for search, Cmd/Ctrl+J for quick add
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsQuickAddOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const openQuickAdd = (defaultType = 'task') => {
    setQuickAddType(defaultType);
    setIsQuickAddOpen(true);
  };
  const closeQuickAdd = () => setIsQuickAddOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const toggleNotifications = () => setIsNotificationsOpen(prev => !prev);

  const unreadNotificationsCount = store.notifications.filter(n => !n.read).length;

  const showToast = (message: string, type: Toast['type'] = 'primary') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const triggerConfetti = () => {
    // Disabled globally across all pages per user request
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isQuickAddOpen,
        openQuickAdd,
        closeQuickAdd,
        quickAddType,
        isSearchOpen,
        openSearch,
        closeSearch,
        isNotificationsOpen,
        toggleNotifications,
        unreadNotificationsCount,
        toasts,
        showToast,
        triggerConfetti,
        refreshKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
