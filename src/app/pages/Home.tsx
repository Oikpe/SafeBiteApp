import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { HeroSection } from "../components/home/HeroSection";
import { ScanCTACard } from "../components/home/ScanCTACard";
import { StatsRow } from "../components/home/StatsRow";
import { RecentScans } from "../components/home/RecentScans";

export default function Home() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  // ── Theme-adaptive card tokens ────────────────────────────────────────────
  // Defined once here and passed down as props so sub-components stay
  // independent of the global theme context.
  const card = {
    bg: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.72)",
    border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(148,163,184,0.13)",
    title: isDark ? "rgba(255,255,255,0.95)" : "#1e293b",
    meta: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8",
    sectionTitle: isDark ? "rgba(255,255,255,0.9)" : "#1e293b",
    dangerPillBg: isDark ? "rgba(239,68,68,0.15)" : "rgba(220,38,38,0.07)",
    dangerPillBorder: isDark ? "1px solid rgba(239,68,68,0.28)" : "1px solid rgba(220,38,38,0.18)",
    arrowColor: isDark ? "rgba(255,255,255,0.25)" : "#94a3b8",
    emptyBorder: isDark ? "1.5px dashed rgba(255,255,255,0.12)" : "1.5px dashed rgba(148,163,184,0.32)",
    emptyIconBg: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
  };

  return (
    <MobileLayout noPadding withNav>
      <div className="pb-36 overflow-y-auto no-scrollbar min-h-dvh">
        {/* ── Hero (dark gradient strip) ── */}
        <HeroSection />

        {/* ── Content ── */}
        <div className="relative px-6 -mt-3 pb-6">
          {/* Scan CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.52, ease: [0.32, 0.72, 0, 1] }}
            className="mb-3"
          >
            <ScanCTACard />
          </motion.div>

          {/* Stats row */}
          <StatsRow />

          {/* Recent scans */}
          <RecentScans
            cardBg={card.bg}
            cardBorder={card.border}
            cardTitle={card.title}
            cardMeta={card.meta}
            sectionTitle={card.sectionTitle}
            dangerPillBg={card.dangerPillBg}
            dangerPillBorder={card.dangerPillBorder}
            arrowColor={card.arrowColor}
            emptyBorder={card.emptyBorder}
            emptyIconBg={card.emptyIconBg}
          />
        </div>
      </div>
    </MobileLayout>
  );
}