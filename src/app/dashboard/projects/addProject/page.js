'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProjectForm from "../../../../components/ProjectForm";

export default function AddProjectPage() {

    const searchParams = useSearchParams();
    const id = searchParams?.get("id");
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        (async () => {
            try {

                const res = await fetch(`/api/projects/${id}`);
                
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || `Status ${res.status}`);
                }
                const data = await res.json();
                console.log(data)
                setInitialData(data);
            } catch (err) {
                console.log("Failed to fetch project", err);
                setError("Failed to fetch projects");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);
    if (loading) return <p className="text-secondary-dark600">Loading projects</p>
    if (error) return <p className="text-error-dark800">{error}</p>


    return (
        <>
            <div className=" bg-primary-light50 rounded-lg min-h-screen flex justify-center p-6">
                <ProjectForm initialData={initialData} isEdit={Boolean(initialData)} />
            </div>
        </>
    )
}