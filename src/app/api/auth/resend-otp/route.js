import { NextResponse } from "next/server";
import { connectMongoose } from "../../../../lib/connectdb";
import User from "../../../../models/User";
import { sendOtpEmail } from "../../../../lib/mailer";
// export async function POST(req) {
//     try {
//         await connectDB()
//         const { email } = await req.json();
//         const user = await User.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
//         user.otp = otp;
//         user.otpExpiresAt = otpExpiresAt;
//         await user.save();

//         // send mail
//         await sendOtpEmail(user.email, otp);
//         return NextResponse.json({ message: 'New OTP sent successfully!' });
//     } catch (err) {
//         console.error("Resend OTP error:", err);
//         return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//     }
// }

export async function POST(req) {
  try {
    console.log("➡️ Resend OTP route hit");
    await connectMongoose();
    const { email } = await req.json();
    console.log("📧 Resending OTP for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    console.log("✅ New OTP generated:", otp);

    await sendOtpEmail(user.email, otp);

    console.log("✅ OTP email sent successfully");

    return NextResponse.json({ message: "New OTP sent successfully!" });
  } catch (err) {
    console.error("❌ Resend OTP error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}