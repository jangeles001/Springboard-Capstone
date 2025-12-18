export function Notification({ message, visible, type = "success" }) {
  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-5 right-5 z-50
        px-4 py-3 rounded-xl shadow-lg
        text-sm font-medium
        transition-opacity duration-300
        ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
      `}
    >
      {message}
    </div>
  );
}