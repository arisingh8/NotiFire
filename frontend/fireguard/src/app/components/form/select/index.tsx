'use client';

import React, { useState } from 'react';
import { SelectStyles } from './styles';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  name: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
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
  placeholder = 'Select an option'
}) => {
  const id = React.useId();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange({
      target: {
        name,
        value: selectedValue
      }
    });
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Clear the selected value whenever the input changes
    onChange({
      target: {
        name,
        value: ''
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && value) {
      // Clear both the search term and the selected value
      setSearchTerm('');
      onChange({
        target: {
          name,
          value: ''
        }
      });
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      if (!value) {
        setSearchTerm('');
      }
    }, 200);
  };

  // Get the display value
  const displayValue = value 
    ? options.find(opt => opt.value === value)?.label 
    : searchTerm;

  return (
    <div className={SelectStyles.container}>
      <label 
        htmlFor={id} 
        className={SelectStyles.label}
      >
        {label}
        {required && <span className={SelectStyles.required}>*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={displayValue || ''}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${SelectStyles.input} ${error ? SelectStyles.error : ''}`}
        />
        
        {isOpen && filteredOptions.length > 0 && (
          <div className={SelectStyles.dropdown}>
            {filteredOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={SelectStyles.option}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
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