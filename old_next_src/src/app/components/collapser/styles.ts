export const CollapserStyles = {
    container: (className: string = '') => `
      bg-gray-800 
      rounded-lg 
      overflow-hidden 
      ${className}
    `,
  
    button: `
      w-full
      px-6
      py-4
      flex
      items-center
      justify-between
      bg-gray-800
      hover:bg-gray-700
      transition-colors
      text-[#ffdbbb]
      font-[family-name:var(--font-eb-garamond)]
    `,
  
    title: "text-lg font-semibold",
  
    icon: "w-5 h-5",
  
    content: (isOpen: boolean) => `
      transition-all
      duration-200
      ease-in-out
      ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      overflow-hidden
    `,
  
    innerContent: "p-6 border-t border-gray-700"
  };