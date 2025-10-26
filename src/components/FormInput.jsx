// src/components/FormInput.jsx
import React from "react";

export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  helperText = "",
  className = "",
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 text-sm text-gray-800 placeholder-gray-400 transition ${
          error ? "border-red-500" : ""
        }`}
      />

      {/* Helper / Error Text */}
      {error ? (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500 mt-1">{helperText}</span>
      ) : null}
    </div>
  );
}
