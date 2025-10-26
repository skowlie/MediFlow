// src/pages/InsuranceRequestDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCases } from "../context/CaseContext"; // 1. Import our hook
import { useUser } from "../context/UserContext"; // Import useUser

export default function InsuranceRequestDetail() {
  const { id } = useParams(); // This `id` is now the `case_id`
  const navigate = useNavigate();
  const { user } = useUser(); // Get user for API calls
  const { cases, submitDecision } = useCases(); // 2. Get data and functions

  const [request, setRequest] = useState(null);
  const [notes, setNotes] = useState(""); // For denial/approval notes
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Load the request from the live context
  useEffect(() => {
    // We might have the case already, but if not (e.g., page refresh),
    // we need a way to fetch it.
    // For now, we just check the context.
    const foundRequest = cases.find((r) => String(r.case_id) === String(id));
    if (foundRequest) {
      setRequest(foundRequest);
    }
    // TODO: Add a fetch for a single case if not found in context
    setIsLoading(false);
  }, [cases, id]);

  // 4. Handle Approve (Refactored)
  const handleApprove = async () => {
    if (!request || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitDecision({
        case_id: request.case_id,
        decision: "APPROVED",
        notes: notes || "All criteria met. Approved.",
      });
      // No need to update state! WebSocket will handle it.
      alert("✅ Request marked as Approved.");
      navigate("/insurer");
    } catch (err) {
      console.error("Failed to approve:", err);
      alert(`Error: Could not approve request. ${err.message}`);
    }
    setIsSubmitting(false);
  };

  // 5. Handle Deny (Refactored)
  const handleDeny = async () => {
    if (!request || isSubmitting) return;
    if (!notes) {
      alert("Please provide a reason for denial in the notes text box.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitDecision({
        case_id: request.case_id,
        decision: "DENIED",
        notes: notes,
      });
      // No need to update state! WebSocket will handle it.
      alert("⚠️ Request marked as Denied.");
      navigate("/insurer");
    } catch (err) {
      console.error("Failed to deny:", err);
      alert(`Error: Could not deny request. ${err.message}`);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="text-lg font-semibold mb-3">Loading request...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p className="text-lg font-semibold mb-3">Request not found.</p>
        <p className="text-sm mb-4">
          It may still be processing or you navigated directly. Try refreshing
          the dashboard.
        </p>
        <button
          onClick={() => navigate("/insurer")}
          className="bg-gray-800 text-white px-5 py-2 rounded-md hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- Normal Render ---
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

      {/* Request Info (Refactored) */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Case Information
        </h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Provider:</strong> {request.provider_id}
          </p>
          <p>
            <strong>Patient ID:</strong> {request.patient_id}
          </p>
          <p>
            <strong>Procedure:</strong> {request.procedure_code}
          </p>
          <p>
            <strong>Date Submitted:</strong>{" "}
            {new Date(request.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                request.status === "APPROVED"
                  ? "text-green-700 bg-green-100 border-green-200"
                  : request.status === "DENIED"
                  ? "text-red-700 bg-red-100 border-red-200"
                  : "text-yellow-700 bg-yellow-100 border-yellow-200"
              }`}
            >
              {request.status}
            </span>
          </p>
        </div>
      </div>

      {/* Real AI Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          AI Analysis Summary
        </h2>
        <div className="space-y-3">
          {request.analysis &&
          typeof request.analysis === "object" &&
          !request.analysis.error ? (
            Object.entries(request.analysis).map(([key, value]) => (
              <div key={key} className="text-sm pb-2 border-b last:border-none">
                <p className="font-semibold text-gray-700">{key}</p>
                <p
                  className={`pl-2 font-medium ${
                    value.met ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {value.met ? "✅ Met" : "❌ Missing / Not Found"}
                </p>
                <p className="pl-2 text-gray-600">
                  <b>Evidence:</b> {value.evidence}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              {request.analysis?.error ||
                "No analysis details available. Status is PENDING."}
            </p>
          )}
        </div>
      </div>

      {/* Decision Notes */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Decision Notes (Required for Denial)
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700"
          rows="4"
          placeholder="e.g., Denied: Patient has not completed 6 weeks of physical therapy."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleDeny}
          disabled={isSubmitting}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Deny Request"}
        </button>
        <button
          onClick={handleApprove}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Approve Request"}
        </button>
      </div>
    </div>
  );
}
