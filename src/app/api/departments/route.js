import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Department from "../../../models/Departments";

// GET all departments
export async function GET() {
  await connectDB();
  const departments = await Department.find().sort({ name: 1 });
  return NextResponse.json(departments);
}

// POST create department
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const existing = await Department.findOne({ name });
  if (existing) {
    return NextResponse.json({ error: "Department already exists" }, { status: 409 });
  }

  const count = await Department.countDocuments();
  const departmentId = `DEP${String(count + 1).padStart(3, "0")}`;

  const department = await Department.create({
    departmentId,
    name,
    description,
    managerId: null, // dummy for now
  });

  return NextResponse.json(department, { status: 201 });
}
