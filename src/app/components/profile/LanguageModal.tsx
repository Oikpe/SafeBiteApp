// ─── LanguageModal ────────────────────────────────────────────────────────────
// Bottom-sheet picker for app language (EN / ID).

import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import type { ThemeTokens } from "../../utils/theme";
import type { Language } from "../../types";
import { CheckCircle2, Circle, X } from "lucide-react";

interface LanguageModalProps {
    isOpen: boolean;
    language: Language;
    tk: ThemeTokens;
    onClose: () => void;
    onSelect: (lang: Language) => void;
    t: {
        languageTitle: string;
        langEn: string;
        langEnSub: string;
        langId: string;
        langIdSub: string;
    };
}

const LANGUAGES: { code: Language; flag: string }[] = [
    { code: "en", flag: "🇺🇸" },
    { code: "id", flag: "🇮🇩" },
];

export function LanguageModal({ isOpen, language, tk, onClose, onSelect, t }: LanguageModalProps) {
    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-end justify-center"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                        className="relative w-full max-w-[430px] rounded-t-[28px] p-6"
                        style={{
                            background: tk.modalBg,
                            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
                            paddingBottom: "max(40px, calc(env(safe-area-inset-bottom, 0px) + 32px))",
                        }}
                    >
                        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: tk.sheetHandleBg }} />
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: tk.textPrimary }}>
                                {t.languageTitle}
                            </h3>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: tk.tileBg }}
                            >
                                <X size={16} style={{ color: tk.textSecondary }} strokeWidth={2} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {LANGUAGES.map(({ code, flag }) => {
                                const isSelected = language === code;
                                const isEn = code === "en";
                                return (
                                    <motion.button
                                        key={code}
                                        onClick={() => { onSelect(code); onClose(); }}
                                        className="flex items-center gap-4 rounded-[18px] p-4 text-left"
                                        style={{
                                            background: isSelected ? "rgba(99,102,241,0.08)" : tk.tileBg,
                                            border: `1.5px solid ${isSelected ? "rgba(99,102,241,0.25)" : tk.tileBorder}`,
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <div
                                            className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                                            style={{ background: tk.cardBg, border: `1px solid ${tk.cardBorder}` }}
                                        >
                                            <span style={{ fontSize: 22 }}>{flag}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-display" style={{ fontSize: 15, fontWeight: 700, color: tk.textPrimary }}>
                                                {isEn ? t.langEn : t.langId}
                                            </p>
                                            <p className="font-display" style={{ fontSize: 12.5, fontWeight: 500, color: tk.textSecondary }}>
                                                {isEn ? t.langEnSub : t.langIdSub}
                                            </p>
                                        </div>
                                        {isSelected
                                            ? <CheckCircle2 size={18} style={{ color: tk.accentText }} strokeWidth={2} />
                                            : <Circle size={18} style={{ color: tk.textTertiary }} strokeWidth={1.5} />
                                        }
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
