export const SelectStyles = {
    container: "flex flex-col gap-1.5 w-full",
    label: "text-[#ffdbbb] font-medium text-sm font-[family-name:var(--font-eb-garamond)]",
    required: "text-red-500 ml-1",
    selectWrapper: "relative",
    select: `
      w-full
      appearance-none
      px-4
      py-2
      pr-10
      bg-gray-700
      border
      border-gray-600
      rounded-lg
      text-[#ffdbbb]
      focus:outline-none
      focus:ring-2
      focus:ring-[#ffdbbb]
      focus:border-transparent
      transition-colors
      duration-200
      font-[family-name:var(--font-eb-garamond)]
    `,
    arrow: `
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      pointer-events-none
      text-[#ffdbbb]
    `,
    error: "border-red-500 focus:ring-red-500",
    errorText: "text-red-500 text-sm font-[family-name:var(--font-eb-garamond)]",
    helperText: "text-gray-400 text-sm font-[family-name:var(--font-eb-garamond)]"
  };