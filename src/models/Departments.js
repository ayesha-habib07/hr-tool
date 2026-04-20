import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentId: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    systemInfo: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      orgId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      role: { type: String },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    }
  },
  { timestamps: true }
);

const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);
export default Department;

// mongoose.models.Department && delete mongoose.models.Department;
// const Department = mongoose.model("Department", departmentSchema);

// export default Department;