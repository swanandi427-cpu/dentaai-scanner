import { useNavigate, useRouterState } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function FloatingCancerSupport() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on the cancer support page itself
  if (pathname === "/cancer-support") return null;

  return (
    <AnimatePresence>
      <motion.button
        type="button"
        key="cancer-support-float"
        initial={{ opacity: 0, x: 60, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 60, scale: 0.8 }}
        transition={{ delay: 1.5, duration: 0.45, ease: "easeOut" }}
        onClick={() => navigate({ to: "/cancer-support" })}
        aria-label="Support cancer patients"
        data-ocid="cancer_support.open_modal_button"
        className="fixed z-50 flex items-center gap-2 rounded-full shadow-2xl group"
        style={{
          bottom: "5.5rem",
          right: "1.5rem",
          padding: "0.6rem 1.1rem 0.6rem 0.8rem",
          background:
            "linear-gradient(135deg, oklch(0.55 0.21 12), oklch(0.62 0.19 28), oklch(0.72 0.18 52))",
          border: "1.5px solid oklch(0.82 0.18 80 / 0.55)",
          color: "oklch(0.97 0.02 80)",
          boxShadow:
            "0 0 18px oklch(0.62 0.19 28 / 0.45), 0 0 50px oklch(0.72 0.18 52 / 0.15), 0 4px 16px rgba(0,0,0,0.45)",
          animation: "cancer-support-pulse 3s ease-in-out infinite",
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
          style={{
            background: "oklch(0.97 0.02 80 / 0.18)",
            border: "1px solid oklch(0.97 0.02 80 / 0.3)",
          }}
        >
          <HeartHandshake className="w-4 h-4" />
        </span>
        <span className="text-xs font-bold tracking-wide leading-tight">
          Cancer
          <br />
          <span style={{ color: "oklch(0.92 0.14 75)" }}>Support</span>
        </span>
      </motion.button>
    </AnimatePresence>
  );
}
