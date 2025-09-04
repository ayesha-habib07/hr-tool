import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent model overwrite in dev mode
const Organization = mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);
export default Organization;
