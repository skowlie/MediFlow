// src/pages/BillsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import { showSuccess, showInfo } from "../components/AlertToast";

export default function BillsPage({ user }) {
  const [bills, setBills] = useState([]);

  // Mock data for now (replace with DynamoDB fetch later)
  useEffect(() => {
    setBills([
      {
        id: 1,
        patient: "Alice Green",
        procedure: "MRI Knee",
        amount: "$1,200",
        date: "2025-10-22",
        status: "Pending Payment",
      },
      {
        id: 2,
        patient: "Mark Black",
        procedure: "Physical Therapy",
        amount: "$900",
        date: "2025-10-19",
        status: "Paid",
      },
      {
        id: 3,
        patient: "Paul White",
        procedure: "CT Scan",
        amount: "$650",
        date: "2025-10-16",
        status: "Under Review",
      },
    ]);
  }, []);

  // Table column config
  const columns = [
    { header: "Patient", accessor: "patient" },
    { header: "Procedure", accessor: "procedure" },
    { header: "Amount", accessor: "amount" },
    { header: "Date", accessor: "date" },
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
          {row.status === "Pending Payment" && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleMarkPaid(row.id)}
            >
              Mark Paid
            </Button>
          )}
          {row.status !== "Under Review" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleFlagReview(row.id)}
            >
              Flag Review
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleMarkPaid = (id) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Paid" } : b))
    );
    showSuccess("Bill marked as paid successfully!");
  };

  const handleFlagReview = (id) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Under Review" } : b))
    );
    showInfo("Bill flagged for manual review.");
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Recent Bills</h1>
          <p className="text-gray-500 text-sm">
            Manage payments and claim review statuses
          </p>
        </div>

        {/* Bills Table */}
        <Table title="Approved and Pending Bills" columns={columns} data={bills} />
      </div>
    </DashboardLayout>
  );
}
