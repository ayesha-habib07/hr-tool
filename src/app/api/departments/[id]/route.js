import { NextResponse } from "next/server";
import { connectMongoose } from "../../../../lib/connectdb";
import departments from '../../../../lib/Departments';

export async function GET(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const department = await departments.findById(id);
        if (!department) {
            return NextResponse.json({ error: "department not found" }, { status: 404 });
        }
        return NextResponse.json(department, { status: 200 });
    } catch (err) {
        console.error('GET api/departments[id]  error', err);
    }
}


export async function PUT(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const body = await req.json();
        const updatedDepartment = await departments.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!updatedDepartment) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 });
        }
        return NextResponse.json(updatedDepartment, { status: 200 });
    } catch (err) {
        console.error("PUT /api/departments/${id} error", err);
    }
}
export async function DELETE(req, { params }) {
    try {
        await connectMongoose();
        const { id } = params;
        const deleted = await departments.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Department not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Department Deleted" }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/departments/${id}  error", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}
