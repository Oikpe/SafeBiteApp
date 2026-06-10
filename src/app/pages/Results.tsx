import { useState, useRef, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp, ALLERGY_LIST, MEMBER_COLORS } from "../context/AppContext";
import { getTokens } from "../utils/theme";
import type { ScanResult, MemberResult } from "../context/AppContext";
import {
  ArrowLeft,
  XOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Share2,
  Shield,
  Info,
  ScanLine,
  Users,
  Search,
} from "lucide-react";
import { T } from "../i18n/translations";

const getStatusConfig = (t: any, isDark: boolean) => ({
  danger: {
    label: t.statusDanger,
    icon: XOctagon,
    gradient: "from-red-500 to-rose-600",
    lightBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(254,242,242,0.9)",
    lightBorder: isDark ? "rgba(239,68,68,0.2)" : "rgba(254,202,202,0.6)",
    text: isDark ? "text-red-400" : "text-red-600",
    textColor: isDark ? "#f87171" : "#dc2626",
    subtext: isDark ? "text-red-300/60" : "text-red-400",
    badge: isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600",
    dot: isDark ? "bg-red-400" : "bg-red-500",
    description: t.statusDangerDesc,
    shadow: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)",
    pillBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.10)",
    pillText: isDark ? "#f87171" : "#dc2626",
  },
  caution: {
    label: t.statusCaution,
    icon: AlertTriangle,
    gradient: "from-amber-400 to-orange-500",
    lightBg: isDark ? "rgba(245,158,11,0.12)" : "rgba(255,251,235,0.9)",
    lightBorder: isDark ? "rgba(245,158,11,0.2)" : "rgba(253,230,138,0.6)",
    text: isDark ? "text-amber-400" : "text-amber-600",
    textColor: isDark ? "#fbbf24" : "#d97706",
    subtext: isDark ? "text-amber-300/60" : "text-amber-400",
    badge: isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-100 text-amber-700",
    dot: isDark ? "bg-amber-400" : "bg-amber-500",
    description: t.statusCautionDesc,
    shadow: isDark ? "rgba(245,158,11,0.2)" : "rgba(245,158,11,0.15)",
    pillBg: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.10)",
    pillText: isDark ? "#fbbf24" : "#b45309",
  },
  safe: {
    label: t.statusSafe,
    icon: CheckCircle2,
    gradient: "from-emerald-400 to-teal-500",
    lightBg: isDark ? "rgba(16,185,129,0.12)" : "rgba(236,253,245,0.9)",
    lightBorder: isDark ? "rgba(16,185,129,0.2)" : "rgba(167,243,208,0.6)",
    text: isDark ? "text-emerald-400" : "text-emerald-600",
    textColor: isDark ? "#34d399" : "#059669",
    subtext: isDark ? "text-emerald-300/60" : "text-emerald-400",
    badge: isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-100 text-emerald-700",
    dot: isDark ? "bg-emerald-400" : "bg-emerald-500",
    description: t.statusSafeDesc,
    shadow: isDark ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.15)",
    pillBg: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.10)",
    pillText: isDark ? "#34d399" : "#047857",
  },
});

interface Person {
  id: string;
  name: string;
  colorIndex: number;
  allergies: string[];
}

function computeMemberResults(food: ScanResult, people: Person[]): MemberResult[] {
  return people.map((person) => {
    const matched = food.allergens.filter((a) => person.allergies.includes(a));
    const status: "danger" | "caution" | "safe" =
      matched.length > 0
        ? (food.status === "caution" ? "caution" : "danger")
        : "safe";

    return {
      memberId: person.id,
      memberName: person.name,
      memberColorIndex: person.colorIndex,
      status,
      matchedAllergens: matched,
    };
  });
}

function worstStatus(statuses: ("danger" | "caution" | "safe")[]): "danger" | "caution" | "safe" {
  if (statuses.includes("danger")) return "danger";
  if (statuses.includes("caution")) return "caution";
  return "safe";
}

import { getInitials } from "../utils/helpers";

function memberAvatarBg(colorIndex: number) {
  if (colorIndex === -1) return "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)";
  return MEMBER_COLORS[colorIndex % MEMBER_COLORS.length].bg;
}

