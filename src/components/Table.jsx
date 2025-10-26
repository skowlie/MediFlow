// src/components/Table.jsx
import React from "react";

export default function Table({ columns = [], data = [], title = "" }) {
  return (
    <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
      {/* Table Header */}
      {title && (
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-4 py-3 text-left font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-3 whitespace-nowrap">
                      {typeof col.cell === "function"
                        ? col.cell(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
