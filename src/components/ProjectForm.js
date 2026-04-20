'use client'
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ProjectForm({ mode = "add", initialData = null, isEdit = false }) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        description: "",
        client: "",
        type: "",
        startDate: "",
        endDate: "",
        status: "",
        priority: "",
        employees: [],
    });

    const [message, setMessage] = useState("");
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);

    // Fill form with initialData when editing
    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || "",
                description: initialData.description || "",
                client: initialData.client || "",
                type: initialData.type || "",
                startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : "",
                endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
                status: initialData.status || "",
                priority: initialData.priority || "",
                employees: initialData.employees || [],
            });
        }
    }, [initialData]);

    // Fetch employees list
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("/api/employees");
                const data = await res.json();
                setEmployees(data.employees || []);
            } catch (err) {
                console.error("Failed to load employees:", err);
                setEmployees([]);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleEmployees = (id) => {
        setForm((prev) => {
            const exists = prev.employees.includes(id);
            return {
                ...prev,
                employees: exists
                    ? prev.employees.filter((empId) => empId !== id)
                    : [...prev.employees, id],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEdit ? `/api/projects/${initialData._id}` : "/api/projects";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Error saving project");
                throw new Error(data.error || "Failed to save project");
            }

            setMessage(isEdit ? "Project updated successfully" : "Project added successfully");

            // Redirect to projects list
            router.push("/dashboard/projects");

            if (mode === "add") {
                setForm({
                    name: "",
                    description: "",
                    client: "",
                    type: "",
                    startDate: "",
                    endDate: "",
                    status: "",
                    priority: "",
                    employees: [],
                });
            }

            console.log("Saved Project:", data);
        } catch (err) {
            console.log(err, "catch error");
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="w-[100%] p-6 bg-white shadow-md rounded-lg space-y-3"
            >
                <h2 className="text-xl font-medium text-secondary-dark800">
                    {isEdit ? "Update project" : "Add New Project"}
                </h2>

                {message && (
                    <p
                        className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
                <div className="relative flex-1">
                    <input
                        type='text'
                        name='name'
                        placeholder=""
                        value={form.name}
                        onChange={handleChange}
                        className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                        htmlFor="projectName"
                        className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                        Project Name
                    </label>
                </div>


                <div className="relative flex-1">
                    <textarea
                        name="description"
                        placeholder=""
                        value={form.description}
                        onChange={handleChange}
                        className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                        htmlFor="description"
                        className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                        Description
                    </label>
                </div>

                <div className="relative flex-1">
                    <input
                        type="text"
                        name="client"
                        placeholder=""
                        value={form.client}
                        onChange={handleChange}
                        className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                        htmlFor="clientName"
                        className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                        Client Name
                    </label>
                </div>



                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">

                        <Select
                            name="type"
                            value={form.type}
                           onValueChange={(value) =>
                                handleChange({ target: { name: "type", value } })
                            }
                            className="peer w-full border-2 border-grey-500  rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none text-grey-700"
                        >
                            <SelectTrigger className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none">
                                <SelectValue placeholder='Project Type'>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Internal' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Internal
                                </SelectItem>
                                <SelectItem value='External' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    External
                                </SelectItem>
                                <SelectItem value='Research' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Research
                                </SelectItem>
                            </SelectContent>

                        </Select>

                    </div>
                    <div className="relative flex-1">
                        <Select
                            name="status"
                            value={form.status}
                            onValueChange={(value) =>
                                handleChange({ target: { name: "status", value } })
                            }
                            className="peer w-full border-2 border-grey-500  rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none text-grey-700"
                        >
                            <SelectTrigger className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none">
                                <SelectValue placeholder='Project Status'>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Pending' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Pending
                                </SelectItem>
                                <SelectItem value='In Progress' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    In Progress
                                </SelectItem>
                                <SelectItem value='On Hold' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    On Hold
                                </SelectItem>
                                <SelectItem value='Completed' className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Completed
                                </SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">

                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                        />
                        <label
                            htmlFor="startDate"
                            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >Start Date</label>
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                        />
                        <label
                            htmlFor="endDate"
                            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >End Date</label>
                    </div>
                </div>



                <div className="flex flex-col !sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Select
                            name="priority"
                            value={form.priority}
                            onValueChange={(value) =>
                                handleChange({ target: { name: "priority", value } })
                            }
                            >
                            <SelectTrigger
                                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none"
                            >
                                <SelectValue placeholder='Project Priority'>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Low' className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Low
                                </SelectItem>
                                <SelectItem value='Medium' className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Medium
                                </SelectItem>
                                <SelectItem value='High' className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    High
                                </SelectItem>
                                <SelectItem value='Urgent' className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800">
                                    Urgent
                                </SelectItem>
                            </SelectContent>

                        </Select>

                    </div>
                    <div className="relative flex-1 peer">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full h-auto border-2 border-grey-500 rounded px-3 pt-5 pb-3 flex justify-between items-start gap-2 text-grey-700 focus:border-primary-dark600 focus:outline-none"
                                >
                                    <div className="flex flex-wrap gap-1 flex-1 text-left">
                                        {form.employees.length > 0 ? (
                                            employees
                                                .filter((emp) => form.employees.includes(emp._id))
                                                .map((emp) => {
                                                    const label = emp.personalInfo?.firstName
                                                        ? `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`
                                                        : `${emp.firstName || ""} ${emp.lastName || ""}`;
                                                    return (
                                                        <span
                                                            key={emp._id}
                                                            className="bg-primary/10 text-primary-dark600 px-2 py-0.5 rounded-md text-xs"
                                                        >
                                                            {label}
                                                        </span>
                                                    );
                                                })
                                        ) : (
                                            <span className="text-gray-400">Select employees</span>
                                        )}
                                    </div>
                                    <ChevronDown className="ml-2 h-4 w-4 opacity-50 mt-1 shrink-0" />
                                </Button>
                            </PopoverTrigger>

                            {/* Match trigger width */}
                            <PopoverContent
                                className="w-[var(--radix-popover-trigger-width)] p-0"
                                align="start"
                            >
                                <Command>
                                    <CommandInput placeholder="Search employees..." />
                                    <CommandList className="max-h-60 overflow-y-auto">
                                        {employees.map((emp) => {
                                            const label = emp.personalInfo?.firstName
                                                ? `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`
                                                : `${emp.firstName || ""} ${emp.lastName || ""}`;
                                            return (
                                                <CommandItem
                                                    key={emp._id}
                                                    onSelect={() => toggleEmployees(emp._id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Checkbox checked={form.employees.includes(emp._id)} />
                                                    <span>{label}</span>
                                                    {form.employees.includes(emp._id) && (
                                                        <Check className="ml-auto h-4 w-4 text-primary" />
                                                    )}
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <label className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus-within:text-primary-dark600">
                            Assign Employees
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-primary-dark600 hover:bg-primary-dark800  text-grey-50 px-4 py-2 rounded shadow-md cursor-pointer"
                >
                    {isEdit ? 'Update Project' : 'Create Project'}

                </button>
            </form>
        </>
    );
}
