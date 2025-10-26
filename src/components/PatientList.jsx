import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientList({ user, patients = [] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mt-4">
      {patients.length > 0 ? (
        patients.map((p, index) => (
          <div
            key={index}
            onClick={() => navigate(`/doctor/patient/${p.code}`)}
            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer flex justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
              <p className="text-sm text-gray-500">Insurance: {p.insurance}</p>
              <p className="text-sm text-gray-400">Patient Code: {p.code}</p>
            </div>
            <span className="text-sm text-gray-500 self-center">
              View Details →
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No patients yet.</p>
      )}
    </div>
  );
}
