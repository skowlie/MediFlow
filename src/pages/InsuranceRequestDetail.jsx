// src/pages/InsuranceRequestDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InsuranceRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [summary, setSummary] = useState(
    "🧠 General Summary (Claude Placeholder): This request appears medically justified pending confirmation of physical therapy completion and adequate documentation."
  );

  // ✅ Load request details
  useEffect(() => {
    const insurerUser = JSON.parse(localStorage.getItem("authUser"));
    if (!insurerUser?.email) return;

    const allKeys = Object.keys(localStorage);
    let foundRequest = null;

    // Search through all doctors’ stored requests
    allKeys.forEach((key) => {
      if (key.startsWith("requestsData_")) {
        const arr = JSON.parse(localStorage.getItem(key)) || [];
        const match = arr.find((r) => String(r.id) === String(id));
        if (match) foundRequest = { ...match, key };
      }
    });

    if (foundRequest) setRequest(foundRequest);
  }, [id]);

  // ✅ Handle Approve
  const handleApprove = () => {
    if (!request) return;
    updateStatus("Approved");
    alert("✅ Request marked as Approved.");
    navigate("/insurer");
  };

  // ✅ Handle Deny
  const handleDeny = () => {
    if (!request) return;
    const reason =
      "❌ Denied: The documentation is incomplete. Please include prior physical therapy notes and updated imaging results for reconsideration.";
    updateStatus("Denied", reason);
    alert("⚠️ Request marked as Denied.");
    navigate("/insurer");
  };

  // ✅ Helper function to update everywhere
  const updateStatus = (newStatus, denialReason = "") => {
    const allKeys = Object.keys(localStorage);

    // Update in doctor’s request list
    allKeys.forEach((key) => {
      if (key.startsWith("requestsData_")) {
        const arr = JSON.parse(localStorage.getItem(key)) || [];
        const updated = arr.map((r) =>
          String(r.id) === String(id)
            ? { ...r, status: newStatus, denialReason }
            : r
        );
        localStorage.setItem(key, JSON.stringify(updated));
      }
    });

    // Update doctor’s activity
    const doctorEmail = request.doctorEmail;
    const activityKey = `doctorActivity_${doctorEmail}`;
    const activity = JSON.parse(localStorage.getItem(activityKey)) || [];
    const newActivity = [
      {
        id: Date.now(),
        patient: request.patientName,
        text:
          newStatus === "Approved"
            ? "Insurance approved the pre-authorization request"
            : "Insurance denied the pre-authorization request",
        date: new Date().toISOString().split("T")[0],
      },
      ...activity,
    ];
    localStorage.setItem(activityKey, JSON.stringify(newActivity));

    // Update insurer's approved bills list if approved
    if (newStatus === "Approved") {
      const insurerUser = JSON.parse(localStorage.getItem("authUser"));
      const billsKey = `billsData_${insurerUser.email}`;
      const bills = JSON.parse(localStorage.getItem(billsKey)) || [];
      const newBill = {
        id: request.id,
        patient: request.patientName,
        procedure: request.exam_findings || "Procedure",
        amount: `$${(Math.random() * 1000 + 500).toFixed(2)}`,
        date: new Date().toISOString().split("T")[0],
        status: "Paid",
      };
      localStorage.setItem(billsKey, JSON.stringify([newBill, ...bills]));
    }
  };

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="text-lg font-semibold mb-3">Request not found.</p>
        <button
          onClick={() => navigate("/insurer")}
          className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Request Details
        </h1>
        <button
          onClick={() => navigate("/insurer")}
          className="text-sm bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>

      {/* Request Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Doctor Request Information
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Doctor:</strong> {request.doctorName || "Unknown"}
          </p>
          <p>
            <strong>Patient:</strong> {request.patientName}
          </p>
          <p>
            <strong>Insurance:</strong> {request.insurance}
          </p>
          <p>
            <strong>Date Submitted:</strong> {request.date}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                request.status === "Approved"
                  ? "text-green-700 bg-green-100 border-green-200"
                  : request.status === "Denied"
                  ? "text-red-700 bg-red-100 border-red-200"
                  : "text-yellow-700 bg-yellow-100 border-yellow-200"
              }`}
            >
              {request.status}
            </span>
          </p>
        </div>
      </div>

      {/* Request Details */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Clinical Details
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Clinical Summary:</strong> {request.clinical_summary}
          </p>
          <p>
            <strong>Treatments Tried:</strong> {request.treatments_tried}
          </p>
          <p>
            <strong>Exam Findings:</strong> {request.exam_findings}
          </p>
          {request.other_notes && (
            <p>
              <strong>Other Notes:</strong> {request.other_notes}
            </p>
          )}
          {request.status === "Denied" && request.denialReason && (
            <p className="text-red-600 mt-3">
              <strong>Denial Reason:</strong> {request.denialReason}
            </p>
          )}
        </div>
      </div>

      {/* Claude Placeholder Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          General Summary (AI Placeholder)
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700"
          rows="4"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleDeny}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Deny Request
        </button>
        <button
          onClick={handleApprove}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Approve Request
        </button>
      </div>
    </div>
  );
}
