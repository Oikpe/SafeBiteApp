import type { ReactNode } from "react";
import { useApp } from "../context/AppContext";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  /** Pass true on pages that show the BottomNav — adds padding so content
   *  isn't hidden under the fixed nav pill */
  withNav?: boolean;
}

export function MobileLayout({
  children,
  className = "mesh-gradient-1",
  noPadding = false,
  withNav = false,
}: MobileLayoutProps) {
  const { theme } = useApp();

  const outerBg = theme === "dark" ? "#0f172a" : "#EBF0FA";
  const darkMeshBg =
    "radial-gradient(at 20% 20%, rgba(36,61,142,0.1) 0%, transparent 55%), " +
    "radial-gradient(at 80% 80%, rgba(96,106,166,0.1) 0%, transparent 55%), " +
    "linear-gradient(180deg, #0f172a 0%, #020617 100%)";

  return (
    <div
      className="min-h-dvh w-full flex justify-center"
      style={{ background: outerBg, transition: "background 0.6s ease" }}
    >
      <div
        className={`relative w-full max-w-[430px] min-h-dvh overflow-hidden noise-overlay ${theme === "dark" ? "" : className
          }`}
        style={
          theme === "dark"
            ? { background: darkMeshBg, transition: "background 0.6s ease" }
            : { transition: "background 0.6s ease" }
        }
      >
        <div className="relative z-[1]">
          {noPadding ? children : <div className="px-5">{children}</div>}
        </div>
        {/* Spacer so bottom content isn't hidden under the BottomNav pill */}
        {withNav && (
          <div
            style={{
              height: "calc(92px + env(safe-area-inset-bottom, 0px))",
              flexShrink: 0,
            }}
          />
        )}
      </div>
    </div>
  );
}

