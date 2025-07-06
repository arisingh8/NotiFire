'use client';

import React from 'react';
import { TextareaStyles } from './styles';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  required = false,
  maxLength,
  showCharacterCount = false,
  className,
  value = '',
  ...props
}) => {
  const id = React.useId();
  const characterCount = String(value).length;

  return (
    <div className={TextareaStyles.container}>
      <label 
        htmlFor={id} 
        className={TextareaStyles.label}
      >
        {label}
        {required && <span className={TextareaStyles.required}>*</span>}
      </label>
      
      <textarea
        id={id}
        className={`${TextareaStyles.textarea} ${error ? TextareaStyles.error : ''} ${className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        required={required}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      
      <div className={TextareaStyles.footer}>
        {error && (
          <span 
            id={`${id}-error`} 
            className={TextareaStyles.errorText}
            role="alert"
          >
            {error}
          </span>
        )}
        
        {helperText && !error && (
          <span 
            id={`${id}-helper`} 
            className={TextareaStyles.helperText}
          >
            {helperText}
          </span>
        )}

        {showCharacterCount && maxLength && (
          <span className={TextareaStyles.characterCount}>
            {characterCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default Textarea;