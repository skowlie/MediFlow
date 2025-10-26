// src/components/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm ${
          currentPage === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <span className="text-sm text-gray-600">
        Page <strong>{currentPage}</strong> of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
