"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Blend } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Login failed:", data.error);
        return;
      }

      // Cookie is set automatically
      router.push("/dashboard");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light50 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10">

        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-secondary-dark800 font-bold text-3xl">Hi, Welcome Back</h2>
            <p className="text-grey-500 font-semibold ">Login to your account</p>

          </div>
          <div>
            <h2> <p><Blend size={32} className="text-secondary-dark800" /></p></h2>
          </div>
        </div>
        <h3 className="text-center mb-10 text-gray-900 font-medium">Sign in with email address</h3>
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
          <div className="relative w-full">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="peer border-2 border-grey-500 rounded px-3 pt-6 pb-2 w-full focus:outline-none focus:border-primary-dark600"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
            >
              Password
            </label>
          </div>
          <div className="flex justify-between text-sm text-gray-600 ">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 accent-primary-main text-primary-main border-gray-300 rounded"

              />
              <p className="text-grey-500">Remember me</p>
            </div>
            <div>
              <p className="cursor-pointer text-secondary-dark600">Forgot Password?</p>
            </div>
          </div>
          <button
            type="submit"
            className="bg-secondary-dark800 hover:bg-secondary-dark600 text-white py-2 rounded cursor-pointer"
          >
            Sign In
          </button>
          <p className="text-right text-sm text-grey-500 cursor-pointer">{"Don't have an account?"}</p>

        </form>
      </div>
    </div>
  );
}
