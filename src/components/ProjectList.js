// "use client";

import Link from "next/link";

export default function ProjectList({ projects, search, setSearch, onChange }) {
  const handleDelete = async (id) => {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    onChange();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProjects = projects.filter((proj) => {
    const text = search.toLowerCase();
    return (
      proj.name?.toLowerCase().includes(text) ||
      proj.client?.toLowerCase().includes(text) ||
      proj.type?.toLowerCase().includes(text) ||
      proj.status?.toLowerCase().includes(text) ||
      proj.priority?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="mt-8">
      {/* 🔍 Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
        />
      </div>

      {/* 📋 Projects Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-700 divide-y divide-gray-600 bg-gray-900 text-sm text-white">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Project ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Start Date</th>
              <th className="px-4 py-3 text-left">End Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProjects.map((proj) => (
              <tr key={proj._id}>
                <td className="px-2 py-2">{proj.projectId}</td>
                <td className="px-2 py-2">{proj.name}</td>
                <td className="px-2 py-2">{proj.client}</td>
                <td className="px-2 py-2">{proj.type}</td>
                <td className="px-2 py-2">{proj.status}</td>
                <td className="px-2 py-2">{proj.priority}</td>
                <td className="px-2 py-2">
                  {proj.startDate ? new Date(proj.startDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-2 py-2">
                  {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : "-"}
                </td>
                <td className="px-2 py-2 text-center space-x-2">
                  <Link
                    href={`/addProject?id=${proj._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-400">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
