import { connectDB } from "../../../../lib/connectDB";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Organization from "../../../../models/Organization";
import jwt from "jsonwebtoken";
import Role from "../../../../models/Role";


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name},
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password, organizationName } = await req.json();
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Find or create organization
    let org = await Organization.findOne({ name: organizationName });
    if (!org) {
      org = await Organization.create({ name: organizationName });
    }

    // Check if this is the first user in the org
    const isFirstUser = !(await User.findOne({ organizationId: org._id }));

    let roleDocs;

    if (isFirstUser) {
      
      roleDocs = await Role.findOne({ name: "Admin" });
      if (!roleDocs) {
        // Auto-create admin role if missing
        roleDocs = await Role.create({ name: "Admin" });
      }
    } else {
      
      return NextResponse.json(
        { error: "Only admin can add members. Please contact your admin." },
        { status: 400 }
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      organizationId: org._id,
       role: roleDocs._id,
      
    });

    
    const token = generateToken({
      _id: newUser._id,
      email: newUser.email,
      role: roleDocs.name,
      name: newUser.name,

    });

    
    const redirectTo = "/dashboard";

    // Set cookie and return response
    const response = NextResponse.json({
      message: "User created successfully",
      role: roleDocs.name,
      redirectTo,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
