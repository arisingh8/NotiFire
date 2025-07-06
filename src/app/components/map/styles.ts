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
    isolate
  `,
  map: `
    w-full 
    h-full 
    relative 
    z-1
  `,
  loading: "w-full h-full flex items-center justify-center bg-gray-800 text-[#ffdbbb] font-(family-name:--font-eb-garamond)",
  popup: "p-3 max-w-xs",
  popupTitle: "text-lg font-bold mb-2 font-(family-name:--font-eb-garamond)",
  popupDescription: "text-sm mb-2 font-(family-name:--font-eb-garamond)",
  severity: "px-2 py-1 rounded-full text-xs font-bold",
  severity_low: "bg-yellow-100 text-yellow-800",
  severity_medium: "bg-orange-100 text-orange-800",
  severity_high: "bg-red-100 text-red-800",
  '.leaflet-right.leaflet-center': `
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  `,
};