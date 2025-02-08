'use client';

import React, { useState } from 'react';
import Sidebar from '../sidebar';
import { LayoutStyles } from './styles';

// Import the SidebarItem type from Sidebar component
interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  items?: {
    label: string;
    onClick: () => void;
  }[];
}

interface LayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={LayoutStyles.container}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`
          ${LayoutStyles.toggle}
          ${isSidebarOpen ? LayoutStyles.toggleOpen : ''}
        `}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        title="Navigation"
        isOpen={isSidebarOpen}
        items={sidebarItems}
        className={LayoutStyles.sidebar}
      />

      {/* Main Content */}
      <main className={`
        ${LayoutStyles.main}
        ${isSidebarOpen ? LayoutStyles.mainWithSidebar : ''}
      `}>
        {children}
      </main>
    </div>
  );
};

export default Layout;