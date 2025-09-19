// import Link from "next/link";
// export default function Projects(){
//     return(
//         <>
//             <div className="flex justify-between">
            
//                     <h2 className="text-white">Project Management</h2>
                    
// <<<<<<< project
//                     <Link
//                       href="/addProject"
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
//                     >
//                       + Add Project
//                     </Link>
//                   </div>
//         </>
//     )
// }
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div>
      <div className="flex justify-between">
        <h2 className="text-white">Project Management</h2>
        <Link
          href="/dashboard/projects/addProject"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          + Add Project
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
  );
}
// =======
//                     <Link
//                       href="/dashboard/projects/addProject"
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
//                     >
//                       + Add Project
//                     </Link>
//                   </div>
//         </>
//     )
// }
// >>>>>>> main
