import { useNavigate } from "@tanstack/react-router";
import { Keyboard, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Shortcut definitions ───────────────────────────────────────────────────
const NAV_SHORTCUTS: {
  keys: string;
  label: string;
  path: "/" | "/scan" | "/find-dentist" | "/history" | "/passport" | "/blog";
}[] = [
  { keys: "G → H", label: "Go to Home", path: "/" },
  { keys: "G → S", label: "Go to Scan", path: "/scan" },
  { keys: "G → D", label: "Find a Dentist", path: "/find-dentist" },
  { keys: "G → I", label: "Scan History", path: "/history" },
  { keys: "G → P", label: "Dental Passport", path: "/passport" },
  { keys: "G → B", label: "Blog", path: "/blog" },
];

const OTHER_SHORTCUTS = [
  { keys: "?", label: "Open keyboard shortcuts" },
  { keys: "Esc", label: "Close this modal" },
  { keys: "/", label: "Open Search" },
];

// ── Hook ──────────────────────────────────────────────────────────────────
export function useKeyboardShortcuts(openModal: () => void) {
  const navigate = useNavigate();
  const pendingG = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // ? opens the modal
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openModal();
        return;
      }

      // / opens search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        navigate({ to: "/search" });
        return;
      }

      // G sequence
      if (key === "g" && !e.metaKey && !e.ctrlKey) {
        pendingG.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          pendingG.current = false;
        }, 1000);
        return;
      }

      if (pendingG.current) {
        pendingG.current = false;
        if (timerRef.current) clearTimeout(timerRef.current);

        switch (key) {
          case "h":
            navigate({ to: "/" });
            break;
          case "s":
            navigate({ to: "/scan" });
            break;
          case "d":
            navigate({ to: "/find-dentist" });
            break;
          case "i":
            navigate({ to: "/history" });
            break;
          case "p":
            navigate({ to: "/passport" });
            break;
          case "b":
            navigate({ to: "/blog" });
            break;
          default:
            break;
        }
      }
    },
    [navigate, openModal],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [handleKeyDown]);
}

// ── KBD chip component ────────────────────────────────────────────────────
function KbdChips({ shortcut }: { shortcut: string }) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      {shortcut.split(" → ").map((part, i, arr) => (
        <span key={part} className="flex items-center gap-1">
          <kbd
            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-bold border font-mono"
            style={{
              background: "oklch(0.10 0.006 70 / 0.8)",
              borderColor: "oklch(0.88 0.18 85 / 0.4)",
              color: "oklch(0.88 0.18 85)",
              minWidth: "1.6rem",
            }}
          >
            {part}
          </kbd>
          {i < arr.length - 1 && (
            <span className="text-xs text-muted-foreground">then</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ── Modal component ───────────────────────────────────────────────────────
export default function KeyboardShortcutsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="kbd-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] hidden md:flex items-center justify-center p-4"
          style={{
            background: "oklch(0.05 0.005 60 / 0.7)",
            backdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        >
          {/* Semantic dialog element */}
          <dialog
            open
            data-ocid="kbd.dialog"
            aria-label="Keyboard shortcuts"
            className="m-0 p-0 border-0 bg-transparent w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22 }}
              className="w-full rounded-2xl border shadow-2xl overflow-hidden"
              style={{
                background: "oklch(0.12 0.008 60 / 0.98)",
                borderColor: "oklch(0.88 0.18 85 / 0.25)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "oklch(0.22 0.015 60 / 0.6)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Keyboard
                    className="w-5 h-5"
                    style={{ color: "oklch(0.88 0.18 85)" }}
                  />
                  <h2 className="font-bold text-foreground">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                  aria-label="Close shortcuts panel"
                  data-ocid="kbd.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Navigation */}
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                >
                  Navigation
                </p>
                <div className="space-y-2 mb-6">
                  {NAV_SHORTCUTS.map((s) => (
                    <div
                      key={s.keys}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-foreground/80">
                        {s.label}
                      </span>
                      <KbdChips shortcut={s.keys} />
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div
                  className="h-px mb-6"
                  style={{ background: "oklch(0.22 0.015 60 / 0.5)" }}
                />

                {/* General */}
                <p
                  className="text-[11px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                >
                  General
                </p>
                <div className="space-y-2">
                  {OTHER_SHORTCUTS.map((s) => (
                    <div
                      key={s.keys}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-foreground/80">
                        {s.label}
                      </span>
                      <KbdChips shortcut={s.keys} />
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground mt-5">
                  Shortcuts are only active on desktop and when not typing in a
                  text field.
                </p>
              </div>
            </motion.div>
          </dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
