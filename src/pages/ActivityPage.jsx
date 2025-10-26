// src/pages/ActivityPage.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { Clock, CheckCircle2, AlertTriangle, FileCheck2 } from "lucide-react";

export default function ActivityPage({ user }) {
  const [activities, setActivities] = useState([]);

  // Mock data (replace with AWS DynamoDB fetch later)
  useEffect(() => {
    setActivities([
      {
        id: 1,
        type: "Submitted Pre-Auth",
        description: "Requested MRI Knee scan approval for Alice Green.",
        time: "2 hours ago",
        icon: <FileCheck2 className="text-blue-600" size={18} />,
      },
      {
        id: 2,
        type: "Received Approval",
        description: "Insurance approved procedure for Paul White.",
        time: "1 day ago",
        icon: <CheckCircle2 className="text-green-600" size={18} />,
      },
      {
        id: 3,
        type: "Request for More Info",
        description: "Insurer requested physical therapy notes for Mark Black.",
        time: "3 days ago",
        icon: <AlertTriangle className="text-yellow-600" size={18} />,
      },
      {
        id: 4,
        type: "Follow-Up Sent",
        description: "Uploaded documentation and resubmitted pre-authorization.",
        time: "5 days ago",
        icon: <Clock className="text-gray-500" size={18} />,
      },
    ]);
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800">Recent Activity</h1>
        <p className="text-gray-500 text-sm">
          Track your recent pre-authorization requests and insurer updates
        </p>

        <div className="relative mt-6 border-l border-gray-200 pl-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="mb-8 relative">
              <div className="absolute -left-3.5 bg-white border border-gray-200 rounded-full p-2 shadow-sm">
                {activity.icon}
              </div>

              <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">
                  {activity.type}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
