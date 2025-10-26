// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  // ✅ Always read from localStorage instead of context
  const storedUser = JSON.parse(localStorage.getItem("authUser"));

  return children;
}
