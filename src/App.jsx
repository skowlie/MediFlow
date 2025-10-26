// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SIgnupPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import InsuranceDashboard from "./pages/InsuranceDashboard";
import PatientDetail from "./pages/PatientDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { useUser } from "./context/UserContext";
import InsuranceRequestDetail from "./pages/InsuranceRequestDetail";


export default function App() {
  const { user, loading } = useUser();

  // ✅ Wait until user is loaded from localStorage before routing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute user={user} allowedRole="doctor">
              <DoctorDashboard user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insurer"
          element={
            <ProtectedRoute user={user} allowedRole="insurer">
              <InsuranceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insurer/request/:id"
          element={
            <ProtectedRoute user={user} allowedRole="insurer">
              <InsuranceRequestDetail />
            </ProtectedRoute>
          }
        />


        <Route
          path="/doctor/patient/:id"
          element={
            <ProtectedRoute user={user} allowedRole="doctor">
              <PatientDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
