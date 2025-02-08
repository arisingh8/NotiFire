'use client';

import React from 'react';
import { SelectStyles } from './styles';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  required = false,
  placeholder = 'Select an option',
  className,
  ...props
}) => {
  const id = React.useId();

  return (
    <div className={SelectStyles.container}>
      <label 
        htmlFor={id} 
        className={SelectStyles.label}
      >
        {label}
        {required && <span className={SelectStyles.required}>*</span>}
      </label>
      
      <div className={SelectStyles.selectWrapper}>
        <select
          id={id}
          className={`${SelectStyles.select} ${error ? SelectStyles.error : ''} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          required={required}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow icon */}
        <div className={SelectStyles.arrow}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <span 
          id={`${id}-error`} 
          className={SelectStyles.errorText}
          role="alert"
        >
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span 
          id={`${id}-helper`} 
          className={SelectStyles.helperText}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Select;