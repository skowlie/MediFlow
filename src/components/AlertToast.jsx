// src/components/AlertToast.jsx
import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, Info } from "lucide-react"; // npm i react-hot-toast lucide-react

// Helper functions for different toast types
export const showSuccess = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5`}
      >
        <div className="flex p-4 items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <div className="flex-1 text-sm text-gray-800">{message}</div>
        </div>
      </div>
    ),
    { duration: 3000 }
  );

export const showError = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5`}
      >
        <div className="flex p-4 items-center gap-3">
          <XCircle className="text-red-500" size={20} />
          <div className="flex-1 text-sm text-gray-800">{message}</div>
        </div>
      </div>
    ),
    { duration: 3000 }
  );

export const showInfo = (message) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black/5`}
      >
        <div className="flex p-4 items-center gap-3">
          <Info className="text-blue-500" size={20} />
          <div className="flex-1 text-sm text-gray-800">{message}</div>
        </div>
      </div>
    ),
    { duration: 3000 }
  );

// Toaster provider (should be placed once in App.jsx)
export function AlertToastProvider() {
  return <Toaster position="top-right" reverseOrder={false} />;
}
