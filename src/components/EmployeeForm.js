"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, RefreshCcw, X } from "lucide-react";

import { useRouter } from "next/navigation";

export default function EmployeeForm({ mode = "add", initialData = null, isEdit = false }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // setting fetched roles from Api into roles
  const [roles, setRoles] = useState([]);

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [newExp, setNewExp] = useState({ company: "", role: "", duration: "" });
  // edit mode for an existing user
  const [editIndex, setEditIndex] = useState(-1);
  const [editExp, setEditExp] = useState({ company: "", role: '', duration: '' })



  const emptyProject = {
    name: '',
    description: '',
    technologies: [],
    duration: '',
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

  // console.log("fetched roles", roles);


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
    if (!exp || (!exp.company && !exp.role && !exp.duration)) return;
    setFormData((prev) => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        experiences: [...(prev.jobInfo?.experiences || []), exp],
      },
    }));
  };

  // update experience
  const updateExperience = (index, updatedExp) => {
    setFormData((prev) => {
      const exps = [...(prev.jobInfo?.experiences || [])];
      exps[index] = updatedExp;
      return {
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          experiences: exps
        },
      };
    });
    setEditIndex(-1);
    setEditExp({ company: "", role: "", duration: "" })
  };
  // delete experience
  const deleteExperience = (index) => {
    setFormData((prev) => {
      const exps = [...(prev.jobInfo?.experiences || [])].filter((_, i) => i !== index);
      return {
        ...prev,
        jobInfo: {
          ...prev.jobInfo,
          experiences: exps
        },
      };
    });
    // if we were editing this item, exit edit mode
    if (editIndex === index) {
      setEditIndex(-1);
      setEditExp({ company: "", role: "", duration: "" });
    }
  };
  // cancel experience while adding
  const cancelAddExperience = () => {
    setIsAddingExperience(false);
    setNewExp({ company: "", role: "", duration: "" })
  }
  // saving experience
  const saveNewExperience = () => {
    if (!newExp.company && !newExp.role && !newExp.duration) return;
    addExperience(newExp);
    setNewExp({ company: "", role: "", duration: "" });
    setIsAddingExperience(false);
  }


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
        // better: use initialData._id
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
      className="w-[70%] p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-xl font-bold">{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
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
      <div className="space-y-2">
        <h2>Personal Information</h2>
        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleChange("personalInfo", "firstName", e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleChange("personalInfo", "lastName", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.personalInfo.email}
            onChange={(e) => handleChange("personalInfo", "email", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="relative w-full">
            {!isEdit && (
              <>
                <input
                  placeholder={isEdit ? "Enter new password (leave blank to keep old)" : "Password"}
                  type={showPassword ? "text" : "password"}
                  value={formData.personalInfo.password}
                  readOnly
                  className="border p-2 rounded w-full pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

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

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.personalInfo.contactNumber}
          onChange={(e) => handleChange("personalInfo", "contactNumber", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <hr />
      <div className="space-y-2">
        <h2>Job Information</h2>

        <div className="flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="Job title"
            value={formData.jobInfo.title}
            onChange={(e) => handleChange("jobInfo", "title", e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="departmentId"
            placeholder="Department Id"
            value={formData.jobInfo.departmentId}
            onChange={(e) => handleChange("jobInfo", "departmentId", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            name="managerId"
            placeholder="Manager Id"
            value={formData.jobInfo.managerId}
            onChange={(e) => handleChange("jobInfo", "managerId", e.target.value)}
            className="w-full p-2 border rounded"
          />

          <select
            value={formData.jobInfo.employmentType}
            onChange={(e) => handleChange("jobInfo", "employmentType", e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={""}>-- Select Employment Type --</option>
            <option value="fulltime">Full time</option>
            <option value="parttime">Part time</option>
          </select>
        </div>


        <div className="flex gap-2">
          <select
            value={formData.jobInfo.status}
            onChange={(e) => handleChange("jobInfo", "status", e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={""}>-- Select Job Status --</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="onleave">On Leave</option>
          </select>
          <select
            value={formData.jobInfo.location}
            onChange={(e) => handleChange("jobInfo", "location", e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={""}>-- Select Job Location --</option>
            <option value="onsite">On Site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
          <input
            name="dateOfJoining"

            type="date"
            value={formData.jobInfo.dateOfJoining}
            onChange={(e) => handleChange("jobInfo", "dateOfJoining", e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Skilss */}
        <div>
          <input
            type="text"
            placeholder="Add skill"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill(e.target.value);
                e.target.value = "";
              }
            }}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />


          <ul className="flex flex-wrap gap-2 mt-2">
            {formData.jobInfo.skills.map((skill, i) => (
              <li key={i} className="flex items-center bg-blue-100 px-2 py-1 rounded">
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
            <h3 className="font-semibold">Experiences</h3>

            {(!formData.jobInfo || (formData.jobInfo.experiences || []).length === 0) ? (
              <p className="text-gray-500 text-sm">No experience added yet.</p>
            ) : (
              (formData.jobInfo.experiences || []).map((exp, i) => (
                <div key={i} className="border p-3 rounded mb-2">
                  {editIndex === i ? (
                    // Edit mode for this experience
                    <div>
                      <input
                        placeholder="Company"
                        value={editExp.company}
                        onChange={(e) => setEditExp((p) => ({ ...p, company: e.target.value }))}
                        className="block w-full mb-2 p-2 border rounded"
                      />
                      <input
                        placeholder="Role"
                        value={editExp.role}
                        onChange={(e) => setEditExp((p) => ({ ...p, role: e.target.value }))}
                        className="block w-full mb-2 p-2 border rounded"
                      />
                      <input
                        placeholder="Duration"
                        value={editExp.duration}
                        onChange={(e) => setEditExp((p) => ({ ...p, duration: e.target.value }))}
                        className="block w-full mb-2 p-2 border rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateExperience(i, editExp)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditIndex(-1);
                            setEditExp({ company: "", role: "", duration: "" });
                          }}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Read mode for this experience
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{exp.company || "—"}</div>
                        <div className="text-sm">{exp.role || "—"} {exp.duration ? `— ${exp.duration}` : ""}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditIndex(i);
                            setEditExp({ company: exp.company || "", role: exp.role || "", duration: exp.duration || "" });
                          }}
                          className="bg-yellow-400 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExperience(i)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>


          <div>
            <button
              type="button"
              onClick={() => setIsAddingExperience(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add Experience
            </button>
            {isAddingExperience && (
              <div className="mt-2 p-3 border rounded bg-gray-50">
                <input
                  placeholder="Company"
                  value={newExp.company}
                  onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))}
                  className="block w-full mb-2 p-2 border rounded"
                />
                <input
                  placeholder="Role"
                  value={newExp.role}
                  onChange={(e) => setNewExp((p) => ({ ...p, role: e.target.value }))}
                  className="block w-full mb-2 p-2 border rounded"
                />
                <input
                  placeholder="Duration"
                  value={newExp.duration}
                  onChange={(e) => setNewExp((p) => ({ ...p, duration: e.target.value }))}
                  className="block w-full mb-2 p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={saveNewExperience} className="bg-green-500 text-white px-3 py-1 rounded">
                    Save
                  </button>
                  <button type="button" onClick={cancelAddExperience} className="bg-gray-300 px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* PAst projects */}

        <div>
          <h3 className="font-semibold">Past Projects</h3>

          {/* Empty state */}
          {(!formData.jobInfo || (formData.jobInfo.pastProjects || []).length === 0) && !showProjectForm && projectEditIndex === -1 && (
            <p className="text-gray-500 text-sm">No past projects added yet.</p>
          )}

          {/* Existing saved projects */}
          {(formData.jobInfo?.pastProjects || []).map((proj, idx) => (
            <div key={idx} className="border p-3 rounded mb-2">
              {projectEditIndex === idx ? (
                // EDIT MODE (uses projectEditData)
                <div>
                  <input
                    placeholder="Project Name"
                    value={projectEditData.name}
                    onChange={(e) => setProjectEditData((p) => ({ ...p, name: e.target.value }))}
                    className="block w-full mb-2 p-2 border rounded"
                  />
                  <input
                    placeholder="Description"
                    value={projectEditData.description}
                    onChange={(e) => setProjectEditData((p) => ({ ...p, description: e.target.value }))}
                    className="block w-full mb-2 p-2 border rounded"
                  />

                  {/* technologies chips + add input */}
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(projectEditData.technologies || []).map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-200 rounded flex items-center gap-2">
                          <span>{t}</span>
                          <button type="button" onClick={() => removeTechFromEditProject(i)} className="text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        placeholder="Add technology"
                        value={editProjectTechInput}
                        onChange={(e) => setEditProjectTechInput(e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                      <button type="button" onClick={addTechToEditProject} className="px-3 bg-gray-300 rounded">Add</button>
                    </div>
                  </div>

                  <input
                    placeholder="Duration"
                    value={projectEditData.duration}
                    onChange={(e) => setProjectEditData((p) => ({ ...p, duration: e.target.value }))}
                    className="block w-full mb-2 p-2 border rounded"
                  />
                  <input
                    placeholder="Company"
                    value={projectEditData.company}
                    onChange={(e) => setProjectEditData((p) => ({ ...p, company: e.target.value }))}
                    className="block w-full mb-2 p-2 border rounded"
                  />

                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateProject(idx)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                    <button type="button" onClick={cancelEditProject} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                  </div>
                </div>
              ) : (
                // READ MODE
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

                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEditProject(idx)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                    <button type="button" onClick={() => deleteProject(idx)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Project Button & Form */}
          <div className="mt-2">
            {!showProjectForm ? (
              <button type="button" onClick={() => { setShowProjectForm(true); setProjectEditIndex(-1); }} className="bg-blue-600 text-white px-3 py-1 rounded">
                + Add Project
              </button>
            ) : (
              <div className="border p-2 mt-2 rounded">
                <input
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="block w-full mb-2 p-2 border rounded"
                />
                <input
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="block w-full mb-2 p-2 border rounded"
                />

                {/* new project technologies */}
                <div className="mb-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(newProject.technologies || []).map((t, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-200 rounded flex items-center gap-2">
                        <span>{t}</span>
                        <button type="button" onClick={() => removeTechFromNewProject(i)} className="text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="Add technology"
                      value={newProjectTechInput}
                      onChange={(e) => setNewProjectTechInput(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button type="button" onClick={addTechToNewProject} className="px-3 bg-gray-300 rounded">Add</button>
                  </div>
                </div>

                <input
                  placeholder="Duration"
                  value={newProject.duration}
                  onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                  className="block w-full mb-2 p-2 border rounded"
                />
                <input
                  placeholder="Company"
                  value={newProject.company}
                  onChange={(e) => setNewProject({ ...newProject, company: e.target.value })}
                  className="block w-full mb-2 p-2 border rounded"
                />

                <div className="flex gap-2">
                  <button type="button" onClick={() => addProject(newProject)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                  <button type="button" onClick={() => { setNewProject(emptyProject); setShowProjectForm(false); setNewProjectTechInput(''); }} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Current Projects</h3>

          {(formData.currentProjects || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No current projects added yet.</p>
          ) : (
            formData.currentProjects.map((proj, idx) => (
              <div key={idx} className="border p-3 rounded mb-2">
                {editCurrentIndex === idx ? (
                  <>
                    <input
                      placeholder="Project ID"
                      value={proj.projectId}
                      onChange={(e) => handleCurrentChange(idx, "projectId", e.target.value)}
                      className="block w-full mb-2 p-2 border rounded"
                    />
                    <input
                      placeholder="Role"
                      value={proj.role}
                      onChange={(e) => handleCurrentChange(idx, "role", e.target.value)}
                      className="block w-full mb-2 p-2 border rounded"
                    />
                    <input
                      type="date"
                      placeholder="Assigned Date"
                      value={proj.assignedDate}
                      onChange={(e) => handleCurrentChange(idx, "assignedDate", e.target.value)}
                      className="block w-full mb-2 p-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditCurrentIndex(-1)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditCurrentIndex(-1)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">Project ID: {proj.projectId}</div>
                      <div className="text-sm">Role: {proj.role}</div>
                      <div className="text-sm">Assigned: {proj.assignedDate}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditCurrentIndex(idx)}
                        className="bg-yellow-400 px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCurrentProject(idx)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Add Button */}
          {!showCurrentForm ? (
            <button
              type="button"
              onClick={() => setShowCurrentForm(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              + Add Current Project
            </button>
          ) : (
            <div className="border p-2 mt-2 rounded">
              <input
                placeholder="Project ID"
                value={currentProjectForm.projectId}
                onChange={(e) =>
                  setCurrentProjectForm({ ...currentProjectForm, projectId: e.target.value })
                }
                className="block w-full mb-2 p-2 border rounded"
              />
              <input
                placeholder="Role"
                value={currentProjectForm.role}
                onChange={(e) =>
                  setCurrentProjectForm({ ...currentProjectForm, role: e.target.value })
                }
                className="block w-full mb-2 p-2 border rounded"
              />
              <input
                type="date"
                value={currentProjectForm.assignedDate}
                onChange={(e) =>
                  setCurrentProjectForm({ ...currentProjectForm, assignedDate: e.target.value })
                }
                className="block w-full mb-2 p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addCurrentProject(currentProjectForm)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentProjectForm(emptyCurrentProject);
                    setShowCurrentForm(false);
                  }}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>



        {/* System Info (Read-only) */}
        <div className="mt-4">


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
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
      >
        {isEdit ? "Update Employee" : "Add Employee"}
      </button>
    </form>
  );
}