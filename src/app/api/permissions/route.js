
import Permission from "../../../models/Permission";

import { connectDB } from "@/src/lib/mongoose";


export async function GET(req) {
  try {
        await connectDB();
    console.log("in permission mongoose connected");

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (!role) {
      return new Response(JSON.stringify({ error: "Role is required" }), { status: 400 });
    }

    console.log(role)

    const rolePermissions = await Permission.findOne({ role });

    // DEBUG: dump connection + collection state
    const mongoose = (await import("mongoose")).default;
    console.log("DB name:", mongoose.connection.name);
    console.log("Collection:", Permission.collection.collectionName);
    const allDocs = await Permission.find({}).lean();
    console.log("All permission docs:", JSON.stringify(allDocs, null, 2));
    console.log("Count:", allDocs.length);

    console.log(rolePermissions?.permissions , "rolePermissions?.permissions")
    return new Response(JSON.stringify(rolePermissions?.permissions || []), {
      status: 200,
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch permissions" }), { status: 500 });
  }
}





