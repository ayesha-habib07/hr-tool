import {connectDB} from "../../../../lib/connectDB";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"; 



export async function POST(req) {
  console.log("Signup route hit");

  try {
    await connectDB();
    console.log(" DB connected");

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: "admin" });
    await newUser.save();

    console.log("User created");
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}