'use client'
import { useEffect, useState } from "react"
export default function DepartmentForm({ mode = 'add', initialData = null, isEdit = false }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [code, setCode] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
        }
    }, [initialData])
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const url = isEdit ? `/api/departments/${initialData._id}` : "/api/departments"
            const method = isEdit ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'error while saving department');
                throw new Error(data.error || "Failed to save department");
            }
            setName('');
            setDescription('');

            setMessage(isEdit ? "Department updated successfully" : "Department added successfully");

            // Redirect to projects list
            router.push("/dashboard/departments");

            if (mode === 'add') {
                setName = ''
                setDescription = ''
            }
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="w-[100%]">
                <form onSubmit={handleSubmit}
                    className=" p-6 bg-white shadow-md rounded-lg space-y-4 w-[100%]">
                    <h2 className="text-xl font-medium text-secondary-dark800">{isEdit ? 'Update Department' : 'Create New Department'}</h2>
                    <div className="relative flex-1">
                        <input
                            name="name"
                            value={name}
                            type="text"
                            placeholder=""
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                        />
                        <label
                            htmlFor="departmentName"
                            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >Department Name</label>
                    </div>

                    <div className="relative flex-1">
                        <textarea
                            name="description"
                            value={description}
                            type="text"
                            placeholder=""
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                        />
                        <label
                            htmlFor="description"
                            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >
                            Description
                        </label>
                    </div>

                    {error && <p className="text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-dark600 hover:bg-primary-dark800  text-grey-50 px-4 py-2 rounded shadow-md cursor-pointer"
                    >
                        {/* {loading ? "Creating" : "Create Department"} */}
                        {isEdit ? 'Update Department' : 'Create Department'}
                    </button>
                </form>
            </div>
        </>
    )
}