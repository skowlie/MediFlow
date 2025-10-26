// src/pages/RequestsPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { showSuccess, showInfo } from "../components/AlertToast";

export default function RequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data for now (replace with API call later)
  useEffect(() => {
    setRequests([
      {
        id: 1,
        patient: "Alice Green",
        doctor: "Dr. John Doe",
        procedure: "MRI Knee",
        status: "Pending",
        notes: "Severe knee pain after injury. Physical therapy failed.",
      },
      {
        id: 2,
        patient: "Mark Black",
        doctor: "Dr. Jane Smith",
        procedure: "Physical Therapy",
        status: "In Review",
        notes: "Ongoing rehabilitation plan with moderate improvement.",
      },
      {
        id: 3,
        patient: "Paul White",
        doctor: "Dr. Emily Brown",
        procedure: "CT Scan",
        status: "Approved",
        notes: "Chronic headaches requiring detailed scan evaluation.",
      },
    ]);
  }, []);

  // Table column configuration
  const columns = [
    { header: "Patient", accessor: "patient" },
    { header: "Doctor", accessor: "doctor" },
    { header: "Procedure", accessor: "procedure" },
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
          {row.status !== "Approved" && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleView = (row) => {
    setSelectedRequest(row);
    setModalOpen(true);
  };

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    );
    showSuccess("Request approved successfully!");
  };

  const handleRequestInfo = () => {
    showInfo("Request for additional information sent to doctor.");
    setModalOpen(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Pre-Authorization Requests
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and approve incoming doctor requests
          </p>
        </div>

        <Table columns={columns} data={requests} />

        {/* Modal for request details */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Request Details"
        >
          {selectedRequest && (
            <div className="space-y-3 text-sm">
              <p>
                <strong>Patient:</strong> {selectedRequest.patient}
              </p>
              <p>
                <strong>Doctor:</strong> {selectedRequest.doctor}
              </p>
              <p>
                <strong>Procedure:</strong> {selectedRequest.procedure}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={selectedRequest.status} />
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Clinical Notes:</strong> {selectedRequest.notes}
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={handleRequestInfo}
                >
                  Request More Info
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
