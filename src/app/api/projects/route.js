import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Project from "../../../models/Projects";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("📩 Incoming project data:", body);

    const { name, description, client, type, startDate, endDate, status, priority } = body;

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
