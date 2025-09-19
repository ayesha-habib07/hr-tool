// 'use client'
// import { useState } from "react"
// export default function ProjectForm() {
//     const [form, setForm] = useState({
//         name: '',
//         description: '',
//         client: '',
//         type: '',
//         startDate: '',
//         endDate: '',
//         status: '',
//         priority: '',
//     });
//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const res = await fetch('/api/projects', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(form),
//             });
//             const data = await res.json();
//             if (!res.ok) {

//                 throw new Error(data.error || 'Failed while creating project');
//             }
//             alert('Project created Successfully!');
//             console.log('created Project', data);
//             setForm({
//                 name: '',
//                 description: '',
//                 client: '',
//                 type: '',
//                 startDate: '',
//                 endDate: '',
//                 status: '',
//                 priority: '',
//             });
//         } catch (err) {
//             console.log(err, "catch error");
//         }
//     };

//     return (
//         <>
//             <form onSubmit={handleSubmit} className="w-[70%] p-6 bg-white shadow-md rounded-lg space-y-4">
//             <h2 className="text-xl font-bold">Add New Project</h2>
//                 <input
//                     type='text'
//                     name='name'
//                     placeholder="Project Name"
//                     value={form.name}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 />
//                 <textarea
//                     type="text"
//                     name="description"
//                     placeholder="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 />
//                 <input
//                     type="text"
//                     name="client"
//                     placeholder="Client Name"
//                     value={form.client}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 />
//                 <select
//                     name="type"
//                     value={form.type}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 >
//                     <option value={''}>-- Select Project Type --</option>
//                     <option value={'internal'}>Internal</option>
//                     <option value={'external'}>External</option>
//                     <option value={'r&d'}>R&D</option>
//                 </select>
//                 <div className="grid grid-cols-2 gap-2">
//                     <div>
//                         <label className="block font-medium">Start Date</label>
//                         <input
//                             type="date"
//                             name="startDate"
//                             value={form.startDate}
//                             onChange={handleChange}
//                             className="border p-2 w-full"
//                         />
//                     </div>
//                     <div>
//                         <label className="block font-medium">End Date</label>
//                         <input
//                             type="date"
//                             name="endDate"
//                             value={form.endDate}
//                             onChange={handleChange}
//                             className="border p-2 w-full"
//                         />
//                     </div>
//                 </div>
//                 <select
//                     name="status"
//                     value={form.status}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 >
//                     <option value={""}>-- Select Project Status --</option>
//                     <option value={'planned'}>Planned</option>
//                     <option value={'inprogress'}>In Progress</option>
//                     <option value={'onhold'}>On Hold</option>
//                     <option value={'completed'}>Completed</option>
//                 </select>
//                 <select
//                     name="priority"
//                     value={form.priority}
//                     onChange={handleChange}
//                     className="border p-2 w-full"
//                 >
//                     <option value={''}>-- Select Project Priority --</option>
//                     <option value={'low'}>Low</option>
//                     <option value={'medium'}>Medium</option>
//                     <option value={'high'}>High</option>
//                     <option value={'critical'}>Critical</option>
//                 </select>

//                 <button
//                     type="submit"
//                     className="bg-blue-600 text-white px-4 py-2 rounded"
//                 >Create Project
//                 </button>

//             </form>
//         </>
//     );
// }
'use client'
import { useState, useEffect } from "react";

export default function ProjectForm() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        client: '',
        type: '',
        startDate: '',
        endDate: '',
        status: '',
        priority: '',
        employees: [],   // 👈 new field for employees
    });

    const [employees, setEmployees] = useState([]); // 👈 all employees list

    // ✅ Employees fetch karne ka useEffect
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("/api/employees");
                const data = await res.json();

                // Sirf employees array set karni hai
                setEmployees(data.employees || []);
            } catch (err) {
                console.error("Failed to load employees:", err);
                setEmployees([]); // safe fallback
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed while creating project');
            }
            alert('Project created Successfully!');
            console.log('created Project', data);
            setForm({
                name: '',
                description: '',
                client: '',
                type: '',
                startDate: '',
                endDate: '',
                status: '',
                priority: '',
                employees: [],
            });
        } catch (err) {
            console.log(err, "catch error");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-[70%] p-6 bg-white shadow-md rounded-lg space-y-4">
                <h2 className="text-xl font-bold">Add New Project</h2>

                <input
                    type='text'
                    name='name'
                    placeholder="Project Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <textarea
                    name="description"
                    placeholder="description"
                    value={form.description}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <input
                    type="text"
                    name="client"
                    placeholder="Client Name"
                    value={form.client}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value={''}>-- Select Project Type --</option>
                    <option value={'internal'}>Internal</option>
                    <option value={'external'}>External</option>
                    <option value={'r&d'}>R&D</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block font-medium">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                </div>

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value={""}>-- Select Project Status --</option>
                    <option value={'planned'}>Planned</option>
                    <option value={'inprogress'}>In Progress</option>
                    <option value={'onhold'}>On Hold</option>
                    <option value={'completed'}>Completed</option>
                </select>

                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="border p-2 w-full"
                >
                    <option value={''}>-- Select Project Priority --</option>
                    <option value={'low'}>Low</option>
                    <option value={'medium'}>Medium</option>
                    <option value={'high'}>High</option>
                    <option value={'critical'}>Critical</option>
                </select>

                {/* ✅ Employees Dropdown at the end */}
                <div>
                    <label className="block font-medium">Assign Employees</label>
                    
                    <select
                        name="employees"
                        value={form.employees}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                employees: [e.target.value], 
                            })
                        }
                        className="border p-2 w-full"
                    >
                        <option value="" disabled hidden >
                            -- Select Employee --
                        </option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.personalInfo?.firstName
                                    ? `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`
                                    : `${emp.firstName || ''} ${emp.lastName || ''}`}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Project
                </button>
            </form>
        </>
    );
}
