import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { BottomNav } from "./BottomNav";

// Tab order for horizontal slide direction
const TAB_PATHS = ["/home", "/history", "/profile"];

// Pages that slide up like a modal stack
const STACK_PREFIXES = ["/scan", "/results", "/profile/edit", "/profile/family"];

// Pages that show the bottom nav
const NAV_PAGES = ["/home", "/history", "/profile"];

function tabIndex(pathname: string) {
  return TAB_PATHS.findIndex(
    (p) => pathname === p || (p !== "/profile" && pathname.startsWith(p))
  );
}

function isStack(pathname: string) {
  return STACK_PREFIXES.some((p) => pathname.startsWith(p));
}

export function RootLayout() {
  const location = useLocation();

  // Track previous path so we can compute slide direction
  const prevRef = useRef(location.pathname);
  const prev = prevRef.current;

  useEffect(() => {
    prevRef.current = location.pathname;
  }, [location.pathname]);

  // --- Decide transition variant ---
  const curIdx = tabIndex(location.pathname);
  const prevIdx = tabIndex(prev);
  const isCurTab = curIdx >= 0;
  const isPrevTab = prevIdx >= 0;
  const isCurStack = isStack(location.pathname);

  let variants: {
    initial: Record<string, number>;
    animate: Record<string, number>;
    exit: Record<string, number>;
    duration: number;
  };

  if (isCurTab && isPrevTab && curIdx !== prevIdx) {
    const dir = curIdx > prevIdx ? 1 : -1;
    variants = {
      initial: { opacity: 0, x: dir * 24, scale: 0.97 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: -dir * 12, scale: 0.98 },
      duration: 0.35,
    };
  } else if (isCurStack) {
    variants = {
      initial: { opacity: 0, y: 32, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, scale: 0.98, y: -10 },
      duration: 0.4,
    };
  } else if (!isCurTab && isPrevTab) {
    variants = {
      initial: { opacity: 0, scale: 1.03, y: 10 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.96, y: 20 },
      duration: 0.4,
    };
  } else {
    variants = {
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
      duration: 0.3,
    };
  }

  const showNav = NAV_PAGES.includes(location.pathname);

  return (
    <>
      {/* Page animation wrapper */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: variants.duration, ease: [0.32, 0.72, 0, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* BottomNav stays mounted — visibility toggled via CSS to avoid remount glitch */}
      <BottomNav visible={showNav} />
    </>
  );
}