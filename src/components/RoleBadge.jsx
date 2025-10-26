// src/components/RoleBadge.jsx
import React from "react";
import { Stethoscope, Building2 } from "lucide-react"; // npm i lucide-react

export default function RoleBadge({ role }) {
  const isDoctor = role?.toLowerCase() === "doctor";

  const roleStyles = isDoctor
    ? "bg-blue-100 text-blue-700 border-blue-200"
    : "bg-purple-100 text-purple-700 border-purple-200";

  const roleLabel = isDoctor ? "Doctor" : "Insurance Company";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleStyles}`}
    >
      {isDoctor ? <Stethoscope size={14} /> : <Building2 size={14} />}
      {roleLabel}
    </span>
  );
}
