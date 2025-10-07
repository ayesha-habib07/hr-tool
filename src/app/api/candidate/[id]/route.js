import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/connectDB";
import Candidate from "../../../../models/Candidate";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json(candidate, { status: 200 });
  } catch (err) {
    console.error("/api/candidate/[id] error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}