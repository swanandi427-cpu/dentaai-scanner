import { Cookie } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "dantanova_cookie_dismissed";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function acceptAll() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          data-ocid="cookie_notice.toast"
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/30 backdrop-blur-xl px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          style={{
            background: "oklch(0.1 0.01 70 / 0.95)",
            boxShadow: "0 -8px 32px oklch(0.78 0.16 80 / 0.08)",
          }}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.78 0.16 80 / 0.15)" }}
            >
              <Cookie className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider sm:hidden">
              Cookie Policy
            </span>
          </div>

          <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
            DantaNova uses browser storage to save your session and preferences.{" "}
            <strong className="text-foreground/80">
              No third-party tracking cookies are used.
            </strong>{" "}
            View our{" "}
            <a
              href="/privacy"
              className="text-primary hover:underline font-semibold"
            >
              Privacy Policy
            </a>{" "}
            for details.
          </p>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              data-ocid="cookie_notice.decline_button"
              onClick={dismiss}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              Dismiss
            </button>
            <button
              type="button"
              data-ocid="cookie_notice.confirm_button"
              onClick={acceptAll}
              className="px-5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 72))",
                color: "oklch(0.08 0.005 60)",
                boxShadow: "0 0 12px oklch(0.78 0.16 80 / 0.3)",
              }}
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
