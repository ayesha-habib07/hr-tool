import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/mongoose";
import User from "../../../../models/User";
import Role from "../../../../models/Role";


// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id.toString(),
//       email: user.email,
//       role: user.role,
//       name: user.name,
//       // orgId: user.organizationId?.toString(),
//       orgId: user.systemInfo?.orgId || user.orgId,
//       // orgId:user.orgId,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "5d" }
//   );
// };

// export async function POST(req) {
//   try {
//     const client = await clientPromise;
//     console.log("in login route client connected", client);
//     // 1️⃣ Connect to MongoDB

//     const db = client.db(process.env.MONGODB_ATLAS_DB_NAME || "hr-tool");
//     const usersCollection = db.collection("users");

//     const { email, password } = await req.json();
//     const normalizedEmail = email.trim().toLowerCase();


//     const user = await User.findOne({ email: normalizedEmail }).populate("role");
//     console.log("Trying to login:", normalizedEmail, "Found user:", user);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }


//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     // Generate token (role as string)
//     const token = generateToken({
//       _id: user._id,
//       email: user.email,
//       role: user.role?.name || user.role,
//       name: user.name,
//     });

//     // Role-based redirect
//     let redirectTo = "/dashboard";
//     const roleName = user.role?.name || user.role;
//     // if (roleName === "project_manager") redirectTo = "/dashboard/team";
//     // if (roleName === "team_member") redirectTo = "/dashboard/tasks";
//     // if(roleName === "Admin") redirectTo = "/dashboard";


//     // Return response with cookie
//     const response = NextResponse.json({
//       success: true,
//       message: "Login successful",
//       redirectTo,
//       role: roleName,
//     });

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60,
//       path: "/",
//     });

//     return response;
//   } catch (err) {
//     console.error("Login error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }



// ✅ Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      // orgId: user.organizationId?.toString(),
      orgId: user.systemInfo?.orgId || user.orgId,
      // orgId:user.orgId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
};

// export async function POST(req) {
//   try {
//     console.log("🔗 Connecting to MongoDB via Mongoose...");
//     await connectDB();

//     const { email, password } = await req.json();
//     const normalizedEmail = email.trim().toLowerCase();

//     // ✅ Native MongoDB query (no Mongoose)
//     const user = await usersCollection.findOne({ email: normalizedEmail });
//     console.log("Trying to login:", normalizedEmail, "Found user:", user);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     // ✅ Manual "populate" for role if stored as ObjectId
//     let roleName = user.role?.name || user.role;
//     if (!roleName && user.roleId) {
//       const role = await rolesCollection.findOne({ _id: user.roleId });
//       roleName = role?.name || "User";
//     }

//     // Generate token (role as string)
//     const token = generateToken({
//       _id: user._id,
//       email: user.email,
//       role: roleName,
//       name: user.name,
//     });

//     // Role-based redirect
//     let redirectTo = "/dashboard";
//     const role = roleName;
//     // if (role === "project_manager") redirectTo = "/dashboard/team";
//     // if (role === "team_member") redirectTo = "/dashboard/tasks";
//     // if (role === "Admin") redirectTo = "/dashboard";

//     // Return response with cookie
//     const response = NextResponse.json({
//       success: true,
//       message: "Login successful",
//       redirectTo,
//       role,
//     });

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60,
//       path: "/",
//     });

//     return response;
//   } catch (err) {
//     console.error("Login error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }






export async function POST(req) {
  try {
    console.log("🔗 Connecting to MongoDB via Mongoose...");
    await connectDB();

    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();

    // ✅ Find user + populate role
    const user = await User.findOne({ email: normalizedEmail }).populate("role");

    console.log("🔍 Trying to login:", normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // ✅ Extract role name
    const roleName = user.role?.name || user.role;

    // ✅ Generate JWT token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: roleName,
      name: user.name,
    });

    // ✅ Role-based redirect
    let redirectTo = "/dashboard";
    // if (roleName === "project_manager") redirectTo = "/dashboard/team";
    // if (roleName === "team_member") redirectTo = "/dashboard/tasks";
    // if (roleName === "Admin") redirectTo = "/dashboard";

    // ✅ Return response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo,
      role: roleName,
    });

    // ✅ Store token in cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}