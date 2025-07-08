export const TextareaStyles = {
  container: "flex flex-col gap-1.5 w-full",
  label:
    "text-[#ffdbbb] font-medium text-sm font-(family-name:--font-eb-garamond)",
  required: "text-red-500 ml-1",
  textarea: `
      w-full
      min-h-[120px]
      px-4
      py-2
      bg-gray-700
      border
      border-gray-600
      rounded-lg
      text-[#ffdbbb]
      placeholder-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-[#ffdbbb]
      focus:border-transparent
      transition-colors
      duration-200
      resize-y
      font-(family-name:--font-eb-garamond)
    `,
  footer: "flex justify-between items-center mt-1",
  error: "border-red-500 focus:ring-red-500",
  errorText: "text-red-500 text-sm font-(family-name:--font-eb-garamond)",
  helperText: "text-gray-400 text-sm font-(family-name:--font-eb-garamond)",
  characterCount:
    "text-gray-400 text-sm ml-auto font-(family-name:--font-eb-garamond)",
};
