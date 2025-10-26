// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar({ user }) {
  const menuItems =
    user?.role === "doctor"
      ? [
          { name: "Dashboard", path: "/doctor" },
          { name: "My Patients", path: "/doctor" },
          { name: "Activity", path: "/doctor" },
          { name: "Settings", path: "/doctor/settings" },
        ]
      : [
          { name: "Dashboard", path: "/insurer" },
          { name: "Doctor Requests", path: "/insurer" },
          { name: "Approved Bills", path: "/insurer" },
          { name: "Settings", path: "/insurer/settings" },
        ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md border-r border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-blue-600">
          {user?.role === "doctor" ? "Doctor Panel" : "Insurer Panel"}
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">© 2025 PreAuth Bridge</p>
      </div>
    </aside>
  );
}
