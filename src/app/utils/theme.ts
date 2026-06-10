// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Color palette: Blue-navy family (#243D8E primary) + Coral accent (#EC6C56).
// Font: Plus Jakarta Sans (weights 200–800, loaded in fonts.css).
//
// Palette reference:
//   Navy scale  : #FEFEFE → #C5D4F9 → #BCBBEC → #8B97CF → #606AA6 → #243D8E
//   Coral scale : #FFEBD1 → #F7D2C9 → #FFB4A6 → #FC987C → #E08587 → #E05B4B
//   Gradients   : blue #C1D5FF → #7680BE, coral #EEA594 → #EC6C56

export type ThemeMode = "light" | "dark";

export const TOKENS = {
  light: {
    // ── Backgrounds ─────────────────────────────────────────────────────────
    pageBg: "linear-gradient(180deg, #EEF3FF 0%, #F5F8FF 40%, #FEFEFE 100%)",
    outerBg: "#EBF0FA",
    heroPatternBg:
      "radial-gradient(at 25% 15%, rgba(36,61,142,0.09) 0%, transparent 55%), " +
      "radial-gradient(at 75% 85%, rgba(96,106,166,0.07) 0%, transparent 55%), " +
      "linear-gradient(180deg, #EEF3FF 0%, #F0F4FF 100%)",

    // ── Cards ────────────────────────────────────────────────────────────────
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "rgba(197,212,249,0.35)",
    cardElevatedBg: "rgba(255,255,255,0.92)",
    cardElevatedBorder: "rgba(197,212,249,0.45)",
    cardShadow: "0 4px 24px -4px rgba(36,61,142,0.07), 0 1px 2px rgba(36,61,142,0.04)",

    // ── Inputs ───────────────────────────────────────────────────────────────
    inputBg: "rgba(240,245,255,0.9)",
    inputBorder: "rgba(188,187,236,0.55)",
    inputFocusBorder: "rgba(36,61,142,0.4)",
    inputText: "#243D8E",
    inputPlaceholder: "#8B97CF",

    // ── Modal / Bottom-sheet ─────────────────────────────────────────────────
    modalBg: "#FEFEFE",
    modalBorder: "rgba(197,212,249,0.3)",
    sheetHandleBg: "#C5D4F9",

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary: "#243D8E",
    textSecondary: "#606AA6",
    textTertiary: "#8B97CF",

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: "rgba(197,212,249,0.45)",

    // ── Brand accent (navy) ──────────────────────────────────────────────────
    accent: "#243D8E",
    accentBg: "rgba(36,61,142,0.07)",
    accentText: "#606AA6",
    accentBorder: "rgba(36,61,142,0.18)",

    // ── Section labels ───────────────────────────────────────────────────────
    sectionLabel: "#8B97CF",

    // ── Profile avatar ───────────────────────────────────────────────────────
    avatarBg: "linear-gradient(135deg, #243D8E 0%, #606AA6 100%)",
    avatarShadow: "rgba(36,61,142,0.28)",

    // ── Tile (allergen card, etc.) ───────────────────────────────────────────
    tileBg: "rgba(240,245,255,0.85)",
    tileBorder: "rgba(197,212,249,0.5)",
    tileIconColor: "#8B97CF",
    tileTextColor: "#606AA6",

    // ── Settings row ─────────────────────────────────────────────────────────
    rowHover: "rgba(197,212,249,0.25)",

    // ── Sign out ─────────────────────────────────────────────────────────────
    signOutBorder: "rgba(224,91,75,0.2)",
    signOutText: "#E05B4B",
    signOutHover: "rgba(224,91,75,0.06)",

    // ── Status (semantic — kept intentionally close to universal norms) ───────
    dangerText: "#E05B4B",
    dangerBg: "rgba(224,91,75,0.08)",
    dangerBorder: "rgba(224,91,75,0.22)",
    safeText: "#16a34a",
    safeBg: "rgba(22,163,74,0.08)",
    safeBorder: "rgba(22,163,74,0.2)",
    cautionText: "#d97706",
    cautionBg: "rgba(217,119,6,0.08)",
    cautionBorder: "rgba(217,119,6,0.2)",

    // ── Allergen severity ────────────────────────────────────────────────────
    highBg: "rgba(224,91,75,0.09)",
    highBorder: "rgba(224,91,75,0.22)",
    highText: "#E05B4B",
    highIcon: "#FC987C",
    highSelectedBg: "rgba(224,91,75,0.11)",
    moderateBg: "rgba(245,158,11,0.09)",
    moderateBorder: "rgba(245,158,11,0.22)",
    moderateText: "#b45309",
    moderateIcon: "#f59e0b",
    moderateSelectedBg: "rgba(245,158,11,0.1)",
    lowBg: "rgba(16,185,129,0.09)",
    lowBorder: "rgba(16,185,129,0.22)",
    lowText: "#059669",
    lowIcon: "#10b981",
    lowSelectedBg: "rgba(16,185,129,0.1)",
  },

  dark: {
    // ── Backgrounds ─────────────────────────────────────────────────────────
    pageBg: "linear-gradient(180deg, #080D1E 0%, #0B1225 40%, #0E1630 100%)",
    outerBg: "#06091A",
    heroPatternBg:
      "radial-gradient(at 25% 15%, rgba(36,61,142,0.14) 0%, transparent 55%), " +
      "radial-gradient(at 75% 85%, rgba(96,106,166,0.10) 0%, transparent 55%), " +
      "linear-gradient(180deg, #080D1E 0%, #0E1630 100%)",

    // ── Cards ────────────────────────────────────────────────────────────────
    cardBg: "rgba(197,212,249,0.05)",
    cardBorder: "rgba(197,212,249,0.09)",
    cardElevatedBg: "rgba(197,212,249,0.07)",
    cardElevatedBorder: "rgba(197,212,249,0.12)",
    cardShadow: "0 4px 24px -4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.22)",

    // ── Inputs ───────────────────────────────────────────────────────────────
    inputBg: "rgba(197,212,249,0.06)",
    inputBorder: "rgba(197,212,249,0.12)",
    inputFocusBorder: "rgba(139,151,207,0.5)",
    inputText: "#C5D4F9",
    inputPlaceholder: "#606AA6",

    // ── Modal / Bottom-sheet ─────────────────────────────────────────────────
    modalBg: "#0D1528",
    modalBorder: "rgba(197,212,249,0.09)",
    sheetHandleBg: "rgba(197,212,249,0.15)",

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary: "#F0F4FF",
    textSecondary: "#C5D4F9",
    textTertiary: "#606AA6",

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: "rgba(197,212,249,0.08)",

    // ── Brand accent (lighter in dark for readability) ───────────────────────
    accent: "#8B97CF",
    accentBg: "rgba(139,151,207,0.12)",
    accentText: "#C5D4F9",
    accentBorder: "rgba(139,151,207,0.28)",

    // ── Section labels ───────────────────────────────────────────────────────
    sectionLabel: "#606AA6",

    // ── Profile avatar ───────────────────────────────────────────────────────
    avatarBg: "linear-gradient(135deg, #243D8E 0%, #606AA6 100%)",
    avatarShadow: "rgba(36,61,142,0.45)",

    // ── Tile ─────────────────────────────────────────────────────────────────
    tileBg: "rgba(197,212,249,0.04)",
    tileBorder: "rgba(197,212,249,0.08)",
    tileIconColor: "#606AA6",
    tileTextColor: "#8B97CF",

    // ── Settings row ─────────────────────────────────────────────────────────
    rowHover: "rgba(197,212,249,0.04)",

    // ── Sign out ─────────────────────────────────────────────────────────────
    signOutBorder: "rgba(252,152,124,0.22)",
    signOutText: "#FC987C",
    signOutHover: "rgba(252,152,124,0.06)",

    // ── Status ───────────────────────────────────────────────────────────────
    dangerText: "#FC987C",
    dangerBg: "rgba(252,152,124,0.1)",
    dangerBorder: "rgba(252,152,124,0.24)",
    safeText: "#4ade80",
    safeBg: "rgba(74,222,128,0.1)",
    safeBorder: "rgba(74,222,128,0.22)",
    cautionText: "#fb923c",
    cautionBg: "rgba(251,146,60,0.1)",
    cautionBorder: "rgba(251,146,60,0.22)",

    // ── Allergen severity ────────────────────────────────────────────────────
    highBg: "rgba(252,152,124,0.08)",
    highBorder: "rgba(252,152,124,0.2)",
    highText: "#FC987C",
    highIcon: "#FC987C",
    highSelectedBg: "rgba(252,152,124,0.13)",
    moderateBg: "rgba(251,191,36,0.08)",
    moderateBorder: "rgba(251,191,36,0.2)",
    moderateText: "#fbbf24",
    moderateIcon: "#fbbf24",
    moderateSelectedBg: "rgba(251,191,36,0.12)",
    lowBg: "rgba(52,211,153,0.08)",
    lowBorder: "rgba(52,211,153,0.2)",
    lowText: "#34d399",
    lowIcon: "#34d399",
    lowSelectedBg: "rgba(52,211,153,0.12)",
  },
} as const;

export type ThemeTokens = typeof TOKENS.light;

export function getTokens(theme: ThemeMode): ThemeTokens {
  // Cast required: 'as const' makes each string value a literal type,
  // so dark's literal strings differ from light's, causing a union mismatch.
  // The shape (keys) is identical — the cast is safe.
  return TOKENS[theme] as unknown as ThemeTokens;
}
