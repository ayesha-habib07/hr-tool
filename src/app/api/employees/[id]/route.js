// import { NextResponse } from "next/server";
// import { connectDB } from "../../../../lib/connectDB";
// import Employee from "../../../../models/Employee";

// import bcrypt from "bcryptjs";



// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;

//     const employee = await Employee.findById(id);

//     if (!employee) {
//       return NextResponse.json({ error: "Employee not found" }, { status: 404 });
//     }

//     return NextResponse.json(employee, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/employees/[id] error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req, { params }) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const body = await req.json();

//     // Handle password separately
//     if (body.personalInfo?.password) {
//       body.personalInfo.password = await bcrypt.hash(
//         body.personalInfo.password,
//         10
//       );
//     } else if (body.personalInfo) {
//       delete body.personalInfo.password;
//     }
//     console.log("test api", req.json())

//     const updated = await Employee.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) {
//       return NextResponse.json(
//         { error: "Employee not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updated, { status: 200 });
//   } catch (err) {
//     console.error("PUT /api/employees/[id] error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


// // DELETE employee
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     const deleted = await Employee.findByIdAndDelete(params.id);

//     if (!deleted) {
//       return NextResponse.json({ error: "Employee not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Employee deleted" }, { status: 200 });
//   } catch (err) {
//     console.error("DELETE /api/employees/[id] error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Employee from "../../../../models/Employee";
import bcrypt from "bcryptjs";
import {checkAuthAndRole} from '../../../../lib/auth';

// GET employee by id
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // ✅ authenticate
    const { user, error, status } = checkAuthAndRole(req, ["Admin", "User"]);
    if (error) return NextResponse.json({ error }, { status });

    const employee = await Employee.findById(id);
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    // ✅ only owner or admin can view
    if (employee.systemInfo.userId.toString() !== user.id && user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized access to this employee" },
        { status: 403 }
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (err) {
    console.error("GET /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT employee by id
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const { user, error, status } = checkAuthAndRole(req, ["Admin"]);
    if (error) return NextResponse.json({ error }, { status });

    const employee = await Employee.findById(id);
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    //  only owner/admin can update
    if (employee.systemInfo.userId.toString() !== user.id && user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized update attempt" },
        { status: 403 }
      );
    }

    // Hash password if provided
    if (body.personalInfo?.password) {
      body.personalInfo.password = await bcrypt.hash(body.personalInfo.password, 10);
    } else if (body.personalInfo) {
      delete body.personalInfo.password;
    }

    const updated = await Employee.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE employee by id
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { user, error, status } = checkAuthAndRole(req, ["Admin"]);
    if (error) return NextResponse.json({ error }, { status });

    const employee = await Employee.findById(params.id);
    if (!employee)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });

    // only owner/admin can delete
    if (employee.systemInfo.userId.toString() !== user.id && user.role !== "Admin") {
      return NextResponse.json(
        { error: "Unauthorized delete attempt" },
        { status: 403 }
      );
    }

    await employee.deleteOne();

    return NextResponse.json({ message: "Employee deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/employees/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
