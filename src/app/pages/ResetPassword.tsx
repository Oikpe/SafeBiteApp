import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { MobileLayout } from "../components/MobileLayout";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const checkedToken = useRef(false);

  // Verify we have a valid recovery session
  useEffect(() => {
    if (checkedToken.current) return;
    checkedToken.current = true;

    // Supabase automatically picks up the token from the URL hash and creates
    // a session via the onAuthStateChange listener. We need to wait a short
    // moment for that to process. If after 3 seconds there's no session, the
    // link is invalid or expired.
    const timer = setTimeout(() => {
      if (!session) {
        setTokenError(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [session]);

  // Clear token error once session appears
  useEffect(() => {
    if (session) setTokenError(false);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !confirmPassword.trim()) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await updatePassword(password);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to home after 2 seconds
    setTimeout(() => navigate("/"), 2000);
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
              {"Set new\npassword"}
            </h1>
            <p
              className="text-indigo-200/50"
              style={{ fontSize: 15, lineHeight: 1.6 }}
            >
              Choose a strong password for your account
            </p>
          </motion.div>

          {tokenError ? (
            /* ── Invalid/expired token ────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
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
                  style={{ background: "rgba(245, 158, 11, 0.15)" }}
                >
                  <AlertTriangle className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-[15px]">Link expired or invalid</p>
                  <p className="text-indigo-200/40 text-sm leading-relaxed">
                    This password reset link has expired or is no longer valid. Please request a new one.
                  </p>
                </div>
              </div>
              <Link
                to="/forgot-password"
                className="block w-full py-4 rounded-2xl font-display text-[15px] font-bold text-white text-center transition-all"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.4)",
                  letterSpacing: "-0.01em",
                }}
              >
                Request New Link
              </Link>
            </motion.div>
          ) : success ? (
            /* ── Success state ────────────────────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
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
                  <p className="text-white font-semibold text-[15px]">Password updated!</p>
                  <p className="text-indigo-200/40 text-sm leading-relaxed">
                    Redirecting you to the app…
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Form ─────────────────────────────────────────────── */
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div>
                <label className="text-xs font-medium text-indigo-200/70 mb-2 block pl-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/30" />
                  <input
                    id="reset-password"
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

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-indigo-200/70 mb-2 block pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-indigo-300/30" />
                  <input
                    id="reset-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
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
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/30 hover:text-indigo-200/60 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
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
                id="reset-submit"
                type="submit"
                disabled={loading || !password.trim() || !confirmPassword.trim()}
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
                  "Update Password"
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