const ResultCard = memo(function ResultCard({
  result,
  index,
  memberResults,
}: {
  result: ScanResult;
  index: number;
  memberResults: MemberResult[] | null;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, language } = useApp();
  const t = T[language];
  const isDark = theme === "dark";
  const tk = getTokens(theme);
  const STATUS_CONFIG = getStatusConfig(t, isDark);
  const config = STATUS_CONFIG[result.status];
  const Icon = config.icon;

  const statusPillStyle = (s: "danger" | "caution" | "safe") => ({
    background: STATUS_CONFIG[s].pillBg,
    color: STATUS_CONFIG[s].pillText,
  });

  const shortLabel = (s: "danger" | "caution" | "safe") =>
    s === "danger" ? t.shortTargetAvoid : s === "caution" ? t.shortTargetCaution : t.shortTargetSafe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.06 * index, 0.3), duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="glass-card rounded-[18px] overflow-hidden mb-3.5"
      style={isExpanded ? { boxShadow: `0 8px 24px -4px ${config.shadow}` } : {}}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left cursor-pointer active:scale-[0.98] transition-transform origin-center"
      >
        <div className="p-4 flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0 mt-0.5`}
            style={{ boxShadow: `0 4px 12px -2px ${config.shadow}` }}
          >
            <Icon size={17} className="text-white" strokeWidth={2.2} />
          </div>

          <div className="flex-1 min-w-0">
            <h4
              className="font-display truncate"
              style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: tk.textPrimary }}
            >
              {result.name}
            </h4>
            <p style={{ fontSize: 12, fontWeight: 500, color: config.pillText }}>
              {result.confidence}% {t.confidenceStr}
              {result.allergens.length > 0 && (
                <span style={{ color: tk.textTertiary, margin: "0 6px" }}>·</span>
              )}
              {result.allergens.length > 0 && (
                <span style={{ color: tk.textSecondary }}>
                  {t.allergenNum(result.allergens.length)}
                </span>
              )}
            </p>

            {memberResults && memberResults.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {memberResults.map((m) => (
                  <div
                    key={m.memberId}
                    className="flex items-center gap-1 rounded-full px-2 py-[3px]"
                    style={statusPillStyle(m.status)}
                  >
                    <span className="font-display" style={{ fontSize: 10.5, fontWeight: 800 }}>
                      {getInitials(m.memberName)}
                    </span>
                    <span className="font-display" style={{ fontSize: 10.5, fontWeight: 600 }}>
                      {shortLabel(m.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: tk.tileBg }}
          >
            <ChevronDown size={15} style={{ color: tk.textSecondary }} strokeWidth={2} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pt-1 pb-4"
              style={{ borderTop: `1px solid ${tk.cardBorder}` }}
            >
              <p className="mb-4" style={{ color: tk.textSecondary, fontSize: 13.5, lineHeight: 1.55 }}>
                {result.description}
              </p>

              {result.allergens.length > 0 && (
                <div className="mb-4">
                  <p
                    className="mb-2 font-display"
                    style={{ color: tk.textTertiary, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    {t.detectedAllergens}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.allergens.map((allergenId) => {
                      const allergy = ALLERGY_LIST.find((a) => a.id === allergenId);
                      const isMatched = memberResults?.some(m => m.matchedAllergens.includes(allergenId));
                      const aStatus = isMatched ? result.status : "safe";
                      const aCfg = STATUS_CONFIG[aStatus];

                      return (
                        <div
                          key={allergenId}
                          className="px-3 py-[5px] rounded-[10px] flex items-center gap-1.5"
                          style={{ background: aCfg.pillBg, color: aCfg.pillText }}
                        >
                          <div className={`w-[5px] h-[5px] rounded-full ${aCfg.dot}`} />
                          <span className="font-display" style={{ fontSize: 12, fontWeight: 600 }}>
                            {allergy?.name || allergenId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {memberResults && memberResults.length > 0 && (
                <div>
                  <p
                    className="mb-2.5 font-display"
                    style={{ color: tk.textTertiary, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
                  >
                    {t.memberBreakdown}
                  </p>
                  <div className="flex flex-col gap-2">
                    {[...memberResults]
                      .sort((a, b) => {
                        const order = { danger: 0, caution: 1, safe: 2 };
                        return order[a.status] - order[b.status];
                      })
                      .map((m) => {
                        const cfg = STATUS_CONFIG[m.status];
                        return (
                          <motion.div
                            key={m.memberId}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22 }}
                            className="flex items-center gap-3 rounded-[13px] px-3 py-2.5"
                            style={{ background: cfg.pillBg }}
                          >
                            <div
                              className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                              style={{ background: memberAvatarBg(m.memberColorIndex) }}
                            >
                              <span className="text-white font-display" style={{ fontSize: 11, fontWeight: 800 }}>
                                {getInitials(m.memberName)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-display truncate"
                                style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: tk.textPrimary }}
                              >
                                {m.memberName}
                              </p>
                              {m.matchedAllergens.length > 0 ? (
                                <p className="truncate" style={{ fontSize: 11.5, color: cfg.pillText, fontWeight: 500 }}>
                                  {m.matchedAllergens
                                    .map((a) => ALLERGY_LIST.find((al) => al.id === a)?.name || a)
                                    .join(", ")}
                                </p>
                              ) : (
                                <p style={{ fontSize: 11.5, fontWeight: 500, color: tk.textTertiary }}>
                                  {m.status === "caution" ? t.possibleTraces : t.noMatch}
                                </p>
                              )}
                            </div>
                            <div
                              className="rounded-[8px] px-2.5 h-[22px] flex items-center justify-center shrink-0"
                              style={{ background: cfg.pillBg, border: `1px solid ${cfg.pillText}22` }}
                            >
                              <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: cfg.pillText, lineHeight: 1, marginTop: "1px" }}>
                                {shortLabel(m.status)}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const SingleFoodResult = memo(function SingleFoodResult({
  result,
  memberResults,
}: {
  result: ScanResult & { memberResults: MemberResult[] | null };
  memberResults: MemberResult[] | null;
}) {
  const { theme, language } = useApp();
  const t = T[language];
  const isDark = theme === "dark";
  const tk = getTokens(theme);
  const STATUS_CONFIG = getStatusConfig(t, isDark);
  const config = STATUS_CONFIG[result.status];
  const Icon = config.icon;

  const verdictText =
    result.status === "danger"
      ? t.containsAllergensAvoid
      : result.status === "caution"
        ? t.mayContainTraces
        : t.safeToEat;

  const shortLabel = (s: "danger" | "caution" | "safe") =>
    s === "danger" ? t.shortTargetAvoid : s === "caution" ? t.shortTargetCaution : t.shortTargetSafe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
    >
      <div
        className="rounded-[24px] p-6 mb-5"
        style={{
          background: isDark
            ? `linear-gradient(145deg, ${config.pillBg} 0%, rgba(0,0,0,0) 70%)`
            : `linear-gradient(145deg, ${config.lightBg} 0%, rgba(255,255,255,0.5) 70%)`,
          border: `1px solid ${isDark ? `${config.pillText}22` : config.lightBorder}`,
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-4 mb-5">
          <div
            className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${config.gradient} flex items-center justify-center shrink-0`}
            style={{ boxShadow: `0 8px 24px -4px ${config.shadow}` }}
          >
            <Icon size={28} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h3
              className="font-display mb-1"
              style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: tk.textPrimary }}
            >
              {result.name}
            </h3>
            <p style={{ fontSize: 13, fontWeight: 600, color: config.pillText }}>
              {result.confidence}% {t.confidenceStr}
            </p>
          </div>
        </div>

        <div
          className="rounded-[14px] p-4 flex items-center gap-3 mb-5"
          style={{
            background: config.pillBg,
            border: `1px solid ${config.pillText}20`,
          }}
        >
          <Icon size={18} style={{ color: config.pillText }} strokeWidth={2.2} />
          <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: config.pillText }}>
            {verdictText}
          </p>
        </div>

        <p style={{ color: tk.textSecondary, fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>
          {result.description}
        </p>
      </div>

      {result.allergens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-elevated rounded-[20px] p-5 mb-5"
        >
          <p
            className="mb-3 font-display"
            style={{ color: tk.textTertiary, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            {t.detectedAllergens}
          </p>
          <div className="flex flex-col gap-2.5">
            {result.allergens.map((allergenId) => {
              const allergy = ALLERGY_LIST.find((a) => a.id === allergenId);
              const isMatched = result.memberResults?.some(m => m.matchedAllergens.includes(allergenId));
              const aStatus = isMatched ? result.status : "safe";
              const aCfg = STATUS_CONFIG[aStatus];

              return (
                <div
                  key={allergenId}
                  className="flex items-center gap-3 rounded-[12px] px-4 py-3"
                  style={{ background: aCfg.pillBg }}
                >
                  <div className={`w-2 h-2 rounded-full ${aCfg.dot}`} />
                  <span className="font-display flex-1" style={{ fontSize: 14, fontWeight: 650, color: aCfg.pillText }}>
                    {allergy?.name || allergenId}
                  </span>
                  <div
                    className="px-2.5 h-[22px] rounded-[8px] flex items-center justify-center"
                    style={{ background: `${aCfg.pillText}15` }}
                  >
                    <span className="font-display" style={{ fontSize: 10.5, fontWeight: 700, color: aCfg.pillText, lineHeight: 1, marginTop: "1px" }}>
                      {isMatched ? aCfg.label : t.statusSafe}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {result.allergens.length === 0 && result.status === "safe" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-elevated rounded-[20px] p-5 mb-5 flex items-center gap-3"
        >
          <CheckCircle2 size={20} style={{ color: config.pillText }} strokeWidth={2} />
          <p className="font-display" style={{ fontSize: 14, fontWeight: 650, color: config.pillText }}>
            {t.noAllergensDetected}
          </p>
        </motion.div>
      )}

      {memberResults && memberResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-elevated rounded-[20px] p-5 mb-5"
        >
          <p
            className="mb-3 font-display"
            style={{ color: tk.textTertiary, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            {t.memberBreakdown}
          </p>
          <div className="flex flex-col gap-2.5">
            {[...memberResults]
              .sort((a, b) => {
                const order = { danger: 0, caution: 1, safe: 2 };
                return order[a.status] - order[b.status];
              })
              .map((m) => {
                const cfg = STATUS_CONFIG[m.status];
                return (
                  <div
                    key={m.memberId}
                    className="flex items-center gap-3 rounded-[13px] px-3 py-2.5"
                    style={{ background: cfg.pillBg }}
                  >
                    <div
                      className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                      style={{ background: memberAvatarBg(m.memberColorIndex) }}
                    >
                      <span className="text-white font-display" style={{ fontSize: 11.5, fontWeight: 800 }}>
                        {getInitials(m.memberName)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display truncate"
                        style={{ fontSize: 13.5, fontWeight: 700, color: tk.textPrimary }}
                      >
                        {m.memberName}
                      </p>
                      {m.matchedAllergens.length > 0 ? (
                        <p className="truncate" style={{ fontSize: 12, color: cfg.pillText, fontWeight: 500 }}>
                          {m.matchedAllergens.map((a) => ALLERGY_LIST.find((al) => al.id === a)?.name || a).join(", ")}
                        </p>
                      ) : (
                        <p style={{ fontSize: 12, color: tk.textTertiary, fontWeight: 500 }}>
                          {m.status === "caution" ? t.possibleTraces : t.noMatch}
                        </p>
                      )}
                    </div>
                    <div
                      className="rounded-[8px] px-2.5 h-[22px] flex items-center justify-center shrink-0"
                      style={{ background: cfg.pillBg, border: `1px solid ${cfg.pillText}22` }}
                    >
                      <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: cfg.pillText, lineHeight: 1, marginTop: "1px" }}>
                        {shortLabel(m.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

const INITIAL_VISIBLE = 8;

function useLazyRender(totalCount: number) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const sentinelCallback = useCallback(
    (node: HTMLDivElement | null) => {
      sentinelRef.current = node;
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + INITIAL_VISIBLE, totalCount));
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [totalCount]
  );

  return { visibleCount, sentinelCallback };
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    scanResults,
    activeHistoryEntry,
    mode,
    allergies,
    currentUser,
    familyMembers,
    theme,
    language,
  } = useApp();

  const t = T[language];
  const isDark = theme === "dark";
  const tk = getTokens(theme);
  const STATUS_CONFIG = getStatusConfig(t, isDark);

  const historyEntry = activeHistoryEntry ?? location.state?.historyEntry ?? null;
  const rawResults: ScanResult[] = historyEntry?.results?.length
    ? historyEntry.results
    : scanResults;

  // ── Empty state guard ─────────────────────────────────────────────────────
  if (rawResults.length === 0) {
    return (
      <MobileLayout noPadding>
        <div className="min-h-dvh flex flex-col items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="text-center"
          >
            <div
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 8px 28px -6px rgba(99,102,241,0.35)",
              }}
            >
              <ScanLine size={28} className="text-white" strokeWidth={1.6} />
            </div>
            <h2
              className="font-display mb-2"
              style={{ color: tk.textPrimary, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              {t.noResultsYet}
            </h2>
            <p
              className="mb-8"
              style={{ color: tk.textSecondary, fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}
            >
              {t.noResultsSub}
            </p>
            <motion.button
              onClick={() => navigate("/scan")}
              className="text-white px-7 py-[14px] rounded-2xl font-display flex items-center gap-2.5"
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: "0 8px 24px -4px rgba(99,102,241,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <ScanLine size={17} strokeWidth={2} />
              {t.startScanning}
            </motion.button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  // ── Build "people" list (always compute for both personal and family mode) ──────────────────────────────────
  const isFamilyMode = mode === "family";
  const people: Person[] = isFamilyMode
    ? [
      { id: "self", name: currentUser || "You", colorIndex: -1, allergies },
      ...familyMembers.map((m, idx) => ({
        id: m.id,
        name: m.name,
        colorIndex: m.colorIndex ?? idx % MEMBER_COLORS.length,
        allergies: m.allergies,
      })),
    ]
    : [
      { id: "self", name: currentUser || "You", colorIndex: -1, allergies }
    ];

  // ── Compute per-item member results and overall dynamic status ─────────────────────────────────────
  const processedResults = rawResults.map((r) => {
    // We always compute member results to know exact matched allergens
    const memberResults = computeMemberResults(r, people);
    // Overall status is the worst status of all people involved in the scan
    const overallStatus = worstStatus(memberResults.map((m) => m.status));

    return {
      ...r,
      status: overallStatus,
      // Only keep member results for family mode UI representation
      memberResults: isFamilyMode ? memberResults : memberResults.filter(m => m.memberId === "self") // pass along for rendering logic 
    };
  });

  const isSingleResult = processedResults.length === 1;

  const dangerItems = processedResults.filter((r) => r.status === "danger");
  const cautionItems = processedResults.filter((r) => r.status === "caution");
  const safeItems = processedResults.filter((r) => r.status === "safe");

  const sections = [
    { status: "danger" as const, items: dangerItems },
    { status: "caution" as const, items: cautionItems },
    { status: "safe" as const, items: safeItems },
  ].filter((s) => s.items.length > 0);

  // ── Per-member summary (family mode, multi-item only) ────────────────────
  const memberSummary = isFamilyMode && !isSingleResult
    ? people.map((p) => ({
      ...p,
      dangerCount: processedResults.filter(
        (r) => r.memberResults?.find((m) => m.memberId === p.id)?.status === "danger"
      ).length,
      cautionCount: processedResults.filter(
        (r) => r.memberResults?.find((m) => m.memberId === p.id)?.status === "caution"
      ).length,
    }))
    : null;

  // ── Lazy rendering — incrementally show large result lists ──────────────
  const { visibleCount, sentinelCallback } = useLazyRender(processedResults.length);

  return (
    <MobileLayout noPadding>
      <div className="min-h-dvh">
        {/* ── Header ── */}
        <div className="px-7 pt-14 pb-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-7"
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
              style={{ background: tk.tileBg }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={17} style={{ color: tk.textSecondary }} strokeWidth={2} />
            </motion.button>
            <h2
              className="font-display"
              style={{ color: tk.textPrimary, fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {historyEntry ? historyEntry.restaurant : t.scanResults}
            </h2>
            <motion.button
              className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: tk.tileBg }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={17} style={{ color: tk.textSecondary }} strokeWidth={2} />
            </motion.button>
          </motion.div>

          {/* ── Single-Food Layout ── */}
          {isSingleResult ? (
            <SingleFoodResult
              result={processedResults[0]}
              memberResults={processedResults[0].memberResults}
            />
          ) : (
            <>
              {/* ── Summary card (multi-item) ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-elevated rounded-[20px] p-5 mb-7"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                      boxShadow: "0 4px 12px rgba(30,27,75,0.2)",
                    }}
                  >
                    {isFamilyMode ? (
                      <Users size={17} className="text-white" strokeWidth={2} />
                    ) : (
                      <Shield size={17} className="text-white" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-display"
                      style={{ color: tk.textPrimary, fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}
                    >
                      {t.itemsAnalyzed(rawResults.length)}
                    </p>
                    <p style={{ color: tk.textSecondary, fontSize: 12.5, fontWeight: 500 }}>
                      {isFamilyMode
                        ? t.checkedForFamily(people.length)
                        : t.basedOnProfile}
                    </p>
                  </div>
                </div>

                {/* Status pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {dangerItems.length > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-[6px] rounded-[10px]"
                      style={{ background: STATUS_CONFIG.danger.pillBg }}
                    >
                      <div className={`w-[6px] h-[6px] rounded-full ${STATUS_CONFIG.danger.dot}`} />
                      <span className="font-display" style={{ fontSize: 12, fontWeight: 650, color: STATUS_CONFIG.danger.pillText }}>
                        {t.avoidCount(dangerItems.length)}
                      </span>
                    </div>
                  )}
                  {cautionItems.length > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-[6px] rounded-[10px]"
                      style={{ background: STATUS_CONFIG.caution.pillBg }}
                    >
                      <div className={`w-[6px] h-[6px] rounded-full ${STATUS_CONFIG.caution.dot}`} />
                      <span className="font-display" style={{ fontSize: 12, fontWeight: 650, color: STATUS_CONFIG.caution.pillText }}>
                        {t.cautionCount(cautionItems.length)}
                      </span>
                    </div>
                  )}
                  {safeItems.length > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-3 py-[6px] rounded-[10px]"
                      style={{ background: STATUS_CONFIG.safe.pillBg }}
                    >
                      <div className={`w-[6px] h-[6px] rounded-full ${STATUS_CONFIG.safe.dot}`} />
                      <span className="font-display" style={{ fontSize: 12, fontWeight: 650, color: STATUS_CONFIG.safe.pillText }}>
                        {t.safeCount(safeItems.length)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Family member summary rows */}
                {memberSummary && memberSummary.length > 0 && (
                  <>
                    <div className="h-px my-4" style={{ background: tk.cardBorder }} />
                    <div className="flex flex-col gap-2.5">
                      {memberSummary.map((m) => {
                        const allSafe = m.dangerCount === 0 && m.cautionCount === 0;
                        return (
                          <div key={m.id} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                              style={{ background: memberAvatarBg(m.colorIndex) }}
                            >
                              <span className="text-white font-display" style={{ fontSize: 11, fontWeight: 800 }}>
                                {getInitials(m.name)}
                              </span>
                            </div>
                            <p
                              className="font-display flex-1 truncate"
                              style={{ fontSize: 13.5, fontWeight: 650, letterSpacing: "-0.01em", color: tk.textPrimary }}
                            >
                              {m.name}
                            </p>
                            {allSafe ? (
                              <div
                                className="flex items-center gap-1 px-2.5 py-[4px] rounded-[9px]"
                                style={{ background: STATUS_CONFIG.safe.pillBg }}
                              >
                                <CheckCircle2 size={11} style={{ color: STATUS_CONFIG.safe.pillText }} strokeWidth={2.5} />
                                <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: STATUS_CONFIG.safe.pillText }}>
                                  {t.allSafe}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                {m.dangerCount > 0 && (
                                  <div
                                    className="flex items-center gap-1 px-2 py-[3px] rounded-[8px]"
                                    style={{ background: STATUS_CONFIG.danger.pillBg }}
                                  >
                                    <XOctagon size={10} style={{ color: STATUS_CONFIG.danger.pillText }} strokeWidth={2.5} />
                                    <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: STATUS_CONFIG.danger.pillText }}>
                                      {t.avoidCount(m.dangerCount)}
                                    </span>
                                  </div>
                                )}
                                {m.cautionCount > 0 && (
                                  <div
                                    className="flex items-center gap-1 px-2 py-[3px] rounded-[8px]"
                                    style={{ background: STATUS_CONFIG.caution.pillBg }}
                                  >
                                    <AlertTriangle size={10} style={{ color: STATUS_CONFIG.caution.pillText }} strokeWidth={2.5} />
                                    <span className="font-display" style={{ fontSize: 11, fontWeight: 700, color: STATUS_CONFIG.caution.pillText }}>
                                      {t.cautionCount(m.cautionCount)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </div>

        {/* ── Results sections (multi-item only) ── */}
        {!isSingleResult && (
          <div className="px-7 pb-8 space-y-7">
            <div className="mt-8 mb-4 px-1 flex items-center justify-between">
              <h3
                className="font-display"
                style={{ color: tk.textPrimary, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                {t.matchesOnMenu}
              </h3>
              <span
                className="px-3 py-[5px] rounded-[10px] font-display"
                style={{ background: tk.tileBg, color: tk.textSecondary, fontSize: 12, fontWeight: 700 }}
              >
                {rawResults.length}
              </span>
            </div>
            {sections.map((section, si) => {
              const config = STATUS_CONFIG[section.status];
              const SectionIcon = config.icon;
              return (
                <motion.div
                  key={section.status}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + si * 0.09 }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-6 h-6 rounded-[7px] flex items-center justify-center"
                      style={{ background: config.lightBg }}
                    >
                      <SectionIcon size={13} style={{ color: config.pillText }} strokeWidth={2.5} />
                    </div>
                    <span
                      className="font-display"
                      style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "-0.01em", color: config.pillText }}
                    >
                      {config.label}
                    </span>
                    <div className="flex-1 h-[1px] ml-1" style={{ background: tk.cardBorder }} />
                    <span className="font-display" style={{ fontSize: 12, fontWeight: 600, color: tk.textSecondary }}>
                      {section.items.length}
                    </span>
                  </div>

                  {section.status === "danger" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2.5 mb-3 px-3.5 py-3 rounded-[14px]"
                      style={{
                        background: isDark ? "rgba(239,68,68,0.08)" : "rgba(254,242,242,0.7)",
                        border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(254,202,202,0.4)"}`,
                      }}
                    >
                      <Info size={13} style={{ color: STATUS_CONFIG.danger.pillText, marginTop: 2 }} strokeWidth={2.2} />
                      <p style={{ color: STATUS_CONFIG.danger.pillText, fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, opacity: 0.8 }}>
                        {isFamilyMode ? t.familyDangerWarning : config.description}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-3">
                    {section.items.slice(0, visibleCount).map((result, i) => (
                      <ResultCard
                        key={result.id}
                        result={result}
                        index={i}
                        memberResults={result.memberResults ?? null}
                      />
                    ))}
                  </div>
                </motion.div>
              );
            })}
            {/* Sentinel — triggers loading more items when scrolled into view */}
            {processedResults.length > visibleCount && (
              <div ref={sentinelCallback} className="h-4" />
            )}
          </div>
        )}

        {/* ── Bottom action ── */}
        <div className="px-7 pb-14 pt-2">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => navigate("/scan")}
            className="w-full text-white py-[15px] rounded-2xl flex items-center justify-center gap-2.5 font-display"
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              boxShadow: "0 8px 24px -4px rgba(30,27,75,0.35)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {isSingleResult ? (
              <>
                <Search size={17} strokeWidth={2} />
                {t.searchAnotherFood}
              </>
            ) : (
              <>
                <ScanLine size={18} strokeWidth={2} />
                {t.scanAnotherMenu}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
}
