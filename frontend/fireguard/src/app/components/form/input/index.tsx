'use client';

import React from 'react';
import { InputStyles } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required = false,
  type = 'text',
  className,
  ...props
}) => {
  const id = React.useId();

  return (
    <div className={InputStyles.container}>
      <label 
        htmlFor={id} 
        className={InputStyles.label}
      >
        {label}
        {required && <span className={InputStyles.required}>*</span>}
      </label>
      
      <input
        id={id}
        type={type}
        className={`${InputStyles.input} ${error ? InputStyles.error : ''} ${className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        required={required}
        {...props}
      />
      
      {error && (
        <span 
          id={`${id}-error`} 
          className={InputStyles.errorText}
          role="alert"
        >
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span 
          id={`${id}-helper`} 
          className={InputStyles.helperText}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;