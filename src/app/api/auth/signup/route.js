// import clientPromise from "../../../../lib/connectdb";
import { connectDB } from "../../../../lib/mongoose";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import Organization from "../../../../models/Organization";
import jwt from "jsonwebtoken";
import Role from "../../../../models/Role";
import { sendOtpEmail } from "../../../../lib/mailer";


// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//       orgId: user.organizationId?.toString(),
//       role: user.role,
//       name: user.name
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "5d" }
//   );
// };

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { name, email, password, organizationName } = await req.json();
//     if (!name || !email || !password || !organizationName) {
//       return NextResponse.json(
//         { error: "All fields required" },
//         { status: 400 }
//       );
//     }


//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }
//     // Find or create organization
//     let org = await Organization.findOne({ name: organizationName });
//     if (!org) {
//       org = await Organization.create({ name: organizationName });
//     }

//     // Check if this is the first user in the org
//     const isFirstUser = !(await User.findOne({ organizationId: org._id }));

//     let roleDocs;

//     if (isFirstUser) {
//       roleDocs = await Role.findOne({ name: "Admin" });
//       if (!roleDocs) {
//         // Auto-create admin role if missing
//         roleDocs = await Role.create({ name: "Admin" });
//       }
//     } else {

//       return NextResponse.json(
//         { error: "Only admin can add members. Please contact your admin." },
//         { status: 400 }
//       );
//     }


//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
//     // Creating new user
//     const newUser = await User.create({
//       otp,
//       otpExpiresAt,
//       isVerified: false,
//       name,
//       email,
//       password: hashedPassword,
//       organizationId: org._id,
//       role: roleDocs._id,
//     });

//     // // send email
//     // try { await sendOtpEmail(email, otp); }
//     // catch (err) { console.error(err, "send otp error in signup route.") }
//     console.log("📧 Sending OTP to:", email, "OTP:", otp);
//     await sendOtpEmail(email, otp);
//     console.log("✅ OTP email sent");



//     const token = generateToken({
//       _id: newUser._id,
//       email: newUser.email,
//       role: roleDocs.name,
//       name: newUser.name,
//     });

//     const redirectTo = "/dashboard";
//     // Set cookie and return response
//     const response = NextResponse.json({
//       message: "User created successfully",
//       role: roleDocs.name,
//       redirectTo,
//     });

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 24 * 60 * 60,
//     });

//     // return NextResponse.json({ success: true, email: newUser.email }, { status: 201 });
//     return new Response(
//       JSON.stringify({ message: "OTP sent to your email." }),
//       { status: 200 }
//     );
//   }
//   catch (err) {
//     console.error("Signup error:", err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      orgId: user.organizationId?.toString(),
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
};

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, organizationName } = await req.json();
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    let org = await Organization.findOne({ name: organizationName });
    if (!org) {
      org = await Organization.create({ name: organizationName });
    }

    const isFirstUser = !(await User.findOne({ organizationId: org._id }));
    let roleDocs;
    if (isFirstUser) {
      roleDocs = await Role.findOne({ name: "Admin" }) || await Role.create({ name: "Admin" });
    } else {
      return NextResponse.json(
        { error: "Only admin can add members. Please contact your admin." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = await User.create({
      otp,
      otpExpiresAt,
      isVerified: false,
      name,
      email,
      password: hashedPassword,
      organizationId: org._id,
      role: roleDocs._id,
    });

    console.log("📧 Sending OTP to:", email, "OTP:", otp);
    await sendOtpEmail(email, otp);
    console.log("✅ OTP email sent");

    const token = generateToken({
      _id: newUser._id,
      email: newUser.email,
      role: roleDocs.name,
      name: newUser.name,
    });

    const response = NextResponse.json({
      message: "OTP sent to your email",
      role: roleDocs.name,
      redirectTo: "/verify",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
