// src/pages/PatientDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contextUser = useContext(UserContext)?.user;
  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const user = contextUser || storedUser;

  const [patient, setPatient] = useState(null);
  const [requests, setRequests] = useState([]);
  const [visits, setVisits] = useState([]);
  const [newRequest, setNewRequest] = useState({
    clinical_summary: "",
    treatments_tried: "",
    exam_findings: "",
    other_notes: "",
  });

  // --- Load patient + their requests ---
  useEffect(() => {
    if (!user || !user.email || !id) return;

    try {
      const patientKey = `patientsData_${user.email}`;
      const allPatients = JSON.parse(localStorage.getItem(patientKey)) || [];
      const found = allPatients.find((p) => String(p.code) === String(id));
      setPatient(found || null);

      const reqKey = `requestsData_${user.email}_${id}`;
      const patientReqs = JSON.parse(localStorage.getItem(reqKey)) || [];
      setRequests(patientReqs.sort((a, b) => b.id - a.id));

      setVisits([
        { id: 1, reason: "Follow-up for MRI results", date: "2025-10-12" },
        { id: 2, reason: "Initial consultation", date: "2025-09-28" },
      ]);
    } catch (err) {
      console.error("Error loading patient:", err);
      setPatient(null);
    }
  }, [id, user]);

  // --- Listen for insurer updates in localStorage ---
  useEffect(() => {
    if (!user || !user.email || !id) return;

    const handleStorage = () => {
      const reqKey = `requestsData_${user.email}_${id}`;
      const updated = JSON.parse(localStorage.getItem(reqKey)) || [];
      setRequests(updated.sort((a, b) => b.id - a.id));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [id, user]);

  // --- Log latest status (optional) ---
  useEffect(() => {
    if (requests.length === 0) return;
    const latest = requests[0];
    if (latest.status === "Approved")
      console.log("✅ Request Approved — Ready for billing!");
    else if (latest.status === "Denied")
      console.log("❌ Request Denied — Needs revision.");
  }, [requests]);

  // --- Submit new insurance request ---
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!patient || !user?.email) return;

    const newReq = {
      id: Date.now(),
      ...newRequest,
      patientName: patient.name,
      patientCode: patient.code,
      insurance: patient.insurance,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
      denialReason: "",
    };

    const reqKey = `requestsData_${user.email}_${patient.code}`;
    const existing = JSON.parse(localStorage.getItem(reqKey)) || [];
    const updated = [newReq, ...existing];
    localStorage.setItem(reqKey, JSON.stringify(updated));
    setRequests(updated);

    const actKey = `doctorActivity_${user.email}`;
    const prev = JSON.parse(localStorage.getItem(actKey)) || [];
    const newAct = [
      {
        id: Date.now(),
        patient: patient.name,
        text: "Submitted new pre-authorization request",
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ];
    localStorage.setItem(actKey, JSON.stringify(newAct));

    setNewRequest({
      clinical_summary: "",
      treatments_tried: "",
      exam_findings: "",
      other_notes: "",
    });
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

      {/* Patient Record */}
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

      {/* Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Insurance Requests
          </h2>

          <form
            onSubmit={handleSubmitRequest}
            className="grid grid-cols-1 gap-4 mb-6"
          >
            {["clinical_summary", "treatments_tried", "exam_findings", "other_notes"].map((f) => (
              <textarea
                key={f}
                placeholder={f.replace("_", " ").replace("_", " ")}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newRequest[f]}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, [f]: e.target.value })
                }
              />
            ))}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </div>
          </form>

          {requests.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recently Added Requests
              </h3>
              <div className="space-y-3">
                {requests.map((req) => (
                  <details
                    key={req.id}
                    className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <summary className="cursor-pointer flex justify-between font-medium text-gray-800">
                      <span>
                        {req.date} – {req.patientName}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          req.status === "Approved"
                            ? "text-green-700 bg-green-100 border-green-200"
                            : req.status === "Denied"
                            ? "text-red-700 bg-red-100 border-red-200"
                            : "text-yellow-700 bg-yellow-100 border-yellow-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        <b>Clinical Summary:</b> {req.clinical_summary}
                      </p>
                      <p>
                        <b>Treatments Tried:</b> {req.treatments_tried}
                      </p>
                      <p>
                        <b>Exam Findings:</b> {req.exam_findings}
                      </p>
                      {req.other_notes && (
                        <p>
                          <b>Other Notes:</b> {req.other_notes}
                        </p>
                      )}
                      {req.status === "Denied" && (
                        <div className="mt-2 border-l-4 border-red-400 pl-3">
                          <p className="text-red-600 font-medium mb-1">
                            Denied by Insurance
                          </p>
                          <p className="text-sm text-gray-700">
                            <b>Reason:</b>{" "}
                            {req.denialReason ||
                              "Documentation incomplete. Please include prior notes and updated results."}
                          </p>
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No requests yet.</p>
          )}
        </div>

        {/* Visits */}
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
