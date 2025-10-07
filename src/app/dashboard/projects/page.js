"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button"

import ProjectList from "../../../components/ProjectList";

export default function ProjectsPage() {
  
  const [projects, setProjects] = useState([]);
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

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `/api/projects?page=${page}&limit=${limit}&search=${debouncedSearch}`
      );
      const data = await res.json();

      setProjects(data.projects || data); // fallback in case no pagination implemented
      setPagination(data.pagination || { total: data.length, pages: 1, page: 1 });
    } catch (err) {
      console.error("error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch]);

  return (
    <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg">
      <div className="flex flex-col gap-8! bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between">
          <h2 className="text-secondary-dark800  text-xl font-medium">Project Management</h2>
          <Link
            href="/dashboard/projects/addProject"
          >
            <Button className='bg-secondary-light50 text-secondary-dark800 hover:bg-secondary-light50 hover:text-secondary-dark800 cursor-pointer font-medium  rounded-lg shadow-md transition'> + Add Project</Button>

          </Link>
        </div>

        <ProjectList
          projects={projects}
          search={search}
          setSearch={setSearch}
          onChange={fetchProjects}
        />

        {/* Pagination */}
        <div className="flex justify-between mt-4 text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="bg-gray-700 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

  );
}

