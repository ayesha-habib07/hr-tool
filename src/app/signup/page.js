"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Blend } from 'lucide-react';
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState('');
  const [agreeError, setAgreeError] = useState();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setAgreeError('You must agree to the Terms & Conditions before signing up.');
      return;
    }
    setAgreeError("");
    setError('');
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
          router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
        }, 1000);
        //         if (res.ok) {
        //   router.push(`/verify?email=${encodeURIComponent(email)}`);
        // }
      } else {
        setMessage({ text: data.error || "Something went wrong", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Server error", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
    }
    else {
      setError('');
    }
  }
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
            {/* Password Input */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={
                (e) => {
                  handleChange(e)
                  validatePassword(e.target.value);
                }
              }
              required
              className={`peer w-full border-2 rounded px-3 pt-5 pb-2 pr-10 focus:outline-none 
          ${error ? "border-red-500" : "border-gray-300 focus:border-primary-dark600"}
        `}
              placeholder="••••••••"
            />

            {/* Label */}
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-gray-500 text-xs transition-colors peer-focus:text-primary-dark600"
            >
              Password
            </label>

            {/* Toggle Visibility Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}

              className="absolute right-3 top-3 text-gray-500 hover:text-primary-dark600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 accent-primary-main text-primary-main border-gray-300 rounded"

            />
            <p className="text-grey-900 font-medium">Agree with <span className="underline">Terms & Condition</span></p>
            {agreeError && <p className="text-red-500 text-xs">{agreeError}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            //  disabled={!agree}

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
