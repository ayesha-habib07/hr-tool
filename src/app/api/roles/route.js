import { NextResponse } from "next/server";
import Role from "../../../models/Role";
import { connectDB } from "@/src/lib/mongoose";

export async function GET() {
   await connectDB();
  const roles = await Role.find();
  return NextResponse.json(roles);
}

export async function POST(req) {
  try {
   await connectDB();
    const body = await req.json();
    const newRole = await Role.create(body);
    return NextResponse.json(newRole, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



