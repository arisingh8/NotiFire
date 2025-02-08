import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost'
  | 'role-atrisk'    // New role variants
  | 'role-dispatcher'
  | 'role-firstresponder';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}