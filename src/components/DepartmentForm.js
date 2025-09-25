'use client'
import { useState } from "react"
export default function DepartmentForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    // const [code, setCode] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create department');
            }
            await res.json();

            setName('');
            setDescription('');

            alert('Department created successfully!')

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
            <form onSubmit={handleSubmit} className="w-[70%] p-6 bg-white shadow-md rounded-lg space-y-4">
                <h2 className="text-xl font-bold">Create New Department</h2>
                <input
                    name="name"
                    value={name}
                    type="text"
                    placeholder="Department Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border px-2 py-1 w-full"
                />
                {/* <input
             name="code"
             value={code}
             placeholder="Enter Code for Department"
             onChange={(e)=> setCode(e.target.value)}
             required
             className="border px-2 py-1 w-full"
                
             /> */}
                <textarea
                    name="description"
                    value={description}
                    type="text"
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border px-2 py-1 w-full"
                />
                {error && <p className="text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {loading ? "Creating" : "Create Department"}
                </button>

            </form>


        </>
    )
}