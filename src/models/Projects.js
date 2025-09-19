import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    client: { type: String },
    type: { type: String, enum: ["internal", "external", "r&d"], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["planned", "inprogress", "onhold", "completed"] },
    priority: { type: String, enum: ["low", "medium", "high", "critical"] },
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
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
