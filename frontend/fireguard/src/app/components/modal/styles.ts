export const ModalStyles = {
  backdrop: "fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60]", // Reduced blur from backdrop-blur-sm to a custom 2px
  container: "fixed inset-0 z-[60] overflow-y-auto", // Increased z-index above footer
  content: "flex min-h-screen items-center justify-center p-4",
  modal: "bg-gray-800/90 rounded-xl shadow-xl w-full max-w-md mx-auto p-6 border border-gray-700 font-[family-name:var(--font-eb-garamond)]",
  header: "flex justify-center items-center mb-6",
  title: "text-2xl font-bold text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)] text-center",
  closeButton: "text-gray-400 hover:text-gray-200 text-2xl font-bold p-2"
};