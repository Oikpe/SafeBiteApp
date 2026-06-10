// ─── Profile Page ─────────────────────────────────────────────────────────────
// Orchestrates the profile screen by composing focused sub-components.
// All business logic lives in sub-components and hooks — this file
// handles only top-level state for modals and the add-member form.

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { getTokens } from "../utils/theme";
import { T } from "../i18n/translations";


// ── Sub-components ────────────────────────────────────────────────────────────
import { AllergyGrid } from "../components/profile/AllergyGrid";
import { FamilyMemberList } from "../components/profile/FamilyMemberList";
import { SettingsSection } from "../components/profile/SettingsSection";
import { ThemeModal } from "../components/profile/ThemeModal";
import { LanguageModal } from "../components/profile/LanguageModal";
import { AddMemberModal } from "../components/profile/AddMemberModal";

// ── Icons ─────────────────────────────────────────────────────────────────────
import { User, Pencil, LogOut } from "lucide-react";
import { getInitials } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const {
    currentUser, mode, allergies,
    addFamilyMember, theme, setTheme, language, setLanguage,
  } = useApp();
  const { signOut } = useAuth();

  const tk = getTokens(theme);
  const t = T[language];

  const [showAddMember, setShowAddMember] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const handleAddMember = (name: string, allergies: string[]) => {
    addFamilyMember({
      id: `fm-${Date.now()}`,
      name,
      avatar: name.charAt(0).toUpperCase(),
      allergies,
    });
  };

  return (
    <MobileLayout noPadding withNav>
      <div
        className="min-h-dvh pb-36 overflow-y-auto no-scrollbar transition-colors duration-500"
        style={{ background: tk.pageBg }}
      >
        <div className="px-6 pt-14 pb-5">
          {/* ── Page header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-7"
          >
            <h1
              className="font-display"
              style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.035em", color: tk.textPrimary }}
            >
              {t.profile}
            </h1>
          </motion.div>

          {/* ── Profile card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="glass-elevated rounded-[22px] p-5 mb-6 overflow-hidden relative"
          >
            <div
              className="absolute top-0 right-0 w-[130px] h-[130px] rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{
                background: mode === "family"
                  ? "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex items-center gap-4">
              <div
                className="w-[58px] h-[58px] rounded-[18px] flex items-center justify-center shrink-0"
                style={{ background: tk.avatarBg, boxShadow: `0 6px 20px -4px ${tk.avatarShadow}` }}
              >
                <span
                  className="text-white font-display"
                  style={{ fontSize: currentUser.length > 2 ? 18 : 22, fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  {currentUser ? getInitials(currentUser) : <User size={22} strokeWidth={1.7} />}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display mb-1.5 truncate" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.025em", color: tk.textPrimary }}>
                  {currentUser || "Your Name"}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="px-2.5 py-[3px] rounded-[8px] font-display"
                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase", background: tk.accentBg, color: tk.accentText }}
                  >
                    {mode === "family" ? t.familyPlan : t.personalPlan}
                  </div>
                  <span className="font-display" style={{ fontSize: 12, fontWeight: 500, color: tk.textTertiary }}>
                    {allergies.length} {t.allergies}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/profile/edit")}
                className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
                style={{ background: tk.accentBg, border: `1px solid ${tk.accentBorder}` }}
                whileTap={{ scale: 0.88 }}
              >
                <Pencil size={14} style={{ color: tk.accentText }} strokeWidth={2.2} />
              </motion.button>
            </div>
          </motion.div>

          {/* ── Allergy grid ── */}
          <AllergyGrid tk={tk} language={language} t={t} />

          {/* ── Family members (family mode only) ── */}
          {mode === "family" && (
            <FamilyMemberList
              tk={tk}
              language={language}
              onAddMember={() => setShowAddMember(true)}
              t={t}
            />
          )}

          {/* ── Settings ── */}
          <SettingsSection
            tk={tk}
            theme={theme}
            language={language}
            onOpenLang={() => setShowLangModal(true)}
            onOpenTheme={() => setShowThemeModal(true)}
            t={t}
          />

          {/* ── Sign out ── */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 }}
            onClick={async () => {
              await signOut();
              // AuthGuard will automatically redirect to /login
            }}
            className="w-full flex items-center justify-center gap-2.5 py-[14px] rounded-[16px] font-display transition-colors"
            style={{ fontSize: 14, fontWeight: 700, border: `1.5px solid ${tk.signOutBorder}`, color: tk.signOutText }}
            whileTap={{ scale: 0.975 }}
          >
            <LogOut size={16} strokeWidth={2} />
            {t.signOut}
          </motion.button>
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddMember}
        tk={tk}
        onClose={() => setShowAddMember(false)}
        onAdd={handleAddMember}
      />
      <ThemeModal
        isOpen={showThemeModal}
        theme={theme}
        tk={tk}
        onClose={() => setShowThemeModal(false)}
        onSelect={setTheme}
        t={t}
      />
      <LanguageModal
        isOpen={showLangModal}
        language={language}
        tk={tk}
        onClose={() => setShowLangModal(false)}
        onSelect={setLanguage}
        t={t}
      />
    </MobileLayout>
  );
}