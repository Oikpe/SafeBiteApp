import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { T } from "../../i18n/translations";
import { XOctagon, CheckCircle2, ScanLine } from "lucide-react";
import { ScanActivityChart } from "./ScanActivityChart";

export function StatsRow() {
    const navigate = useNavigate();
    const { history, language, theme } = useApp();
    const t = T[language];
    const isDark = theme === "dark";

    // ── Real-time computed stats ─────────────────────────────────────────────
    const totalScans = history.reduce((acc, h) => acc + (h.itemsScanned || 0), 0);
    // "danger" only → Avoided count
    const dangerItems = history.flatMap((h) => (h.results || []).filter((r) => r.status === "danger")).length;
    // "safe" + "caution" → Safe Picks count (caution = has allergens but user is not allergic)
    const safeItems = history.flatMap((h) => (h.results || []).filter((r) => r.status === "safe" || r.status === "caution")).length;
    const isEmpty = history.length === 0;

    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/70" : "text-slate-500";

    const getPremiumCardStyle = (type: 'ocean' | 'magenta' | 'jade') => {
        let r, g, b;
        if (type === 'ocean') { r = 59; g = 130; b = 246; }       // blue-500
        else if (type === 'magenta') { r = 236; g = 72; b = 153; } // pink-500
        else { r = 16; g = 185; b = 129; }                         // emerald-500

        return {
            background: isDark
                ? `radial-gradient(140% 140% at 50% 50%, rgba(${r},${g},${b},0.0) 20%, rgba(${r},${g},${b},0.15) 75%, rgba(${r},${g},${b},0.4) 100%)`
                : `radial-gradient(140% 140% at 50% 50%, rgba(255,255,255,0.4) 20%, rgba(${r},${g},${b},0.25) 75%, rgba(${r},${g},${b},0.5) 100%)`,
            border: `1px solid rgba(${r},${g},${b},${isDark ? 0.3 : 0.6})`,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: isDark
                ? `inset 0 0 60px rgba(${r},${g},${b},0.15), inset 0 1px 1px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.5)`
                : `inset 0 0 60px rgba(255,255,255,0.6), inset 0 1px 1px #ffffff, 0 15px 35px rgba(${r},${g},${b},0.2)`,
        };
    };

    return (
        <div className="mb-6 relative w-full rounded-[40px]">
            {/* ── Content Foreground ── */}
            <div className="relative z-10 px-1">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="grid grid-cols-2 gap-3"
                >
                    {/* 1. Total Scans (Full Width Top) - Ocean Blue */}
                    <motion.button
                        onClick={() => navigate("/history")}
                        whileTap={{ scale: 0.96 }}
                        className="col-span-2 relative p-5 pb-3 flex flex-col justify-between text-left rounded-[32px] overflow-hidden transition-all duration-300"
                        style={{ height: isEmpty ? "170px" : "195px", ...getPremiumCardStyle('ocean') }}
                    >
                        <div className="relative z-10 w-full flex justify-between items-start">
                            <div className={`px-3 py-1.5 rounded-[12px] text-[10px] font-bold tracking-widest uppercase ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {t.lifetime}
                            </div>
                            <div className={`font-display mb-1 flex items-center gap-1.5 ${textSecondary}`} style={{ fontSize: 13, fontWeight: 700 }}>
                                {t.totalScans}
                            </div>
                        </div>

                        {isEmpty ? (
                            /* ── Empty State ── */
                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-100/80'}`}>
                                    <ScanLine size={22} className={isDark ? "text-blue-400" : "text-blue-500"} strokeWidth={2} />
                                </div>
                                <p className={`text-sm font-semibold ${isDark ? 'text-blue-300/70' : 'text-blue-600/60'}`}>
                                    {t.noScansYet}
                                </p>
                                <p className={`text-[11px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                    Scan a menu to start tracking
                                </p>
                            </div>
                        ) : (
                            /* ── Data View ── */
                            <div className="relative z-10 flex flex-col w-full h-full mt-1 justify-end">
                                <div className="flex justify-between items-end relative z-20 mb-1">
                                    <div className={`font-display ${textPrimary}`} style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                        {totalScans}
                                    </div>
                                    <div className={`text-[10px] font-bold tracking-wider ${isDark ? 'text-blue-300/70' : 'text-blue-500/70'} uppercase`}>
                                        {t.last7Days}
                                    </div>
                                </div>

                                {/* Real-Data Area Chart (Recharts) */}
                                <div className="w-full h-[80px] mt-1 -ml-1">
                                    <ScanActivityChart history={history} isDark={isDark} emptyLabel={t.noScanActivityYet} />
                                </div>
                            </div>
                        )}
                    </motion.button>

                    {/* 2. Avoided (Square Bottom Left) - Floral Magenta */}
                    <motion.button
                        onClick={() => navigate("/history")}
                        whileTap={{ scale: 0.94 }}
                        className="relative p-5 flex flex-col justify-between text-left rounded-[32px] overflow-hidden transition-all duration-300"
                        style={{ height: "150px", ...getPremiumCardStyle('magenta') }}
                    >
                        <div className="relative z-10 w-full flex justify-between items-start">
                            <div className={`font-display ${textSecondary}`} style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                                {t.avoided}
                            </div>
                            <div className="flex items-center justify-center pt-0.5">
                                <XOctagon size={22} className={isDark ? "text-pink-400" : "text-pink-500"} strokeWidth={2.5} />
                            </div>
                        </div>

                        {isEmpty ? (
                            /* ── Empty State ── */
                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                                <p className={`text-[11px] font-medium ${isDark ? 'text-pink-300/50' : 'text-pink-500/40'}`}>
                                    No data yet
                                </p>
                            </div>
                        ) : (
                            /* ── Data View ── */
                            <>
                                <div className={`relative z-10 font-display ${textPrimary}`} style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                    {dangerItems}
                                </div>
                                <p className={`relative z-10 text-[10px] font-medium -mt-1 ${isDark ? 'text-pink-300/50' : 'text-pink-500/40'}`}>
                                    Dangerous items caught
                                </p>
                            </>
                        )}
                    </motion.button>

                    {/* 3. Safe Picks (Square Bottom Right) - Rare Jade */}
                    <motion.button
                        onClick={() => navigate("/history")}
                        whileTap={{ scale: 0.94 }}
                        className="relative p-5 flex flex-col justify-between text-left rounded-[32px] overflow-hidden transition-all duration-300"
                        style={{ height: "150px", ...getPremiumCardStyle('jade') }}
                    >
                        <div className="relative z-10 flex w-full justify-between items-start">
                            <div className={`font-display ${textSecondary}`} style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                                {t.safePicks}
                            </div>
                            <div className="flex items-center justify-center pt-0.5">
                                <CheckCircle2 size={22} className={isDark ? "text-emerald-400" : "text-emerald-500"} strokeWidth={2.5} />
                            </div>
                        </div>

                        {isEmpty ? (
                            /* ── Empty State ── */
                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                                <p className={`text-[11px] font-medium ${isDark ? 'text-emerald-300/50' : 'text-emerald-500/40'}`}>
                                    No data yet
                                </p>
                            </div>
                        ) : (
                            /* ── Data View ── */
                            <>
                                <div className={`relative z-10 font-display ${textPrimary}`} style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                    {safeItems}
                                </div>
                                <p className={`relative z-10 text-[10px] font-medium -mt-1 ${isDark ? 'text-emerald-300/50' : 'text-emerald-500/40'}`}>
                                    Safe items confirmed
                                </p>
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
