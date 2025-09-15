import { connectDB } from '../../../lib/connectDB';
import Permission from "../../../models/Permission";



export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (!role) {
      return new Response(JSON.stringify({ error: "Role is required" }), { status: 400 });
    }

    const rolePermissions = await Permission.findOne({ role });
    return new Response(JSON.stringify(rolePermissions?.permissions || []), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch permissions" }), { status: 500 });
  }
}

