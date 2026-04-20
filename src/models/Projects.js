import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    description: { type: String },
    client: { type: String },
    type: { type: String, enum: ["Internal", "External", "Research"], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Pending", "In Progress", "On Hold", "Completed"], },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"] },
    managerId: { type: String },
    team: [
      {

        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },

        role: { type: String },
        assignedDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    documents: [{ type: String }],
    systemInfo: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      orgId: { type: String },
      role: { type: String },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      updatedBy: { type: String },
    },
  },

  { timestamps: true }
);


const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;

// mongoose.models.Project && delete mongoose.models.Project;
// const Project = mongoose.model("Project", projectSchema);
// export default Project;
