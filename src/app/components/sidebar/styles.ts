export const SidebarStyles = {
  container: `
      fixed
      top-0
      h-full
      w-96
      bg-gray-800
      border-gray-700
      shadow-xl
      transition-transform
      duration-300
      ease-in-out
      z-40
      font-(family-name:--font-eb-garamond)
    `,
  open: "transform translate-x-0",
  closed: "transform -translate-x-full",
  position_left: "left-0 border-r",
  position_right: "right-0 border-l transform translate-x-full",
  header:
    "flex justify-between items-center px-4 py-3 border-b border-gray-700",
  title: "text-xl font-bold text-[#ffdbbb]",
  closeButton: "text-gray-400 hover:text-[#ffdbbb] text-2xl font-bold",
  content: "overflow-y-auto h-[calc(100%-4rem)]",
  itemContainer: "border-b border-gray-700/50 last:border-b-0",
  item: `
      w-full
      flex
      items-center
      px-4
      py-3
      text-[#ffdbbb]
      hover:bg-gray-700
      transition-colors
      duration-150
    `,
  hasChildren: "",
  expanded: "bg-gray-700/50",
  icon: "mr-3 w-5 h-5",
  label: "flex-1 text-left",
  arrow: `
      ml-2
      text-sm
      transition-transform
      duration-200
    `,
  nestedItems: "bg-gray-700/30",
  nestedItem: `
      w-full
      px-4
      py-2
      text-left
      text-[#ffdbbb]
      hover:bg-gray-700
      transition-colors
      duration-150
      pl-8
    `,
};
