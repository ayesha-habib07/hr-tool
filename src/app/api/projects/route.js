import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Project from "../../../models/Projects";

// ================= GET Projects with Pagination & Search =================
export async function GET(req) {
  try {
    await connectDB();

    // query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { client: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { priority: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
      },
    });
  } catch (err) {
    console.error(" Error fetching projects:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= POST Create Project =================
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Incoming project data:", body);

    const { name, description, client, type, startDate, endDate, status, priority, managerId } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and Type are required." },
        { status: 400 }
      );
    }

    // auto generating project ID
    const count = await Project.countDocuments();
    const projectId = `PRJ${String(count + 1).padStart(3, "0")}`;

    const project = await Project.create({
      projectId,
      name,
      description,
      client,
      type,
      startDate,
      endDate,
      status,
      priority,
      managerId,
      team: [],
      documents: [],
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(" Error creating project:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ================= DELETE Project =================
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(" Error deleting project:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// // ================= POST Create Project =================
// export async function POST(req) {
//   try {
//     await connectDB();

//     const body = await req.json();
//     console.log("📩 Incoming project data:", body);

//     const { name, description, client, type, startDate, endDate, status, priority, managerId } = body;

//     if (!name || !type) {
//       return NextResponse.json(
//         { error: "Name and Type are required." },
//         { status: 400 }
//       );
//     }

//     //  safer auto-generating project ID
//     const lastProject = await Project.findOne().sort({ createdAt: -1 });
//     let projectId = "PRJ001";

//     if (lastProject && lastProject.projectId) {
//       const lastNum = parseInt(lastProject.projectId.replace("PRJ", ""), 10);
//       projectId = `PRJ${String(lastNum + 1).padStart(3, "0")}`;
//     }

//     const project = await Project.create({
//       projectId,
//       name,
//       description,
//       client,
//       type,
//       startDate,
//       endDate,
//       status,
//       priority,
//       managerId,
//       team: [],
//       documents: [],
//     });

//     return NextResponse.json(project, { status: 201 });
//   } catch (err) {
//     console.error("Error creating project:", err);

//     // retry logic for duplicate projectId (rare race condition)
//     if (err.code === 11000) {
//       const lastProject = await Project.findOne().sort({ createdAt: -1 });
//       const lastNum = parseInt(lastProject.projectId.replace("PRJ", ""), 10);
//       const newId = `PRJ${String(lastNum + 1).padStart(3, "0")}`;

//       try {
//         const project = await Project.create({ ...(await req.json()), projectId: newId });
//         return NextResponse.json(project, { status: 201 });
//       } catch (retryErr) {
//         return NextResponse.json({ error: retryErr.message }, { status: 500 });
//       }
//     }

//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
