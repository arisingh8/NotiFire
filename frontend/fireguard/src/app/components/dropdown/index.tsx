'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DropdownStyles } from './styles';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className={`${DropdownStyles.container} ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={DropdownStyles.trigger}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`${DropdownStyles.menu} ${DropdownStyles[`align_${align}`]}`}>
          {items.map((item) => (
            <button
              key={item.value}
              className={DropdownStyles.item}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && (
                <span className={DropdownStyles.icon}>{item.icon}</span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;