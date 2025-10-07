'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dayjs from 'dayjs';

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

export default function CandidateDetail({ params }) {
    const { id } = useParams(params);
    const router = useRouter();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const res = await fetch(`/api/candidate/${id}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch candidate: ${res.status}`);
                }
                const data = await res.json();
                setCandidate(data);
            } catch (error) {
                console.error("/api/candidate/[id] error", error);
            }
        };

        if (id) fetchCandidate();
    }, [id]);

    if (!candidate) return <p>Loading</p>

    return (
        <>
            <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg flex flex-col gap-4 ">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className='font-semibold text-xl text-grey-700'>Candiate Details</h1>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className='text-grey-700 font-medium pl-6'>Candidate Name: {candidate.fullName}</h2>
                    <p className='text-grey-700 font-medium pl-6'>Candiate ID: {id}</p> 
                    <hr className='text-grey-100  mt-3 mx-5'></hr>

                    <div className='p-6'>
                        <div className='flex justify-between items-center mb-6'>
                            {/* <h1 className='text-xl  text-secondary-dark600 font-medium'>
                                {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                            </h1> */}

                            <AlertDialog>
                                {/* <AlertDialogTrigger asChild>
                                    <button className="bg-secondary-light50 hover:bg-secondary-dark600 text-secondary-dark600 hover:text-grey-50 px-4 py-2 font-medium rounded-md text-xs flex items-center justify-center cursor-pointer transition-colors duration-300 ease-in-out">
                                        Delete
                                    </button>
                                </AlertDialogTrigger> */}
                                {/* <AlertDialogContent>
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
                                </AlertDialogContent> */}
                            </AlertDialog>
                        </div>

                        <Tabs defaultValue="personal">
                            <TabsList className="gap-6 w-full mb-2 text-grey-700 " >
                                <TabsTrigger value="personal" className=" font-medium cursor-pointer">Personal Info</TabsTrigger>
                                <TabsTrigger value="job" className=" font-medium cursor-pointer">Job Info</TabsTrigger>
                                <TabsTrigger value="education" className=" font-medium cursor-pointer">Education</TabsTrigger>
                            </TabsList>
                            <hr className='text-grey-100  mb-6'></hr>
                            <TabsContent value="personal" className="text-grey-700">
                                <p className='py-2'><strong>Name: </strong>{candidate.fullName}</p>
                                <p className='py-2'><strong>Email: </strong>{candidate.email}</p>
                                <p className='py-2'><strong>Department: {candidate.department}</strong></p>
                                <p className='py-2'><strong>Date Of Birth: </strong>

                                {candidate.dateOfBirth ? dayjs(candidate.dateOfBirth).format("DD-MM-YYYY"): "NA"}
                                  
                                </p>
                                <p className='py-2'><strong>Contact Number: </strong>{candidate.phoneNumber}</p>
                            </TabsContent>
                            <TabsContent value="job" className="text-grey-700">
                                <div>
                                    <strong>Skills</strong>
                                    {candidate.skills?.length > 0 ? (
                                        <ul className='list-disc pl-6'>
                                            {candidate.skills.map((skill, idx) => (
                                                <li key={idx}>{skill}</li>
                                            ))}

                                        </ul>) : (<p>No skill added yet</p>)}
                                </div>
                                {/* experiences */}
                                <div className='mt-4 '>
                                    <strong>Experiences</strong>
                                    {candidate.employmentHistory?.length > 0 ? (
                                        <ul>
                                            {candidate.employmentHistory.map((exp, idx) => (
                                                <li key={idx}>
                                                    <p><strong>Company Name: </strong>{exp.company}</p>
                                                    <p><strong>Role: </strong>{exp.role}</p>
                                                    <p><strong>Date Of Joining: </strong>{exp.startDate}</p>
                                                    <p><strong>Date Of Leaving: </strong>{exp.endDate}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (<p>No experience added.</p>)}
                                </div>
                            </TabsContent>
                           
                            <TabsContent value="education" className="text-grey-700">
                                <div className='mt-4 '>
                                    <strong>Latest Education</strong>
                                    {candidate.education?.length > 0 ? (
                                        <ul>
                                            {candidate.education.map((exp, idx) => (
                                                <li key={idx}>
                                                    <p><strong>University Name: </strong>{exp.universityName}</p>
                                                    <p><strong>Degree: </strong>{exp.degree}</p>
                                                    <p><strong>Year: </strong>{exp.year}</p>

                                                </li>
                                            ))}
                                        </ul>
                                    ) : (<p>No education added.</p>)}
                                </div>
                            </TabsContent>
                        </Tabs>


                    </div>
                </div>
            </div >


        </>
    )
}