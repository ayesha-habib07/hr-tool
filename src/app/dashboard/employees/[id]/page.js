'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { useParams } from 'next/navigation'

export default function EmployeeDetail({ params }) {
    console.log("Params:", params);
    const { id } = use(params)

    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            console.log("id is missing:", id)
            return
        }

        const fetchEmployee = async () => {
            try {
                const res = await fetch(`/api/employees/${id}`)
                console.log("Fetching:", `/api/employees/${id}`)

                if (!res.ok) {
                    throw new Error(`Failed to fetch employee: ${res.status}`)
                }

                const data = await res.json()
                console.log("Employee data:", data)
                setEmployee(data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchEmployee()
    }, [id]);


    // fetching deprtments from mongo
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch("/api/departments");
                const data = await res.json();
                 setDepartments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load departments:", err);
            }
        };
        fetchDepartments();
    }, []);
    const getDepartmentName = (id) => {
        const dept = departments.find((d) => d._id === id)
        return dept ? dept.name : "N/A"
    }

    if (!employee) return <p>Loading..</p>


    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
            // onChange?.()
            router.push('/dashboard/employees')

        } catch (err) {
            console.log("Failed to delete employee", err)
        }
        finally {
            setLoading(false);
        }

    }
    if (!employee) return <p>loading...</p>

    return (
        <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg flex flex-col gap-4 ">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className='font-semibold text-xl text-grey-700'>Employee Details</h1>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <p className='text-grey-700 font-medium pl-6'>Employee ID: {id}</p>
                <hr className='text-grey-100  mt-3 mx-5'></hr>

                <div className='p-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className='text-xl  text-secondary-dark600 font-medium'>
                            {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                        </h1>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="bg-secondary-light50 hover:bg-secondary-dark600 text-secondary-dark600 hover:text-grey-50 px-4 py-2 font-medium rounded-md text-xs flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out">
                                    Delete
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. The employee will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>

                                    <AlertDialogCancel disabled={loading} className=' bg-primary-dark600 text-grey-50 hover:bg-primary-dark800 hover:text-grey-50 font-medium cursor-pointer transition-colors duration-300 ease-in-out'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(employee._id)}
                                        disabled={loading}
                                        className="bg-error-main text-grey-50 hover:bg-error-dark800 cursor-pointer transition-colors duration-300 ease-in-out"
                                    > {loading ? "Deleting..." : "Yes, Delete"}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <Tabs defaultValue="personal" className="w-full">
                        <ScrollArea className="w-full overflow-x-auto whitespace-nowrap">
                            <TabsList
                                className="w-full flex !flex gap-3 mb-2 text-grey-700 px-3 py-2 min-w-max"
                            >
                                <TabsTrigger value="personal" className="font-medium whitespace-nowrap">
                                    Personal Info
                                </TabsTrigger>
                                <TabsTrigger value="job" className="font-medium whitespace-nowrap">
                                    Job Info
                                </TabsTrigger>
                                <TabsTrigger value="projects" className="font-medium whitespace-nowrap">
                                    Current Projects
                                </TabsTrigger>
                                <TabsTrigger value="system" className="font-medium whitespace-nowrap">
                                    System Info
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <hr className='text-grey-100  mb-6'></hr>
                        <TabsContent value="personal" className="text-grey-700">
                            <p className='py-2'><strong>First Name: </strong>{employee.personalInfo.firstName}</p>

                            <p className='py-2'><strong>Last Name: </strong>{employee.personalInfo.lastName}</p>
                            <p className='py-2'><strong>Email: </strong>{employee.personalInfo.email}</p>
                            <p className='py-2'><strong>Contact Number: </strong>{employee.personalInfo.contactNumber}</p>
                        </TabsContent>
                        <TabsContent value="job" className="text-grey-700">
                            <p><strong>Title:</strong> {employee.jobInfo.title}</p>



                            <p className='py-2'><strong>Department: </strong> {getDepartmentName(employee.jobInfo.departmentId)}</p>
                            <p className='py-2'><strong>Manager: </strong>{employee.jobInfo.managerId?.personalInfo?.firstName || "N/A"}</p>
                            <p className='py-2'><strong>Employee Type: </strong> {employee.jobInfo.employmentType}</p>
                            <p className='py-2'><strong>Status: </strong> {employee.jobInfo.status}</p>
                            <p className='py-2'><strong>Location: </strong> {employee.jobInfo.location}</p>
                            <div>
                                <strong>Skills</strong>
                                {employee.jobInfo.skills?.length > 0 ? (
                                    <ul className='list-disc pl-6'>
                                        {employee.jobInfo.skills.map((skill, idx) => (
                                            <li key={idx}>{skill}</li>
                                        ))}

                                    </ul>) : (<p>No skill added yet</p>)}
                            </div>
                            {/* experiences */}
                            <div className='mt-4 '>
                                <strong>Experiences</strong>
                                {employee.jobInfo.experiences?.length > 0 ? (
                                    <ul>
                                        {employee.jobInfo.experiences.map((exp, idx) => (
                                            <li key={idx}>
                                                <p><strong>Company Name: </strong>{exp.company}</p>
                                                <p><strong>Role: </strong>{exp.role}</p>
                                                <p><strong>Date Of Joining: </strong>{exp.dateOfJoining}</p>
                                                <p><strong>Date Of Leaving: </strong>{exp.dateOfLeaving}</p>
                                                <p><strong>Years of Experience: </strong>{exp.yearsOfExperience} years</p>
                                                <p><strong>ExpertiseLevel: </strong>{exp.expertiseLevel}</p>

                                            </li>
                                        ))}
                                    </ul>
                                ) : (<p>No experience added.</p>)}
                            </div>
                            <div className="mt-4">
                                <strong>Past Projects:</strong>
                                {employee.jobInfo.pastProjects?.length > 0 ? (
                                    <ul className="list-disc pl-6">
                                        {employee.jobInfo.pastProjects.map((proj, idx) => (
                                            <li key={idx}>
                                                <p><strong>Name:</strong> {proj.name}</p>
                                                <p><strong>Description:</strong> {proj.description}</p>
                                                <p><strong>Technologies:</strong> {proj.technologies?.join(", ")}</p>
                                                <p><strong>projectStartDate:</strong> {proj.projectStartDate}</p>
                                                <p><strong>projectEndDate:</strong> {proj.projectStartDate}</p>
                                                <p><strong>Company:</strong> {proj.company}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No past projects added</p>
                                )}
                            </div>

                        </TabsContent>
                        <TabsContent value="projects" className="text-grey-700">
                            {
                                employee.currentProjects?.length > 0 ? (
                                    <ul className="list-disc pl-4">
                                        {employee.currentProjects.map((p, i) => (
                                            <li key={i}>
                                                {p.role} ({new Date(p.assignedDate).toLocaleDateString()} → Present)
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No current projects</p>
                                )
                            }

                        </TabsContent>
                        <TabsContent value="system" className="text-grey-700">
                            <p className='py-2'><strong>User Id: </strong>{employee.systemInfo.userId}</p>
                            <p className='py-2'><strong>Role: </strong>{employee.systemInfo.role}</p>
                            <p className='py-2'><strong>Created At: </strong>{employee.systemInfo.createdAt}</p>
                            <p className='py-2'><strong>Created By: </strong>{employee.systemInfo.updatedBy}</p>
                        </TabsContent>

                    </Tabs>


                </div>
            </div>
        </div >
    )
}

