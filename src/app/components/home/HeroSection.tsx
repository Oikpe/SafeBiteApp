// ─── HeroSection ──────────────────────────────────────────────────────────────
// Reverted standard neat layout

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../../context/AppContext";
import { T } from "../../i18n/translations";
import { Bell, ShieldAlert, Phone, Info } from "lucide-react";

function getGreeting(t: any) {
    const h = new Date().getHours();
    if (h < 12) return t.goodMorning;
    if (h < 17) return t.goodAfternoon;
    return t.goodEvening;
}

export function HeroSection() {
    const navigate = useNavigate();
    const { currentUser, allergies, language } = useApp();
    const t = T[language];
    const hasAllergies = allergies.length > 0;

    // Carousel state
    const [currentIndex, setCurrentIndex] = useState(0);

    const notifications = [
        {
            id: 'active',
            icon: ShieldAlert,
            title: `${allergies.length} Allergens Active`,
            desc: "Monitoring your profile",
            color: "text-rose-500",
            bg: "bg-rose-100 dark:bg-rose-900/30",
            iconColor: "text-rose-600 dark:text-rose-400"
        },
        {
            id: 'reminder',
            icon: Info,
            title: "Safety First",
            desc: "Always notify the Chef of allergies",
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            iconColor: "text-amber-600 dark:text-amber-400"
        },
        {
            id: 'cross',
            icon: ShieldAlert,
            title: "Cross-Contamination",
            desc: "Ask about shared fryers & grills",
            color: "text-indigo-500",
            bg: "bg-indigo-100 dark:bg-indigo-900/30",
            iconColor: "text-indigo-600 dark:text-indigo-400"
        },
        {
            id: 'sauces',
            icon: Info,
            title: "Hidden Allergens",
            desc: "Check sauces, dressings & marinades",
            color: "text-teal-500",
            bg: "bg-teal-100 dark:bg-teal-900/30",
            iconColor: "text-teal-600 dark:text-teal-400"
        },
        {
            id: 'ask',
            icon: Phone,
            title: "When in Doubt",
            desc: "Ask the staff to check the packaging",
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            id: 'dessert',
            icon: ShieldAlert,
            title: "Dessert Warning",
            desc: "Pastries often share production lines",
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400"
        }
    ];

    // Auto-scroll effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % notifications.length);
        }, 4000); // 4 seconds per slide
        return () => clearInterval(timer);
    }, [notifications.length]);

    return (
        <div className="px-6 pt-14 flex flex-col items-center pb-6">
            <div className="flex items-start justify-between w-full mb-6 relative z-10">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{getGreeting(t)}</p>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                        {currentUser || t.welcomeBack}
                    </h1>
                </div>
                <button
                    onClick={() => navigate("/history")}
                    className="relative flex items-center justify-center rounded-full w-12 h-12 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <Bell size={20} className="text-slate-600 dark:text-slate-300" strokeWidth={2} />
                    <div className="absolute top-[12px] right-[14px] w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800" />
                </button>
            </div>

            {/* Notification Carousel */}
            <div className="w-full relative h-[88px] overflow-hidden rounded-[32px] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                <AnimatePresence initial={false}>
                    {notifications.map((notif, index) => {
                        if (index !== currentIndex) return null;
                        const Icon = notif.icon;

                        return (
                            <motion.button
                                key={notif.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0, zIndex: 10 }}
                                exit={{ opacity: 0, y: -15, zIndex: 0 }}
                                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                onClick={() => navigate('/profile')}
                                className="absolute inset-0 w-full flex items-center justify-between p-4 active:scale-[0.98] transition-transform"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${notif.bg} ${notif.iconColor}`}>
                                        {index === 0 ? (
                                            <span className="text-lg font-bold">{allergies.length}</span>
                                        ) : (
                                            <Icon size={22} strokeWidth={2.2} />
                                        )}
                                    </div>
                                    <div className="text-left flex flex-col justify-center h-full">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight mb-0.5">{notif.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">{notif.desc}</p>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
