export const MapStyles = {
  container: `
    w-full 
    h-full 
    min-h-[400px] 
    rounded-lg 
    overflow-hidden 
    border 
    border-gray-700 
    relative 
    z-0
    bg-gray-800
  `,

  map: "w-full h-full",

  loading: `
    w-full 
    h-full 
    flex 
    items-center 
    justify-center 
    bg-gray-800 
    text-[#ffdbbb] 
    font-[family-name:var(--font-eb-garamond)]
  `,

  popup: `
    p-4 
    max-w-xs 
    bg-gray-800 
    rounded-lg 
    shadow-xl 
    border 
    border-gray-700
  `,

  popupTitle: `
    text-lg 
    font-bold 
    mb-2 
    text-[#ffdbbb] 
    font-[family-name:var(--font-eb-garamond)]
  `,

  popupDescription: `
    text-sm 
    mb-2 
    text-[#ffdbbb] 
    font-[family-name:var(--font-eb-garamond)]
  `,

  severity: "px-3 py-1 rounded-lg text-xs font-bold",

  severity_low: "bg-gray-700 text-[#ffdbbb]",
  severity_medium: "bg-gray-700/80 text-[#ffdbbb]",
  severity_high: "bg-gray-700/60 text-[#ffdbbb]"
};