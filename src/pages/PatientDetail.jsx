// src/pages/PatientDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Keep this
import { useCases } from "../context/CaseContext"; // 1. Import our new hook

export default function PatientDetail() {
  const { id } = useParams(); // This is the patient's code
  const navigate = useNavigate();

  const { user } = useUser();

  // 2. Get cases and API functions from context
  const {
    cases,
    createCase,
    getCasesByPatient,
    isLoading: casesLoading,
  } = useCases();

  const [patient, setPatient] = useState(null);
  // This state is now *derived* from the global context
  const [patientRequests, setPatientRequests] = useState([]);
  const [visits, setVisits] = useState([]);
  const [newRequest, setNewRequest] = useState({
    procedure_code: "", // This is the main field we need
    notes: "", // Simple notes field for the doctor
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect for loading patient (from localStorage, that's fine)
  useEffect(() => {
    if (!user || !user.email || !id) return;

    // Load patient from local storage
    const patientKey = `patientsData_${user.email}`;
    const allPatients = JSON.parse(localStorage.getItem(patientKey)) || [];
    const found = allPatients.find((p) => String(p.code) === String(id));
    setPatient(found || null);

    // Load initial cases for *this* patient
    if (found) {
      // We call this to "backfill" the context if it's empty
      getCasesByPatient(found.code).catch((err) => {
        console.error("Could not load initial cases:", err);
      });
    }

    // Mock visits, this is fine
    setVisits([
      { id: 1, reason: "Follow-up for MRI results", date: "2025-10-12" },
      { id: 2, reason: "Initial consultation", date: "2025-09-28" },
    ]);
  }, [user, id, getCasesByPatient]);

  // 3. This effect *derives* this patient's requests from the global `cases`
  useEffect(() => {
    if (patient) {
      const filteredCases = cases
        .filter((c) => c.patient_id === patient.code)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setPatientRequests(filteredCases);
    }
  }, [cases, patient]); // Re-run whenever the global case list changes!

  // 4. --- Submit new insurance request (Refactored) ---
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!patient || !user?.email || !newRequest.procedure_code) {
      alert("Please enter a procedure code.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Call the API instead of localStorage
      await createCase({
        patient_id: patient.code,
        provider_id: user.email, // Using email as provider_id
        procedure_code: newRequest.procedure_code,
      });

      // We don't need to update state. The WebSocket message will!
      // The server will respond with the PENDING case, which the
      // WebSocket will then update to APPROVED_READY/MISSING_INFO.

      alert(
        "Request submitted! The status will update automatically in the list below."
      );

      setNewRequest({ procedure_code: "", notes: "" });
    } catch (err) {
      console.error("Failed to submit case:", err);
      alert(`Error: Failed to submit case. ${err.message}`);
    }
    setIsSubmitting(false);
  };

  // --- Loading and error states ---
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading user data...
      </div>
    );

  if (!patient)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="text-lg font-semibold mb-3">
          Patient not found for this account.
        </p>
        <button
          onClick={() => navigate("/doctor")}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );

  // --- Normal Render ---
  return (
    <div className="min-h-screen w-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {patient.name}
          </h1>
          <p className="text-sm text-gray-500">
            Insurance: {patient.insurance} • DOB: {patient.dob} • ID:{" "}
            {patient.code}
          </p>
        </div>
        <button
          onClick={() => navigate("/doctor")}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>

      {/* Patient Record (No change needed) */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Patient Record
        </h2>
        {patient.record ? (
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              A record was uploaded for this patient.
            </p>
            <button
              onClick={() => {
                try {
                  const pdfData = patient.record;
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
                  window.open(URL.createObjectURL(blob), "_blank");
                } catch {
                  alert("⚠️ Could not open PDF. Try re-uploading.");
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              View PDF Record
            </button>
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No record uploaded for this patient.
          </p>
        )}
      </div>

      {/* Requests and Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requests (Refactored) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            New Insurance Request
          </h2>

          <form
            onSubmit={handleSubmitRequest}
            className="grid grid-cols-1 gap-4 mb-6"
          >
            <input
              key="procedure_code"
              placeholder="Procedure Code (e.g., CPT 73721)"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newRequest.procedure_code}
              onChange={(e) =>
                setNewRequest({ ...newRequest, procedure_code: e.target.value })
              }
              required
            />
            <textarea
              key="notes"
              placeholder="Optional: Internal notes for this request"
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newRequest.notes}
              onChange={(e) =>
                setNewRequest({ ...newRequest, notes: e.target.value })
              }
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>

          {/* Refactored Request List */}
          {casesLoading && <p>Loading requests...</p>}
          {patientRequests.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Requests
              </h3>
              <div className="space-y-3">
                {patientRequests.map((req) => (
                  <details
                    key={req.case_id} // Use real case_id
                    className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <summary className="cursor-pointer flex justify-between font-medium text-gray-800">
                      <span>
                        {new Date(req.created_at).toLocaleDateString()} –{" "}
                        {req.procedure_code}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          req.status === "APPROVED"
                            ? "text-green-700 bg-green-100 border-green-200"
                            : req.status === "DENIED"
                            ? "text-red-700 bg-red-100 border-red-200"
                            : req.status === "APPROVED_READY"
                            ? "text-blue-700 bg-blue-100 border-blue-200"
                            : req.status === "MISSING_INFORMATION"
                            ? "text-yellow-700 bg-yellow-100 border-yellow-200"
                            : "text-gray-700 bg-gray-100 border-gray-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-600 space-y-2">
                      <p>
                        <b>Case ID:</b> {req.case_id}
                      </p>
                      <p>
                        <b>Procedure:</b> {req.procedure_code}
                      </p>

                      {/* Show the real AI analysis */}
                      <div className="mt-2 border-l-4 border-gray-300 pl-3">
                        <p className="font-medium mb-1">AI Analysis:</p>
                        {req.analysis &&
                        typeof req.analysis === "object" &&
                        !req.analysis.error ? (
                          Object.entries(req.analysis).map(([key, value]) => (
                            <div key={key} className="text-xs mb-1">
                              <p className="font-semibold">{key}</p>
                              <p
                                className={`pl-2 ${
                                  value.met ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {value.met ? "✅ Met" : "❌ Missing"}
                              </p>
                              <p className="pl-2 text-gray-500">
                                <b>Evidence:</b> {value.evidence}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic">
                            {req.analysis?.error || "Analysis pending..."}
                          </p>
                        )}
                      </div>

                      {/* Show insurer notes if they exist */}
                      {req.analysis?.insurer_decision_notes && (
                        <div className="mt-2 border-l-4 border-blue-400 pl-3">
                          <p className="text-blue-600 font-medium mb-1">
                            Insurer Notes:
                          </p>
                          <p className="text-sm text-gray-700">
                            {req.analysis.insurer_decision_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </>
          ) : (
            !casesLoading && (
              <p className="text-gray-500 italic">No requests yet.</p>
            )
          )}
        </div>

        {/* Visits (No change needed) */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Visits
          </h2>
          {visits.length > 0 ? (
            <ul className="space-y-3">
              {visits.map((v) => (
                <li
                  key={v.id}
                  className="flex justify-between border-b pb-2 text-gray-700"
                >
                  <span>{v.reason}</span>
                  <span className="text-gray-500">{v.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No recent visits recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
