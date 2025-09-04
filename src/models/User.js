import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev mode
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
