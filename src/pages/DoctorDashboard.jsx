// src/pages/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PatientList from "../components/PatientList";

export default function DoctorDashboard({ user }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", insurance: "", dob: "" });

  // ✅ FIX: add handleLogout back
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  // ... rest of your DoctorDashboard code


  // ✅ Scoped keys for this doctor
  const doctorKey = user ? `patientsData_${user.email}` : "patientsData_temp";
  const activityKey = user ? `doctorActivity_${user.email}` : "doctorActivity_temp";

  // ✅ Load data for this specific doctor
  const loadData = () => {
    const storedPatients = JSON.parse(localStorage.getItem(doctorKey)) || [];
    const storedActivity = JSON.parse(localStorage.getItem(activityKey)) || [];
    setPatients(storedPatients);
    setActivity(storedActivity);
  };

  // Load on mount + route change
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (location.pathname === "/doctor") {
      loadData();
    }
  }, [location]);

  // Refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // ➕ Add new patient
  // Generate 5-digit code helper
const generatePatientCode = () =>
  String(Math.floor(Math.random() * 100000)).padStart(5, "0");

const handleAddPatient = (e) => {
  e.preventDefault();
  if (!newPatient.name || !newPatient.insurance || !newPatient.dob) return;

  const newEntry = {
    id: Date.now(),
    code: generatePatientCode(), // ✅ add unique code
    ...newPatient,
    doctorEmail: user?.email || "unknown",
  };

  const updatedPatients = [...patients, newEntry];
  setPatients(updatedPatients);
  localStorage.setItem(doctorKey, JSON.stringify(updatedPatients));
  console.log("Saved patient under key:", doctorKey);
  console.log("Saved data:", updatedPatients);
  const newActivity = [
    {
      id: Date.now(),
      patient: newPatient.name,
      text: "Added new patient",
      date: new Date().toISOString().split("T")[0],
    },
    ...activity,
  ];
  setActivity(newActivity);
  localStorage.setItem(activityKey, JSON.stringify(newActivity));

  setShowModal(false);
  setNewPatient({ name: "", insurance: "", dob: "" });
};


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
          activity.map((a) => (
            <li key={a.id} className="border-b pb-2">
              📋 {a.text} —{" "}
              <span className="font-medium">{a.patient}</span> ({a.date})
            </li>
          ))
        )}
      </ul>
    </section>
  </div>
</main>


      {/* Add Patient Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-md">
      <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newPatient.name || !newPatient.insurance || !newPatient.dob) return;

          // ✅ Convert uploaded PDF to base64 string
          let base64File = "";
          if (newPatient.recordFile) {
            const reader = new FileReader();
            base64File = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(newPatient.recordFile);
            });
          }

          const newEntry = {
            id: Date.now(),
            code: String(Math.floor(Math.random() * 100000)).padStart(5, "0"),
            name: newPatient.name,
            insurance: newPatient.insurance,
            dob: newPatient.dob,
            record: base64File || null, // ✅ store PDF here
            doctorEmail: user?.email || "unknown",
          };

          const doctorKey = user ? `patientsData_${user.email}` : "patientsData_temp";
          const updatedPatients = [...patients, newEntry];
          setPatients(updatedPatients);
          localStorage.setItem(doctorKey, JSON.stringify(updatedPatients));

          const activityKey = user ? `doctorActivity_${user.email}` : "doctorActivity_temp";
          const newActivity = [
            {
              id: Date.now(),
              patient: newPatient.name,
              text: "Added new patient with record",
              date: new Date().toISOString().split("T")[0],
            },
            ...activity,
          ];
          setActivity(newActivity);
          localStorage.setItem(activityKey, JSON.stringify(newActivity));

          setShowModal(false);
          setNewPatient({ name: "", insurance: "", dob: "", recordFile: null });
        }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Patient Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          type="text"
          placeholder="Insurance Company"
          value={newPatient.insurance}
          onChange={(e) => setNewPatient({ ...newPatient, insurance: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        <input
          type="date"
          value={newPatient.dob}
          onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-2"
          required
        />
        {/* ✅ PDF upload with custom blue button */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Patient Record (PDF)
  </label>

  <div className="flex items-center gap-3">
    {/* Hidden file input */}
    <input
      id="patient-record-upload"
      type="file"
      accept="application/pdf"
      onChange={(e) =>
        setNewPatient({ ...newPatient, recordFile: e.target.files[0] })
      }
      className="hidden"
    />

    {/* Custom styled label as button */}
    <label
      htmlFor="patient-record-upload"
      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
    >
      Choose File
    </label>

    {/* Show selected filename */}
    {newPatient.recordFile ? (
      <span className="text-sm text-gray-600 truncate">
        {newPatient.recordFile.name}
      </span>
    ) : (
      <span className="text-sm text-gray-400">No file chosen</span>
    )}
  </div>
</div>


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
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
