// ─── Member Avatar Color Palette ───────────────────────────────────────────────
// Gradient swatches used for family member avatars.
// Isolated here so Profile, FamilyMemberDetail, and AppContext can all
// import from one place without circular dependencies.

export interface MemberColor {
    bg: string;
    shadow: string;
}

export const MEMBER_COLORS: MemberColor[] = [
    { bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", shadow: "rgba(99,102,241,0.35)" },
    { bg: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", shadow: "rgba(236,72,153,0.35)" },
    { bg: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)", shadow: "rgba(20,184,166,0.35)" },
    { bg: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)", shadow: "rgba(249,115,22,0.35)" },
    { bg: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)", shadow: "rgba(34,197,94,0.35)" },
    { bg: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", shadow: "rgba(59,130,246,0.35)" },
    { bg: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)", shadow: "rgba(239,68,68,0.35)" },
    { bg: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", shadow: "rgba(168,85,247,0.35)" },
];
