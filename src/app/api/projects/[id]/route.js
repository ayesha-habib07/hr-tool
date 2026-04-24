import { NextResponse } from "next/server";


import { connectMongoose } from "../../../../lib/connectDB";
import Projects from "../../../../models/Projects";

export async function GET(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const project = await Projects.findById(id);

        if (!project) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (err) {
        console.error("GET /api/projects/[id] error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const body = await req.json();

        const updatedProject = await Projects.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found." }, { status: 404 });
        }

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (err) {
        console.error("PUT /api/projects/[id] error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const deleted = await Projects.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Project Deleted" }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/projects/[id] error", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}