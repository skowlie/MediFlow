// src/api.js
const API_URL = "http://127.0.0.1:8000";

/**
 * Creates a new pre-auth case.
 * The server will handle the analysis and WebSocket broadcast.
 */
export const createCase = async (caseData) => {
  // caseData = { patient_id, provider_id, procedure_code }
  const response = await fetch(`${API_URL}/create-pre-auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(caseData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create case");
  }
  return response.json();
};

/**
 * Submits a final decision from the insurer.
 * The server will handle the update and WebSocket broadcast.
 */
export const submitDecision = async (decisionData) => {
  // decisionData = { case_id, decision, notes }
  const response = await fetch(`${API_URL}/submit-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(decisionData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to submit decision");
  }
  return response.json();
};

/**
 * Fetches all cases for a specific patient.
 * Used for initial page load.
 */
export const getCasesByPatient = async (patientId) => {
  const response = await fetch(`${API_URL}/get-cases-by-patient/${patientId}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to get patient cases");
  }
  return response.json();
};

/**
 * Fetches all cases with a specific status.
 * Used for the insurer's initial page load.
 */
export const getCasesByStatus = async (status) => {
  const response = await fetch(`${API_URL}/get-cases-by-status/${status}`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to get cases by status");
  }
  return response.json();
};

/**
 * Uploads a patient's PDF record and metadata to S3.
 */
export const uploadPatientRecord = async (patientId, patientName, file) => {
  const formData = new FormData();
  formData.append("patient_id", patientId);
  formData.append("patient_name", patientName); // <-- ADDED PATIENT NAME
  formData.append("patient_file", file);

  const response = await fetch(`${API_URL}/upload-patient-record`, {
    method: "POST",
    body: formData, // No Content-Type header needed, browser sets it
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to upload file");
  }
  return response.json();
};
