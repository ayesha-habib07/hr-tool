import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  department: {type:String ,required:true},
  description: { type: String, required: true },
  skills: [{ type: String }],
  employmentHistory: [
    {
      company: { type: String },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  ],
  education: [
    {
      universityName: { type: String },
      degree: { type: String },
      year: { type: String },
    },
  ],
  portfolioLink: { type: String },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
}, { timestamps: true });



const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);

export default Candidate;
