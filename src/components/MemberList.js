"use client";

import Link from "next/link";
export default function MembersList({ employees, search, setSearch, onChange }) {
  const handleDelete = async (id) => {
    await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    onChange();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // filter employees by personal info and  job info
  const filteredEmployees = employees.filter((emp) => {
    const text = search.toLowerCase();
    return (
      emp.personalInfo?.firstName?.toLowerCase().includes(text) ||
      emp.personalInfo?.lastName?.toLowerCase().includes(text) ||
      emp.personalInfo?.email?.toLowerCase().includes(text) ||
      emp.personalInfo?.contactNumber?.toLowerCase().includes(text) ||
      emp.jobInfo?.title?.toLowerCase().includes(text) ||
      emp.jobInfo?.location?.toLowerCase().includes(text) ||
      emp.systemInfo?.role?.toLowerCase().includes(text)
    );
  });

  console.log(employees,"emppp")

  return (
    <div className="mt-8">

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
        />
      </div>


      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-700 divide-y divide-gray-600 bg-gray-900 text-sm text-white">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">First Name</th>
              <th className="px-4 py-3 text-left">Last Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td className="px-2 py-2">{emp.personalInfo?.firstName}</td>
                <td className="px-2 py-2">{emp.personalInfo?.lastName}</td>
                <td className="px-2 py-2">{emp.personalInfo?.email}</td>
                <td className="px-2 py-2">{emp.systemInfo?.role || "N/A"}</td>
                <td className="px-2 py-2">{emp.personalInfo?.contactNumber}</td>
                <td className="px-2 py-2">{emp.jobInfo?.title}</td>
                <td className="px-2 py-2">{emp.jobInfo?.status}</td>
                <td className="px-2 py-2">{emp.jobInfo?.location}</td>
                <td className="px-2 py-2">{emp.departmentName || "N/A"}</td>
                {/* <td className="px-2 py-2">{emp.jobInfo?.departmentId?.name || N/A}</td>
                 */}
                {/* <td>
  {emp.jobInfo?.departmentId?.name || "N/A"} 
 
</td> */}
                <td className="px-2 py-2 text-center space-x-2">
                  <Link
                    href={`/dashboard/employees/addEmployee?id=${emp._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
