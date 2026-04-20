import { connectMongoose } from "../../../../lib/connectdb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoose();
    const { token, password } = await req.json();

    // Verify invite token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { password: hashedPassword, isActive: true },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password set successfully" });
  } catch (err) {
    console.error("Set password error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
