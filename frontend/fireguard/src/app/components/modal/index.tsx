'use client';

import React from 'react';
import { ModalStyles } from './styles';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, title }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={ModalStyles.backdrop} />
      
      {/* Modal */}
      <div className={ModalStyles.container}>
        <div className={ModalStyles.content}>
          <div className={ModalStyles.modal}>
            {title && (
              <div className={ModalStyles.header}>
                <h2 className={ModalStyles.title}>{title}</h2>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;