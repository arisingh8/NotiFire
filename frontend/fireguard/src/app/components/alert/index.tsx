'use client';

import React from 'react';
import { AlertStyles } from './styles';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp?: Date;
  isRead?: boolean;
  onRead?: () => void;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  title,
  message,
  severity,
  timestamp = new Date(),
  isRead = false,
  onRead,
  onDismiss,
  actionLabel,
  onAction
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className={`${AlertStyles.container} ${AlertStyles[severity]} ${isRead ? AlertStyles.read : ''}`}>
      {/* Indicator dot */}
      {!isRead && <div className={AlertStyles.unreadDot} />}

      {/* Content */}
      <div className={AlertStyles.content}>
        <div className={AlertStyles.header}>
          <h3 className={AlertStyles.title}>{title}</h3>
          <span className={AlertStyles.timestamp}>{formatTime(timestamp)}</span>
        </div>

        <p className={AlertStyles.message}>{message}</p>

        {/* Actions */}
        <div className={AlertStyles.actions}>
          {!isRead && onRead && (
            <button 
              onClick={onRead}
              className={AlertStyles.readButton}
            >
              Mark as Read
            </button>
          )}

          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className={AlertStyles.actionButton}
            >
              {actionLabel}
            </button>
          )}

          {onDismiss && (
            <button 
              onClick={onDismiss}
              className={AlertStyles.dismissButton}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;