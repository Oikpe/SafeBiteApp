import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || cooldown > 0) return;

    setLoading(true);
    setError(null);

    const { error: authError } = await resetPassword(email);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    setSent(true);
    setCooldown(60);
    setLoading(false);
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
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-300/50 hover:text-indigo-200 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </motion.div>

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
              {"Reset\npassword"}
            </h1>
            <p
              className="text-indigo-200/50"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              Enter your email and we'll send you a link to reset your password
            </p>
          </motion.div>

          {sent ? (
            /* ── Success state ──────────────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-5"
            >
              <div
                className="flex flex-col items-center gap-4 py-8 px-6 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1.5px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(34, 197, 94, 0.15)" }}
                >
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-[15px]">Check your email</p>
                  <p className="text-indigo-200/40 text-sm leading-relaxed">
                    We sent a password reset link to{" "}
                    <span className="text-indigo-200/70 font-medium">{email}</span>
                  </p>
                </div>
              </div>

              {/* Resend button */}
              <motion.button
                type="button"
                disabled={cooldown > 0 || loading}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl font-display text-[15px] font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: cooldown > 0
                    ? "rgba(99, 102, 241, 0.2)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: cooldown > 0
                    ? "none"
                    : "0 8px 24px -4px rgba(99, 102, 241, 0.4)",
                  letterSpacing: "-0.01em",
                }}
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : loading
                    ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    : "Resend Email"}
              </motion.button>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          ) : (
            /* ── Form state ─────────────────────────────────────────── */
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
                    id="forgot-email"
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
                id="forgot-submit"
                type="submit"
                disabled={loading || !email.trim()}
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
                  "Send Reset Link"
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
