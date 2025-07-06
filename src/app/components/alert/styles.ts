export const AlertStyles = {
    container: `
      relative
      flex
      items-start
      p-4
      mb-4
      rounded-lg
      border
      transition-all
      duration-200
      font-(family-name:--font-eb-garamond)
    `,
    unreadDot: `
      absolute
      top-4
      left-4
      w-2
      h-2
      rounded-full
      bg-blue-500
    `,
    content: "flex-1 ml-6",
    header: "flex justify-between items-start mb-1",
    title: "text-lg font-bold",
    timestamp: "text-sm text-gray-500",
    message: "text-base mb-3",
    actions: "flex items-center justify-end space-x-3",
    readButton: "text-sm text-blue-500 hover:text-blue-600",
    actionButton: `
      px-4
      py-1.5
      bg-[#ffdbbb]
      text-gray-900
      rounded-lg
      text-sm
      hover:opacity-90
      transition-opacity
    `,
    dismissButton: `
      text-gray-400
      hover:text-gray-600
      text-xl
      font-bold
      leading-none
    `,
    read: "opacity-75",
  
    // Severity variants
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800"
  };