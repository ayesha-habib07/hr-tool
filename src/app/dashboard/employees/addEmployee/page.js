// import AddMemberForm from "../../components/AddMemberForm";
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EmployeeForm from '../../../../components/EmployeeForm'

export default function AddEmployeePage() {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Status ${res.status}`);
        }
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error("Failed to fetch employee:", err);
        setError("Failed to load employee");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="text-secondary-dark800">Loading employee...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // pass isEdit true only when we actually loaded initialData
  return (
    <div className="bg-primary-light50 min-h-screen flex items-start justify-center p-6 rounded-lg">
      <EmployeeForm initialData={initialData} isEdit={Boolean(initialData)} />
    </div>
  );
}