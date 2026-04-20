import mongoose from "mongoose";
const permissionSchema = new mongoose.Schema({
  role: String,
  permissions: [
    {
      name: String,
      href: String,
      icon: String
    }
  ]
});

const Permission = mongoose.models.Permission || mongoose.model("Permission", permissionSchema)
export default Permission;