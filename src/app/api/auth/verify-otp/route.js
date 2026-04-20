// import { NextResponse } from "next/server";
// import { connectDB } from "../../../../lib/connectDB";
// import User from "../../../../models/User";
// import jwt from "jsonwebtoken";

// // export async function POST(req) {
// //     const { email, otp } = await req.json();
// //     await connectDB();

// //     const user = await User.findOne({ email });
// //     if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
// //     if (user.isVerified) return NextResponse.json({ message: 'Already verified' }, { status: 200 });
// //     if (!user.otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
// //         return NextResponse.json({ error: 'OTP expired, Request a new one' }, { status: 400 });
// //     }
// //     if (user.otp !== otp) {
// //         return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
// //     }
// //     user.isVerified = true;
// //     user.otp = undefined;
// //     user.otpExpiresAt = undefined;
// //     await user.save();

// //     return NextResponse.json({ success: true, message: "Account verified" }, { status: 200 });
// // }


// export async function POST(req) {
//   try {
//     await connectDB();
//     const { email, otp } = await req.json();

//     const user = await User.findOne({ email });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     // 1️⃣ Check expiration first
//     if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
//       return NextResponse.json({ error: "OTP expired" }, { status: 400 });

//     // 2️⃣ Check if OTP matches
//     if (user.otp !== otp)
//       return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

//     // ✅ Update user
//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiresAt = null;
//     await user.save();

//     // ✅ Generate JWT and set cookie
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     const res = NextResponse.json({
//       message: "Account verified successfully!",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 7 * 24 * 60 * 60,
//     });

//     return res;
//   } catch (err) {
//     console.error("❌ Verify OTP error:", err);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connectMongoose } from "../../../../lib/connectdb";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectMongoose();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    // 1 Check OTP expiration
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });

    // 2Check OTP match
    if (user.otp !== otp)
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });

    // Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        success: true,
        message: "Account verified successfully!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    //  Set auth cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
