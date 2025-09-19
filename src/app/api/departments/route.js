import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Department from "../../../models/Departments";

// GET all departments
export async function GET() {
  await connectDB();
  const departments = await Department.find().sort({ name: 1 });
  return NextResponse.json(departments);
}


export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { name, description,  managerId } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const existing = await Department.findOne({ name });
  if (existing) {
    return NextResponse.json({ error: "Department already exists" }, { status: 409 });
  }
  // const existingCode = await Department.findOne({ code });
  // if (existingCode) {
  //   return NextResponse.json({ error: "Code is already taken" }, { status: 407 });
  // }

  const count = await Department.countDocuments();
  const departmentId = `DEP${String(count + 1).padStart(3, "0")}`;

  const department = await Department.create({
    departmentId,
    name,
    description,
    managerId: managerId || null,
  });
  console.log(department)

  return NextResponse.json(department, { status: 201 });
}
