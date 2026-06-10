import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { ShieldCheck, ScanLine, Users, ArrowRight, ChevronRight, User, ArrowLeft, ChevronLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { SafeToEatIcon, ScanMenuIcon, ProtectFamilyIcon } from "../components/OnboardingIcons";

const SLIDES = [
  {
    icon: SafeToEatIcon,
    title: "Know what's\nsafe to eat",
    subtitle:
      "SafeBite analyzes restaurant menus and food labels to identify allergens specific to your profile.",
    accent: "from-emerald-500 to-teal-600",
    orb1: "bg-emerald-400/20",
    orb2: "bg-teal-300/15",
    orb3: "bg-cyan-400/10",
    bg: "radial-gradient(at 30% 20%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(at 70% 70%, rgba(20,184,166,0.08) 0%, transparent 50%), linear-gradient(180deg, #f0fdf9 0%, #f0fdfa 50%, #f5f3ff 100%)",
  },
  {
    icon: ScanMenuIcon,
    title: "Scan any\nmenu instantly",
    subtitle:
      "Point your camera at any menu or search manually. Our AI identifies every potential allergen in seconds.",
    accent: "from-indigo-500 to-blue-600",
    orb1: "bg-indigo-400/20",
    orb2: "bg-blue-300/15",
    orb3: "bg-violet-400/10",
    bg: "radial-gradient(at 20% 30%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(at 80% 70%, rgba(59,130,246,0.08) 0%, transparent 50%), linear-gradient(180deg, #eef2ff 0%, #f0f5ff 50%, #faf5ff 100%)",
  },
  {
    icon: ProtectFamilyIcon,
    title: "Protect your\nwhole family",
    subtitle:
      "Add family members with their own allergy profiles. Check menu safety for everyone at once.",
    accent: "from-violet-500 to-purple-600",
    orb1: "bg-violet-400/20",
    orb2: "bg-purple-300/15",
    orb3: "bg-fuchsia-400/10",
    bg: "radial-gradient(at 60% 20%, rgba(139,92,246,0.12) 0%, transparent 60%), radial-gradient(at 20% 80%, rgba(168,85,247,0.08) 0%, transparent 50%), linear-gradient(180deg, #f5f3ff 0%, #faf5ff 50%, #fdf2f8 100%)",
  },
];

export default function Onboarding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showNameStep, setShowNameStep] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const slide = SLIDES[activeSlide];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setDirection(1);
      setActiveSlide(activeSlide + 1);
    } else {
      setShowNameStep(true);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  };

  const handleLetsGo = () => {
    const trimmed = nameValue.trim();
    if (!trimmed) return;
    setCurrentUser(trimmed);
    navigate("/setup-mode");
  };

  const handleSkip = () => {
    setShowNameStep(true);
    setTimeout(() => inputRef.current?.focus(), 400);
  };

  return (
    <MobileLayout noPadding className="">
      <AnimatePresence mode="wait">
        {showNameStep ? (
          /* ── Name step ── */
          <motion.div
            key="name-step"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative min-h-dvh flex flex-col"
            style={{
              background:
                "radial-gradient(at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 55%), radial-gradient(at 70% 75%, rgba(139,92,246,0.08) 0%, transparent 55%), linear-gradient(180deg, #eef2ff 0%, #f5f3ff 60%, #fdf2f8 100%)",
            }}
          >
            {/* Ambient orbs */}
            <div
              className="absolute w-[260px] h-[260px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
                top: "-8%",
                right: "-15%",
              }}
            />
            <div
              className="absolute w-[180px] h-[180px] rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
                bottom: "15%",
                left: "-10%",
              }}
            />

            <div className="relative z-10 flex flex-col flex-1 px-7">
              {/* Top bar (Removed Logo, Added Back Button) */}
              <div className="flex items-center justify-between pt-14 pb-4 h-24">
                <button
                  onClick={() => setShowNameStep(false)}
                  className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center shadow-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                {/* Avatar illustration */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                  className="relative mb-10 self-start"
                >
                  <div
                    className="w-[72px] h-[72px] rounded-[22px] flex items-center justify-center relative z-10"
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 8px 32px -4px rgba(99,102,241,0.35)",
                    }}
                  >
                    <User size={30} className="text-white" strokeWidth={1.7} />
                  </div>
                  <div
                    className="absolute -inset-3 rounded-[28px] blur-xl opacity-20 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="font-display text-slate-900 mb-4 whitespace-pre-line"
                  style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.035em" }}
                >
                  {"What's your\nname?"}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.45 }}
                  className="text-slate-400 mb-10 max-w-[270px]"
                  style={{ fontSize: 15.5, lineHeight: 1.6, letterSpacing: "-0.01em" }}
                >
                  This helps us personalize your SafeBite experience.
                </motion.p>

                {/* Input */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.45 }}
                  className="relative mb-5"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLetsGo()}
                    placeholder="Type your name..."
                    className="w-full rounded-[18px] px-5 py-[18px] text-slate-700 placeholder:text-slate-300 outline-none font-display transition-all duration-300"
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.015em",
                      background: "rgba(255,255,255,0.82)",
                      border: nameValue
                        ? "2px solid rgba(99,102,241,0.4)"
                        : "2px solid rgba(148,163,184,0.2)",
                      boxShadow: nameValue
                        ? "0 0 0 4px rgba(99,102,241,0.08)"
                        : "none",
                      backdropFilter: "blur(16px)",
                    }}
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                  {nameValue.trim() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                    >
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* Name preview */}
                <AnimatePresence>
                  {nameValue.trim() && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="font-display text-indigo-500 mb-0 pl-1"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      Hi, {nameValue.trim()}!
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* "Let's Go" Button placed right under the text input as requested */}
                {nameValue.trim() !== "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLetsGo}
                      className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-display transition-[background-color,color,box-shadow,border-color] duration-300"
                      style={{
                        padding: "17px",
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        color: "#ffffff",
                        boxShadow: "0 8px 24px -4px rgba(99,102,241,0.4)",
                      }}
                    >
                      Let's Go
                      <ArrowRight size={18} strokeWidth={2.2} className="mt-[2px]" />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Slides ── */
          <motion.div
            key="slides"
            className="relative min-h-dvh"
            animate={{ background: slide.bg }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Floating orbs */}
            <motion.div
              className={`absolute w-[280px] h-[280px] rounded-full ${slide.orb1} blur-3xl`}
              animate={{ x: activeSlide * -30 + 20, y: activeSlide * 20 - 80 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ top: "5%", right: "-15%" }}
            />
            <motion.div
              className={`absolute w-[200px] h-[200px] rounded-full ${slide.orb2} blur-3xl animate-float-delayed`}
              style={{ bottom: "20%", left: "-10%" }}
            />
            <motion.div
              className={`absolute w-[160px] h-[160px] rounded-full ${slide.orb3} blur-2xl animate-float-slow`}
              style={{ top: "40%", right: "10%" }}
            />

            <div className="relative z-10 flex flex-col min-h-dvh px-7">
              {/* Top bar (Logo removed, Skip button kept aligned right) */}
              <div className="flex items-center justify-between pt-14 pb-4 h-24">
                <div className="w-12 h-12 flex items-center justify-start">
                  {activeSlide > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => {
                        setDirection(-1);
                        setActiveSlide((prev) => prev - 1);
                      }}
                      className="w-[42px] h-[42px] flex items-center justify-center rounded-[14px] glass-subtle transition-all duration-300"
                      whileTap={{ scale: 0.92 }}
                    >
                      <ChevronLeft size={22} className="text-slate-600 outline-none" strokeWidth={2.5} />
                    </motion.button>
                  )}
                </div>

                {activeSlide < SLIDES.length - 1 && (
                  <motion.button
                    onClick={handleSkip}
                    className="text-slate-400 px-4 py-2 rounded-full glass-subtle"
                    style={{ fontSize: 13, fontWeight: 500 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Skip
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center pb-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeSlide}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 60, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: direction * -60, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                    className="flex flex-col items-start"
                  >
                    <motion.div
                      className="relative mb-10"
                      initial={{ scale: 0.85, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
                    >
                      <div
                        className={`w-[130px] h-[130px] rounded-[32px] bg-gradient-to-br ${slide.accent} flex items-center justify-center relative z-10`}
                        style={{ boxShadow: "0 16px 32px -8px rgba(0,0,0,0.25)" }}
                      >
                        {/* Slide Icon (Custom Composed SVGs) */}
                        <slide.icon size={68} />
                      </div>
                    </motion.div>

                    <h1
                      className="font-display text-slate-900 mb-5 whitespace-pre-line"
                      style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.035em" }}
                    >
                      {slide.title}
                    </h1>

                    <p
                      className="text-slate-500 max-w-[300px]"
                      style={{ fontSize: 15.5, lineHeight: 1.65, letterSpacing: "-0.01em" }}
                    >
                      {slide.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom */}
              <div className="pb-12 flex items-center justify-between">
                <div className="flex gap-2">
                  {SLIDES.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setDirection(i > activeSlide ? 1 : -1);
                        setActiveSlide(i);
                      }}
                      className="relative h-[6px] rounded-full overflow-hidden"
                      animate={{
                        width: i === activeSlide ? 32 : 8,
                        backgroundColor: i === activeSlide ? "#1e1b4b" : "#cbd5e1",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      {i === activeSlide && (
                        <motion.div
                          className="absolute inset-0 rounded-full shimmer"
                          style={{ opacity: 0.4 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleNext}
                  className={`flex items-center gap-2 bg-gradient-to-r ${slide.accent} text-white rounded-2xl`}
                  style={{
                    padding: "15px 26px",
                    fontSize: 15,
                    fontWeight: 650,
                    letterSpacing: "-0.01em",
                    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="font-display">
                    {activeSlide === SLIDES.length - 1 ? "Get Started" : "Next"}
                  </span>
                  {activeSlide === SLIDES.length - 1 ? (
                    <ArrowRight size={17} strokeWidth={2.2} className="mt-[2px]" />
                  ) : (
                    <ChevronRight size={17} strokeWidth={2.2} className="mt-[2px]" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileLayout >
  );
}
