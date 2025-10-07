"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCcw, X } from "lucide-react";

import { useRouter } from "next/navigation";

// shadcn component imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function EmployeeForm({ mode = "add", initialData = null, isEdit = false }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // setting fetched roles from Api into roles
  const [roles, setRoles] = useState([]);


  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [newExp, setNewExp] = useState({ company: "", role: "", dateOfJoining: "", dateOfLeaving: "" });
  const [saving, setSaving] = useState(false);
  // edit mode for an existing user
  const [editIndex, setEditIndex] = useState(-1);
  const [editExp, setEditExp] = useState({ company: "", role: '', dateOfJoining: "", dateOfLeaving: "" });


  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        const data = await res.json();
        console.log("Employees API response:", data);

        if (Array.isArray(data.employees)) {
          setEmployees(data.employees);
        }
      } catch (err) {
        console.log("Failed to load employees", err);
      }
    };
    fetchEmployees();
  }, []);

  // fetching deprtments from mongo
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const emptyProject = {
    name: '',
    description: '',
    technologies: [],
    projectStartDate: '',
    projectEndDate: '',
    company: '',
  };

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState(emptyProject);
  const [newProjectTechInput, setNewProjectTechInput] = useState('');

  // Separate edit state for pastProjects (don't reuse experience editIndex)
  const [projectEditIndex, setProjectEditIndex] = useState(-1);
  const [projectEditData, setProjectEditData] = useState(emptyProject);
  const [editProjectTechInput, setEditProjectTechInput] = useState('');

  const emptyCurrentProject = {
    projectId: '',
    role: '',
    assignedDate: '',
  };
  const [currentProjectForm, setCurrentProjectForm] = useState(emptyCurrentProject);
  const [showCurrentForm, setShowCurrentForm] = useState(false);
  const [editCurrentIndex, setEditCurrentIndex] = useState(-1);

  // add
  const addCurrentProject = (proj) => {
    setFormData((prev) => ({
      ...prev,
      currentProjects: [...(prev.currentProjects || []), proj],
    }));
    setCurrentProjectForm(emptyCurrentProject);
    setShowCurrentForm(false);
  };

  // delete
  const deleteCurrentProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      currentProjects: prev.currentProjects.filter((_, i) => i !== index),
    }));
  };

  // edit
  const handleCurrentChange = (index, field, value) => {
    const updated = [...formData.currentProjects];
    updated[index][field] = value;
    setFormData({ ...formData, currentProjects: updated });
  };


  const generatePassword = (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };


  const initialPassword = isEdit ? "" : generatePassword();
  const [password, setPassword] = useState(initialPassword);


  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch('/api/roles');
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Error while fetching roles:", err);
      }
    }
    fetchRoles();
  }, []);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      password: initialPassword,

    },
    jobInfo: {
      title: "",
      departmentId: "",
      managerId: "",
      employmentType: "",
      status: "",
      dateOfJoining: "",
      location: "",
      skills: [],
      experiences: [],
      pastProjects: [],
    },
    currentProjects: [],

    systemInfo: {
      userId: "",
      role: "",
      createdAt: "",
      updatedAt: "",
      updatedBy: "",
    }
  });
  // prefilled when editing form data
  useEffect(() => {
    if (!initialData) return;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        firstName: initialData.personalInfo?.firstName || "",
        lastName: initialData.personalInfo?.lastName || "",
        email: initialData.personalInfo?.email || "",
        contactNumber: initialData.personalInfo?.contactNumber || "",
        password: "", // do not prefill/show raw password
      },
      jobInfo: {
        ...prev.jobInfo,
        ...(initialData.jobInfo || {}),
      },
      systemInfo: {
        ...prev.systemInfo,
        ...(initialData.systemInfo || {}),
      },
      currentProjects: initialData.currentProjects || [],
    }));
  }, [mode, initialData, isEdit]);


  // adding skill
  const addSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        skills: [...prev.jobInfo.skills, skill],
      },
    }));
  };
  // removing skill
  const removeSkill = (index) => {
    setFormData((prev) => {
      const updatedSkills = prev.jobInfo.skills.filter((_, i) => i !== index);
      return {
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          skills: updatedSkills,
        },
      };
    });
  };

  //  addExperience
  const addExperience = (exp) => {
    if (!exp || (!exp.company && !exp.role && !exp.dateOfJoining && !exp.dateOfLeaving)) return;
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        experiences: [...(prev.jobInfo?.experiences || []), exp],
      },
    }));
  };

  // update experience
  const updateExperience = (i, updated) => {
    setFormData((prev) => {
      const updatedExperiences = [...(prev.jobInfo?.experiences || [])];
      updatedExperiences[i] = updated;
      return {
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          experiences: updatedExperiences
        },
      };
    });
    setEditIndex(-1);
    setEditExp({ company: "", role: "", dateOfJoining: "", dateOfLeaving: "" })
  };
  // delete experience
  const deleteExperience = (i) => {
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        experiences: (prev.jobInfo?.experiences || []).filter((_, idx) => idx !== i)
      }
    }));
    // if we were editing this item, exit edit mode
    if (editIndex === index) {
      setEditIndex(-1);
      setEditExp({ company: "", role: "", dateOfJoining: "", dateOfLeaving: "" });
    }
  };

  const saveNewExperience = async () => {
    // Basic validation example
    if (!newExp.company && !newExp.role && !newExp.duration) {
      alert("Please fill all fields");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        experiences: [
          ...(prev.jobInfo?.experiences || []),
          { ...newExp }
        ]
      }
    }));

    setIsAddingExperience(false);
    setNewExp({ company: '', role: '', dateOfJoining: "", dateOfLeaving: "" })


  };

  const cancelAddExperience = () => {
    // reset and close
    setNewExp({ company: "", role: "", dateOfJoining: "", dateOfLeaving: "" });
    setIsAddingExperience(false);
  };

  // Add a new past project
  const addProject = (proj) => {
    // validate minimal
    if (!proj || (!proj.name && !proj.description)) return;
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        pastProjects: [...(prev.jobInfo?.pastProjects || []), proj],
      },
    }));
    setNewProject(emptyProject);
    setNewProjectTechInput('');
    setShowProjectForm(false);
  };

  // Delete project by index
  const deleteProject = (index) => {
    setFormData((prev) => {
      const arr = [...(prev.jobInfo?.pastProjects || [])];
      arr.splice(index, 1);
      return { ...prev, jobInfo: { ...prev.jobInfo, pastProjects: arr } };
    });
    // if editing the deleted index, cancel edit
    if (projectEditIndex === index) cancelEditProject();
  };

  // Start editing an existing project
  const startEditProject = (index) => {
    const proj = (formData.jobInfo?.pastProjects || [])[index] || emptyProject;
    setProjectEditIndex(index);
    // copy so changes are local until saved
    setProjectEditData({ ...proj, technologies: [...(proj.technologies || [])] });
    setEditProjectTechInput('');
    // hide add form while editing (optional)
    setShowProjectForm(false);
  };

  // Update the project after editing
  const updateProject = (index) => {
    setFormData((prev) => {
      const arr = [...(prev.jobInfo?.pastProjects || [])];
      arr[index] = projectEditData;
      return { ...prev, jobInfo: { ...prev.jobInfo, pastProjects: arr } };
    });
    setProjectEditIndex(-1);
    setProjectEditData(emptyProject);
    setEditProjectTechInput('');
  };

  // Cancel edit mode
  const cancelEditProject = () => {
    setProjectEditIndex(-1);
    setProjectEditData(emptyProject);
    setEditProjectTechInput('');
  };

  // helpers for technologies (new project)
  const addTechToNewProject = () => {
    const t = newProjectTechInput.trim();
    if (!t) return;
    setNewProject((p) => ({ ...p, technologies: [...(p.technologies || []), t] }));
    setNewProjectTechInput('');
  };
  const removeTechFromNewProject = (i) => {
    setNewProject((p) => ({ ...p, technologies: p.technologies.filter((_, idx) => idx !== i) }));
  };

  // helpers for technologies (edit mode)
  const addTechToEditProject = () => {
    const t = editProjectTechInput.trim();
    if (!t) return;
    setProjectEditData((p) => ({ ...p, technologies: [...(p.technologies || []), t] }));
    setEditProjectTechInput('');
  };
  const removeTechFromEditProject = (i) => {
    setProjectEditData((p) => ({ ...p, technologies: p.technologies.filter((_, idx) => idx !== i) }));
  };


  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  };
  // handle data while submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form data:", formData);
    try {
      let url = "/api/employees";
      let method = "POST";
      let bodyToSend = formData;

      if (isEdit && initialData?._id) {
        url = `/api/employees/${initialData._1?._id || initialData._id || initialData.id}`; // safe read if shape differs

        url = `/api/employees/${initialData._id}`;
        method = "PUT";
        // For PUT send only fields you want to update, or full nested objects
        bodyToSend = {
          personalInfo: formData.personalInfo,
          jobInfo: formData.jobInfo,
          systemInfo: formData.systemInfo,
        };
      }


      const res = await fetch(
        isEdit ? `/api/employees/${initialData._id}` : "/api/employees",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error adding employee");
      }
      else {
        setMessage(isEdit ? "Employee updated successfully" : "Employee added successfully");
        // After update/add: navigate back to the list
        router.push("/dashboard/employees");

        if (mode === 'add') {
          const newPwd = generatePassword();
          setFormData({
            personalInfo: {
              firstName: "",
              lastName: "",
              email: "",
              contactNumber: "",
              password: newPwd
            },
            jobInfo: {
              title: "",
              departmentId: "",
              managerId: "" || null,
              employmentType: "",
              status: "",
              dateOfJoining: "",
              location: "",
              skills: [],
              experiences: [],
              pastProjects: [],
            },
            currentProjects: [],
            systemInfo: {
              userId: "",
              role: "",
              createdAt: "",
              updatedAt: "",
              updatedBy: "",
            },
          });
        }
      }

    }

    catch (error) {
      console.log(error);
      setMessage("❌ " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[100%] p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-xl font-medium text-secondary-dark800">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
      {/* show submission message */}
      {message && (
        <p
          className={`text-sm ${message.includes("success")
            ? "text-green-600"
            : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}
      {/* personal Information */}
      <div className="space-y-2">
        <h2 className="text-secondary-dark800 font-semibold">Personal Information</h2>
       <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="firstName"
              value={formData.personalInfo.firstName}
              onChange={(e) =>
                handleChange("personalInfo", "firstName", e.target.value)
              }
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
            />
            <label
              htmlFor="firstName"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
            >
              First Name
            </label>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              name="lastName"
              value={formData.personalInfo.lastName}
              onChange={(e) =>
                handleChange("personalInfo", "lastName", e.target.value)
              }
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
            />
            <label
              htmlFor="lastName"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
            >
              Last Name
            </label>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              name="email"
              placeholder=""
              value={formData.personalInfo.email}
              onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"

            >Email</label>
          </div>


          <div className="relative flex-1">
            {!isEdit && (
              <>
                <input
                  placeholder={isEdit ? "Enter new password (leave blank to keep old)" : "Password"}
                  type={showPassword ? "text" : "password"}
                  value={formData.personalInfo.password}
                  readOnly
                  className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                >
                  Password
                </label>


                {/* refresh password */}
                <button
                  type="button"
                  onClick={generatePassword}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <RefreshCcw size={18} />
                </button>


                {/* toggle visibility */}
                <button

                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </>
            )}

          </div>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            name="contactNumber"
            placeholder=""
            value={formData.personalInfo.contactNumber}
            onChange={(e) => handleChange("personalInfo", "contactNumber", e.target.value)}
            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
          />
          <label
            htmlFor="contactNumber"
            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
          >Contact Number</label>
        </div>
      </div>

      <hr className="text-grey-700" />
      {/* Job info */}
      <div className="space-y-2">
        <h2 className="text-secondary-dark800 font-semibold">Job Information</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="title"
              placeholder="Job title"
              value={formData.jobInfo.title}
              onChange={(e) => handleChange("jobInfo", "title", e.target.value)}
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
            />
            <label
              htmlFor="title"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
            >
              Title
            </label>
          </div>
          <div className="relative flex-1">
            <Select
              value={formData.jobInfo.departmentId}
              onValueChange={(value) => handleChange("jobInfo", "departmentId", value)}
            >
              <SelectTrigger
                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none"
              >
                <SelectValue placeholder="-- Select Department --" />
              </SelectTrigger>

              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem
                    key={dept._id}
                    value={dept._id}
                    className="text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Select
              name="managerId"
              value={formData.jobInfo.managerId || ""}
              onChange={(e) => handleChange("jobInfo", "managerId", e.target.value)}

            >
              <SelectTrigger
                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none"
              >
                <SelectValue placeholder='-- Select Manager --'> </SelectValue>
              </SelectTrigger>
              <SelectContent>

                {employees.map((emp) => (
                  <SelectItem key={emp._id} value={emp._id}
                    className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                  >
                    {emp.personalInfo?.firstName} {emp.personalInfo?.lastName} — {emp.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1">
            <Select
              value={formData.jobInfo.employmentType}
              onChange={(e) => handleChange("jobInfo", "employmentType", e.target.value)}
            >
              <SelectTrigger
                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none">
                <SelectValue placeholder='-- Select Employment Type --'>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Full time
                </SelectItem>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Part time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Select
              value={formData.jobInfo.status}
              onChange={(e) => handleChange("jobInfo", "status", e.target.value)}
              className="peer w-full border-2 border-grey-500  rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none text-grey-700"
            >
              <SelectTrigger
                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none">
                <SelectValue placeholder='-- Select Job Status --'></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Active
                </SelectItem>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Inactive
                </SelectItem>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  On Leave
                </SelectItem>
              </SelectContent>

            </Select>
          </div>
          <div className="relative flex-1">
            <Select
              value={formData.jobInfo.location}
              onChange={(e) => handleChange("jobInfo", "location", e.target.value)}

            >
              <SelectTrigger
                className="w-full border-2 border-grey-500 rounded px-3 pt-5 pb-6 h-auto min-h-[55px] text-grey-700 focus:border-primary-dark600 focus:ring-0 focus:outline-none"
              >
                <SelectValue placeholder='-- Select Job Location --'>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  On Site
                </SelectItem>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Remote
                </SelectItem>
                <SelectItem
                  className=" text-grey-700 py-2 hover:bg-secondary-light50 hover:text-secondary-dark800"
                >
                  Hybrid
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>



        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              name="dateOfJoining"
              type="date"
              value={formData.jobInfo.dateOfJoining}
              onChange={(e) => handleChange("jobInfo", "dateOfJoining", e.target.value)}
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
            />
            <label htmlFor="dateOfJoining" className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600">
              Date of Joining</label>
          </div>
        </div>

        {/* Skilss */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder=""
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill(e.target.value);
                e.target.value = "";
              }
            }}
            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
          />
          <label
            htmlFor="skills"
            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"

          >Skills</label>


          <ul className="flex flex-wrap gap-2 mt-2">
            {formData.jobInfo.skills.map((skill, i) => (
              <li key={i} className="flex items-center bg-primary-light50 px-2 py-1 rounded">
                <span>{skill}</span>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => removeSkill(i)}
                >
                  <X />
                </button>
              </li>

            ))}
          </ul>
        </div>



        {/* Experiences */}

        <div className="space-y-4">
          {/* Add Experience button + form */}
          {/* Experiences list */}
          <div>
            <h3 className="font-semibold text-secondary-dark800">Experiences</h3>

            {(formData.jobInfo?.experiences || []).length === 0 ? (
              <p className="text-gray-500 text-sm">No experience added yet.</p>
            ) : (
              (formData.jobInfo.experiences || []).map((exp, i) => (
                <div key={i} className="border p-3 rounded mb-2 flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{exp.company || "—"}</div>
                    <div className="text-sm">{exp.role || "—"}
                    </div>
                    <div className="text-sm"> {exp.dateOfStart}</div>
                    <div className="text-sm"> {exp.dateOfEnd}</div>


                  </div>

                  <div className="flex gap-2">
                    {/* --- Edit Button --- */}
                    <Dialog open={editIndex === i} onOpenChange={(open) => {
                      if (!open) {
                        setEditIndex(-1);
                        setEditExp({ company: "", role: "", dateOfStart: "", dateOfEnd: "" });
                      }
                    }}>
                      <Button

                        className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 cursor-pointer font-medium "
                        onClick={() => {
                          setEditIndex(i);
                          setEditExp({
                            company: exp.company || "",
                            role: exp.role || "",
                            dateOfJoining: exp.dateOfJoining || "",
                            dateOfLeaving: exp.dateOfLeaving || "",
                          });
                        }}
                      >
                        Edit
                      </Button>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Experience</DialogTitle>
                          <DialogDescription>
                            Update details for this experience.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3 py-3">
                          <div className="relative flex-1">
                            <input
                              placeholder=""
                              value={editExp.company}
                              onChange={(e) => setEditExp((p) => ({ ...p, company: e.target.value }))}
                              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                            />
                            <label className="absolute left-3 top-1 text-gray-500 text-xs">Company Name</label>
                          </div>

                          <div className="relative flex-1">
                            <input
                              placeholder=""
                              value={editExp.role}
                              onChange={(e) => setEditExp((p) => ({ ...p, role: e.target.value }))}
                              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                            />
                            <label className="absolute left-3 top-1 text-gray-500 text-xs">Role Name</label>
                          </div>

                          <div className="relative flex-1">
                            <input
                              placeholder=""
                              value={editExp.dateOfJoining}
                              onChange={(e) => setEditExp((p) => ({ ...p, dateOfJoining: e.target.value }))}
                              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                            />
                            <label className="absolute left-3 top-1 text-gray-500 text-xs">Date of Joining</label>
                          </div>
                          <div className="relative flex-1">
                            <input
                              placeholder=""
                              value={editExp.dateOfLeaving}
                              onChange={(e) => setEditExp((p) => ({ ...p, dateOfLeaving: e.target.value }))}
                              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                            />
                            <label className="absolute left-3 top-1 text-gray-500 text-xs">Date of Leaving</label>
                          </div>
                        </div>


                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => {
                              updateExperience(i, editExp);
                              setEditIndex(-1); // close after saving
                            }}
                            className="bg-primary-dark600 hover:bg-primary-dark800  text-grey-50 font-medium cursor-pointer rounded-md text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setEditIndex(-1);
                              setEditExp({ company: "", role: "", dateOfJoining: "", dateOfLeaving: "" });
                            }}
                            className="bg-secondary-dark600 hover:bg-secondary-dark800  text-grey-50 font-medium cursor-pointer rounded-md text-sm"
                          >
                            Cancel
                          </Button>
                        </div>

                      </DialogContent>
                    </Dialog>

                    {/* --- Delete Button --- */}
                    <Button
                      variant="destructive"
                      className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 cursor-pointer font-medium  "
                      onClick={() => deleteExperience(i)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* add experience */}
          <div>
            {/* Main trigger */}
            <Button
              type="button"
              onClick={() => setIsAddingExperience(true)}
              className="bg-secondary-dark600 text-grey-50 hover:bg-secondary-dark800 cursor-pointer font-medium px-3 py-1 rounded"
            >
              + Add Experience
            </Button>
            {/* Controlled Dialog */}
            <Dialog open={isAddingExperience} onOpenChange={setIsAddingExperience}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className=" text-secondary-dark800 font-medium mb-3">Add Experience</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <input
                      id="company"
                      placeholder=""
                      value={newExp.company}
                      onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))}
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label htmlFor="company" className="absolute left-3 top-1 text-gray-500 text-xs">
                      Company Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="role"
                      placeholder=""
                      value={newExp.role}
                      onChange={(e) => setNewExp((p) => ({ ...p, role: e.target.value }))}
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label htmlFor="role" className="absolute left-3 top-1 text-gray-500 text-xs">
                      Role Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="date"
                      id="dateOfJoining"
                      placeholder=""
                      value={newExp.dateOfJoining}
                      onChange={(e) => setNewExp((p) => ({ ...p, dateOfJoining: e.target.value }))}
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label htmlFor="duration" className="absolute left-3 top-1 text-gray-500 text-xs">
                      Date of Joining
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateOfLeaving"
                      placeholder=""
                      value={newExp.dateOfLeaving}
                      onChange={(e) => setNewExp((p) => ({ ...p, dateOfLeaving: e.target.value }))}
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label htmlFor="duration" className="absolute left-3 top-1 text-gray-500 text-xs">
                      Date of Leaving
                    </label>
                  </div>

                  <div className="flex gap-2">
                    {/* ensure type="button" so it doesn't submit any surrounding form */}
                    <button
                      type="button"
                      onClick={saveNewExperience}
                      disabled={saving}
                      className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer px-3 py-1 rounded"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>

                    {/* Option A: call your cancel handler */}
                    <button
                      type="button"
                      onClick={cancelAddExperience}
                      className="bg-secondary-dark600 hover:bg-secondary-dark800  text-grey-50 font-medium cursor-pointer  px-3 py-1 rounded"
                    >
                      Cancel
                    </button>

                    {/* Option B: or use DialogClose (uncomment if you prefer) */}
                    {/* <DialogClose asChild>
                <button type="button" className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
              </DialogClose> */}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>

        {/* PAst projects */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-secondary-dark800">Add Past Projects</h3>
            {/* Empty state */}
            {(!formData.jobInfo || (formData.jobInfo.pastProjects || []).length === 0) && !showProjectForm && projectEditIndex === -1 ? (
              <p className="text-gray-500 text-sm">No past projects added yet.</p>
            ) : (
              (formData.jobInfo?.pastProjects || []).map((proj, idx) => (
                <div key={idx} className="border p-3 rounded mb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{proj.name || "—"}</div>
                        <div className="text-sm">{proj.description || ""}</div>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {(proj.technologies || []).map((t, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{t}</span>
                          ))}
                        </div>
                        <div className="text-sm">{proj.duration || ""}</div>
                        <div className="text-sm">{proj.company || ""}</div>
                      </div>

                      {/* <div className="flex gap-2">
                      <button type="button" onClick={() => startEditProject(idx)} className="bg-primary-dark600 text-white font-medium px-2 py-1 rounded cursor-pointer">Edit</button>
                      <button type="button" onClick={() => deleteProject(idx)} className="bg-secondary-dark600 text-white  font-medium cursor-pointer px-2 py-1 rounded">Delete</button>
                    </div> */}
                    </div>
                    <div className="flex gap-2">
                      <Dialog
                        open={projectEditIndex === idx}
                        onOpenChange={(open) => setProjectEditIndex(open ? idx : -1)}
                      >
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            onClick={() => startEditProject(idx)}
                            className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer px-4 py-2 text-sm  rounded-md"
                          >
                            Edit
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Past Project</DialogTitle>
                          </DialogHeader>
                          {/* // EDIT MODE (uses projectEditData) */}
                          <div className="flex flex-col gap-3">
                            <div className="relative flex-1">
                              <input
                                placeholder=""
                                value={projectEditData.name}
                                onChange={(e) => setProjectEditData((p) => ({ ...p, name: e.target.value }))}
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
                                placeholder=""
                                value={projectEditData.description}
                                onChange={(e) => setProjectEditData((p) => ({ ...p, description: e.target.value }))}
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="project description"
                                className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                              >Project Description</label>
                            </div>
                            {/* technologies chips + add input */}
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {(projectEditData.technologies || []).map((t, i) => (
                                  <span key={i} className="px-2 py-1 bg-primary-light50 font-medium cursor-pointer rounded flex items-center gap-2">
                                    <span>{t}</span>
                                    <button type="button" onClick={() => removeTechFromEditProject(i)} className=" font-medium cursor-pointer ">×</button>
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <input
                                    placeholder=""
                                    value={editProjectTechInput}
                                    onChange={(e) => setEditProjectTechInput(e.target.value)}
                                    className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                                  />
                                  <label
                                    htmlFor="add technology"
                                    className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                                  >
                                    Add technology
                                  </label>
                                </div>

                                <button type="button" onClick={addTechToEditProject} className="px-3 bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 rounded">Add</button>
                              </div>
                            </div>
                            <div className="relative flex-1">
                              <input
                                type="date"
                                placeholder=""
                                value={projectEditData.projectStartDate}
                                onChange={(e) => setProjectEditData((p) => ({ ...p, projectStartDate: e.target.value }))}
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="projectStartDate"
                                className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                              >
                                Project Start Date
                              </label>
                            </div>
                            <div className="relative flex-1">
                              <input
                                type="date"
                                placeholder=""
                                value={projectEditData.projectEndDate}
                                onChange={(e) => setProjectEditData((p) => ({ ...p, projecEndDate: e.target.value }))}
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="projecEndDate"
                                className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                              >
                                Project End Date
                              </label>
                            </div>
                            <div className="relative flex-1">
                              <input
                                placeholder="Company"
                                value={projectEditData.company}
                                onChange={(e) => setProjectEditData((p) => ({ ...p, company: e.target.value }))}
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="Company Name"
                                className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                              >
                                Company Name
                              </label>
                            </div>

                            <div className="flex gap-2">
                              <button type="button" onClick={() => updateProject(idx)} className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer px-4 py-2 rounded-md text-sm">Save</button>
                              <button type="button" onClick={cancelEditProject} className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 font-medium cursor-pointer px-4 py-2 rounded-md text-sm">Cancel</button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Delete Button */}
                      <button type="button" onClick={() => deleteProject(idx)} className="bg-secondary-dark600 text-white  font-medium cursor-pointer px-4 py-2 text-sm  rounded-md">Delete</button>


                    </div>
                  </div>
                </div>
              )))}
          </div>
          {/* Add past Project Button & Form */}
          <div>
            <button
              type="button"
              onClick={() => {
                setShowProjectForm(true)
                setProjectEditIndex(-1)
              }}
              className="bg-secondary-dark600 text-grey-50 hover:bg-secondary-dark800 cursor-pointer font-medium px-3 py-1 rounded"
            >
              + Add Past Project
            </button>
            <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Project</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-3">
                  {/* Project Name */}
                  <div className="relative flex-1">
                    <input
                      placeholder=""
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="projectName"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                      Project Name
                    </label>
                  </div>

                  {/* Description */}
                  <div className="relative flex-1">
                    <textarea
                      placeholder=""
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({ ...newProject, description: e.target.value })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                      Description
                    </label>
                  </div>

                  {/* Technologies */}
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(newProject.technologies || []).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary-light50 cursor-pointer rounded flex items-center gap-2"
                        >
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => removeTechFromNewProject(i)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          placeholder=""
                          value={newProjectTechInput}
                          onChange={(e) => setNewProjectTechInput(e.target.value)}
                          className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                        />
                        <label
                          htmlFor="addTechnology"
                          className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >
                          Add technology
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={addTechToNewProject}
                        className="px-3 bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 cursor-pointer font-medium rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/*project satrt Duration */}
                  <div className="relative flex-1">
                    <input
                      type="date"
                      placeholder=""
                      value={newProject.projectStartDate}
                      onChange={(e) =>
                        setNewProject({ ...newProject, projectStartDate: e.target.value })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="projectStartDate"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                      project Start Date
                    </label>
                  </div>
                  {/* Project End date */}
                  <div className="relative flex-1">
                    <input
                      type="date"
                      placeholder=""
                      value={newProject.projectEndDate}
                      onChange={(e) =>
                        setNewProject({ ...newProject, projectEndDate: e.target.value })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="projectStartDate"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                      project End Date
                    </label>
                  </div>


                  {/* Company */}
                  <div className="relative flex-1">
                    <input
                      placeholder=""
                      value={newProject.company}
                      onChange={(e) =>
                        setNewProject({ ...newProject, company: e.target.value })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="companyName"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                    >
                      Company Name
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addProject(newProject)
                        setNewProject(emptyProject)
                        setShowProjectForm(false)
                        setNewProjectTechInput("")
                      }}
                      className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewProject(emptyProject)
                        setShowProjectForm(false)
                        setNewProjectTechInput("")
                      }}
                      className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 font-medium cursor-pointer px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* editing current project */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-secondary-dark800">Current Projects</h3>
            {(formData.currentProjects || []).length === 0 ? (
              <p className="text-gray-500 text-sm">No current projects added yet.</p>
            ) : (
              formData.currentProjects.map((proj, idx) => (
                <div key={idx} className="border p-3 rounded mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Project ID: {proj.projectId}</div>
                      <div className="text-sm">Role: {proj.role}</div>
                      <div className="text-sm">Assigned: {proj.assignedDate}</div>
                    </div>
                    <div className="flex gap-2">
                      {/* Edit Button triggers modal */}
                      <Dialog
                        open={editCurrentIndex === idx}
                        onOpenChange={(open) => setEditCurrentIndex(open ? idx : -1)}
                      >
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer  rounded-md text-sm px-4 py-2"
                          >
                            Edit
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Current Project</DialogTitle>
                          </DialogHeader>

                          <div className="flex flex-col gap-3 mt-3">
                            {/* Project ID */}
                            <div className="relative flex-1">
                              <input
                                placeholder=""
                                value={proj.projectId}
                                onChange={(e) =>
                                  handleCurrentChange(idx, "projectId", e.target.value)
                                }
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                               focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="ProjectId"
                                className="absolute left-3 top-1 text-gray-500 text-xs 
                               transition-colors peer-focus:text-primary-dark600"
                              >
                                Project Id
                              </label>
                            </div>

                            {/* Role */}
                            <div className="relative flex-1">
                              <input
                                placeholder="Role"
                                value={proj.role}
                                onChange={(e) =>
                                  handleCurrentChange(idx, "role", e.target.value)
                                }
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                               focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="Role"
                                className="absolute left-3 top-1 text-gray-500 text-xs 
                               transition-colors peer-focus:text-primary-dark600"
                              >
                                Role Name
                              </label>
                            </div>

                            {/* Assigned Date */}
                            <div className="relative flex-1">
                              <input
                                type="date"
                                placeholder=""
                                value={proj.assignedDate}
                                onChange={(e) =>
                                  handleCurrentChange(idx, "assignedDate", e.target.value)
                                }
                                className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                               focus:border-primary-dark600 focus:outline-none"
                              />
                              <label
                                htmlFor="assignedDate"
                                className="absolute left-3 top-1 text-gray-500 text-xs 
                               transition-colors peer-focus:text-primary-dark600"
                              >
                                Assigned Date
                              </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditCurrentIndex(-1)
                                }}
                                className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium cursor-pointer px-3 py-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditCurrentIndex(-1)}
                                className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 font-medium cursor-pointer px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => deleteCurrentProject(idx)}
                        className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 font-medium cursor-pointer px-4 py-2 text-sm rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowCurrentForm(true)}
              className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 cursor-pointer font-medium px-3 py-1 rounded"
            >
              + Add Current Project
            </button>
            <Dialog open={showCurrentForm} onOpenChange={setShowCurrentForm}>


              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Current Project</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-3">
                  {/* Project ID */}
                  <div className="relative flex-1">
                    <input
                      placeholder=""
                      value={currentProjectForm.projectId}
                      onChange={(e) =>
                        setCurrentProjectForm({
                          ...currentProjectForm,
                          projectId: e.target.value,
                        })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                     focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="projectId"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors 
                     peer-focus:text-primary-dark600"
                    >
                      Project ID
                    </label>
                  </div>

                  {/* Role */}
                  <div className="relative flex-1">
                    <input
                      placeholder="Role"
                      value={currentProjectForm.role}
                      onChange={(e) =>
                        setCurrentProjectForm({
                          ...currentProjectForm,
                          role: e.target.value,
                        })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                     focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="role"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors 
                     peer-focus:text-primary-dark600"
                    >
                      Role Name
                    </label>
                  </div>

                  {/* Assigned Date */}
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={currentProjectForm.assignedDate}
                      onChange={(e) =>
                        setCurrentProjectForm({
                          ...currentProjectForm,
                          assignedDate: e.target.value,
                        })
                      }
                      className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 
                     focus:border-primary-dark600 focus:outline-none"
                    />
                    <label
                      htmlFor="assigneddate"
                      className="absolute left-3 top-1 text-gray-500 text-xs transition-colors 
                     peer-focus:text-primary-dark600"
                    >
                      Assigned Date
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addCurrentProject(currentProjectForm)
                        setCurrentProjectForm(emptyCurrentProject)
                        setShowCurrentForm(false)
                      }}
                      className="bg-primary-dark600 hover:bg-primary-dark800 text-grey-50 font-medium 
                     cursor-pointer px-4 py-2 rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentProjectForm(emptyCurrentProject)
                        setShowCurrentForm(false)
                      }}
                      className="bg-secondary-dark600 hover:bg-secondary-dark800 text-grey-50 font-medium 
                     cursor-pointer px-4 py-2 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          </div>

        </div>




        {/* System Info (Read-only) */}
        {/* <div className="mt-4">


          <div className="grid grid-cols-2 gap-2 mt-2">


            <h3 className="font-semibold">System Info</h3>
            <p>User ID: {formData?.systemInfo?.userId || "N/A"}</p>
            <p>Role: {formData?.systemInfo?.role || "N/A"}</p>
            <p>
              Created At:{" "}
              {formData?.systemInfo?.createdAt
                ? new Date(formData.systemInfo.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <p>Updated By: {formData?.systemInfo?.updatedBy || "N/A"}</p>


          </div>
        </div> */}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary-dark600 hover:bg-primary-dark800  text-grey-50 px-4 py-2 rounded shadow-md cursor-pointer"
        >
          {isEdit ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </form>
  );
}