'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pt-20 md:pt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-600/20 to-black/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-600/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-black-400/50 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>
      </div>

      {/* Main signup container */}
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-black via-emerald-600 to-white/50 rounded-2xl blur opacity-20 animate-pulse"></div>

        {/* Signup card */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-green-600/20 to-white/10 rounded-xl blur transition-opacity duration-300 ${
                  focusedField === "name" ? "opacity-50" : "opacity-0"
                }`}
              ></div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User
                    className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === "name"
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-green-400/50 focus:outline-none transition-all duration-300"
                />
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 ${
                    focusedField === "name" ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-green-600/20 to-white/10 rounded-xl blur transition-opacity duration-300 ${
                  focusedField === "email" ? "opacity-50" : "opacity-0"
                }`}
              ></div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail
                    className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === "email"
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-green-400/50 focus:outline-none transition-all duration-300"
                />
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-300 ${
                    focusedField === "email" ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-white/10 rounded-xl blur transition-opacity duration-300 ${
                  focusedField === "password" ? "opacity-50" : "opacity-0"
                }`}
              ></div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock
                    className={`w-5 h-5 transition-colors duration-300 ${
                      focusedField === "password"
                        ? "text-emerald-400"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-white/10 focus:border-emerald-400/50 focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-300 ${
                    focusedField === "password" ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-in slide-in-from-left duration-300">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 hover:from-green-500 hover:via-emerald-500 hover:to-green-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>

            {/* Login link */}
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-300 text-xs text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors duration-300 font-medium">
                  Login here
                </Link>{" "}
              </p>
            </div>
          </form>

          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-white/60 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full opacity-40 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}