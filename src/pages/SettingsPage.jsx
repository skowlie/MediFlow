// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import RoleBadge from "../components/RoleBadge";
import { showSuccess } from "../components/AlertToast";

export default function SettingsPage({ user }) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    organization: user?.organization || "",
    phone: user?.phone || "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Mock save – later integrate with AWS Cognito or API
    console.log("Saved settings:", formData);
    showSuccess("Settings updated successfully!");
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your profile and account preferences
            </p>
          </div>
          <RoleBadge role={user?.role} />
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label={user?.role === "doctor" ? "Clinic / Hospital" : "Insurance Organization"}
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder={user?.role === "doctor" ? "e.g., Santa Clara Medical Center" : "e.g., Blue Cross Insurance"}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
          <FormInput
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            helperText="Leave blank to keep your current password."
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
