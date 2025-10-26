// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Removed useUser import as we get user via props now
import PatientList from "../components/PatientList";
import { uploadPatientRecord } from "../api"; // Keep this if you added it

// Receive user as a prop directly from App.jsx
export default function DoctorDashboard({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    insurance: "",
    dob: "",
    recordFile: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    // If you have a logout function in context, call it too
    // logout();
    navigate("/login");
  };

  // ✅ Scoped keys are now more reliable because `user` prop is stable
  const doctorKey = user ? `patientsData_${user.email}` : null;
  const activityKey = user ? `doctorActivity_${user.email}` : null;

  // ✅ Load data function - checks for valid keys
  const loadData = () => {
    if (!doctorKey || !activityKey) {
      console.warn("User email not available, cannot load data.");
      setPatients([]); // Clear data if user/keys are missing
      setActivity([]);
      return;
    }
    console.log("Loading data with keys:", doctorKey, activityKey); // Debugging
    const storedPatients = JSON.parse(localStorage.getItem(doctorKey)) || [];
    const storedActivity = JSON.parse(localStorage.getItem(activityKey)) || [];
    setPatients(storedPatients);
    setActivity(storedActivity);
  };

  // ✅ *** CORRECTED useEffect Hook ***
  // This hook now reliably runs *after* the `user` prop is available
  // and whenever the user prop changes (e.g., on login/logout).
  useEffect(() => {
    if (user) {
      console.log("User detected in Dashboard, loading data..."); // Debugging
      loadData();
    } else {
      console.log("No user detected in Dashboard, clearing data..."); // Debugging
      setPatients([]); // Clear data if user logs out
      setActivity([]);
    }

    // Refresh when window regains focus (if user is logged in)
    const handleFocus = () => {
      if (user) loadData();
    };
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [user, location.pathname]); // Depend on user and location path

  // ➕ Add new patient (No changes needed here from previous version)
  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (
      !newPatient.name ||
      !newPatient.insurance ||
      !newPatient.dob ||
      !doctorKey ||
      !activityKey
    ) {
      alert("Cannot add patient: Missing information or user data.");
      return;
    }

    setIsSubmitting(true);
    const patientCode = String(Math.floor(Math.random() * 100000)).padStart(
      5,
      "0"
    );
    let base64File = "";

    // Upload to S3 via your API
    if (newPatient.recordFile) {
      try {
        await uploadPatientRecord(
          patientCode,
          newPatient.name,
          newPatient.recordFile
        );
      } catch (err) {
        console.error("S3 Upload Failed:", err);
        alert(`Error: Could not upload patient record to S3. ${err.message}`);
        setIsSubmitting(false);
        return;
      }

      // Convert file for localStorage
      const reader = new FileReader();
      base64File = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(newPatient.recordFile);
      });
    }

    // Save to localStorage
    const newEntry = {
      id: Date.now(),
      code: patientCode,
      name: newPatient.name,
      insurance: newPatient.insurance,
      dob: newPatient.dob,
      record: base64File || null,
      doctorEmail: user?.email || "unknown",
    };

    // Read current patients *again* before updating to avoid race conditions
    const currentPatients = JSON.parse(localStorage.getItem(doctorKey)) || [];
    const updatedPatients = [...currentPatients, newEntry];
    setPatients(updatedPatients); // Update state
    localStorage.setItem(doctorKey, JSON.stringify(updatedPatients)); // Save

    // Update activity
    const currentActivity = JSON.parse(localStorage.getItem(activityKey)) || [];
    const newActivity = [
      {
        id: Date.now(),
        patient: newPatient.name,
        text: "Added new patient with record",
        date: new Date().toISOString().split("T")[0],
      },
      ...currentActivity,
    ];
    setActivity(newActivity); // Update state
    localStorage.setItem(activityKey, JSON.stringify(newActivity)); // Save

    // Reset form
    setShowModal(false);
    setNewPatient({ name: "", insurance: "", dob: "", recordFile: null });
    setIsSubmitting(false);
  };

  // --- Render ---
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">
          {user?.fullName || "Doctor"}’s Dashboard 🩺
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Portal (Left, larger) */}
          <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Patients
              </h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Patient
              </button>
            </div>
            {/* Pass user down if PatientList needs it */}
            <PatientList user={user} patients={patients} />
          </section>

          {/* Recent Activity (Right, smaller) */}
          <section className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <ul className="space-y-3 text-gray-700">
              {activity.length === 0 ? (
                <li className="text-gray-500 italic">No recent activity</li>
              ) : (
                activity.slice(0, 10).map(
                  (
                    a // Show top 10
                  ) => (
                    <li key={a.id} className="border-b pb-2">
                      📋 {a.text} —{" "}
                      <span className="font-medium">{a.patient}</span> ({a.date}
                      )
                    </li>
                  )
                )
              )}
            </ul>
          </section>
        </div>
      </main>

      {/* Add Patient Modal (Refactored) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
            <form
              onSubmit={handleAddPatient} // Use the new handler
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Patient Name"
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Insurance Company"
                value={newPatient.insurance}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, insurance: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
              <input
                type="date"
                value={newPatient.dob}
                onChange={(e) =>
                  setNewPatient({ ...newPatient, dob: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
              {/* PDF upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Record (PDF for AI)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="patient-record-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        recordFile: e.target.files[0],
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="patient-record-upload"
                    className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                  {newPatient.recordFile ? (
                    <span className="text-sm text-gray-600 truncate">
                      {newPatient.recordFile.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      No file chosen
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
