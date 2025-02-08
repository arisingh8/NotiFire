'use client';

import React from 'react';
import { ModalStyles } from './styles';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={ModalStyles.backdrop}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={ModalStyles.container}>
        <div className={ModalStyles.content}>
          {title && (
            <div className={ModalStyles.header}>
              <h2 className={ModalStyles.title}>{title}</h2>
              <button 
                onClick={onClose}
                className={ModalStyles.closeButton}
              >
                ×
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;