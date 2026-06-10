// ─── ThemeModal ───────────────────────────────────────────────────────────────
// Bottom-sheet picker for light / dark theme.

import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import type { ThemeTokens } from "../../utils/theme";
import { Sun, Moon, CheckCircle2, Circle, X } from "lucide-react";

interface ThemeModalProps {
    isOpen: boolean;
    theme: "light" | "dark";
    tk: ThemeTokens;
    onClose: () => void;
    onSelect: (theme: "light" | "dark") => void;
    t: {
        themeTitle: string;
        lightTheme: string;
        lightThemeSub: string;
        darkTheme: string;
        darkThemeSub: string;
    };
}

export function ThemeModal({ isOpen, theme, tk, onClose, onSelect, t }: ThemeModalProps) {
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
                                {t.themeTitle}
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
                            {(["light", "dark"] as const).map((val) => {
                                const isSelected = theme === val;
                                const isLight = val === "light";
                                return (
                                    <motion.button
                                        key={val}
                                        onClick={() => { onSelect(val); onClose(); }}
                                        className="flex items-center gap-4 rounded-[18px] p-4 text-left transition-all"
                                        style={{
                                            background: isSelected ? (isLight ? "rgba(99,102,241,0.08)" : "rgba(129,140,248,0.1)") : tk.tileBg,
                                            border: `1.5px solid ${isSelected ? (isLight ? "rgba(99,102,241,0.25)" : "rgba(129,140,248,0.25)") : tk.tileBorder}`,
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <div
                                            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
                                            style={{ background: isLight ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" : "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}
                                        >
                                            {isLight
                                                ? <Sun size={20} className="text-amber-500" strokeWidth={1.9} />
                                                : <Moon size={20} className="text-indigo-300" strokeWidth={1.9} />
                                            }
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.015em", color: tk.textPrimary }}>
                                                {isLight ? t.lightTheme : t.darkTheme}
                                            </p>
                                            <p className="font-display" style={{ fontSize: 12.5, fontWeight: 500, color: tk.textSecondary }}>
                                                {isLight ? t.lightThemeSub : t.darkThemeSub}
                                            </p>
                                        </div>
                                        {isSelected
                                            ? <CheckCircle2 size={18} style={{ color: isLight ? tk.accentText : "#818cf8" }} strokeWidth={2} />
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
