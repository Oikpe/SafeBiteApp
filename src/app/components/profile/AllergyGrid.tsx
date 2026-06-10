// ─── AllergyGrid ──────────────────────────────────────────────────────────────
// 2-column allergen toggle grid, sorted by severity (high → moderate → low).

import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { SORTED_ALLERGY_LIST } from "../../constants/allergies";
import type { ThemeTokens } from "../../utils/theme";
import type { Language } from "../../types";
import { Shield, Check } from "lucide-react";
import { severityStyle as getSeverityStyle, severityLabel as getSeverityLabel } from "../../utils/helpers";

interface AllergyGridProps {
    tk: ThemeTokens;
    language: Language;
    t: {
        myAllergies: string;
        allergenCount: (n: number) => string;
        noAllergies: string;
        tapToToggle: string;
        highRisk: string;
        moderate: string;
        lowRisk: string;
    };
}

export function AllergyGrid({ tk, language, t }: AllergyGridProps) {
    const { allergies, toggleAllergy } = useApp();
    const activeCount = allergies.length;

    const severityStyle = (sev: "high" | "moderate" | "low") => getSeverityStyle(sev, tk);
    const severityLabel = (sev: "high" | "moderate" | "low") => getSeverityLabel(sev, t);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="mb-6"
        >
            {/* Section header */}
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                    <Shield size={13} style={{ color: tk.sectionLabel }} strokeWidth={2.2} />
                    <span
                        className="font-display"
                        style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: tk.sectionLabel }}
                    >
                        {t.myAllergies}
                    </span>
                </div>
                <motion.div
                    key={activeCount}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-2.5 py-1 rounded-full font-display"
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: activeCount > 0 ? "rgba(239,68,68,0.1)" : tk.accentBg,
                        color: activeCount > 0 ? "#ef4444" : tk.accentText,
                    }}
                >
                    {activeCount > 0 ? t.allergenCount(activeCount) : t.noAllergies}
                </motion.div>
            </div>

            <p
                className="font-display mb-3.5 pl-0.5"
                style={{ fontSize: 12, fontWeight: 500, color: tk.textTertiary, letterSpacing: "-0.005em" }}
            >
                {t.tapToToggle}
            </p>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-2.5">
                {SORTED_ALLERGY_LIST.map((allergy, i) => {
                    const isActive = allergies.includes(allergy.id);
                    const sev = severityStyle(allergy.severity);
                    const IconComp = allergy.icon;

                    return (
                        <motion.button
                            key={allergy.id}
                            onClick={() => toggleAllergy(allergy.id)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.04, type: "spring", stiffness: 380, damping: 28 }}
                            whileTap={{ scale: 0.94 }}
                            className="relative text-left rounded-[16px] p-3.5 overflow-hidden transition-all duration-300"
                            style={{
                                background: isActive ? sev.bg : tk.tileBg,
                                border: `1.5px solid ${isActive ? sev.border : tk.tileBorder}`,
                                boxShadow: isActive ? `0 4px 16px -4px ${sev.bg}` : "none",
                            }}
                        >
                            {/* Icon + checkmark row */}
                            <div className="flex items-start justify-between mb-2.5">
                                <div
                                    className="w-9 h-9 rounded-[11px] flex items-center justify-center"
                                    style={{
                                        background: isActive ? `${sev.bg}` : tk.cardBg,
                                        border: `1px solid ${isActive ? sev.border : tk.cardBorder}`,
                                    }}
                                >
                                    <IconComp
                                        size={16}
                                        strokeWidth={isActive ? 2.2 : 1.7}
                                        style={{ color: isActive ? sev.text : tk.tileIconColor }}
                                    />
                                </div>
                                <motion.div
                                    className="w-5 h-5 rounded-full flex items-center justify-center"
                                    animate={{
                                        background: isActive ? sev.bg : "rgba(0,0,0,0)",
                                        borderColor: isActive ? sev.border : tk.tileBorder,
                                    }}
                                    style={{ border: `1.5px solid ${isActive ? sev.border : tk.tileBorder}` }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isActive && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                                            <Check size={10} style={{ color: sev.text }} strokeWidth={3} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Name */}
                            <p
                                className="font-display mb-1"
                                style={{
                                    fontSize: 13,
                                    fontWeight: isActive ? 700 : 600,
                                    letterSpacing: "-0.01em",
                                    color: isActive ? sev.text : tk.tileTextColor,
                                }}
                            >
                                {language === "id" ? allergy.nameId : allergy.name}
                            </p>

                            {/* Severity badge */}
                            <div
                                className="inline-flex items-center gap-1 rounded-full px-2 py-[2px]"
                                style={{ background: isActive ? `${sev.bg}` : tk.cardBg }}
                            >
                                <div
                                    className="w-[5px] h-[5px] rounded-full"
                                    style={{ background: isActive ? sev.text : tk.tileIconColor, opacity: isActive ? 1 : 0.5 }}
                                />
                                <span
                                    className="font-display"
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 600,
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase",
                                        color: isActive ? sev.text : tk.textTertiary,
                                    }}
                                >
                                    {severityLabel(allergy.severity)}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
