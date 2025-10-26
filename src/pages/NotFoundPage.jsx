// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle className="text-blue-600" size={60} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-white px-5 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-gray-400">
        © 2025 Mediclear. All rights reserved.
      </footer>
    </div>
  );
}
