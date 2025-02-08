import { ButtonVariant, ButtonSize } from './button.types';

type ButtonVariantProps = {
  variant: ButtonVariant;
  size: ButtonSize;
};

export const buttonVariants = ({ variant, size }: ButtonVariantProps): string => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 w-full justify-center flex items-center';
  
  const variants = {
    primary: 'bg-[#ffdbbb] hover:opacity-80 text-gray-800 focus:ring-orange-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'border-2 border-[#ffdbbb] text-[#ffdbbb] hover:bg-[#ffdbbb] hover:text-gray-800 focus:ring-orange-500',
    ghost: 'text-[#ffdbbb] hover:bg-[#ffdbbb]/10 focus:ring-orange-500',
    'role-resident': 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    'role-manager': 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    'role-firefighter': 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return `${baseClasses} ${variants[variant]} ${sizes[size]}`;
};