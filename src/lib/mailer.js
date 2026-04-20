// import nodemailer from "nodemailer";

// export async function sendOtpEmail(to, otp) {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT || 587),
//         auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     });
//     await transporter.sendMail({
//         from: process.env.SMTP_FROM || 'no reply to the mail',
//         to,
//         subject: "Your verification code",
//         text: `Your verification code is ${otp}. It expires in 15 minutes.`,
//         html: `<p>Your verification code is <b>${otp}</b>. It expires in 15 minutes.</p>`
//     })

// }

// import nodemailer from "nodemailer";

// export async function sendOtpEmail(to, otp) {
//   const testAccount = await nodemailer.createTestAccount(); // 👈 creates fake SMTP
//   const transporter = nodemailer.createTransport({
//     host: testAccount.smtp.host,
//     port: testAccount.smtp.port,
//     secure: testAccount.smtp.secure,
//     auth: { user: testAccount.user, pass: testAccount.pass },
//   });

//   const info = await transporter.sendMail({
//     from: 'no-reply@example.com',
//     to,
//     subject: "Your verification code",
//     text: `Your verification code is ${otp}`,
//     html: `<p>Your verification code is <b>${otp}</b></p>`,
//   });

//   console.log("Preview URL: ", nodemailer.getTestMessageUrl(info)); // 👈 Open this link in your browser
// }



// lib/mailer.js
import nodemailer from "nodemailer";

export async function sendOtpEmail(to, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "no-reply@example.com",
      to,
      subject: "Your verification code",
      text: `Your verification code is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in 15 minutes.</p>`,
    });

    // 👇 This line gives you a preview URL to open the email in your browser
    console.log("📧 Preview email URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

