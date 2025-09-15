import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });


const Organization = mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema);
export default Organization;
