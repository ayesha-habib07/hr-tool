"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Blend } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Account created successfully!", type: "success" });
        setForm({ name: "", email: "", password: "", organizationName: "" });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setMessage({ text: data.error || "Something went wrong", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light50 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">

        <div className="flex justify-between mb-10 leading-relaxed">
          <div>
            <h2 className="text-secondary-dark800 font-bold text-3xl">Sign Up</h2>
            <p className="text-grey-500 font-semibold ">Enter credentials to continue</p>
          </div>
          <div className="flex items-center">
            <p><Blend size={32} className="text-secondary-dark800" /></p>
          </div>
        </div>

        <h3 className="text-center mb-10 text-gray-900 font-medium">Sign up with email address</h3>
        {message && (
          <p
            className={`mb-4 text-sm text-center ${message.type === "success" ? "text-green-600" : "text-red-500"
              }`}
          >
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
              placeholder=""
            />
            <label
              htmlFor="name"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600">
              Full Name
            </label>

          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
              placeholder=""
            />
            <label htmlFor="email" className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600">
              Email Address / Username
            </label>

          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
              placeholder="••••••••"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600">
              Password
            </label>

          </div>

          <div className="relative">
            <input
              type="text"
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
              required
              className="peer w-full border-2 border-grey-500 rounded px-3 pt-5 pb-2 focus:border-primary-dark600 focus:outline-none"
              placeholder=""
            />
            <label
              htmlFor="organizationName"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600">Organization Name</label>

          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 accent-primary-main text-primary-main border-gray-300 rounded"

            />
            <p className="text-grey-900 font-medium">Agree with <span className="underline">Terms & Condition</span></p>
          </div>
          <button
            type="submit"
            disabled={loading}

            className="w-full cursor-pointer bg-secondary-dark800 hover:bg-secondary-dark600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-right text-sm text-grey-500 cursor-pointer">
            Have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
