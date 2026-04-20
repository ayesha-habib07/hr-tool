import { NextResponse } from "next/server";

import Department from "../../../models/Departments";
import { checkAuthAndRole } from "../../../lib/auth";
import { connectDB } from "@/src/lib/mongoose";
import { connect } from "mongoose";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { user, error, status } = checkAuthAndRole(req, ['Admin', 'User']);
//     if (error) return NextResponse.json({ error }, { status });

//     const body = await req.json();
//     const { name, description, managerId } = body;

//     if (!name) {
//       return NextResponse.json({ error: "Name is required" }, { status: 400 });
//     }

//     const existing = await Department.findOne({ name });
//     if (existing) {
//       return NextResponse.json({ error: "Department already exists" }, { status: 409 });
//     }
//     // const existingCode = await Department.findOne({ code });
//     // if (existingCode) {
//     //   return NextResponse.json({ error: "Code is already taken" }, { status: 407 });
//     // }

//     const count = await Department.countDocuments();
//     const departmentId = `DEP${String(count + 1).padStart(3, "0")}`;

//     const department = await Department.create({
//       departmentId,
//       name,
//       description,
//       managerId: managerId || null,
//       systemInfo: {
//         userId: user.id,
//         orgId: user.orgId || user.id,
//         role: user.role,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         updatedBy: user.id,
//       }
//     });

//   await department.save();
//     console.log(department);
//     return NextResponse.json({ message: "Department created", department });
//   }catch (err) {
//     console.error("Error creating Department", err);
//     return NextResponse.json({err:err.message}, {status:500});
//   }
// }

export async function POST(req) {
  try {
      await connectDB();
    const { user, error, status } = checkAuthAndRole(req, ["Admin", "User"]);
    if (error) return NextResponse.json({ error }, { status });

    const body = await req.json();
    console.log("📥 Incoming department data:", body);
    console.log("👤 Authenticated user:", user);

    const { name, description, managerId } = body;

    const department = await Department.create({
      name,
      description,
      managerId,
      systemInfo: {
        userId: user.id,
        orgId: user.orgId || user.id,
        role: user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user.id,
      },
    });

    console.log("✅ Department saved:", department);
    return NextResponse.json({ message: "Department created", department });
  } catch (err) {
    console.error("❌ Error creating department:", err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}


export async function GET(req) {
  try {
  await connectDB();
    const { user, error, status } = checkAuthAndRole(req, ["Admin", "User"]);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const orgId = user.orgId || user.id;
    const query = { "systemInfo.orgId": orgId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Department.countDocuments(query);
    const departments = await Department.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      departments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
      },
    });
  } catch (err) {
    console.error("Error fetching departments:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
