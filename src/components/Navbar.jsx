// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const roleLabel =
    user?.role === "doctor" ? "Doctor" : "Insurance Company";

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 py-3 px-6 flex justify-between items-center">
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
        <h1 className="text-xl font-semibold text-blue-600">PreAuth Bridge</h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            {user?.fullName || user?.email?.split("@")[0]}
          </p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>

        {/* Logout Button */}
        <button
        onClick={() => {
            localStorage.removeItem("authUser");
            window.location.href = "/login";
        }}
        className="text-sm text-gray-600 hover:text-red-500"
        >
        Logout
        </button>

      </div>
    </header>
  );
}
