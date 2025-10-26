// src/components/StatsGrid.jsx
import React from "react";

export default function StatsGrid({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">
              {stat.label}
            </p>
            {stat.icon && (
              <div className="text-blue-600">{stat.icon}</div>
            )}
          </div>

          <h3 className="text-2xl font-semibold text-gray-800">
            {stat.value}
          </h3>

          {stat.delta && (
            <p
              className={`text-xs font-medium mt-1 ${
                stat.delta > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.delta > 0 ? "+" : ""}
              {stat.delta}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
