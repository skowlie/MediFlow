// src/components/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ status }) {
  const getBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "denied":
        return "bg-red-100 text-red-700 border-red-200";
      case "in review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}
