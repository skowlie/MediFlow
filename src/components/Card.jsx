// src/components/Card.jsx
import React from "react";

export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="text-sm text-gray-700">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
}
