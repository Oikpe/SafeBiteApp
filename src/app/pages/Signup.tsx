import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signUp, resendConfirmation } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await signUp(email, password);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    // Show confirmation pending view
    setConfirmationPending(true);
    setCooldown(60);
    setLoading(false);
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);

    const { error: resendError } = await resendConfirmation(email);
    if (resendError) {
      setError(resendError);
      setResendLoading(false);
      return;
    }

    setCooldown(60);
    setResendLoading(false);
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
              {confirmationPending ? "Check\nyour email" : "Create\naccount"}
            </h1>
            <p
              className="text-indigo-200/50"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              {confirmationPending
                ? "We sent a confirmation link to verify your email"
                : "Join SafeBite — eating safe starts here"}
            </p>
          </motion.div>

          {confirmationPending ? (
            /* ── Confirmation pending state ──────────────────────── */
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
                  <p className="text-white font-semibold text-[15px]">Confirmation email sent</p>
                  <p className="text-indigo-200/40 text-sm leading-relaxed">
                    Click the link we sent to{" "}
                    <span className="text-indigo-200/70 font-medium">{email}</span>{" "}
                    to verify your account
                  </p>
                </div>
              </div>

              {/* Resend button */}
              <motion.button
                type="button"
                disabled={cooldown > 0 || resendLoading}
                whileTap={{ scale: 0.97 }}
                onClick={handleResend}
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
                  : resendLoading
                    ? <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    : "Resend Confirmation Email"}
              </motion.button>

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

              {/* Back to login */}
              <p className="text-center text-sm text-indigo-200/35">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="text-indigo-300/70 hover:text-indigo-200 transition-colors font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          ) : (
            /* ── Sign up form ───────────────────────────────────────── */
            <>
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
                      id="signup-email"
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
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
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
                  id="signup-submit"
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
                    "Create Account"
                  )}
                </motion.button>
              </motion.form>

              {/* Sign in link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-center text-sm text-indigo-200/35 mt-8"
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-300/70 hover:text-indigo-200 transition-colors font-semibold"
                >
                  Sign In
                </Link>
              </motion.p>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

