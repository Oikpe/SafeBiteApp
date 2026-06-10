import { useNavigate, useLocation } from "react-router";
import { Home, Clock, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { T } from "../i18n/translations";

const NAV_ITEMS = [
  { path: "/home", icon: Home, key: "navHome" as const },
  { path: "/history", icon: Clock, key: "navHistory" as const },
  { path: "/profile", icon: User, key: "navProfile" as const },
];

interface BottomNavProps {
  /** When false, nav fades out but stays mounted — prevents remount glitch */
  visible?: boolean;
}

export function BottomNav({ visible = true }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, language } = useApp();
  const isDark = theme === "dark";
  const t = T[language];

  return (
    <>
      {/* Gradient backdrop — fades content behind the nav pill */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          // gradient fade (top) + frosted zone (bottom).
          // Bottom uses semi-transparent (not fully solid) so content peeks
          // through as a faint silhouette — the pill looks like it floats
          // over content rather than sitting on an opaque shelf.
          height: 150,
          background: isDark
            ? `linear-gradient(to bottom,
                transparent 0%,
                rgba(14,22,48,0.06) 20%,
                rgba(14,22,48,0.18) 38%,
                rgba(14,22,48,0.38) 55%,
                rgba(14,22,48,0.62) 72%,
                rgba(14,22,48,0.82) 88%,
                rgba(14,22,48,0.92) 100%)`
            : `linear-gradient(to bottom,
                transparent 0%,
                rgba(235,240,250,0.06) 20%,
                rgba(235,240,250,0.18) 38%,
                rgba(235,240,250,0.38) 55%,
                rgba(235,240,250,0.62) 72%,
                rgba(235,240,250,0.82) 88%,
                rgba(235,240,250,0.92) 100%)`,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
          zIndex: 49, // above content, below nav pill (z:50)
          transform: visible ? "translateZ(0) translateY(0)" : "translateZ(0) translateY(20px)",
        }}
      />

      {/* Nav pill — always mounted, visibility toggled via opacity */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: "max(20px, calc(env(safe-area-inset-bottom, 0px) + 12px))",
          willChange: "opacity, transform",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateZ(0) translateY(0)" : "translateZ(0) translateY(35px)",
          pointerEvents: visible ? "auto" : "none",
          transition: visible
            ? "opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
            : "opacity 0.3s ease-in, transform 0.3s cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            borderRadius: 9999,
            padding: "8px 8px",
            pointerEvents: visible ? "auto" : "none",
            background: isDark
              ? "rgba(8, 13, 30, 0.90)"
              : "rgba(36, 61, 142, 0.82)",
            border: isDark
              ? "1px solid rgba(197,212,249,0.12)"
              : "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            boxShadow: isDark
              ? "0 8px 48px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 48px rgba(0,0,0,0.28), 0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/profile" && location.pathname.startsWith("/profile"));
            const Icon = item.icon;
            const label = t[item.key];

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  width: 76,
                  height: 52,
                  borderRadius: 9999,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
                onPointerDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.88)";
                }}
                onPointerUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                {/* Active indicator — always in DOM, toggled via CSS */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 9999,
                    background: "linear-gradient(135deg, #243D8E 0%, #606AA6 100%)",
                    boxShadow: isActive
                      ? "0 0 16px rgba(36,61,142,0.5), inset 0 1px 0 rgba(255,255,255,0.18)"
                      : "none",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0.82)",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                  }}
                />
                <Icon
                  size={18}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    color: isActive ? "#ffffff" : "rgba(148,163,184,0.55)",
                    transition: "color 0.2s ease",
                    flexShrink: 0,
                  }}
                  strokeWidth={isActive ? 2.3 : 1.7}
                />
                <span
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 9.5,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.02em",
                    fontFamily: "var(--font-display, sans-serif)",
                    color: isActive ? "rgba(255,255,255,0.88)" : "rgba(148,163,184,0.45)",
                    transition: "color 0.2s ease",
                    userSelect: "none",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}