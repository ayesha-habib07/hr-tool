import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase:true },
    password: { type: String, default: null },
    avatar: { type: String, default: "" },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    isVerified:{type:Boolean, default:false},
    otp:{type:String},
    otpExpiresAt:{type:Date},   
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
