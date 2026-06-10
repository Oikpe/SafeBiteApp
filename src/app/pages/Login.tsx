import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }
    navigate("/");
  };

  return (
    <MobileLayout noPadding>
      <div
        className="relative min-h-dvh flex flex-col justify-center px-7"
        style={{
          background:
            "radial-gradient(at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 55%), radial-gradient(at 70% 75%, rgba(139,92,246,0.10) 0%, transparent 55%), linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        }}
      >
        {/* Ambient orbs */}
        <div
          className="absolute w-[260px] h-[260px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            top: "-8%",
            right: "-15%",
          }}
        />
        <div
          className="absolute w-[180px] h-[180px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            bottom: "15%",
            left: "-10%",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1
              className="font-display text-white mb-3 whitespace-pre-line"
              style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em" }}
            >
              {"Welcome\nback"}
            </h1>
            <p
              className="text-indigo-200/50"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              Sign in to continue to SafeBite
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="text-xs font-medium text-indigo-200/70 mb-2 block pl-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/30" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-[15px] text-white placeholder:text-indigo-300/25 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1.5px solid rgba(255, 255, 255, 0.08)",
                    fontWeight: 500,
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-indigo-200/70 mb-2 block pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/30" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl text-[15px] text-white placeholder:text-indigo-300/25 outline-none transition-all focus:ring-2 focus:ring-indigo-500/40"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1.5px solid rgba(255, 255, 255, 0.08)",
                    fontWeight: 500,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/30 hover:text-indigo-200/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-300/50 hover:text-indigo-200 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-display text-[15px] font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? "rgba(99, 102, 241, 0.4)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 24px -4px rgba(99, 102, 241, 0.4)",
                letterSpacing: "-0.01em",
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>

          {/* Sign up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-sm text-indigo-200/35 mt-8"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-300/70 hover:text-indigo-200 transition-colors font-semibold"
            >
              Sign Up
            </Link>
          </motion.p>
        </div>
      </div>
    </MobileLayout>
  );
}
