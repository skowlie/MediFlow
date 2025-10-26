// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  // ✅ Always read from localStorage instead of context
  const storedUser = JSON.parse(localStorage.getItem("authUser"));

  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && storedUser.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
