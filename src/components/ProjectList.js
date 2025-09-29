import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditIcon from '@mui/icons-material/Edit';

export default function ProjectList({ projects, search, setSearch, onChange }) {

  console.log(projects, "projectsdta")
  const handleDelete = async (id) => {
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    onChange();
  };

  // const handleSearch = (e) => {
  //   setSearch(e.target.value);
  // };

  const filteredProjects = (projects || []).filter((proj) => {
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
    <>
      <Table>
        <TableCaption>A list of projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Project Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-grey-700">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj) => (
              <TableRow key={proj._id}>
                <TableCell>{proj.projectId}</TableCell>
                <TableCell>{proj.name}</TableCell>
                <TableCell>{proj.client}</TableCell>
                <TableCell>{proj.type}</TableCell>
                <TableCell>{proj.status}</TableCell>
                <TableCell>{proj.priority}</TableCell>
                <TableCell>{proj.startDate ? new Date(proj.startDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{proj.endDate ? new Date(proj.endDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell className="space-x-2">
                  <Link
                    href={`/dashboard/projects/addProject?id=${proj._id}`}
                    className="bg-primary-light50 hover:bg-primary-dark600 text-primary-dark600  hover:text-grey-50 px-2 py-1 rounded-md text-xs flex items-center justify-center transition-colors duration-300 ease-in-out"
                  >
                    <EditIcon fontSize="small" />
                  </Link>
                  {/* <button 
                    onClick={() => handleDelete(proj._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                  >
                    Delete
                  </button> */}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-grey-700">
                No projects found
              </TableCell>
            </TableRow>
          )}

        </TableBody>
      </Table>

    </>
  )
}