"use client";

import React, { useEffect } from "react";

// Define the SidebarItem interface
export interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  items?: {
    label: string;
    onClick: () => void;
  }[];
}

export interface SidebarProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  side?: "left" | "right";
  title?: string;
  items?: SidebarItem[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  children,
  isOpen = false,
  onClose,
  side = "left",
  title,
  items,
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Render navigation items if items prop is provided
  const renderNavigationItems = () => {
    if (!items) return null;

    return (
      <nav className="mt-4">
        {items.map((item, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={item.onClick}
              className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-gray-700 rounded transition-colors duration-200"
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span>{item.label}</span>
            </button>

            {/* Render sub-items if they exist */}
            {item.items && (
              <div className="ml-6 mt-1">
                {item.items.map((subItem, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={subItem.onClick}
                    className="w-full flex items-center px-4 py-1 text-left text-gray-300 hover:bg-gray-700 rounded transition-colors duration-200 text-sm"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  };

  return (
    <div
      className={`fixed top-0 ${side === "left" ? "left-0" : "right-0"} h-full w-64 
            bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out 
            ${isOpen ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"} ${className}`}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white text-lg"
      >
        ×
      </button>

      <div className="p-4">
        {/* Render title if provided */}
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-white border-b border-gray-700 pb-2">
            {title}
          </h2>
        )}

        {/* Render navigation items if items prop is provided, otherwise render children */}
        {items ? renderNavigationItems() : children}
      </div>
    </div>
  );
};

export default Sidebar;
