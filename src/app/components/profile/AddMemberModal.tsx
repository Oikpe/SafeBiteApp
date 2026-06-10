// ─── AddMemberModal ───────────────────────────────────────────────────────────
// Bottom-sheet for adding a new family member: name input + allergy selection.

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { ALLERGY_LIST, useApp } from "../../context/AppContext";
import type { ThemeTokens } from "../../utils/theme";
import { UserPlus, X, Check, ChevronRight } from "lucide-react";
import { T } from "../../i18n/translations";

interface AddMemberModalProps {
    isOpen: boolean;
    tk: ThemeTokens;
    onClose: () => void;
    onAdd: (name: string, allergies: string[]) => void;
}

export function AddMemberModal({ isOpen, tk, onClose, onAdd }: AddMemberModalProps) {
    const { language } = useApp();
    const t = T[language];
    const [name, setName] = useState("");
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
    const [step, setStep] = useState<"name" | "allergies">("name");
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when sheet opens
    useEffect(() => {
        if (isOpen && step === "name") {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, step]);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setName("");
                setSelectedAllergies([]);
                setStep("name");
            }, 300);
        }
    }, [isOpen]);

    const toggleAllergy = (id: string) => {
        setSelectedAllergies((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };

    const handleAdd = () => {
        if (!name.trim()) return;
        onAdd(name.trim(), selectedAllergies);
        onClose();
    };

    const canProceed = name.trim().length > 0;

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
                        className="relative w-full max-w-[430px] rounded-t-[28px] px-6 pt-5"
                        style={{
                            background: tk.modalBg,
                            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
                            paddingBottom: "max(40px, calc(env(safe-area-inset-bottom, 0px) + 32px))",
                        }}
                    >
                        {/* Handle */}
                        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: tk.sheetHandleBg }} />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3
                                    className="font-display"
                                    style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: tk.textPrimary }}
                                >
                                    {step === "name" ? t.addFamilyMemberTitle : `Allergies for ${name}`}
                                </h3>
                                <p className="font-display mt-0.5" style={{ fontSize: 12.5, color: tk.textTertiary, fontWeight: 500 }}>
                                    {step === "name" ? t.enterTheirName : "Select all that apply — can be updated later"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: tk.tileBg }}
                            >
                                <X size={16} style={{ color: tk.textSecondary }} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Step: Name */}
                        <AnimatePresence mode="wait">
                            {step === "name" && (
                                <motion.div
                                    key="name-step"
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 16 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        ref={inputRef}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter" && canProceed) setStep("allergies"); }}
                                        placeholder="e.g. Mom, Dad, Alex…"
                                        className="w-full rounded-[16px] px-4 font-display outline-none"
                                        style={{
                                            height: 54,
                                            fontSize: 16,
                                            fontWeight: 600,
                                            letterSpacing: "-0.01em",
                                            background: tk.tileBg,
                                            border: `1.5px solid ${canProceed ? tk.accentBorder : tk.cardBorder}`,
                                            color: tk.textPrimary,
                                            transition: "border-color 0.2s",
                                        }}
                                    />
                                    <motion.button
                                        onClick={() => { if (canProceed) setStep("allergies"); }}
                                        disabled={!canProceed}
                                        className="w-full mt-4 flex items-center justify-center gap-2.5 rounded-[16px] font-display"
                                        style={{
                                            height: 54,
                                            fontSize: 15,
                                            fontWeight: 700,
                                            letterSpacing: "-0.01em",
                                            opacity: canProceed ? 1 : 0.4,
                                            background: "linear-gradient(135deg, #EEA594 0%, #EC6C56 100%)",
                                            color: "#fff",
                                            boxShadow: canProceed ? "0 8px 24px -4px rgba(236,108,86,0.35)" : "none",
                                            transition: "opacity 0.2s, box-shadow 0.2s",
                                            border: "none",
                                            cursor: canProceed ? "pointer" : "not-allowed",
                                        }}
                                        whileTap={canProceed ? { scale: 0.975 } : undefined}
                                    >
                                        {t.nextSelectAllergies}
                                        <ChevronRight size={17} strokeWidth={2.2} />
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Step: Allergies */}
                            {step === "allergies" && (
                                <motion.div
                                    key="allergy-step"
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className="grid grid-cols-2 gap-2 mb-4"
                                        style={{ maxHeight: 260, overflowY: "auto" }}
                                    >
                                        {ALLERGY_LIST.map((allergy) => {
                                            const isSelected = selectedAllergies.includes(allergy.id);
                                            const Icon = allergy.icon;
                                            return (
                                                <motion.button
                                                    key={allergy.id}
                                                    onClick={() => toggleAllergy(allergy.id)}
                                                    className="relative flex items-center gap-2.5 rounded-[14px] px-3 py-3 text-left"
                                                    style={{
                                                        background: isSelected ? "rgba(36,61,142,0.10)" : tk.tileBg,
                                                        border: `1.5px solid ${isSelected ? "rgba(36,61,142,0.30)" : tk.tileBorder}`,
                                                        transition: "background 0.18s, border-color 0.18s",
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Icon
                                                        size={16}
                                                        style={{ color: isSelected ? "#243D8E" : tk.textTertiary, flexShrink: 0 }}
                                                        strokeWidth={1.8}
                                                    />
                                                    <span
                                                        className="font-display truncate"
                                                        style={{ fontSize: 12.5, fontWeight: 600, color: isSelected ? "#243D8E" : tk.textPrimary }}
                                                    >
                                                        {allergy.name}
                                                    </span>
                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#243D8E" }}>
                                                            <Check size={9} className="text-white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <motion.button
                                            onClick={() => setStep("name")}
                                            className="flex-none rounded-[16px] font-display"
                                            style={{
                                                height: 54,
                                                width: 54,
                                                fontSize: 14,
                                                fontWeight: 700,
                                                background: tk.tileBg,
                                                border: `1.5px solid ${tk.cardBorder}`,
                                                color: tk.textSecondary,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            ←
                                        </motion.button>
                                        <motion.button
                                            onClick={handleAdd}
                                            className="flex-1 flex items-center justify-center gap-2.5 rounded-[16px] font-display"
                                            style={{
                                                height: 54,
                                                fontSize: 15,
                                                fontWeight: 700,
                                                letterSpacing: "-0.01em",
                                                background: "linear-gradient(135deg, #EEA594 0%, #EC6C56 100%)",
                                                color: "#fff",
                                                boxShadow: "0 8px 24px -4px rgba(236,108,86,0.35)",
                                                border: "none",
                                            }}
                                            whileTap={{ scale: 0.975 }}
                                        >
                                            <UserPlus size={17} strokeWidth={2.2} />
                                            {t.addName(name)}
                                            {selectedAllergies.length > 0 && (
                                                <span
                                                    className="rounded-full font-display"
                                                    style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.2)", padding: "1px 6px" }}
                                                >
                                                    {selectedAllergies.length} {t.allergyLabel}
                                                </span>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
