// src/pages/ReportsPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FileText } from "lucide-react";

export default function ReportsPage({ user }) {
  const [approvalData, setApprovalData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Mock analytics data (replace with AWS QuickSight or SageMaker later)
  useEffect(() => {
    setApprovalData([
      { name: "Approved", value: 62 },
      { name: "Denied", value: 18 },
      { name: "Pending", value: 20 },
    ]);

    setMonthlyData([
      { month: "Jun", requests: 40, approvals: 30 },
      { month: "Jul", requests: 52, approvals: 42 },
      { month: "Aug", requests: 60, approvals: 50 },
      { month: "Sep", requests: 58, approvals: 44 },
      { month: "Oct", requests: 66, approvals: 55 },
    ]);
  }, []);

  const COLORS = ["#16a34a", "#dc2626", "#f59e0b"]; // green, red, amber

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-blue-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 text-sm">
              Track performance metrics and approval trends
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Request Outcomes
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value}%)`}
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Monthly Requests vs Approvals
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
                <Bar dataKey="approvals" fill="#16a34a" name="Approvals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Summary Insights
          </h2>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
            <li>Approval rate increased by <span className="text-green-600 font-medium">8%</span> this month.</li>
            <li>Average pre-authorization processing time dropped to <span className="text-blue-600 font-medium">1.8 days</span>.</li>
            <li><span className="text-yellow-600 font-medium">20%</span> of pending requests require additional clinical documentation.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
