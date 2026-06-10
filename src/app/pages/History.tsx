import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";
import {
  ScanLine,
  Filter,
  XOctagon,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { T } from "../i18n/translations";

export default function History() {
  const navigate = useNavigate();
  const { history, setActiveHistoryEntry, theme, language } = useApp();
  const isDark = theme === "dark";
  const t = T[language];
  const [filterMode, setFilterMode] = useState<"all" | "danger" | "safe">("all");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return t.today;
    if (diff === 1) return t.yesterday;
    if (diff < 7) return t.daysAgo(diff);
    return date.toLocaleDateString(language === "en" ? "en-US" : "id-ID", { month: "short", day: "numeric" });
  };

  const filteredHistory = history.filter(entry => {
    if (filterMode === "danger") {
      return entry.results.some(r => r.status === "danger");
    }
    if (filterMode === "safe") {
      return entry.results.every(r => r.status !== "danger" && r.status !== "caution") && entry.results.length > 0;
    }
    return true;
  });

  // Group history by date string for sticky headers
  const groupedHistory = filteredHistory.reduce((groups, entry) => {
    const dateStr = formatDate(entry.date);
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(entry);
    return groups;
  }, {} as Record<string, typeof history>);

  const handleFilterToggle = () => {
    if (filterMode === "all") {
      setFilterMode("danger");
      toast.error(language === "en" ? "Showing Dangerous Scans" : "Menampilkan Scan Berbahaya");
    } else if (filterMode === "danger") {
      setFilterMode("safe");
      toast.success(language === "en" ? "Showing Safe Scans" : "Menampilkan Scan Aman");
    } else {
      setFilterMode("all");
      toast(language === "en" ? "Showing All History" : "Menampilkan Semua Riwayat");
    }
  };

  return (
    <MobileLayout noPadding withNav>
      <div className="min-h-dvh pb-36 font-display">
        {/* Page Header */}
        <div className="px-5 pt-14 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-2"
          >
            <h1
              className="font-display text-slate-900 dark:text-white"
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {t.historyTitle}
            </h1>
            <motion.button
              onClick={handleFilterToggle}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center pointer-events-auto relative"
              style={{
                background: filterMode !== "all"
                  ? (isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)")
                  : (isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)"),
                border: filterMode !== "all"
                  ? (isDark ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.2)")
                  : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(148,163,184,0.14)"),
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Filter
                size={18}
                strokeWidth={2}
                className={filterMode !== "all" ? "text-indigo-500" : "text-slate-600 dark:text-white/60"}
              />
              {filterMode !== "all" && (
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-white/40 font-display"
            style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}
          >
            {t.historyRecorded(history.length)}
          </motion.p>
        </div>

        {/* ── Timeline ── */}
        <div className="pt-2">
          {history.length === 0 ? (
            <div className="px-5 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-10 text-center w-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-slate-50 dark:bg-slate-900 text-slate-400"
                >
                  <ScanLine size={28} strokeWidth={1.6} />
                </div>
                <p className="font-bold text-slate-900 dark:text-white" style={{ fontSize: 16 }}>
                  {t.historyEmpty}
                </p>
                <p className="mt-2 text-slate-500 dark:text-slate-400" style={{ fontSize: 13, fontWeight: 500 }}>
                  {t.historyEmptySub}
                </p>
              </motion.div>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([dateLabel, entries], groupIndex) => (
              <div key={dateLabel} className="mb-4 relative">
                {/* Standard Sticky header */}
                <div
                  className="sticky top-0 z-20 py-2 mb-2 bg-[#EBF0FA] dark:bg-[#0f172a]"
                >
                  <h2
                    className="font-semibold text-slate-500 dark:text-slate-400 px-6 uppercase text-xs tracking-wider"
                  >
                    {dateLabel}
                  </h2>
                </div>

                <div className="space-y-3 px-5">
                  {entries.map((entry, i) => {
                    const dangerCount = entry.results.filter((r) => r.status === "danger").length;
                    const cautionCount = entry.results.filter((r) => r.status === "caution").length;
                    const safeCount = entry.results.filter((r) => r.status === "safe").length;

                    const isDanger = dangerCount > 0;
                    const isCaution = !isDanger && cautionCount > 0;

                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 + groupIndex * 0.1, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                        onClick={() => {
                          setActiveHistoryEntry(entry);
                          navigate("/results");
                        }}
                        className="w-full text-left rounded-2xl relative overflow-hidden flex bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform"
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="p-4 w-full relative z-10 flex gap-4 items-center">

                          {/* Icon container */}
                          <div
                            className={`rounded-2xl flex items-center justify-center shrink-0 w-14 h-14 ${isDanger ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500' : isCaution ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'}`}
                          >
                            <ScanLine size={24} strokeWidth={2} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 h-[22px]">
                              <h3
                                className="font-semibold truncate text-slate-900 dark:text-white"
                                style={{ fontSize: 17, letterSpacing: "-0.02em" }}
                              >
                                {entry.restaurant}
                              </h3>
                              <ArrowUpRight size={16} strokeWidth={2.5} className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                            </div>

                            <div className="flex items-center gap-[6px] mb-2.5">
                              <Clock size={12} strokeWidth={2.5} className="text-slate-400 dark:text-white/30" />
                              <span className="text-slate-500 dark:text-white/40" style={{ fontSize: 12, fontWeight: 500 }}>
                                {t.itemsScanned(entry.itemsScanned)}
                              </span>
                            </div>

                            {/* Results breakdown pills */}
                            <div className="flex items-center gap-1.5">
                              {dangerCount > 0 && (
                                <div
                                  className="flex items-center gap-1 px-2.5 py-[4px] rounded-full"
                                  style={{ background: "rgba(225,29,72,0.15)", border: "1px solid rgba(225,29,72,0.3)" }}
                                >
                                  <XOctagon size={11} className="text-rose-400" strokeWidth={2.5} />
                                  <span className="text-rose-300 font-display" style={{ fontSize: 11, fontWeight: 700 }}>
                                    {dangerCount}
                                  </span>
                                </div>
                              )}
                              {cautionCount > 0 && (
                                <div
                                  className="flex items-center gap-1 px-2.5 py-[4px] rounded-full"
                                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
                                >
                                  <AlertTriangle size={11} className="text-amber-400" strokeWidth={2.5} />
                                  <span className="text-amber-300 font-display" style={{ fontSize: 11, fontWeight: 700 }}>
                                    {cautionCount}
                                  </span>
                                </div>
                              )}
                              {safeCount > 0 && (
                                <div
                                  className="flex items-center gap-1 px-2.5 py-[4px] rounded-full"
                                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
                                >
                                  <CheckCircle2 size={11} className="text-emerald-400" strokeWidth={2.5} />
                                  <span className="text-emerald-300 font-display" style={{ fontSize: 11, fontWeight: 700 }}>
                                    {safeCount}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}