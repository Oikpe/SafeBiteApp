import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { MobileLayout } from "../components/MobileLayout";
import { useApp, ALLERGY_LIST } from "../context/AppContext";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";

const ACCENT_COLORS = [
  { bg: "bg-amber-50", active: "from-amber-500 to-orange-600", text: "text-amber-600", shadow: "rgba(245,158,11,0.25)" },     // Peanuts
  { bg: "bg-red-50", active: "from-red-500 to-rose-600", text: "text-red-500", shadow: "rgba(239,68,68,0.25)" },             // Shellfish
  { bg: "bg-cyan-50", active: "from-cyan-500 to-blue-600", text: "text-cyan-600", shadow: "rgba(6,182,212,0.25)" },          // Fish
  { bg: "bg-orange-50", active: "from-orange-400 to-yellow-500", text: "text-orange-500", shadow: "rgba(249,115,22,0.25)" }, // Eggs
  { bg: "bg-blue-50", active: "from-blue-500 to-indigo-600", text: "text-blue-500", shadow: "rgba(59,130,246,0.25)" },       // Dairy
  { bg: "bg-lime-50", active: "from-lime-500 to-green-600", text: "text-lime-600", shadow: "rgba(132,204,22,0.25)" },        // Gluten
  { bg: "bg-emerald-50", active: "from-emerald-500 to-teal-600", text: "text-emerald-600", shadow: "rgba(16,185,129,0.25)" },// Soy
  { bg: "bg-violet-50", active: "from-violet-500 to-purple-600", text: "text-violet-500", shadow: "rgba(139,92,246,0.25)" }, // Sesame
  { bg: "bg-fuchsia-50", active: "from-fuchsia-500 to-pink-600", text: "text-fuchsia-500", shadow: "rgba(217,70,239,0.25)" },// Sulfites
  { bg: "bg-yellow-50", active: "from-yellow-400 to-amber-500", text: "text-yellow-600", shadow: "rgba(234,179,8,0.25)" },   // Mustard
];

export default function AllergySetup() {
  const navigate = useNavigate();
  const { allergies, toggleAllergy, completeOnboarding } = useApp();

  const handleFinish = () => {
    completeOnboarding();
    navigate("/home");
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
          <div className="flex items-center gap-3 mb-8">
            <motion.button
              onClick={() => navigate(-1)}
              className="w-10 h-10 glass-card rounded-[14px] flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={17} className="text-slate-600" strokeWidth={2} />
            </motion.button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-indigo-500 font-display" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase" }}>
              Step 2 of 2
            </span>
          </div>

          <h1
            className="font-display text-slate-900 mb-2"
            style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.035em" }}
          >
            Select your allergies
          </h1>
          <p className="text-slate-400" style={{ fontSize: 14.5, lineHeight: 1.55, letterSpacing: "-0.01em" }}>
            Choose all that apply. You can update these later.
          </p>
        </motion.div>

        {/* Allergy grid */}
        <div className="flex-1 pt-7 pb-4 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-3">
            {ALLERGY_LIST.map((allergy, index) => {
              const isSelected = allergies.includes(allergy.id);
              const Icon = allergy.icon;
              const color = ACCENT_COLORS[index];

              return (
                <motion.button
                  key={allergy.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.04 * index,
                    duration: 0.4,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  onClick={() => toggleAllergy(allergy.id)}
                  className={`relative flex flex-col items-start h-[158px] text-left p-4 rounded-[18px] transition-[background-color,color,box-shadow,border-color] duration-300 ${isSelected
                    ? `bg-gradient-to-br ${color.active}`
                    : "glass-card"
                    }`}
                  style={
                    isSelected
                      ? { boxShadow: `0 8px 24px -4px ${color.shadow}` }
                      : {}
                  }
                  whileTap={{ scale: 0.94 }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute top-3 right-3 w-[22px] h-[22px] bg-white/25 rounded-full flex items-center justify-center"
                    >
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                  <div
                    className={`w-11 h-11 rounded-[14px] flex items-center justify-center mb-3 transition-all duration-300 ${isSelected ? "bg-white/20" : color.bg
                      }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors duration-300 ${isSelected ? "text-white" : color.text
                        }`}
                      strokeWidth={1.7}
                    />
                  </div>
                  <h4
                    className={`font-display mb-0.5 transition-colors duration-300 ${isSelected ? "text-white" : "text-slate-700"
                      }`}
                    style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.01em" }}
                  >
                    {allergy.name}
                  </h4>
                  <p
                    className={`transition-colors duration-300 ${isSelected ? "text-white/65" : "text-slate-400"
                      }`}
                    style={{ fontSize: 11.5, lineHeight: 1.4 }}
                  >
                    {allergy.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="pb-12 pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-display" style={{ fontSize: 13, fontWeight: 600 }}>
              {allergies.length} selected
            </span>
            <button
              onClick={() => {
                completeOnboarding();
                navigate("/home");
              }}
              className="text-slate-400"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              Skip for now
            </button>
          </div>
          <motion.button
            onClick={handleFinish}
            disabled={allergies.length === 0}
            className={`w-full flex items-center justify-center gap-2.5 rounded-2xl font-display transition-[background-color,color,box-shadow,border-color] duration-300 ${allergies.length > 0
              ? "text-white"
              : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            style={{
              padding: "17px",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              ...(allergies.length > 0
                ? {
                  background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                  boxShadow: "0 8px 24px -4px rgba(30, 27, 75, 0.35)",
                }
                : {}),
            }}
            whileTap={allergies.length > 0 ? { scale: 0.975 } : undefined}
          >
            Finish Setup
            <ArrowRight size={18} strokeWidth={2.2} className="mt-[2px]" />
          </motion.button>
        </div>
      </div>
    </MobileLayout>
  );
}