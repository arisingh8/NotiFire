export const DropdownStyles = {
    container: "relative inline-block",
    trigger: "cursor-pointer",
    menu: `
      w-full
      absolute
      z-50
      mt-2
      min-w-[200px]
      bg-gray-800
      border

      border-gray-700
      rounded-lg
      shadow-lg
      py-1
      font-[family-name:var(--font-eb-garamond)]
    `,
    align_left: "left-0",
    align_right: "right-0",
    item: `
      w-full
      px-4
      py-2
      text-left
      text-[#ffdbbb]
      hover:bg-gray-700
      flex
      items-center
      gap-2
      transition-colors
      duration-150
    `,
    icon: "w-5 h-5"
  };