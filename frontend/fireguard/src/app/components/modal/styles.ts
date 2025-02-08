export const ModalStyles = {
  backdrop: "fixed inset-0 bg-black bg-opacity-70 z-30", // Lowered z-index
  container: "fixed inset-0 z-40 overflow-y-auto", // Lowered z-index
  content: "flex min-h-screen items-center justify-center p-4",
  modal: "bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-auto p-6 border border-gray-700",
  header: "flex justify-between items-center mb-6",
  title: "text-2xl font-bold text-[#ffdbbb] font-[family-name:var(--font-eb-garamond)]",
  closeButton: "text-gray-400 hover:text-gray-200 text-2xl font-bold p-2"
};