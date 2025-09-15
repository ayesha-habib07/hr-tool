"use client";
import { useState } from "react";

export default function AddRoleForm({ onAdded, organizationId }) {
  const [roleName, setRoleName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: roleName, organizationId }),
    });
    setRoleName("");
    onAdded();
  };
  console.log(roleName)

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 bg-gray-800 p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Role name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        className="border border-gray-600 bg-gray-900 px-3 py-2 rounded text-white"
        required
      />
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Add Role
      </button>
    </form>
  );
}
