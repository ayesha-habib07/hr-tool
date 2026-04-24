import { NextResponse } from "next/server";
import { connectMongoose } from "../../../../lib/connectDB";
import User from "../../../../models/User";
import crypto from "crypto";

export async function POST(req){
    try{
        await connectMongoose();
        const {email} = await req.json();
        if(!email){
            return NextResponse.json(
                {success:false, message:'Email is required'},
                {status:500}
            );
        }
        const user = await user.findOne({email});
        if(!user){
            return NextResponse.json(
                {success:false, message:'No user found with thi email'},
                {status:500}
            );
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP=  otp;
        user.resetPasswordExpires= Date.now() + 15 * 60 * 1000    //15 mints
        await user.save();

        return NextResponse.json(
            {success:false, message:'server error'},
            {status:500}
        );
    }catch(err){
        console.error("Forgot password error:", err);
        return NextResponse.json(
            {success:false, message:'server error'}, {status:500}
        );
    }
}