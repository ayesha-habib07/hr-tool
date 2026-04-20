import { NextResponse } from "next/server";
import Employee from '../../../models/Employee';
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Department from "../../../models/Departments";
import jwt from "jsonwebtoken";
// import { connectDB } from "../../../lib/mongodb";

import clientPromise from "@/src/lib/connectdb";
import { checkAuthAndRole } from "../../../lib/auth";


// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { connectDB } from "@/src/lib/mongoose";




export async function GET(req) {
  try {
   await connectDB();
    console.log("in employee get client connected");
    //   const client = await clientPromise;
    // console.log("connected mongoatlas")
    // console.log("in employee  db connected", db);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Check user auth
    const { user, error, status } = checkAuthAndRole(req, ["Admin", "User"]);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // console.log("user from employee route", user);
    const orgId = user.orgId || user.id;
    // Build search query
    const query = {
      "systemInfo.orgId": orgId, // restrict data to logged-in user's org
    };

    if (search) {
      query.$or = [
        { "personalInfo.firstName": { $regex: search, $options: "i" } },
        { "personalInfo.lastName": { $regex: search, $options: "i" } },
        { "personalInfo.contactNumber": { $regex: search, $options: "i" } },
        { "personalInfo.email": { $regex: search, $options: "i" } },
        { "jobInfo.title": { $regex: search, $options: "i" } },
        { "jobInfo.location": { $regex: search, $options: "i" } },
        { "systemInfo.role": { $regex: search, $options: "i" } },
      ];
    }

    // console.log("🔍 Final query:", query);

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



export async function POST(req) {
  try {
    console.log("Employee post hittttt");

    // const client = await clientPromise;
    // const database = client.db(process.env.MONGODB_ATLAS_DB_NAME);
    // const collection = database.collection("employees");
    // console.log("in employee post clinet connected", client);


    await connectDB();
    const body = await req.json();

    // Hash password if provided
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

    // Validate departmentId
    if (
      !body.jobInfo?.departmentId ||
      !mongoose.Types.ObjectId.isValid(body.jobInfo.departmentId)
    ) {
      return NextResponse.json(
        { error: "Invalid or missing departmentId" },
        { status: 400 }
      );
    }

    // Validate optional managerId
    let managerId = null;
    if (body.jobInfo?.managerId && mongoose.Types.ObjectId.isValid(body.jobInfo.managerId)) {
      managerId = body.jobInfo.managerId;
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Auth & Role check
    const { user, error, status } = checkAuthAndRole(req, ["Admin"]);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Sanitize data
    if (body.jobInfo?.managerId === "") {
      body.jobInfo.managerId = null;
    }

    // Create new employee
    const newEmployee = await Employee.create({
      userId: user.id,
      orgId: user.orgId || user.id,
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
        managerId,
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
        orgId: user.orgId || user.id,
        role: user.role || "system",
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user.id || "system",
        userId: decoded.id,

      },
    });

    const employee = newEmployee.toObject();
    const text = `
      ${employee.personalInfo.firstName} ${employee.personalInfo.lastName} 
      works as ${employee.jobInfo.title}.
      Department: ${employee.jobInfo.departmentId}.
      Skills: ${(employee.jobInfo.skills || []).join(", ")}.
      Summary: ${employee.jobInfo.pastProjects?.join(" | ")}
    `;

    // ✅ Generate embedding
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const vectors = await embeddings.embedDocuments([text]);
    const vector = vectors[0];

    await Employee.updateOne(
      { _id: newEmployee._id },
      {
        $set: {
          embeddingText: text,
          embedding: vector,
        },
      }
    );
    console.log("vectorrrrrrr:", vector);
    console.log("✅ Employee added + embedding created");

    return NextResponse.json(newEmployee, { status: 201 });
  }
  //   newEmployee.orgId = newEmployee._id;
  //   await newEmployee.save();
  //   await createEmployeeEmbedding(newEmployee);

  //   return NextResponse.json(newEmployee, { status: 201 });
  // }
  catch (err) {
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