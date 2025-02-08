'use client';

import React, { useState } from 'react';
import { SidebarStyles } from './styles';

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  items?: {
    label: string;
    onClick: () => void;
  }[];
}

// Export the interface
export interface SidebarProps {
  items?: SidebarItem[];
  children?: React.ReactNode;
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  side?: 'left' | 'right';
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  items = [],
  children,
  title,
  isOpen = true,
  onClose,
  side = 'left',
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (label: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  return (
    <div
      className={`
        ${SidebarStyles.container}
        ${isOpen ? SidebarStyles.open : SidebarStyles.closed}
        ${side === 'right' ? SidebarStyles.position_right : SidebarStyles.position_left}
        ${className}
      `}
    >
      {/* Header */}
      <div className={SidebarStyles.header}>
        {title && <h2 className={SidebarStyles.title}>{title}</h2>}
        {onClose && (
          <button
            onClick={onClose}
            className={SidebarStyles.closeButton}
            aria-label="Close sidebar"
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <div className={SidebarStyles.content}>
        {children ? (
          // Render children if provided
          children
        ) : (
          // Otherwise render items list
          items.map((item) => (
            <div key={item.label} className={SidebarStyles.itemContainer}>
              <button
                onClick={() => {
                  if (item.items) {
                    toggleItem(item.label);
                  } else {
                    item.onClick?.();
                  }
                }}
                className={`
                  ${SidebarStyles.item}
                  ${item.items ? SidebarStyles.hasChildren : ''}
                  ${expandedItems.has(item.label) ? SidebarStyles.expanded : ''}
                `}
              >
                {item.icon && (
                  <span className={SidebarStyles.icon}>{item.icon}</span>
                )}
                <span className={SidebarStyles.label}>{item.label}</span>
                {item.items && (
                  <span className={SidebarStyles.arrow}>▼</span>
                )}
              </button>

              {/* Nested Items */}
              {item.items && expandedItems.has(item.label) && (
                <div className={SidebarStyles.nestedItems}>
                  {item.items.map((nestedItem) => (
                    <button
                      key={nestedItem.label}
                      onClick={nestedItem.onClick}
                      className={SidebarStyles.nestedItem}
                    >
                      {nestedItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;