import type { ThemeTokens } from "./theme";

export function getInitials(name: string): string {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function severityStyle(
    sev: "high" | "moderate" | "low",
    tk: ThemeTokens
) {
    if (sev === "high") {
        return { bg: tk.highBg, border: tk.highBorder, text: tk.highText };
    }
    if (sev === "moderate") {
        return { bg: tk.moderateBg, border: tk.moderateBorder, text: tk.moderateText };
    }
    return { bg: tk.lowBg, border: tk.lowBorder, text: tk.lowText };
}

export function severityLabel(
    sev: "high" | "moderate" | "low",
    t: { highRisk?: string; moderate?: string; lowRisk?: string; [key: string]: any }
) {
    if (sev === "high") return t.highRisk || "High";
    if (sev === "moderate") return t.moderate || "Moderate";
    return t.lowRisk || "Low";
}
