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
    'role-atrisk': 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    'role-dispatcher': 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    'role-firstresponder': 'bg-yellow-700 hover:bg-yellow-800 text-white focus:ring-yellow-700',
  };


  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return `${baseClasses} ${variants[variant]} ${sizes[size]}`;
};