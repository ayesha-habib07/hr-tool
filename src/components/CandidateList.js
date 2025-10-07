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
import dayjs from "dayjs";
export default function CandidateList({ candidates, search, setSearch, onChange }) {

    const filteredCandidates = (candidates || []).filter((candidate) => {
        const text = search.toLowerCase();
        return (
            candidate.fullName?.toLowerCase().includes(text)
        )
    });

    return (
        <>
            <Table>
                {/* <TableCaption>A list of candidates.</TableCaption> */}
                <TableHeader>
                    <TableRow>

                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Date of birth</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody className="text-grey-700">
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate) => (
                            <TableRow key={candidate._id}>
                                <TableCell>
                                    <Link
                                        className="cursor-pointer text-grey-700"
                                        href={`/dashboard/candidate/${candidate._id}`}
                                    >
                                        {candidate.fullName}
                                    </Link>

                                </TableCell>
                                <TableCell>{candidate.email}</TableCell>
                                <TableCell>{candidate.department}</TableCell>
                                <TableCell>{candidate.phoneNumber}</TableCell>
                                <TableCell>
                                    {candidate.dateOfBirth ? dayjs(candidate.dateOfBirth).format("DD-MM-YYYY") // or "yyyy/MM/DD"
                                        : "N/A"}
                                </TableCell>
                                {/* <TableCell>{proj.status}</TableCell> */}
                                {/* <TableCell>{proj.priority}</TableCell> */}
                                {/* <TableCell>{proj.startDate ? new Date(proj.startDate).toLocaleDateString() : "-"}</TableCell> */}
                                {/* <TableCell>{proj.endDate ? new Date(proj.endDate).toLocaleDateString() : "-"}</TableCell> */}
                                {/* <TableCell className="space-x-2">
                                    <Link
                                        href={`/dashboard/projects/addProject?id=${proj._id}`}
                                        className="bg-primary-light50 hover:bg-primary-dark600 text-primary-dark600  hover:text-grey-50 px-2 py-1 rounded-md text-xs flex items-center justify-center transition-colors duration-300 ease-in-out"
                                    >
                                        <EditIcon fontSize="small" />
                                    </Link>
                                   
                                </TableCell> */}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-4 text-grey-700">
                                No candidate found
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>

        </>
    )
}