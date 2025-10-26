// src/pages/InsuranceDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useCases } from "../context/CaseContext"; // live cases + ws + fetch

export default function InsuranceDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { cases, isLoading } = useCases();

  const [myRequests, setMyRequests] = useState([]);
  const [approvedBills, setApprovedBills] = useState([]);

  // Quick debug to confirm what the context is delivering
  useEffect(() => {
    if (isLoading) return;
    // eslint-disable-next-line no-console
    console.group("[Insurer Debug]");
    // eslint-disable-next-line no-console
    console.log("Total cases:", cases?.length);
    // eslint-disable-next-line no-console
    console.log(
      "Statuses:",
      (cases || []).map((c) => c.status || c.case_status || c.current_status)
    );
    // eslint-disable-next-line no-console
    console.log("Sample:", (cases || []).slice(0, 3));
    // eslint-disable-next-line no-console
    console.groupEnd();
  }, [cases, isLoading]);

  useEffect(() => {
    if (isLoading || !user || !cases) return;

    // Accept common "ready for review" variants to avoid silent drops
    const READY_STATUSES = new Set([
      "APPROVED_READY",
      "READY_FOR_REVIEW",
      "READY",
      "PENDING_REVIEW",
    ]);

    const allRequestsInQueue = (cases || []).filter((req) => {
      const status = (req.status || req.case_status || req.current_status || "")
        .toString()
        .toUpperCase();
      return READY_STATUSES.has(status);
    });

    allRequestsInQueue.sort((a, b) => {
      const ad = new Date(
        a.created_at || a.createdAt || a.last_updated || a.updatedAt || 0
      );
      const bd = new Date(
        b.created_at || b.createdAt || b.last_updated || b.updatedAt || 0
      );
      return bd - ad;
    });

    setMyRequests(allRequestsInQueue);

    const allApproved = (cases || []).filter((req) => {
      const status = (req.status || req.case_status || req.current_status || "")
        .toString()
        .toUpperCase();
      return status === "APPROVED";
    });

    const bills = allApproved.map((r) => ({
      id: r.case_id || r.id,
      patient: r.patient_id || r.patientId,
      amount: `$${(Math.random() * 1000 + 500).toFixed(2)}`,
      procedure: r.procedure_code || r.procedureCode,
      date: new Date(r.last_updated || r.updatedAt || Date.now())
        .toISOString()
        .split("T")[0],
    }));

    setApprovedBills(bills);
  }, [cases, user, isLoading]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          {user?.insuranceName || "Insurer"}’s Dashboard 🏢
        </h1>
        <div className="flex gap-3">
          {user?.policyFile && (
            <button
              onClick={() => {
                try {
                  const pdfData = user.policyFile;
                  const base64 = pdfData.startsWith(
                    "data:application/pdf;base64,"
                  )
                    ? pdfData.split(",")[1]
                    : pdfData;
                  const bytes = atob(base64)
                    .split("")
                    .map((c) => c.charCodeAt(0));
                  const blob = new Blob([new Uint8Array(bytes)], {
                    type: "application/pdf",
                  });
                  const url = URL.createObjectURL(blob);
                  window.open(url, "_blank");
                } catch (err) {
                  console.error("Error opening PDF:", err);
                  alert("⚠️ Could not open policy file. Try re-uploading.");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View Policy PDF
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests */}
        <section className="lg:col-span-2 bg-white shadow-sm rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pre-Authorization Work Queue
          </h2>

          {isLoading && (
            <p className="text-gray-500 italic">Loading queue...</p>
          )}

          {!isLoading && myRequests.length === 0 ? (
            <div className="space-y-2">
              <p className="text-gray-500 italic">The work queue is empty.</p>
              {(cases || []).length > 0 && (
                <details className="mt-2 text-xs text-gray-600">
                  <summary className="cursor-pointer">
                    Debug: show all cases
                  </summary>
                  <pre className="p-3 bg-gray-50 rounded border overflow-x-auto">
                    {JSON.stringify(cases, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 w-full text-left text-gray-600 text-sm uppercase">
                  <th className="p-3">Provider</th>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Procedure</th>
                  <th className="p-3">Status</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r) => (
                  <tr
                    key={r.case_id}
                    className="border-b hover:bg-gray-50 transition text-gray-700"
                  >
                    <td className="p-3 font-medium">{r.provider_id}</td>
                    <td className="p-3">{r.patient_id}</td>
                    <td className="p-3 text-sm">{r.procedure_code}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/insurer/request/${r.case_id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
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

          {isLoading && <p className="text-gray-500 italic">Loading...</p>}

          {!isLoading && approvedBills.length === 0 ? (
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
                      {b.procedure}
                    </p>
                    <p className="text-xs text-gray-500">
                      Patient: {b.patient} • {b.date}
                    </p>
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
