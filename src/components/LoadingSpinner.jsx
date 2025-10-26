// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-gray-600">
      <div
        className={`animate-spin rounded-full border-t-blue-500 border-gray-200 ${sizes[size]}`}
      />
      {text && (
        <p className="text-sm text-gray-500 mt-3 font-medium">{text}</p>
      )}
    </div>
  );
}
