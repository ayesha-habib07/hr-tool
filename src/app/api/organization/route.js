
import { NextResponse } from "next/server";
import Organization from "../../../models/Organization";
import { connectDB } from "../../../lib/connectDB";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newOrg = new Organization(body);
    await newOrg.save();

    return NextResponse.json({ success: true, org: newOrg }, { status: 201 });
  } catch (err) {
    console.error("Error saving organization:", err);
    return NextResponse.json({ error: "Failed to save organization" }, { status: 500 });
  }
}
