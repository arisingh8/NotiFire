export const LayoutStyles = {
  container: "min-h-screen bg-gray-900 relative",
  toggle: `
      fixed
      top-1/2
      -translate-y-1/2
      left-0
      z-50
      bg-gray-800/50
      hover:bg-gray-800
      text-[#ffdbbb]
      p-2
      rounded-r-lg
      transition-all
      duration-300
      backdrop-blur-sm
    `,
  toggleOpen: "left-80",
  sidebar: "w-80 fixed!", // Override default width
  main: `
      min-h-screen
      transition-all
      duration-300
      ease-in-out
      p-8
    `,
  mainWithSidebar: "ml-80", // Match sidebar width
};
