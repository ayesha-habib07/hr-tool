"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmployeeForm from "../../../components/EmployeeForm";

export default function EditEmployeePage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) throw new Error("Failed to fetch employee");
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) return <p className="text-white">Loading...</p>;

  if (!employee) return <p className="text-red-500">Employee not found</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Edit Employee</h2>
      <EmployeeForm initialData={employee} isEdit={true} />
    </div>
  );
}