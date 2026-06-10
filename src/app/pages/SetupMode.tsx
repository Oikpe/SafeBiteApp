import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp } from "../context/AppContext";
import { User, Users, ArrowRight, ArrowLeft } from "lucide-react";

const MODES = [
  {
    id: "personal" as const,
    icon: User,
    title: "Just me",
    description: "Set up your personal allergy profile for safe solo dining",
    gradient: "from-indigo-500 to-blue-600",
    lightGradient: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    ring: "ring-indigo-200",
  },
  {
    id: "family" as const,
    icon: Users,
    title: "My family",
    description: "Manage allergy profiles for your whole family in one place",
    gradient: "from-violet-500 to-purple-600",
    lightGradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    ring: "ring-violet-200",
  },
];

export default function SetupMode() {
  const navigate = useNavigate();
  const { mode, setMode, theme } = useApp();

  const handleContinue = () => {
    if (mode) {
      navigate("/allergy-setup");
    }
  };

  return (
    <MobileLayout noPadding>
      <div className="flex flex-col min-h-dvh px-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-14 pb-2"
        >
          {/* Top spacer where logo used to be, replaced with Back Button */}
          <div className="flex items-center pt-8 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-[14px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-indigo-500 font-display" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              Step 1 of 2
            </span>
          </div>

          <h1
            className="font-display text-slate-900 mb-2"
            style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.035em" }}
          >
            Who are you{"\n"}protecting?
          </h1>
          <p className="text-slate-400" style={{ fontSize: 15, lineHeight: 1.55, letterSpacing: "-0.01em" }}>
            Choose how you want to use SafeBite
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="flex-1 flex flex-col gap-5 pt-10">
          {MODES.map((m, index) => {
            const isSelected = mode === m.id;

            // All per-mode style data defined inline — no changes needed outside this element
            const styleData = {
              personal: {
                gradientStyle: "linear-gradient(135deg, #6366f1 0%, #2563eb 100%)",
                accentColor: "#6366f1",
                bgWash: "linear-gradient(135deg, rgba(99,102,241,0.09) 0%, rgba(255,255,255,0.3) 70%)",
                glowColor: "rgba(99,102,241,0.22)",
                shadowColor: "rgba(99,102,241,0.38)",
                chipBg: "rgba(99,102,241,0.09)",
                borderColor: "rgba(99,102,241,0.28)",
                count: "1",
                countLabel: "Personal profile",
                features: ["Instant scan", "Risk alerts", "Dining history"],
              },
              family: {
                gradientStyle: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                accentColor: "#8b5cf6",
                bgWash: "linear-gradient(135deg, rgba(139,92,246,0.09) 0%, rgba(255,255,255,0.3) 70%)",
                glowColor: "rgba(139,92,246,0.22)",
                shadowColor: "rgba(139,92,246,0.38)",
                chipBg: "rgba(139,92,246,0.09)",
                borderColor: "rgba(139,92,246,0.28)",
                count: "8+",
                countLabel: "Up to 8 members",
                features: ["Multi profiles", "Per-member alerts", "Shared scans"],
              },
            }[m.id];

            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + index * 0.13,
                  duration: 0.52,
                  ease: [0.32, 0.72, 0, 1],
                }}
                onClick={() => setMode(m.id)}
                className="relative text-left rounded-[26px] overflow-hidden"
                whileTap={{ scale: 0.972 }}
                style={{
                  background: isSelected
                    ? styleData.bgWash
                    : "rgba(255,255,255,0.52)",
                  border: isSelected
                    ? `1.5px solid ${styleData.borderColor}`
                    : "1.5px solid rgba(148,163,184,0.14)",
                  boxShadow: isSelected
                    ? `0 10px 40px -10px ${styleData.shadowColor}, 0 2px 8px rgba(0,0,0,0.04)`
                    : "0 2px 12px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  transition: "background 0.45s ease, border 0.35s ease, box-shadow 0.45s ease",
                }}
              >
                {/* Left full-height gradient accent bar */}
                <motion.div
                  className="absolute left-0 top-4 bottom-4 w-[3.5px] rounded-full"
                  style={{ background: styleData.gradientStyle, transformOrigin: "center" }}
                  animate={{ scaleY: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />

                {/* Ambient glow orb — bottom right */}
                <motion.div
                  className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${styleData.glowColor} 0%, transparent 70%)`,
                  }}
                  animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.4 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />

                {/* Top-left gradient bloom */}
                <motion.div
                  className="absolute -left-6 -top-6 w-24 h-24 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${styleData.glowColor} 0%, transparent 70%)`,
                  }}
                  animate={{ opacity: isSelected ? 0.6 : 0, scale: isSelected ? 1 : 0.3 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                />

                {/* Watermark count */}
                <motion.span
                  className="absolute right-6 top-1/2 -translate-y-1/2 font-display pointer-events-none select-none"
                  animate={{
                    opacity: isSelected ? 0.1 : 0.035,
                    scale: isSelected ? 1 : 0.82,
                    y: isSelected ? "-50%" : "-40%",
                  }}
                  transition={{ duration: 0.45 }}
                  style={{
                    fontSize: 88,
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    color: styleData.accentColor,
                    lineHeight: 1,
                  }}
                >
                  {styleData.count}
                </motion.span>

                <div className="relative z-10 px-5 pt-5 pb-4">
                  {/* Top row: icon + text + selector */}
                  <div className="flex items-center gap-4">
                    {/* Icon with halo */}
                    <motion.div
                      animate={isSelected ? { scale: 1.07 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 360, damping: 22 }}
                      className="relative flex-shrink-0"
                    >
                      {/* Halo glow ring */}
                      <motion.div
                        className="absolute inset-[-7px] rounded-[26px]"
                        style={{
                          background: `radial-gradient(ellipse, ${styleData.glowColor} 0%, transparent 72%)`,
                        }}
                        animate={{ opacity: isSelected ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div
                        className="relative w-[52px] h-[52px] rounded-[18px] flex items-center justify-center"
                        style={{
                          background: isSelected ? styleData.gradientStyle : "rgba(148,163,184,0.1)",
                          boxShadow: isSelected ? `0 6px 20px ${styleData.shadowColor}` : "none",
                          transition: "background 0.4s ease, box-shadow 0.4s ease",
                        }}
                      >
                        <m.icon
                          size={22}
                          className={isSelected ? "text-white" : "text-slate-400"}
                          strokeWidth={isSelected ? 2.1 : 1.7}
                          style={{ transition: "color 0.3s" }}
                        />
                      </div>
                    </motion.div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-display mb-0.5"
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          letterSpacing: "-0.028em",
                          color: isSelected ? "#1e1b4b" : "#1e293b",
                          transition: "color 0.3s",
                        }}
                      >
                        {m.title}
                      </h3>
                      <motion.p
                        animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : -4 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                          color: styleData.accentColor,
                          textTransform: "uppercase",
                        }}
                        className="font-display"
                      >
                        {styleData.countLabel}
                      </motion.p>
                    </div>

                    {/* Animated selection badge */}
                    <motion.div
                      className="flex-shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center"
                      transition={{ type: "spring", stiffness: 520, damping: 22 }}
                      style={{
                        background: isSelected ? styleData.gradientStyle : "transparent",
                        border: isSelected ? "none" : "1.5px solid rgba(148,163,184,0.38)",
                        boxShadow: isSelected ? `0 3px 10px ${styleData.shadowColor}` : "none",
                        transition: "border 0.3s, box-shadow 0.3s",
                      }}
                    >
                      {isSelected && (
                        <motion.svg
                          width="11"
                          height="9"
                          viewBox="0 0 11 9"
                          fill="none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.08 }}
                        >
                          <motion.path
                            d="M1.5 4.5L4 7L9.5 1.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.32, ease: "easeOut" }}
                          />
                        </motion.svg>
                      )}
                    </motion.div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-slate-400 mt-3"
                    style={{ fontSize: 13, lineHeight: 1.55 }}
                  >
                    {m.description}
                  </p>

                  {/* Feature chips — staggered entrance when selected */}
                  <motion.div
                    className="flex gap-2 flex-wrap overflow-hidden"
                    initial={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
                    animate={{
                      maxHeight: isSelected ? 72 : 0,
                      opacity: isSelected ? 1 : 0,
                      marginTop: isSelected ? 10 : 0,
                    }}
                    transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {styleData.features.map((feature, i) => (
                      <motion.span
                        key={feature}
                        animate={
                          isSelected
                            ? { opacity: 1, y: 0, scale: 1 }
                            : { opacity: 0, y: 6, scale: 0.88 }
                        }
                        transition={{
                          delay: isSelected ? 0.12 + i * 0.075 : 0,
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                        }}
                        className="font-display rounded-full whitespace-nowrap"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.005em",
                          padding: "4px 11px",
                          background: styleData.chipBg,
                          color: styleData.accentColor,
                        }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        <motion.div
          className="pb-12 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <motion.button
            onClick={handleContinue}
            disabled={!mode}
            className={`w-full flex items-center justify-center gap-2.5 rounded-2xl font-display transition-[background-color,color,box-shadow,border-color] duration-300 ${mode
              ? "text-white"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            style={{
              padding: "17px",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              ...(mode
                ? {
                  background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                  boxShadow: "0 8px 24px -4px rgba(30, 27, 75, 0.35)",
                }
                : {}),
            }}
            whileTap={mode ? { scale: 0.975 } : undefined}
          >
            Continue
            <ArrowRight size={18} strokeWidth={2.2} className="mt-[2px]" />
          </motion.button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}