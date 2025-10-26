// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "doctor",
    insuranceName: "",
    policyFile: null,
  });

  // ✅ Convert uploaded PDF to base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, policyFile: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
      ...form,
      id: Date.now(),
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("authUser", JSON.stringify(newUser));

    // Redirect based on role
    navigate(form.role === "doctor" ? "/doctor" : "/insurer");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />

          {/* Role Selector */}
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="doctor">Doctor</option>
            <option value="insurer">Insurance Representative</option>
          </select>

          {/* ✅ Only show if insurer role selected */}
          {form.role === "insurer" && (
            <>
              {/* Insurance company name */}
              <input
                type="text"
                placeholder="Insurance Company Name"
                value={form.insuranceName}
                onChange={(e) =>
                  setForm({ ...form, insuranceName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />

              {/* Policy upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Policy PDF
                </label>

                <div className="flex items-center gap-3">
                  <input
                    id="policy-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="policy-upload"
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-gray-500 truncate">
                    {form.policyFile ? "File uploaded" : "No file chosen"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
