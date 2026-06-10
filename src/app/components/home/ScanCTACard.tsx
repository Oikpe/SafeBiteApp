// ─── ScanCTACard ──────────────────────────────────────────────────────────────
// "Eat safe, every meal." primary action card with gradient background.
// Premium glassmorphism buttons and modern layout.

import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { T } from "../../i18n/translations";
import { Search, ScanLine } from "lucide-react";
import gradientBg from "../../../assets/gradients/Rectangle.png";

export function ScanCTACard() {
    const navigate = useNavigate();
    const { allergies, language, theme } = useApp();
    const t = T[language];
    const isDark = theme === "dark";

    return (
        <div
            className="relative rounded-[32px] overflow-hidden transition-[box-shadow,border-color] duration-300"
            style={{
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(79,70,229,0.12)"}`,
                boxShadow: isDark
                    ? "0 20px 40px rgba(0,0,0,0.5)"
                    : "0 15px 35px rgba(79,70,229,0.18)",
            }}
        >
            {/* ── Gradient Background ── */}
            <img
                src={gradientBg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
            />

            {/* ── Glassmorphism Overlay ── */}
            <div
                className="absolute inset-0"
                style={{
                    zIndex: 1,
                    background: isDark
                        ? "rgba(15,23,42,0.45)"
                        : "rgba(15,23,42,0.25)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                }}
            />

            {/* ── Content ── */}
            <div className="relative p-6" style={{ zIndex: 2 }}>
                {/* ── Header Text ── */}
                <div className="mb-5">
                    <h2 className="text-[22px] font-bold text-white tracking-tight leading-[1.2]">
                        {t.eatSafe}
                        <br />
                        <span className="text-indigo-300">{t.everyMeal}</span>
                    </h2>
                    <p className="text-white/50 text-sm mt-1.5 font-medium">{t.scanCTASub}</p>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex gap-3">
                    {/* Primary: Scan Menu */}
                    <button
                        onClick={() => navigate("/scan")}
                        className="flex-1 flex items-center justify-center gap-1.5 h-[52px] rounded-2xl font-semibold text-[15px] active:scale-[0.97] transition-transform"
                        style={{
                            background: "linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(139,92,246,0.9) 100%)",
                            boxShadow: "0 8px 24px rgba(99,102,241,0.35), inset 0 1px 1px rgba(255,255,255,0.2)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.15)",
                        }}
                    >
                        {t.scanCTA}
                        <ScanLine size={18} strokeWidth={2.5} className="mt-[1px] opacity-70" />
                    </button>

                    {/* Secondary: Search */}
                    <button
                        onClick={() => navigate("/scan?mode=search")}
                        className="flex items-center justify-center w-[52px] h-[52px] rounded-2xl active:scale-[0.97] transition-transform"
                        style={{
                            background: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
                        }}
                    >
                        <Search size={20} strokeWidth={2.2} className="text-white/80" />
                    </button>
                </div>
            </div>
        </div>
    );
}
