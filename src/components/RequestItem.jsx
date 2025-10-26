// src/components/RequestItem.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // optional icons (install: npm i lucide-react)

export default function RequestItem({ request }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Summary Row */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-800 font-medium">
            {request.text.length > 50
              ? `${request.text.substring(0, 50)}...`
              : request.text}
          </p>
          <p className="text-sm text-gray-500">{request.date}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              request.status === "Approved"
                ? "bg-green-100 text-green-700"
                : request.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {request.status}
          </span>
          {expanded ? (
            <ChevronUp className="text-gray-600" size={18} />
          ) : (
            <ChevronDown className="text-gray-600" size={18} />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 border-t pt-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Full Request:</span>{" "}
            {request.text}
          </p>

          {request.status === "Denied" && (
            <p className="mt-2 text-red-600">
              <span className="font-semibold">Reason for Denial:</span>{" "}
              {request.reason}
            </p>
          )}

          {request.status === "Approved" && (
            <p className="mt-2 text-green-600">
              ✅ This request has been approved.
            </p>
          )}

          {request.status === "Pending" && (
            <p className="mt-2 text-yellow-700">
              ⏳ Awaiting insurer review.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
