// src/layouts/DashboardLayout.jsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ user, children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (visible on desktop only) */}
      <Sidebar user={user} />

      {/* Main section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar user={user} />

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
