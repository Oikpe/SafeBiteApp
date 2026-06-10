import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp, ALLERGY_LIST, MEMBER_COLORS } from "../context/AppContext";
import { getTokens } from "../utils/theme";
import { T } from "../i18n/translations";
import { ArrowLeft, Check, Trash2, AlertTriangle, Shield, X } from "lucide-react";
import { severityStyle as getSeverityStyle, severityLabel as getSeverityLabel } from "../utils/helpers";
import { SORTED_ALLERGY_LIST } from "../constants/allergies";

export default function FamilyMemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { familyMembers, updateFamilyMember, removeFamilyMember, theme, language } = useApp();

  const tk = getTokens(theme);
  const t = T[language];

  const member = familyMembers.find((m) => m.id === id);

  const [editName, setEditName] = useState(member?.name ?? "");
  const [editAllergies, setEditAllergies] = useState<string[]>(member?.allergies ?? []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!member) {
    return (
      <MobileLayout noPadding>
        <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center" style={{ background: tk.pageBg }}>
          <AlertTriangle size={36} style={{ color: tk.textTertiary }} strokeWidth={1.5} className="mb-4" />
          <p className="font-display" style={{ fontSize: 16, color: tk.textSecondary }}>{t.memberNotFound}</p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-6 font-display"
            style={{ fontSize: 14, fontWeight: 600, color: tk.accentText }}
          >
            {t.backToProfile}
          </button>
        </div>
      </MobileLayout>
    );
  }

  const color = MEMBER_COLORS[member.colorIndex % MEMBER_COLORS.length];
  const hasChanges =
    editName.trim() !== member.name ||
    JSON.stringify([...editAllergies].sort()) !== JSON.stringify([...member.allergies].sort());

  const handleSave = () => {
    if (!editName.trim()) return;
    updateFamilyMember(member.id, {
      name: editName.trim(),
      allergies: editAllergies,
    });
    navigate("/profile");
  };

  const handleDelete = () => {
    removeFamilyMember(member.id);
    navigate("/profile");
  };

  const toggleEditAllergy = (allergyId: string) => {
    setEditAllergies((prev) =>
      prev.includes(allergyId) ? prev.filter((a) => a !== allergyId) : [...prev, allergyId]
    );
  };

  const severityStyle = (sev: "high" | "moderate" | "low") => getSeverityStyle(sev, tk);
  const severityLabel = (sev: "high" | "moderate" | "low") => getSeverityLabel(sev, t);

  return (
    <MobileLayout noPadding>
      <div
        className="min-h-dvh pb-10 overflow-y-auto no-scrollbar transition-colors duration-500"
        style={{ background: tk.pageBg }}
      >
        <div className="px-6 pt-14">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3.5">
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
                {t.editMember}
              </h1>
            </div>
            {/* Delete button */}
            <motion.button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)" }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={15} className="text-red-400" strokeWidth={2} />
            </motion.button>
          </div>

          {/* Member avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div
                className="w-[80px] h-[80px] rounded-[24px] flex items-center justify-center"
                style={{ background: color.bg, boxShadow: `0 10px 32px -6px ${color.shadow}` }}
              >
                <span className="text-white font-display" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>
                  {editName.charAt(0).toUpperCase() || member.avatar}
                </span>
              </div>
              <div
                className="absolute -inset-3 rounded-[30px] blur-xl opacity-25 pointer-events-none"
                style={{ background: color.bg }}
              />
            </div>
          </motion.div>

          {/* Name field */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="glass-elevated rounded-[22px] p-5 mb-6"
          >
            <label
              className="font-display block mb-2.5"
              style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: tk.textTertiary }}
            >
              {t.memberName}
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={t.memberNamePlaceholder}
              className="w-full rounded-[14px] py-[14px] px-4 outline-none font-display transition-all duration-300"
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                background: tk.inputBg,
                border: `1.5px solid ${editName.trim() && editName !== member.name ? tk.inputFocusBorder : tk.inputBorder}`,
                color: tk.inputText,
              }}
              autoCapitalize="words"
            />
          </motion.div>

          {/* Allergies section */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="mb-7"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Shield size={13} style={{ color: tk.sectionLabel }} strokeWidth={2.2} />
                <span
                  className="font-display"
                  style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: tk.sectionLabel }}
                >
                  {t.memberAllergies}
                </span>
              </div>
              {editAllergies.length > 0 && (
                <span
                  className="font-display px-2.5 py-1 rounded-full"
                  style={{ fontSize: 11, fontWeight: 700, background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                >
                  {editAllergies.length} {t.activeLabels}
                </span>
              )}
            </div>

            {/* IMPORTANT: These are this member's own allergies — isolated from parent user */}
            <div className="grid grid-cols-2 gap-2.5">
              {SORTED_ALLERGY_LIST.map((allergy, i) => {
                const isActive = editAllergies.includes(allergy.id);
                const sev = severityStyle(allergy.severity);
                const IconComp = allergy.icon;

                return (
                  <motion.button
                    key={allergy.id}
                    onClick={() => toggleEditAllergy(allergy.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.03, type: "spring", stiffness: 380, damping: 28 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative text-left rounded-[16px] p-3.5 overflow-hidden transition-all duration-250"
                    style={{
                      background: isActive ? sev.bg : tk.tileBg,
                      border: `1.5px solid ${isActive ? sev.border : tk.tileBorder}`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div
                        className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                        style={{ background: isActive ? sev.bg : tk.cardBg, border: `1px solid ${isActive ? sev.border : tk.cardBorder}` }}
                      >
                        <IconComp size={16} strokeWidth={isActive ? 2.2 : 1.7} style={{ color: isActive ? sev.text : tk.tileIconColor }} />
                      </div>
                      <motion.div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ border: `1.5px solid ${isActive ? sev.border : tk.tileBorder}` }}
                        animate={{ background: isActive ? sev.bg : "rgba(0,0,0,0)" }}
                      >
                        {isActive && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                            <Check size={10} style={{ color: sev.text }} strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <p
                      className="font-display mb-1"
                      style={{ fontSize: 13, fontWeight: isActive ? 700 : 600, letterSpacing: "-0.01em", color: isActive ? sev.text : tk.tileTextColor }}
                    >
                      {language === "id" ? allergy.nameId : allergy.name}
                    </p>
                    <div className="inline-flex items-center gap-1 rounded-full px-2 py-[2px]" style={{ background: isActive ? sev.bg : tk.cardBg }}>
                      <div className="w-[5px] h-[5px] rounded-full" style={{ background: isActive ? sev.text : tk.tileIconColor, opacity: isActive ? 1 : 0.5 }} />
                      <span className="font-display" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: isActive ? sev.text : tk.textTertiary }}>
                        {severityLabel(allergy.severity)}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Save button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="flex flex-col gap-3 pb-10"
          >
            <motion.button
              onClick={handleSave}
              disabled={!editName.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-[15px] rounded-2xl font-display transition-all duration-300"
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                ...(editName.trim()
                  ? {
                      background: hasChanges
                        ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                        : "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                      color: "#ffffff",
                      boxShadow: "0 8px 24px -4px rgba(99,102,241,0.35)",
                    }
                  : {
                      background: tk.tileBg,
                      color: tk.textTertiary,
                    }),
              }}
              whileTap={editName.trim() ? { scale: 0.975 } : undefined}
            >
              <Check size={17} strokeWidth={2.5} />
              {t.saveMember}
            </motion.button>

            <motion.button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center justify-center py-[14px] rounded-2xl font-display"
              style={{ fontSize: 14, fontWeight: 600, color: tk.textSecondary }}
              whileTap={{ scale: 0.97 }}
            >
              {t.cancel}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── Delete confirm sheet ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative w-full max-w-[430px] rounded-t-[28px] p-6 pb-10"
              style={{ background: tk.modalBg, boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}
            >
              <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: tk.sheetHandleBg }} />

              {/* Warning icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-14 h-14 rounded-[18px] flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <AlertTriangle size={24} className="text-red-400" strokeWidth={2} />
                </div>
              </div>

              <h3
                className="font-display text-center mb-2"
                style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", color: tk.textPrimary }}
              >
                {t.confirmDelete}
              </h3>
              <p
                className="font-display text-center mb-7"
                style={{ fontSize: 14, fontWeight: 500, color: tk.textSecondary, lineHeight: 1.55 }}
              >
                Remove <span style={{ fontWeight: 700, color: tk.textPrimary }}>{member.name}</span>?{" "}
                {t.confirmDeleteSub}
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2.5 py-[14px] rounded-2xl font-display"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                    color: "#ffffff",
                    boxShadow: "0 6px 20px -4px rgba(220,38,38,0.4)",
                  }}
                  whileTap={{ scale: 0.975 }}
                >
                  <Trash2 size={16} strokeWidth={2} />
                  {t.confirmBtn}
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full flex items-center justify-center py-[14px] rounded-2xl font-display"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    background: tk.tileBg,
                    color: tk.textSecondary,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t.cancelBtn}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout>
  );
}