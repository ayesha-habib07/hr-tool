import React from 'react'

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

export default function DepartmentList({ departments, search, setSearch, onChange }) {

    const handleDelete = async (id) => {
        await fetch(`api/departments?id=${id}`, { method: "DELETE" })
        onChange();
    }

    // const filteredDepartments = (departments).filter((dept) => {
    //     const text = search.toLowerCase();
    //     return (
    //         dept.name?.toLowerCase.includes(text)
    //     )
    // })
    const filteredDepartments = Array.isArray(departments)
        ? departments.filter((dept) =>

            dept.name?.toLowerCase().includes(search.toLowerCase())

        )
        : [];

    return (
        <>
            <Table>
                <TableCaption>A list of Departments.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Despcription</TableHead>
                        <TableHead>Actions</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody  className="text-grey-700">
                    {filteredDepartments.length > 0 ? (
                        filteredDepartments.map((dept) => (
                            <TableRow key={dept._id}>
                                <TableCell>{dept.name}</TableCell>
                                <TableCell>{dept.description}</TableCell>

                                <TableCell className="space-x-2">
                                    <Link
                                        href={`/dashboard/departments/addDepartment?id=${dept._id}`}
                                        className="bg-primary-light50 hover:bg-primary-dark600 text-primary-dark600  hover:text-grey-50 px-2 py-1 rounded-md text-xs flex items-center justify-center transition-colors duration-300 ease-in-out"
                                    >
                                        <EditIcon fontSize="small" />
                                    </Link>
                                    {/* <Link
                                        href={`/addDepartment?id=${dept._id}`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                                    >
                                        Update
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(dept._id)}
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
                                No departments found
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>
        </>
    )
}