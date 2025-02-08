'use client';

import React from 'react';
import { SelectStyles } from './styles';
import Dropdown from '@/app/components/dropdown';

interface Option {
  value: string;
  label: string;
}

// Create a type for our synthetic event that matches the shape we need
type SelectChangeEvent = {
  target: {
    name: string;
    value: string;
    type?: string;
  };
};

interface SelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (e: SelectChangeEvent) => void;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  error,
  helperText,
  required = false,
  placeholder = 'Select an option',
  className = ''
}) => {
  const id = React.useId();

  const handleSelect = (selectedValue: string) => {
    // Create a synthetic event object
    const syntheticEvent: SelectChangeEvent = {
      target: {
        name,
        value: selectedValue,
        type: 'select'
      }
    };

    onChange(syntheticEvent);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className={SelectStyles.container}>
      <label 
        htmlFor={id} 
        className={SelectStyles.label}
      >
        {label}
        {required && <span className={SelectStyles.required}>*</span>}
      </label>

      <Dropdown
        trigger={
          <div className={`${SelectStyles.select} ${error ? SelectStyles.error : ''}`}>
            <span className={value ? '' : SelectStyles.placeholder}>
              {selectedLabel}
            </span>
            <span className={SelectStyles.arrow}>▼</span>
          </div>
        }
        items={options.map(option => ({
          label: option.label,
          value: option.value,
          onClick: () => handleSelect(option.value)
        }))}
        className={className}
      />

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