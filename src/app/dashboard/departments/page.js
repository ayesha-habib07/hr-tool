'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button"

import DepartmentList from "@/src/components/DepartmentList";
import { useEffect, useState } from "react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });


  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 2000);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`/api/departments?page=${page}&limit=${limit}&search=${debouncedSearch}`);
      const data = await res.json();
      setDepartments(data.departments || data);

      setPagination(data.pagination || { total: data.length, pages: 1, page: 1 });

      console.log(data, "departments");
    } catch (err) {
      console.log("Error while fetching departments", err);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, [page, debouncedSearch]);

  return (
    <>

      <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg">
        <div className=" flex flex-col gap-8! bg-white p-6 rounded-lg shadow-md " >
          <div className="flex justify-between">
            <h2 className="text-secondary-dark800  text-xl font-medium">Department Management</h2>

            <Link href="/dashboard/departments/addDepartment">
              <Button className='bg-secondary-light50 text-secondary-dark800 hover:bg-secondary-light50 hover:text-secondary-dark800 cursor-pointer font-medium  rounded-lg shadow-md transition'> + Add Department</Button>
            </Link>
          </div>
          <DepartmentList
      
            departments={departments}
            search={search}
            setSearch={setSearch}
            onchange={fetchDepartments}
          />
        </div>
      </div >
    </>
  )
} 