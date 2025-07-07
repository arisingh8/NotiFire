export const SelectStyles = {
  container: "flex flex-col gap-1.5 w-full",
  label:
    "text-[#ffdbbb] font-medium text-sm font-(family-name:--font-eb-garamond)",
  required: "text-red-500 ml-1",
  input: `
    w-full
    px-4
    py-2
    bg-gray-700
    border
    border-gray-600
    rounded-lg
    text-[#ffdbbb]
    outline-none
    focus:border-[#ffdbbb]
    transition-colors
    duration-200
    font-(family-name:--font-eb-garamond)
  `,
  error: "border-red-500",
  dropdown: `
    absolute
    z-50
    w-full
    mt-1
    max-h-60
    overflow-auto
    bg-gray-700
    border
    border-gray-600
    rounded-lg
    shadow-lg
  `,
  option: `
    w-full
    px-4
    py-2
    text-left
    text-[#ffdbbb]
    hover:bg-gray-600
    transition-colors
    duration-150
    font-(family-name:--font-eb-garamond)
  `,
  errorText: "text-red-500 text-sm font-(family-name:--font-eb-garamond)",
  helperText: "text-gray-400 text-sm font-(family-name:--font-eb-garamond)",
};
