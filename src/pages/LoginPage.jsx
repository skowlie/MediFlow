// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Retrieve all registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ✅ Find match
    const foundUser = users.find(
      (u) =>
        u.email.trim().toLowerCase() === form.email.trim().toLowerCase() &&
        u.password.trim() === form.password.trim()
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      return;
    }

    // ✅ Save logged-in user
    localStorage.setItem("authUser", JSON.stringify(foundUser));
    setError("");

    // Redirect based on role
    if (foundUser.role === "doctor") {
      navigate("/doctor");
    } else if (foundUser.role === "insurer") {
      navigate("/insurer");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Login to Portal
        </h2>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
