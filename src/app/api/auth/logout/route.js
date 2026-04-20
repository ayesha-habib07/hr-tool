import { NextResponse } from "next/server";
export async function POST(){
    const res= NextResponse.json({
        success:true,
        message:'Logged out successfully!',
    });

    // clear the token cookie
    res.cookies.delete('token');
    return res;
}