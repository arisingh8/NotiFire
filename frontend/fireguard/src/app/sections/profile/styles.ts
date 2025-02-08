export const ProfileStyles = {
  pageContainer: (isEditing: boolean) => `
    min-h-screen 
    bg-gray-900 
    ${isEditing ? 'overflow-auto pb-16' : 'overflow-hidden'}
  `,
  
  container: "max-w-2xl mx-auto p-8",
  
  card: `
    bg-gray-800 
    rounded-lg 
    shadow-xl 
    p-6
  `,

  header: `
    flex 
    items-center 
    gap-4 
    mb-6
  `,

  avatar: `
    w-16 
    h-16 
    bg-gray-700 
    rounded-full 
    flex 
    items-center 
    justify-center
  `,

  userName: `
    text-xl 
    font-bold 
    text-[#ffdbbb]
  `,

  userRole: "text-gray-400",

  form: "space-y-6",

  formGroup: "grid grid-cols-2 gap-4",

  checkboxContainer: `
    flex 
    items-center 
    gap-2
  `,

  checkbox: `
    w-4 
    h-4 
    text-[#ffdbbb] 
    bg-gray-700 
    border-gray-600 
    rounded 
    focus:ring-[#ffdbbb]
  `,

  checkboxLabel: "text-[#ffdbbb]",

  buttonGroup: "flex gap-4",

  primaryButton: `
    px-6 
    py-2 
    bg-[#ffdbbb] 
    text-gray-900 
    rounded-lg 
    font-bold 
    hover:opacity-90
  `,

  secondaryButton: `
    px-6 
    py-2 
    bg-gray-700 
    text-[#ffdbbb] 
    rounded-lg 
    font-bold 
    hover:opacity-90
  `,

  profileDetail: "text-[#ffdbbb] space-y-4",

  errorMessage: `
    mb-6 
    p-4 
    bg-red-800/50 
    text-red-100 
    rounded-lg
  `,

  loadingContainer: `
    min-h-screen 
    bg-gray-900 
    flex 
    items-center 
    justify-center
  `,

  loadingText: "text-[#ffdbbb]"
};