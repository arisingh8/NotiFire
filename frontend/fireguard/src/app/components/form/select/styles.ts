export const SelectStyles = {
  container: "flex flex-col gap-1.5 w-full",
  label: "text-[#ffdbbb] font-medium text-sm font-[family-name:var(--font-eb-garamond)]",
  required: "text-red-500 ml-1",
  select: `
    w-full
    px-4
    py-2
    bg-gray-700
    border
    border-gray-600
    rounded-lg
    text-[#ffdbbb]
    cursor-pointer
    flex
    justify-between
    items-center
    hover:bg-gray-600
    transition-colors
    duration-200
    font-[family-name:var(--font-eb-garamond)]
  `,
  placeholder: "text-gray-400",
  arrow: "text-sm",
  error: "border-red-500",
  errorText: "text-red-500 text-sm font-[family-name:var(--font-eb-garamond)]",
  helperText: "text-gray-400 text-sm font-[family-name:var(--font-eb-garamond)]"
};