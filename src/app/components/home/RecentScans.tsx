// ─── RecentScans ──────────────────────────────────────────────────────────────
// Displays the 3 most recent scan history entries with risk bars.
// Falls back to an empty state prompt when no history exists.

import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";
import { T } from "../../i18n/translations";
import {
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    XOctagon,
    ScanLine,
    ArrowUpRight,
} from "lucide-react";

interface RecentScansProps {
    cardBg: string;
    cardBorder: string;
    cardTitle: string;
    cardMeta: string;
    sectionTitle: string;
    dangerPillBg: string;
    dangerPillBorder: string;
    arrowColor: string;
    emptyBorder: string;
    emptyIconBg: string;
}

export function RecentScans({
    cardBg, cardBorder, cardTitle, cardMeta, sectionTitle,
    dangerPillBg, dangerPillBorder, arrowColor, emptyBorder, emptyIconBg,
}: RecentScansProps) {
    const navigate = useNavigate();
    const { history, setActiveHistoryEntry, language } = useApp();
    const recentHistory = history.slice(0, 3);
    const t = T[language];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        >
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <h3
                    className="font-display"
                    style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em", color: sectionTitle }}
                >
                    {t.recentScans}
                </h3>
                <motion.button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-0.5 font-display text-indigo-500"
                    style={{ fontSize: 13, fontWeight: 650 }}
                    whileTap={{ scale: 0.93 }}
                >
                    {t.seeAll}
                    <ChevronRight size={14} strokeWidth={2.2} />
                </motion.button>
            </div>

            {recentHistory.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {recentHistory.map((entry, i) => {
                        const dangerCount = entry.results.filter((r) => r.status === "danger").length;
                        const safeCount = entry.results.filter((r) => r.status === "safe").length;
                        const cautionCount = entry.results.filter((r) => r.status === "caution").length;
                        const total = Math.max(entry.results.length, 1);
                        const dangerPct = (dangerCount / total) * 100;
                        const cautionPct = (cautionCount / total) * 100;
                        const safePct = (safeCount / total) * 100;

                        return (
                            <motion.button
                                key={entry.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.43 + i * 0.08 }}
                                onClick={() => {
                                    setActiveHistoryEntry(entry);
                                    navigate("/results");
                                }}
                                className="text-left rounded-[20px] p-4"
                                style={{
                                    background: cardBg,
                                    border: cardBorder,
                                    backdropFilter: "blur(16px)",
                                    boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
                                }}
                                whileTap={{ scale: 0.975 }}
                            >
                                {/* Top row */}
                                <div className="flex items-center gap-3.5 mb-3">
                                    <div
                                        className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                                        style={{
                                            background: dangerCount > 0
                                                ? "linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(239,68,68,0.07) 100%)"
                                                : "linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(34,197,94,0.07) 100%)",
                                            border: dangerCount > 0
                                                ? "1px solid rgba(220,38,38,0.18)"
                                                : "1px solid rgba(22,163,74,0.18)",
                                        }}
                                    >
                                        {dangerCount > 0
                                            ? <AlertTriangle size={17} className="text-red-500" strokeWidth={2} />
                                            : <CheckCircle2 size={17} className="text-emerald-500" strokeWidth={2} />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="font-display truncate mb-0.5"
                                            style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em", color: cardTitle }}
                                        >
                                            {entry.restaurant}
                                        </h4>
                                        <p
                                            className="font-display"
                                            style={{ fontSize: 11.5, fontWeight: 500, color: cardMeta }}
                                        >
                                            {t.itemsScanned(entry.itemsScanned)}
                                        </p>
                                    </div>
                                    {dangerCount > 0 && (
                                        <div
                                            className="flex items-center gap-1.5 rounded-[9px] shrink-0"
                                            style={{ padding: "5px 9px", background: dangerPillBg, border: dangerPillBorder }}
                                        >
                                            <XOctagon size={11} className="text-red-500" strokeWidth={2.2} />
                                            <span className="font-display text-red-500" style={{ fontSize: 11, fontWeight: 700 }}>
                                                {dangerCount}
                                            </span>
                                        </div>
                                    )}
                                    <ArrowUpRight size={14} strokeWidth={2} style={{ color: arrowColor }} className="shrink-0" />
                                </div>

                                {/* Risk bar */}
                                <div className="h-[4px] rounded-full overflow-hidden flex gap-[2px]">
                                    {dangerCount > 0 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                                            className="rounded-full"
                                            style={{ width: `${dangerPct}%`, background: "linear-gradient(90deg, #b91c1c, #ef4444)", transformOrigin: "left" }}
                                        />
                                    )}
                                    {cautionCount > 0 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.55 + i * 0.1, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                                            className="rounded-full"
                                            style={{ width: `${cautionPct}%`, background: "linear-gradient(90deg, #b45309, #f59e0b)", transformOrigin: "left" }}
                                        />
                                    )}
                                    {safeCount > 0 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.6 + i * 0.1, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                                            className="rounded-full"
                                            style={{ width: `${safePct}%`, background: "linear-gradient(90deg, #15803d, #22c55e)", transformOrigin: "left" }}
                                        />
                                    )}
                                    <div className="flex-1 rounded-full" style={{ background: "rgba(148,163,184,0.14)" }} />
                                </div>

                                {/* Risk labels */}
                                <div className="flex items-center gap-2 mt-2">
                                    {dangerCount > 0 && (
                                        <span className="font-display text-red-500" style={{ fontSize: 10.5, fontWeight: 600 }}>
                                            {dangerCount} {t.dangerLabel}
                                        </span>
                                    )}
                                    {cautionCount > 0 && (
                                        <span className="font-display text-amber-500" style={{ fontSize: 10.5, fontWeight: 600 }}>
                                            · {cautionCount} {t.cautionLabel}
                                        </span>
                                    )}
                                    {safeCount > 0 && (
                                        <span className="font-display text-emerald-500" style={{ fontSize: 10.5, fontWeight: 600 }}>
                                            · {safeCount} {t.safeLabel}
                                        </span>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            ) : (
                <motion.button
                    onClick={() => navigate("/scan")}
                    className="w-full rounded-[20px] p-8 text-center bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
                    style={{
                        backdropFilter: "blur(16px)",
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-slate-50 dark:bg-slate-900"
                    >
                        <ScanLine size={22} className="text-slate-400 dark:text-slate-500" strokeWidth={1.7} />
                    </div>
                    <p className="font-display font-bold text-slate-900 dark:text-white" style={{ fontSize: 14, letterSpacing: "-0.01em" }}>
                        {t.historyEmpty}
                    </p>
                    <p className="font-display text-slate-500 dark:text-slate-400 mt-1" style={{ fontSize: 12.5, fontWeight: 500 }}>
                        {t.historyEmptySub}
                    </p>
                </motion.button>
            )}
        </motion.div>
    );
}
