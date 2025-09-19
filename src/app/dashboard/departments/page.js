import Link from "next/link";
export default function Departments(){
    return(
        <>
            <div className="flex justify-between">
            
                    <h2 className="text-white">Department Management</h2>
                    
                    <Link
                      href="/dashboard/departments/addDepartment"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                      + Add Department
                    </Link>
                  </div>
        </>
    )
}