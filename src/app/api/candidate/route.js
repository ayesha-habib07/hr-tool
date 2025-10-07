import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connectDB";
import Candidate from "../../../models/Candidate";

// POSt
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Incoming candidate information:", body);

    const {
      fullName,
      email,
      department,
      description,
      skills,
      employmentHistory,
      education,
      phoneNumber,
      dateOfBirth,
      portfolioLink
    } = body;


    if (!description || !phoneNumber || !dateOfBirth) {
      return NextResponse.json(
        { error: "Need to fill required fields" },
        { status: 400 }
      );
    }

    const candidate = await Candidate.create({
      fullName,
      email,
      department,
      portfolioLink,
      description,

      skills: Array.isArray(skills) ? skills : [skills],

      employmentHistory: (employmentHistory || []).map(job => ({
        ...job,
        startDate: job.startDate ? new Date(job.startDate) : null,
        endDate: job.endDate ? new Date(job.endDate) : null,
      })),

      education: education || [],
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth),
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (err) {
    console.error("POST /api/candidate error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// GET
export async function GET() {
  try {
    await connectDB();
    const candidates = await Candidate.find().sort({ fullName: 1 });
    return NextResponse.json(candidates);
  } catch (err) {
    console.error("GET /api/candidate error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCandidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCandidate);
  } catch (err) {
    console.error("PUT /api/candidate error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 });
    }

    const deletedCandidate = await Candidate.findByIdAndDelete(id);

    if (!deletedCandidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Candidate deleted successfully." });
  } catch (err) {
    console.error("DELETE /api/candidate error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
