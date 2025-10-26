import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("userAccounts")) || [];
    const foundUser = users.find(
      (u) => u.email === email.trim() && u.password === password.trim()
    );

    if (!foundUser) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("authUser", JSON.stringify(foundUser));
    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));

    if (foundUser.role === "doctor") {
      navigate("/doctor");
    } else if (foundUser.role === "insurer") {
      navigate("/insurer");
    } else {
      setError("Invalid user role");
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[90%] max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Login to Portal
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
        {/* Developer Full Reset Button */}
<div className="text-center mt-6">
  <button
    onClick={() => {
      if (
        window.confirm(
          "⚠️ This will delete ALL saved data — accounts, patients, requests, and logins. Continue?"
        )
      ) {
        localStorage.clear();
        alert("🧹 All data (including accounts and logins) has been reset!");
        window.location.reload(); // reload app to clear state
      }
    }}
    className="text-sm text-red-600 hover:text-red-800 underline"
  >
    Reset ALL Data (Doctors + Insurers + Accounts)
  </button>
</div>


      </div>
    </div>
  );
}
