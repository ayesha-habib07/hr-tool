'use client'
import { useState } from "react";
import { Blend } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit =async(e)=>{
        e.preventDefault();
        try{
            const res= await fetch('/api/auth/forgot-password',{
                method:'POST',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({email}),
            });
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.message);
                console.error('error while setting new password');
                return;
            }
            
            setEmail('');
        }catch(err){
            console.error('failed set forget password', err);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-light50 px-4">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10">

                <div className="flex justify-between mb-10">
                    <div>
                        <h2 className="text-secondary-dark800 font-bold text-3xl">Forgot Password?</h2>
                        <p className="text-grey-500 font-semibold ">Enter credentials to continue</p>

                    </div>
                    <div>
                        <h2>
                            <p><Blend size={32} className="text-secondary-dark800" /></p>
                        </h2>
                    </div>
                </div>
                <p className=" mb-10 text-grey-700 font-medium">Enter your email address below and we will send you password reset OTP.</p>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 max-w-md mx-auto"
                >
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
                            placeholder=""
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
                        >
                            Email Address / Username
                        </label>
                    </div>
                   
                    <button
                        type="submit"
                        className="bg-secondary-dark800 hover:bg-secondary-dark600 text-white py-2 rounded cursor-pointer"
                    >
                        Send Mail
                    </button>
                    <p className="text-right text-sm text-grey-500 cursor-pointer">{"Don't have an account?"}</p>

                </form>
            </div>
        </div>
    );
}