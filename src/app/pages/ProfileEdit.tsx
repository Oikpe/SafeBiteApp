import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { getTokens } from "../utils/theme";
import { T } from "../i18n/translations";
import { ArrowLeft, Check, User } from "lucide-react";
import { getInitials } from "../utils/helpers";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, theme, language } = useApp();
  const tk = getTokens(theme);
  const t = T[language];

  const [nameValue, setNameValue] = useState(currentUser);

  const hasChanged = nameValue.trim() && nameValue.trim() !== currentUser;

  const handleSave = () => {
    if (nameValue.trim()) {
      setCurrentUser(nameValue.trim());
      navigate("/profile");
    }
  };

  return (
    <MobileLayout noPadding>
      <div
        className="min-h-dvh transition-colors duration-500"
        style={{ background: tk.pageBg }}
      >
        <div className="px-6 pt-14">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-10">
            <motion.button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: tk.cardBg, border: `1px solid ${tk.cardBorder}` }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={17} style={{ color: tk.textSecondary }} strokeWidth={2} />
            </motion.button>
            <h1
              className="font-display"
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.025em", color: tk.textPrimary }}
            >
              {t.editName}
            </h1>
          </div>

          {/* Avatar preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex justify-center mb-10"
          >
            <div className="relative">
              <div
                className="w-[90px] h-[90px] rounded-[26px] flex items-center justify-center"
                style={{
                  background: tk.avatarBg,
                  boxShadow: `0 10px 36px -6px ${tk.avatarShadow}`,
                }}
              >
                <span
                  className="text-white font-display"
                  style={{
                    fontSize: nameValue.trim().length > 2 ? 26 : 32,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {nameValue.trim() ? getInitials(nameValue.trim()) : <User size={36} strokeWidth={1.5} />}
                </span>
              </div>
              {/* Glow */}
              <div
                className="absolute -inset-3 rounded-[32px] blur-xl opacity-20 pointer-events-none"
                style={{ background: tk.avatarBg }}
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="glass-elevated rounded-[22px] p-5 mb-6"
          >
            <label
              className="font-display block mb-2.5"
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: tk.textTertiary,
              }}
            >
              {t.name}
            </label>
            <div className="relative">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder={t.namePlaceholder}
                className="w-full rounded-[14px] py-[14px] px-4 pr-12 outline-none font-display transition-all duration-300"
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  background: tk.inputBg,
                  border: `1.5px solid ${nameValue !== currentUser && nameValue.trim() ? tk.inputFocusBorder : tk.inputBorder}`,
                  color: tk.inputText,
                  boxShadow:
                    nameValue !== currentUser && nameValue.trim()
                      ? `0 0 0 4px ${theme === "dark" ? "rgba(129,140,248,0.08)" : "rgba(99,102,241,0.06)"}`
                      : "none",
                }}
                autoCapitalize="words"
                autoFocus
              />
              {nameValue.trim() && nameValue !== currentUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: tk.accentBg }}
                >
                  <Check size={12} style={{ color: tk.accentText }} strokeWidth={3} />
                </motion.div>
              )}
            </div>

            {/* Character count */}
            <div className="flex justify-end mt-2">
              <span
                className="font-display"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: nameValue.length > 30 ? "#ef4444" : tk.textTertiary,
                }}
              >
                {nameValue.length}/30
              </span>
            </div>
          </motion.div>

          {/* Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="font-display text-center mb-8"
            style={{ fontSize: 12.5, fontWeight: 500, color: tk.textTertiary, lineHeight: 1.6 }}
          >
            {t.nameAppearsProfile}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              onClick={handleSave}
              disabled={!nameValue.trim() || nameValue.length > 30}
              className="w-full flex items-center justify-center gap-2.5 py-[15px] rounded-2xl font-display transition-all duration-300"
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                ...(hasChanged && nameValue.length <= 30
                  ? {
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "#ffffff",
                      boxShadow: "0 8px 24px -4px rgba(99,102,241,0.35)",
                    }
                  : {
                      background: tk.tileBg,
                      color: tk.textTertiary,
                    }),
              }}
              whileTap={hasChanged ? { scale: 0.975 } : undefined}
            >
              <Check size={17} strokeWidth={2.5} />
              {t.save}
            </motion.button>

            <motion.button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center justify-center py-[14px] rounded-2xl font-display transition-colors"
              style={{
                fontSize: 14,
                fontWeight: 600,
                background: "transparent",
                color: tk.textSecondary,
              }}
              whileTap={{ scale: 0.97 }}
            >
              {t.cancel}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </MobileLayout>
  );
}
