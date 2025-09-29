import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Employee from '../../../models/Employee';
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Department from "../../../models/Departments";

import { checkAuthAndRole } from "../../../lib/auth";
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Build search query
    const query = search
      ? {
        $or: [
          { "personalInfo.firstName": { $regex: search, $options: "i" } },
          { "personalInfo.lastName": { $regex: search, $options: "i" } },
          { "personalInfo.contactNumber": { $regex: search, $options: "i" } },
          { "personalInfo.email": { $regex: search, $options: "i" } },
          { "jobInfo.title": { $regex: search, $options: "i" } },
          { "jobInfo.location": { $regex: search, $options: "i" } },
          { "systemInfo.role": { $regex: search, $options: "i" } },
          { "jobInfo.departmentId": { $regex: search, $options: "i" } },
        ],
      }
      : {};

    // Count total documents for pagination
    const total = await Employee.countDocuments(query);

    // Aggregate employees with department name
    const employees = await Employee.aggregate([
      { $match: query },

      // Convert string departmentId to ObjectId
      {
        $addFields: {
          departmentObjectId: { $toObjectId: "$jobInfo.departmentId" },
        },
      },

      // Lookup department
      {
        $lookup: {
          from: "departments",
          localField: "jobInfo.departmentId",
          foreignField: "_id",
          as: "department",
        },
      },

      { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },

      { $skip: (page - 1) * limit },
      { $limit: limit },

      // Select fields to return
      {
        $project: {
          "personalInfo.firstName": 1,
          "personalInfo.lastName": 1,
          "personalInfo.email": 1,
          "personalInfo.contactNumber": 1,
          "jobInfo.title": 1,
          "jobInfo.status": 1,
          "jobInfo.location": 1,
          "systemInfo.role": 1,
          departmentName: { $ifNull: ["$department.name", "N/A"] },
        },
      },
    ]);

    return NextResponse.json({
      employees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/employees error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     console.log("Incoming body:", body);
    


//     let hashedPassword = null;
//     if (body?.personalInfo?.password) {
//       hashedPassword = await bcrypt.hash(body.personalInfo.password, 10);
//     }


//     // first validation of required fields
//     if (!body.personalInfo.firstName || !body.personalInfo.lastName || !body.personalInfo.email) {
//       return NextResponse.json(
//         { error: "Missing required personal information" },
//         { status: 400 }
//       );
//     }
//     const { user, error, status } = checkAuthAndRole(req, ['Admin']);
//     if (error) {
//       return NextResponse.json({ error }, { status });
//     }
//     let data = body;
    
//     if(data.jobinfo){
//       if(data.jobinfo.mangerId === ''){
//         data.jobInfo.mangerId = null;
//       }
//     }
// console.log("data.jobinfo" )

//     const newEmployee = await Employee.create({
//       personalInfo: {
//         firstName: body.personalInfo.firstName,
//         lastName: body.personalInfo.lastName,
//         email: body.personalInfo.email.trim().toLowerCase(),
//         contactNumber: body.personalInfo.contactNumber,
//         password: hashedPassword,
//       },
//       jobInfo: {
//         title: body.jobInfo?.title,
//         departmentId: body.jobInfo?.departmentId,
//         managerId: body.jobInfo?.managerId || null,
//         employmentType: body.jobInfo?.employmentType,
//         status: body.jobInfo?.status,
//         dateOfJoining: body.jobInfo?.dateOfJoining,
//         location: body.jobInfo?.location,
//         skills: body.jobInfo?.skills || [],
//         experiences: body.jobInfo?.experiences || [],
//         pastProjects: body.jobInfo?.pastProjects || [],
//       },
//       currentProjects: body.currentProjects || [],
//       systemInfo: {
//     userId: user.id,  // ✅ comes from token
//     role: user.role || "system",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     updatedBy: user.id || "system",
//   },
//     });
//    const newUser= await newEmployee.save();

//     return NextResponse.json(newUser, { status: 201 });
//     console.log("Saving jobInfo.experiences:", body.jobInfo?.experiences);

//   } catch (err) {
//     console.error("POST /api/employees error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Incoming body:", body);

    // 🔑 Hash password if provided
    let hashedPassword = null;
    if (body?.personalInfo?.password) {
      hashedPassword = await bcrypt.hash(body.personalInfo.password, 10);
    }

    // Validate required personalInfo fields
    if (
      !body.personalInfo?.firstName ||
      !body.personalInfo?.lastName ||
      !body.personalInfo?.email
    ) {
      return NextResponse.json(
        { error: "Missing required personal information" },
        { status: 400 }
      );
    }

    // Validate departmentId (required in schema)
    if (
      !body.jobInfo?.departmentId ||
      !mongoose.Types.ObjectId.isValid(body.jobInfo.departmentId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing departmentId" },
        { status: 400 }
      );
    }

    //  managerId is optional (only validate if provided)
    let managerId = null;
    if (body.jobInfo?.managerId) {
      if (mongoose.Types.ObjectId.isValid(body.jobInfo.managerId)) {
        managerId = body.jobInfo.managerId;
      } else {
        console.warn("⚠️ Invalid managerId received, setting to null");
      }
    }

    // 🔑 Role check
    const { user, error, status } = checkAuthAndRole(req, ["Admin"]);
    if (error) {
      return NextResponse.json({ error }, { status });
    }
    let data = body;
    // sanitize empty strings to null
    if (data.jobInfo) {
      if (data.jobInfo.managerId === '') {
        data.jobInfo.managerId = null;
      }
    }


// check this later
    // jobInfo.departmentId = new mongoose.Types.ObjectId(body.jobInfo.departmentId);

    // Create employee
    const newEmployee = await Employee.create({
      personalInfo: {
        firstName: body.personalInfo.firstName,
        lastName: body.personalInfo.lastName,
        email: body.personalInfo.email.trim().toLowerCase(),
        contactNumber: body.personalInfo.contactNumber,
        password: hashedPassword,
      },
      jobInfo: {
        title: body.jobInfo?.title,
        departmentId: body.jobInfo.departmentId,
        managerId: managerId, // optional now
        employmentType: body.jobInfo?.employmentType,
        status: body.jobInfo?.status,
        dateOfJoining: body.jobInfo?.dateOfJoining,
        location: body.jobInfo?.location,
        skills: body.jobInfo?.skills || [],
        experiences: body.jobInfo?.experiences || [],
        pastProjects: body.jobInfo?.pastProjects || [],
      },
      currentProjects: body.currentProjects || [],
      systemInfo: {
        userId: user.id,
        role: user.role || "system",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user.id || "system",
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err) {
    console.error("POST /api/employees error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();

    // authentication cokies
    const { user, error, status } = checkAuthAndRole(req, ['Admin']);
    if (error) {
      return NextResponse.json({ error }, { status });
    }


    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Employee Id is required' }, { status: 400 });
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    // If password provided, hash it
    if (body.personalInfo?.password) {
      employee.personalInfo.password = await bcrypt.hash(body.personalInfo.password, 10);
      // remove plain password from body to avoid overwriting
      delete body.personalInfo.password;
    }



    // if (body.personalInfo) {
    //   employee.personalInfo = { ...employee.personalInfo.toObject(), ...body.personalInfo };
    // }
    if (body.jobInfo) {
      employee.jobInfo = { ...employee.jobInfo.toObject(), ...body.jobInfo };
    }
    if (body.currentProjects) {
      employee.currentProjects = { ...employee.currentProjects.toObject(), ...body.currentProjects };
    }
    if (body.systemInfo) {
      employee.systemInfo = {
        ...employee.systemInfo.toObject(),
        updatedAt: new Date(),
        updatedBy: user.id || "system",
      };

      await employee.save();
      return NextResponse.json(employee, { status: 200 });
      console.log("Saving jobInfo.experiences:", body.jobInfo?.experiences);
    }
  } catch (err) {
    console.error("PUT /api/employees error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/employees error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}