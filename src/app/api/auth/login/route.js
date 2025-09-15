import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/connectDB";
import User from "../../../../models/User";
import Role from "../../../../models/Role";

const generateToken = (user) => {
  return jwt.sign(
    {
       id: user._id.toString(), 
       email: user.email,
      role: user.role, 
       name: user.name ,
       orgId:user.organizationId,
      },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();

  
    const user = await User.findOne({ email:normalizedEmail }).populate("role");
console.log("Trying to login:", normalizedEmail, "Found user:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Generate token (role as string)
    const token = generateToken({
      _id: user._id,
      email: user.email,
      role: user.role?.name || user.role,
      name: user.name,
    });

    // Role-based redirect
    let redirectTo = "/dashboard";
    const roleName = user.role?.name || user.role;
    // if (roleName === "project_manager") redirectTo = "/dashboard/team";
    // if (roleName === "team_member") redirectTo = "/dashboard/tasks";
    // if(roleName === "Admin") redirectTo = "/dashboard";
    

    // Return response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo,
      role: roleName,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
