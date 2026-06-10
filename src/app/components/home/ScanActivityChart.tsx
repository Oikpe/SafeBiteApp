import { useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import type { HistoryEntry } from "../../types";

// ─── Helpers ────────────────────────────────────────────────────────────────────

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Build an array of the last 7 calendar days ending today. */
function getLast7Days(): { key: string; label: string; fullDate: string }[] {
    const days: { key: string; label: string; fullDate: string }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
        days.push({
            key,
            label: DAY_LABELS[d.getDay()],
            fullDate: `${d.getDate()}/${d.getMonth() + 1}`,
        });
    }
    return days;
}

/** Aggregate history entries → scans per day for the last 7 days. */
function aggregateByDay(history: HistoryEntry[]) {
    const days = getLast7Days();

    // Build a lookup: "YYYY-MM-DD" → total items scanned that day
    const scansByDate: Record<string, number> = {};
    for (const entry of history) {
        // Safely handle invalid/missing dates
        if (!entry.date || typeof entry.date !== "string") continue;
        const dateKey = entry.date.slice(0, 10);
        scansByDate[dateKey] = (scansByDate[dateKey] || 0) + (entry.itemsScanned || 0);
    }

    return days.map((d) => ({
        day: d.label,
        date: d.fullDate,
        scans: scansByDate[d.key] ?? 0,
    }));
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────

interface TooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
    isDark: boolean;
}

function ChartTooltip({ active, payload, label, isDark }: TooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: isDark ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.96)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                borderRadius: 12,
                padding: "8px 14px",
                boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.5)"
                    : "0 8px 24px rgba(0,0,0,0.1)",
                backdropFilter: "blur(12px)",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: "2px 0 0",
                    fontSize: 18,
                    fontWeight: 800,
                    color: isDark ? "#93c5fd" : "#3b82f6",
                    letterSpacing: "-0.02em",
                }}
            >
                {payload[0].value} <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>scans</span>
            </p>
        </div>
    );
}

// ─── Empty State ────────────────────────────────────────────────────────────────

function EmptyChartState({ isDark, emptyLabel }: { isDark: boolean, emptyLabel?: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-60">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#60a5fa" : "#3b82f6"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M7 16l4-6 4 4 5-8" opacity="0.5" strokeDasharray="3 3" />
            </svg>
            <span className={`text-[10px] font-semibold tracking-wide ${isDark ? 'text-blue-300/60' : 'text-blue-500/50'}`}>
                {emptyLabel || "No scan activity yet"}
            </span>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

interface ScanActivityChartProps {
    history: HistoryEntry[];
    isDark: boolean;
    emptyLabel?: string;
}

export function ScanActivityChart({ history, isDark, emptyLabel }: ScanActivityChartProps) {
    const data = useMemo(() => aggregateByDay(history), [history]);
    const hasActivity = useMemo(() => data.some((d) => d.scans > 0), [data]);

    // Theme-aware color tokens
    const strokeColor = isDark ? "#60a5fa" : "#3b82f6"; // blue-400 / blue-500
    const gradientStart = isDark ? "rgba(96,165,250,0.35)" : "rgba(59,130,246,0.25)";
    const gradientEnd = isDark ? "rgba(96,165,250,0.0)" : "rgba(59,130,246,0.0)";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const axisColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";
    const dotFill = isDark ? "#1e293b" : "#ffffff";

    // Show empty state if no scan activity in last 7 days
    if (!hasActivity) {
        return <EmptyChartState isDark={isDark} />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                    <linearGradient id="scanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientStart} />
                        <stop offset="100%" stopColor={gradientEnd} />
                    </linearGradient>
                </defs>

                <CartesianGrid
                    strokeDasharray="4 4"
                    stroke={gridColor}
                    vertical={false}
                />

                <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontSize: 10,
                        fontWeight: 600,
                        fill: axisColor,
                        dy: 4,
                    }}
                />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                        fontSize: 9,
                        fontWeight: 500,
                        fill: axisColor,
                    }}
                />

                <Tooltip
                    content={<ChartTooltip isDark={isDark} />}
                    cursor={{
                        stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                    }}
                />

                <Area
                    type="monotoneX"
                    dataKey="scans"
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    fill="url(#scanAreaGradient)"
                    dot={{
                        r: 3,
                        fill: dotFill,
                        stroke: strokeColor,
                        strokeWidth: 2,
                    }}
                    activeDot={{
                        r: 5,
                        fill: strokeColor,
                        stroke: dotFill,
                        strokeWidth: 2,
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
