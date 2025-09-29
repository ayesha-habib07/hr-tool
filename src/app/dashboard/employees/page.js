"use client";
import { useEffect, useState } from "react";
import MembersList from "../../../components/MemberList";
import Link from "next/link";

import { Button } from "@/components/ui/button"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 2000);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchEmployees = async () => {
    try {

      const res = await fetch(
        `/api/employees?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );
      const data = await res.json();
      console.log(data, "employeedata")

      setEmployees(data.employees || []);
      setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
    } catch (err) {
      console.error("error fetching employees:", err)
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, debouncedSearch]);

  console.log("search:", search, "debounced:", debouncedSearch);
  console.log(employees, "employyye")

  return (

    <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between">
          <h2 className="text-secondary-dark800  text-xl font-medium">Employees Management</h2>
          <Link href="/dashboard/employees/addEmployee">
            <Button className='bg-secondary-light50 text-secondary-dark800 hover:bg-secondary-light50 hover:text-secondary-dark800 cursor-pointer font-medium  rounded-lg shadow-md transition'> + Add Employee</Button>
          </Link>
        </div>
        <MembersList
          employees={employees}
          search={search}
          setSearch={setSearch}
          onChange={fetchEmployees}
        />

        <div className="flex justify-between mt-4 text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-secondary-light50 text-secondary-dark800 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-secondary-light50 text-secondary-dark800 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

  );
}
