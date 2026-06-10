// ─── FamilyMemberList ─────────────────────────────────────────────────────────
// Shows family members list + "Add member" button when in family mode.

import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useApp, ALLERGY_LIST, MEMBER_COLORS } from "../../context/AppContext";
import type { ThemeTokens } from "../../utils/theme";
import type { Language } from "../../types";
import { Users, UserPlus, ChevronRight } from "lucide-react";
import { severityStyle as getSeverityStyle } from "../../utils/helpers";

interface FamilyMemberListProps {
    tk: ThemeTokens;
    language: Language;
    onAddMember: () => void;
    t: {
        familyMembers: string;
        addMember: string;
        noFamilyMembers: string;
        allergenCount: (n: number) => string;
        noAllergies: string;
    };
}

export function FamilyMemberList({ tk, onAddMember, t }: FamilyMemberListProps) {
    const navigate = useNavigate();
    const { familyMembers } = useApp();

    const severityStyle = (sev: "high" | "moderate" | "low") => getSeverityStyle(sev, tk);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="mb-6"
        >
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                    <Users size={13} style={{ color: tk.sectionLabel }} strokeWidth={2.2} />
                    <span
                        className="font-display"
                        style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: tk.sectionLabel }}
                    >
                        {t.familyMembers}
                    </span>
                </div>
                <motion.button
                    onClick={onAddMember}
                    className="flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 font-display"
                    style={{ fontSize: 12, fontWeight: 700, background: tk.accentBg, color: tk.accentText, border: `1px solid ${tk.accentBorder}` }}
                    whileTap={{ scale: 0.93 }}
                >
                    <UserPlus size={12} strokeWidth={2.2} />
                    {t.addMember}
                </motion.button>
            </div>

            <div className="flex flex-col gap-2.5">
                {familyMembers.map((member, i) => {
                    const color = MEMBER_COLORS[member.colorIndex % MEMBER_COLORS.length];
                    const memberAllergyCount = member.allergies.length;
                    return (
                        <motion.button
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32 + i * 0.07 }}
                            onClick={() => navigate(`/profile/family/${member.id}`)}
                            className="glass-card rounded-[18px] p-4 flex items-center gap-3.5 text-left"
                            whileTap={{ scale: 0.975 }}
                        >
                            <div
                                className="w-12 h-12 rounded-[15px] flex items-center justify-center shrink-0"
                                style={{ background: color.bg, boxShadow: `0 4px 12px ${color.shadow}` }}
                            >
                                <span className="text-white font-display" style={{ fontSize: 16, fontWeight: 800 }}>
                                    {member.avatar}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4
                                    className="font-display mb-0.5 truncate"
                                    style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.015em", color: tk.textPrimary }}
                                >
                                    {member.name}
                                </h4>
                                <p className="font-display" style={{ fontSize: 12, fontWeight: 500, color: tk.textTertiary }}>
                                    {memberAllergyCount > 0 ? t.allergenCount(memberAllergyCount) : t.noAllergies}
                                </p>
                            </div>
                            {/* Allergy dot preview */}
                            {memberAllergyCount > 0 && (
                                <div className="flex gap-1 shrink-0">
                                    {member.allergies.slice(0, 3).map((aid) => {
                                        const a = ALLERGY_LIST.find((x) => x.id === aid);
                                        if (!a) return null;
                                        const sev = severityStyle(a.severity);
                                        return <div key={aid} className="w-[6px] h-[6px] rounded-full" style={{ background: sev.text }} />;
                                    })}
                                    {memberAllergyCount > 3 && (
                                        <span style={{ fontSize: 10, color: tk.textTertiary, fontWeight: 600 }}>
                                            +{memberAllergyCount - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                            <ChevronRight size={14} style={{ color: tk.textTertiary }} strokeWidth={2} />
                        </motion.button>
                    );
                })}

                {familyMembers.length === 0 && (
                    <div
                        className="rounded-[18px] p-8 text-center"
                        style={{ background: tk.tileBg, border: `1px dashed ${tk.cardBorder}` }}
                    >
                        <Users size={22} style={{ color: tk.textTertiary }} className="mx-auto mb-2" strokeWidth={1.7} />
                        <p className="font-display" style={{ fontSize: 13, fontWeight: 500, color: tk.textTertiary }}>
                            {t.noFamilyMembers}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
