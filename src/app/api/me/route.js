import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../models/User";

export async function GET(req) {
  try {
    //  Get token from cookies
    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401});
    }

    //  Verify token
    console.log(process.env.JWT_SECRET , "process.env.JWT_SECRET")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    const user= await User.findById(decoded.id).populate("role")
    console.log("Decoded token:", decoded);


    // Return structured user object
  return NextResponse.json({
  user: {
    id: user._id.toString(),   
    userId: user._id.toString(), 
    email: user.email,
    role: user.role?.name || user.role,
    name: user.name, 
  },
  systemInfo: {
        userId: decoded?.id || "system",
        role: decoded?.role || "system",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        updatedBy: decoded?.id || "system",
      },
});
  } catch (err) {
    console.error("/api/me error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}


