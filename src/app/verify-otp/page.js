// 'use client'
// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import OTPInput from "../../components/OTPInput";

// export default function VerifyPage() {
//     const router = useRouter();
//     const params = useSearchParams();
//     const email = params?.get("email") || "";
//     const [msg, setMsg] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleComplete = async (otp) => {
//         setLoading(true);
//         const res = await fetch("/api/auth/verify-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, otp }),
//         });
//         const data = await res.json();
//         setLoading(false);
//         if (res.ok) {
//             router.push("/dashboard"); // or login
//         } else {
//             setMsg(data.error || "Verification failed");
//         }
//     };

//     return (

//         <>
//             <main style={{ padding: 24 }} >
//                 <h1>Verify your account</h1>
//                 <p>Enter the 6-digit code sent to <b>{email}</b></p>
//                 <OTPInput onComplete={handleComplete} />
//                 {loading && <p>Checking...</p>}
//                 {msg && <p style={{ color: "red" }}>{msg}</p>}
//             </main>
//         </>
//     )

// }


"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import OTPInput from "../../components/OTPInput";
import { Blend } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState(null); // "success" | "error" | null

    // const handleComplete = async (otp) => {
    //     setLoading(true);
    //     setMsg("");
    //     setStatus(null);

    //     try {
    //         const res = await fetch("/api/auth/verify-otp", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email, otp }),
    //         });

    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.error || "Verification failed");

    //         setStatus("success");
    //         setMsg("✅ Verified successfully! Redirecting...");
    //         // setTimeout(() => {
    //         //     window.location.href = "/dashboard";
    //         // }, 1500);
    //         // ✅ Redirect (cookie already stores token)
    //         router.push("/dashboard");

    //     } catch (err) {
    //         console.error("OTP verification error:", err); 
    //         setStatus("error");
    //         setMsg("❌ Invalid or expired OTP. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
   

    const handleComplete = async (otp) => {
  setLoading(true);
  setMsg("");
  setStatus(null);

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Invalid or expired OTP");
    }

    setStatus("success");
    setMsg("✅ Verified successfully! Redirecting...");
    router.push("/dashboard");
  } catch (err) {
    setStatus("error");
    setMsg(err.message);
  } finally {
    setLoading(false);
  }
};

    const handleResend = async () => {
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Failed to resend OTP");
            const data = await res.json();
            setMsg(data.message);
        } catch (err) {
            console.error("❌ Failed to resend OTP", err);
            setMsg("❌ Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };


    return (

        <>

            <div className="min-h-screen flex items-center justify-center bg-primary-light50 px-4">
                <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">

                    <div className="flex justify-between mb-10 leading-relaxed">
                        <div>
                            <h2 className="text-secondary-dark800 font-bold text-3xl">Verification Code</h2>
                            <p className="text-grey-500 font-semibold ">We send you on mail.</p>
                        </div>
                        <div className="flex items-center">
                            <p><Blend size={32} className="text-secondary-dark800" /></p>
                        </div>
                    </div>
                    <h3 className="text-center mb-10 text-gray-900 font-medium">
                        We’ve sent a code to{" "}
                        <span className="font-semibold">
                            {email
                                ? email.replace(/(.{2}).+(@.+)/, "$1****$2")
                                : "your email"}
                        </span>
                    </h3>
                    <OTPInput onComplete={handleComplete} />
                    {loading && (
                        <p style={{ marginTop: 20, color: "#00bcd4", fontSize: 14 }}>
                            ⏳ Processing...
                        </p>

                    )}
                    {msg && (
                        <p
                            style={{
                                marginTop: 20,
                                fontSize: 14,
                                color: status === "success" ? "#4caf50" : "#f44336",
                                fontWeight: 500,
                                transition: "color 0.3s ease",
                            }}
                        >
                            {msg}
                        </p>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        disabled={loading}

                        className="mb-5 mt-5  w-full cursor-pointer bg-secondary-dark800 hover:bg-secondary-dark600 text-white py-2 px-4 rounded font-semibold transition-all duration-300"
                    >
                        {loading ? "Contunue..." : "Continue"}
                    </button>
                    <p className="text-grey-500 font-semibold ">Did not receive the email? Check your spam filter, or.</p>
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        className="mb-5 mt-5  w-full cursor-pointer border-1 border-secondary-dark600 bg-white hover:bg-secondary-light50 text-secondary-dark600 py-2 px-4 rounded font-semibold transition-all duration-300"

                    >
                        Resend OTP
                    </button>
                </div>
            </div>



        </>
    );
}
