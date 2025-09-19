import Link from "next/link";
export default function Projects(){
    return(
        <>
            <div className="flex justify-between">
            
                    <h2 className="text-white">Project Management</h2>
                    
                    <Link
                      href="/dashboard/projects/addProject"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                      + Add Project
                    </Link>
                  </div>
        </>
    )
}