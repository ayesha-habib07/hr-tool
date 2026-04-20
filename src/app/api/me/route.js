import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Role from "../../../models/Role";

import { connectDB } from "@/src/lib/mongoose";


export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const user = await User.findById(userId).populate("role");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roleName =
      typeof user.role === "object" && user.role !== null
        ? user.role.name
        : user.role;

    return NextResponse.json({
  user: {
    id: user._id.toString(),   
    userId: user._id.toString(), 
    email: user.email,
    role: roleName,
    name: user.name, 
    avatar: user.avatar || "",
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

export async function PATCH(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    const { avatar } = await req.json();
    if (typeof avatar !== "string" || !avatar.trim()) {
      return NextResponse.json({ error: "Valid avatar is required" }, { status: 400 });
    }

    const avatarValue = avatar.trim();
    const isDataImage = avatarValue.startsWith("data:image/");
    const isHttpImage = /^https?:\/\/.+/i.test(avatarValue);
    if (!isDataImage && !isHttpImage) {
      return NextResponse.json({ error: "Avatar must be image data URL or http(s) URL" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar: avatarValue } },
      { new: true }
    ).populate("role");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roleName =
      typeof updatedUser.role === "object" && updatedUser.role !== null
        ? updatedUser.role.name
        : updatedUser.role;

    return NextResponse.json({
      message: "Profile image updated",
      user: {
        id: updatedUser._id.toString(),
        userId: updatedUser._id.toString(),
        email: updatedUser.email,
        role: roleName,
        name: updatedUser.name,
        avatar: updatedUser.avatar || "",
      },
    });
  } catch (err) {
    console.error("/api/me PATCH error:", err);
    return NextResponse.json({ error: "Failed to update profile image" }, { status: 500 });
  }
}




