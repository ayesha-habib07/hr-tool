import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/connectDB";
import Employee from "../../../../models/Employee";

import bcrypt from "bcryptjs";



export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const employee = await Employee.findById(id);

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (err) {
    console.error("GET /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    // Handle password separately
    if (body.personalInfo?.password) {
      body.personalInfo.password = await bcrypt.hash(
        body.personalInfo.password,
        10
      );
    } else if (body.personalInfo) {
      delete body.personalInfo.password;
    }
console.log("test api",req.json())
    const updated = await Employee.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// DELETE employee
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const deleted = await Employee.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Employee deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}