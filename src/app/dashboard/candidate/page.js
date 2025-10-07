'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CandidateList from '@/src/components/CandidateList';

export default function Page() {
    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1);

        }, 2000);

    }, [search])

    const fetchCandidate = async () => {
        try {
            const res = await fetch(`/api/candidate?page=${page}&limit=${limit}&search=${debouncedSearch}`);
            const data = await res.json();
            setCandidates(data);
            setPagination(data.pagination || { total: data.length, pages: 1, page: 1 });

        } catch (err) {
            console.error("/api/candidate fetch", err);
        }
    }

    useEffect(() => {
        fetchCandidate();
    }, [page, setDebouncedSearch])

    return (
         <div className=" bg-primary-light50 min-h-screen p-6 rounded-lg">
              <div className="flex flex-col gap-8! bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between">
                  <h2 className="text-secondary-dark800  text-xl font-medium">Candidate Management</h2>
                  <Link
                    href="/dashboard/projects/addProject"
                  >
                    {/* <Button className='bg-secondary-light50 text-secondary-dark800 hover:bg-secondary-light50 hover:text-secondary-dark800 cursor-pointer font-medium  rounded-lg shadow-md transition'> + Add Project</Button> */}
        
                  </Link>
                </div>
       
                <CandidateList
                  candidates={candidates}
                  search={search}
                  setSearch={setSearch}
                  onChange={fetchCandidate}
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
            </div>
    )
}

