import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function AdminLoginPage() {
  const [email, setEmail] = useState("admin@enviaar.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin/products";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back! Logged in successfully.");
        navigate(from, { replace: true });
      } else {
        setError("Invalid credentials. Try admin@enviaar.com and admin123");
        toast.error("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-900 font-sans">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-amber-300 shadow-inner">
            <img src="/image-copy.png" alt="ENVIAAR Logo" className="h-9 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your store dashboard, inventory & orders
          </p>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-2xl text-xs space-y-1 text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <ShieldCheck className="h-4 w-4" /> Demo Access Credentials:
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Email: <span className="text-white">admin@enviaar.com</span> | Password: <span className="text-white">admin123</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@enviaar.com"
                className="w-full h-11 pl-10 pr-4 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-10 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-amber-400 focus:ring-amber-400 bg-slate-800" />
              Remember this device
            </label>
            <a href="#" className="text-amber-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 font-semibold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-lg shadow-amber-400/10 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign in to Dashboard"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-400 transition">
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
