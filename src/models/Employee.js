import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String },

  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    contactNumber: { type: String },
  },

  jobInfo: {
    title: { type: String },
    departmentId: { type:mongoose.Schema.Types.ObjectId, ref:"Department", required:true},
    managerId: {type:mongoose.Schema.Types.ObjectId, ref:"Employee", default:null },
    employmentType: { type: String },
    status: { type: String }, 
    dateOfJoining: { type: Date },
    location: { type: String },
    skills: [{ type: String }],

    experiences: [
      {
        company: { type: String },
        role: { type: String },
        duration: { type: String },
      },
    ],

    pastProjects: [
      {
        name: { type: String },
        description: { type: String },
        technologies: [{ type: String }],
        duration: { type: String },
        company: { type: String },
      },
    ],
  },

  currentProjects: [
    {
      projectId: { type:String},
      role: { type: String },
      assignedDate: { type: Date },
    },
  ],

  systemInfo: {
    userId: { type: String },
    role: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String},
  },
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
