// src/pages/PatientsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { showSuccess, showInfo } from "../components/AlertToast";

export default function PatientsPage({ user }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock patient data for now (will connect to AWS later)
  useEffect(() => {
    setPatients([
      {
        id: 1,
        name: "Alice Green",
        lastVisit: "2025-10-20",
        diagnosis: "Knee Pain",
        status: "Approved",
        notes: "MRI scan approved and completed successfully.",
      },
      {
        id: 2,
        name: "Mark Black",
        lastVisit: "2025-10-18",
        diagnosis: "Lower Back Injury",
        status: "Pending",
        notes: "Awaiting pre-authorization for physical therapy.",
      },
      {
        id: 3,
        name: "Paul White",
        lastVisit: "2025-10-15",
        diagnosis: "Migraine",
        status: "Denied",
        notes: "CT scan request denied due to insufficient prior treatments.",
      },
    ]);
  }, []);

  // Table configuration
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Diagnosis", accessor: "diagnosis" },
    { header: "Last Visit", accessor: "lastVisit" },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleView(row)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleRequestAuth(row.id)}
          >
            Request Auth
          </Button>
        </div>
      ),
    },
  ];

  const handleView = (row) => {
    setSelectedPatient(row);
    setModalOpen(true);
  };

  const handleRequestAuth = (id) => {
    const patient = patients.find((p) => p.id === id);
    showInfo(`Pre-authorization requested for ${patient.name}.`);
  };

  const handleSubmitAuth = () => {
    showSuccess("Pre-authorization submitted successfully!");
    setModalOpen(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            My Patients
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage your current patients
          </p>
        </div>

        {/* Table */}
        <Table columns={columns} data={patients} />

        {/* Modal for Patient Details */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Patient Details"
        >
          {selectedPatient && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Name:</strong> {selectedPatient.name}
              </p>
              <p>
                <strong>Diagnosis:</strong> {selectedPatient.diagnosis}
              </p>
              <p>
                <strong>Last Visit:</strong> {selectedPatient.lastVisit}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={selectedPatient.status} />
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Clinical Notes:</strong> {selectedPatient.notes}
              </p>

              <div className="mt-5 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => showInfo("Request for additional info sent to insurer.")}>
                  Request Info
                </Button>
                <Button variant="primary" onClick={handleSubmitAuth}>
                  Submit Pre-Auth
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
