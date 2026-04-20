import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    contactNumber: { type: String },
  },

  jobInfo: {
    title: { type: String },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    employmentType: { type: String },
    status: { type: String },
    dateOfJoining: { type: Date },
    location: { type: String },
    skills: [{ type: String }],

    experiences: [
      {
        company: { type: String },
        role: { type: String },
        dateOfJoining: { type: String },
        dateOfLeaving: { type: String },
        yearsOfExperience:{type:String},
        expertiseLevel:{type:String},
      },
    ],

    pastProjects: [
      {
        name: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        projectStartDate: { type: String },
        projectEndDate: { type: String },
        company: { type: String },
      },
    ],
  },

  currentProjects: [
    {
      projectId: { type: String },
      role: { type: String },
      assignedDate: { type: Date },
    },
  ],

  systemInfo: {
    userId: { type: String },
    orgId: { type: String },
    role: { type: String, default: "system" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    updatedBy: { type: String },
  },
   // ✅ Add these for AI vector search
  embeddingText: { type: String },
  embedding: { type: [Number] }, 
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;


// mongoose.models.Employee && delete mongoose.models.Employee;
// const Employee = mongoose.model("Employee", employeeSchema);

// export default Employee;
