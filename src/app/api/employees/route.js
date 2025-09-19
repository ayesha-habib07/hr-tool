import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Employee from '../../../models/Employee';
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; 
import Department from "../../../models/Departments";
import jwt from 'jsonwebtoken';

import { checkAuthAndRole } from "../../../lib/auth";








export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // FIXED QUERY
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
        ],
      }
      : {};

    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
    .populate("jobInfo.departmentId","name")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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

    // 🔑 Validate required personalInfo fields
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

    // 🔑 Validate departmentId (required in schema)
    if (
      !body.jobInfo?.departmentId ||
      !mongoose.Types.ObjectId.isValid(body.jobInfo.departmentId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing departmentId" },
        { status: 400 }
      );
    }

    // ✅ managerId is optional (only validate if provided)
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

    // ✅ Create employee
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
    const {user, error, status} = checkAuthAndRole(req,['Admin']);
    if(error){
      return NextResponse.json({error}, {status});
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
}catch (err) {
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




// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const newEmployee = new Employee({
//       employeeId: body.employeeId,
//       personalInfo: {
//         firstName: body.firstName,
//         lastName: body.lastName,
//         email: body.email,
//         contactNumber: body.contactNumber,
//       },
//       jobInfo: {
//         title: body.title,
//         employmentType: body.employmentType,
//         status: body.status,
//         dateOfJoining: body.dateOfJoining,
//         location: body.location,
//         skills: body.skills || [],
//       },
//     });

//     await newEmployee.save();

//     return NextResponse.json(
//       { message: "Employee created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     return NextResponse.json(
//       { message: "Failed to create employee", error },
//       { status: 500 }
//     );
//   }
// }