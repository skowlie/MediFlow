// src/components/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Search...", value, onChange }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />
    </div>
  );
}
