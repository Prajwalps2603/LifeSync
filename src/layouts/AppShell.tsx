import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { QuickAddModal } from '../components/global/QuickAddModal';
import { SearchOverlay } from '../components/global/SearchOverlay';
import { NotificationsDrawer } from '../components/global/NotificationsDrawer';
import { ToastContainer } from '../components/ui/ToastContainer';
import './layout.css';



interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        <main className="content-area">
          {children}
        </main>
      </div>
      <MobileNav />
      <QuickAddModal />
      <SearchOverlay />
      <NotificationsDrawer />
      <ToastContainer />
    </div>
  );
};
