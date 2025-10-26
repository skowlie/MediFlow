// src/pages/InsuranceDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function InsuranceDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [requests, setRequests] = useState([]);
  const [approvedBills, setApprovedBills] = useState([]);

  // ✅ Load only requests for this insurer (by name)
  const loadRequestsForInsurer = () => {
    const allKeys = Object.keys(localStorage);
    let allRequests = [];

    // Gather all requests from all doctors
    allKeys.forEach((key) => {
      if (key.startsWith("requestsData_")) {
        const doctorRequests = JSON.parse(localStorage.getItem(key)) || [];
        allRequests.push(...doctorRequests);
      }
    });

    // ✅ Filter requests that belong to this insurer
    const insurerRequests = allRequests.filter(
      (req) =>
        req.insurance &&
        user?.fullName &&
        req.insurance.toLowerCase().trim() === user.fullName.toLowerCase().trim()
    );

    // Sort by date (latest first)
    insurerRequests.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Store all requests + approved ones
    setRequests(insurerRequests);

    const approved = insurerRequests
      .filter((r) => r.status === "Approved")
      .map((r) => ({
        id: r.id,
        patient: r.patientName,
        amount: `$${(Math.random() * 1000 + 500).toFixed(2)}`,
        date: r.date,
      }));

    setApprovedBills(approved);
  };

  useEffect(() => {
    loadRequestsForInsurer();
    // Refresh when window regains focus
    const handleFocus = () => loadRequestsForInsurer();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-700">
          Welcome, {user?.fullName || "Insurance Company"}
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log Out
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests */}
        <section className="lg:col-span-2 bg-white shadow-sm rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Doctor Requests for {user?.fullName}
          </h2>

          {requests.length === 0 ? (
            <p className="text-gray-500 italic">
              No requests found for this insurer.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 w-full text-left text-gray-600 text-sm uppercase">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Summary</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
  {requests.map((r) => (
    <tr
      key={r.id}
      className="border-b hover:bg-gray-50 transition text-gray-700"
    >
      <td className="p-3 font-medium">
        {r.doctorName || "Dr. Unknown"}
      </td>
      <td className="p-3">{r.patientName}</td>
      <td className="p-3 text-sm truncate max-w-xs">{r.clinicalSummary}</td>
      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.status === "Approved"
              ? "bg-green-100 text-green-700"
              : r.status === "Denied"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {r.status}
        </span>
      </td>
      {/* ✅ View Details Button */}
      <td className="p-3 text-right">
        <button
          onClick={() => navigate(`/insurer/request/${r.id}`)}
          className="text-white hover:text-gray-500 text-sm font-medium"
        >
          View Details →
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          )}
        </section>

        {/* Approved Bills */}
        <section className="bg-white shadow-sm rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recently Approved Bills
          </h2>

          {approvedBills.length === 0 ? (
            <p className="text-gray-500 italic">No approved bills yet.</p>
          ) : (
            <div className="space-y-3">
              {approvedBills.map((b) => (
                <div
                  key={b.id}
                  className="border-b pb-3 last:border-none flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      {b.patient}
                    </p>
                    <p className="text-xs text-gray-500">{b.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {b.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
