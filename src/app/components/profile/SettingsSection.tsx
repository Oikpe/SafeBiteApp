// ─── SettingsSection ──────────────────────────────────────────────────────────
// Active settings (Language, Appearance) + greyed-out coming-soon rows.

import { motion } from "motion/react";
import type { ThemeTokens } from "../../utils/theme";
import type { Language } from "../../types";
import { Globe, Moon, Sun, Bell, Lock, FileText, HelpCircle, ChevronRight } from "lucide-react";

interface SettingsSectionProps {
    tk: ThemeTokens;
    theme: "light" | "dark";
    language: Language;
    onOpenLang: () => void;
    onOpenTheme: () => void;
    t: {
        settings: string;
        language: string;
        appearance: string;
        appearanceSub: (t: string) => string;
        notifications: string;
        notificationsSub: string;
        privacy: string;
        privacySub: string;
        terms: string;
        termsSub: string;
        help: string;
        helpSub: string;
        comingSoon: string;
    };
}

export function SettingsSection({ tk, theme, language, onOpenLang, onOpenTheme, t }: SettingsSectionProps) {
    const comingSoonItems = [
        { icon: Bell, label: t.notifications, sub: t.notificationsSub, color: "rgba(59,130,246,0.1)", iconColor: "#3b82f6" },
        { icon: Lock, label: t.privacy, sub: t.privacySub, color: "rgba(245,158,11,0.1)", iconColor: "#f59e0b" },
        { icon: FileText, label: t.terms, sub: t.termsSub, color: "rgba(100,116,139,0.1)", iconColor: "#64748b" },
        { icon: HelpCircle, label: t.help, sub: t.helpSub, color: "rgba(236,72,153,0.1)", iconColor: "#ec4899" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="mb-6"
        >
            <div className="flex items-center gap-2 mb-3.5">
                <span
                    className="font-display"
                    style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: tk.sectionLabel }}
                >
                    {t.settings}
                </span>
            </div>

            {/* Active settings */}
            <div
                className="rounded-[20px] overflow-hidden"
                style={{ background: tk.cardBg, border: `1px solid ${tk.cardBorder}` }}
            >
                {/* Language row */}
                <button
                    onClick={onOpenLang}
                    className="w-full flex items-center gap-3.5 px-4 py-[14px] text-left transition-colors"
                    style={{ borderBottom: `1px solid ${tk.divider}` }}
                >
                    <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}>
                        <Globe size={15} className="text-emerald-500" strokeWidth={1.9} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-display" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: tk.textPrimary }}>
                            {t.language}
                        </h4>
                        <p className="font-display" style={{ fontSize: 11.5, fontWeight: 500, color: tk.textSecondary }}>
                            {language === "en" ? "English" : "Bahasa Indonesia"}
                        </p>
                    </div>
                    <ChevronRight size={14} style={{ color: tk.textTertiary }} strokeWidth={2} />
                </button>

                {/* Appearance row */}
                <button
                    onClick={onOpenTheme}
                    className="w-full flex items-center gap-3.5 px-4 py-[14px] text-left"
                >
                    <div
                        className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                        style={{ background: theme === "dark" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)" }}
                    >
                        {theme === "dark"
                            ? <Moon size={15} style={{ color: tk.accentText }} strokeWidth={1.9} />
                            : <Sun size={15} style={{ color: tk.accentText }} strokeWidth={1.9} />
                        }
                    </div>
                    <div className="flex-1">
                        <h4 className="font-display" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: tk.textPrimary }}>
                            {t.appearance}
                        </h4>
                        <p className="font-display" style={{ fontSize: 11.5, fontWeight: 500, color: tk.textSecondary }}>
                            {t.appearanceSub(theme)}
                        </p>
                    </div>
                    <ChevronRight size={14} style={{ color: tk.textTertiary }} strokeWidth={2} />
                </button>
            </div>

            {/* Coming-soon settings */}
            <div
                className="rounded-[20px] overflow-hidden mt-3"
                style={{ background: tk.cardBg, border: `1px solid ${tk.cardBorder}`, opacity: 0.45, pointerEvents: "none" }}
            >
                {comingSoonItems.map((item, i, arr) => (
                    <div
                        key={item.label}
                        className="flex items-center gap-3.5 px-4 py-[13px]"
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${tk.divider}` : "none" }}
                    >
                        <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: item.color }}>
                            <item.icon size={15} style={{ color: item.iconColor }} strokeWidth={1.9} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-display" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: tk.textPrimary }}>{item.label}</h4>
                            <p className="font-display" style={{ fontSize: 11.5, fontWeight: 500, color: tk.textSecondary }}>{item.sub}</p>
                        </div>
                        <span
                            className="font-display rounded-full px-2 py-0.5"
                            style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", background: tk.accentBg, color: tk.accentText }}
                        >
                            {t.comingSoon}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
