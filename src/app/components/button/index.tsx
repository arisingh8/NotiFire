'use client';

import React from 'react';
import { ButtonProps } from './button.types';
import { buttonVariants } from './variants';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const variantClasses = buttonVariants({ variant, size });
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;