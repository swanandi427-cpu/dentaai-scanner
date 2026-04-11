import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Trash2, UserLock } from "lucide-react";
import { useState } from "react";

const CONSENT_KEY = "dantanova_consent_v1";

function hasConsented(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return true;
  }
}

const PRIVACY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Encrypted & Private",
    text: "Scan results are saved to your account on the ICP blockchain — encrypted and secure by default.",
  },
  {
    icon: UserLock,
    title: "Only You Can See It",
    text: "Your dental data is only visible to you. No one else can access your scans or health records.",
  },
  {
    icon: Trash2,
    title: "Delete Anytime",
    text: "You can permanently delete all your data at any time from your Profile page.",
  },
];

export default function ConsentModal() {
  const [open, setOpen] = useState(!hasConsented());
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}} data-ocid="consent.dialog">
      <DialogContent
        className="rounded-3xl border max-w-sm mx-auto p-0 overflow-hidden [&>button]:hidden"
        style={{
          background: "oklch(0.09 0.012 70)",
          borderColor: "oklch(0.78 0.16 80 / 0.25)",
          boxShadow:
            "0 0 60px oklch(0.78 0.16 80 / 0.2), 0 0 120px oklch(0.78 0.16 80 / 0.08), 0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Gold top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.88 0.18 85), oklch(0.72 0.19 72), oklch(0.88 0.18 85))",
          }}
        />

        <div className="p-6">
          <DialogHeader className="flex flex-col items-center text-center gap-3 mb-5">
            {/* Logo circle */}
            <div
              className="flex items-center justify-center rounded-full overflow-hidden"
              style={{
                width: 72,
                height: 72,
                background: "oklch(0.78 0.16 80 / 0.08)",
                border: "2px solid oklch(0.78 0.16 80 / 0.5)",
                boxShadow:
                  "0 0 24px oklch(0.88 0.18 85 / 0.35), 0 0 60px oklch(0.78 0.16 80 / 0.12)",
              }}
            >
              <img
                src="/assets/uploads/file_00000000a88c720bbdf9639edb08e122-3-1.png"
                alt="DantaNova"
                width={56}
                height={56}
                style={{ width: 56, height: 56, objectFit: "contain" }}
              />
            </div>

            <DialogTitle className="font-display text-2xl font-black">
              Welcome to <span className="text-gradient-gold">DantaNova</span>
            </DialogTitle>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Before you begin your dental scan, here's how we protect your
              data.
            </p>
          </DialogHeader>

          {/* Privacy points */}
          <ul className="flex flex-col gap-3 mb-6">
            {PRIVACY_POINTS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 p-3 rounded-2xl"
                style={{
                  background: "oklch(0.14 0.01 70 / 0.6)",
                  border: "1px solid oklch(0.78 0.16 80 / 0.12)",
                }}
              >
                <div
                  className="circle-icon w-9 h-9 flex-shrink-0 mt-0.5"
                  style={{
                    background: "oklch(0.78 0.16 80 / 0.15)",
                    border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                  }}
                >
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground/90 mb-0.5">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Consent checkbox */}
          <div
            className="flex items-center gap-3 mb-5 p-3 rounded-2xl"
            style={{
              background: "oklch(0.14 0.01 70 / 0.4)",
              border: "1px solid oklch(0.78 0.16 80 / 0.15)",
            }}
          >
            <Checkbox
              id="consent-check"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(!!v)}
              data-ocid="consent.checkbox"
              className="rounded border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor="consent-check"
              className="text-xs text-muted-foreground cursor-pointer leading-relaxed"
            >
              I understand and agree to the{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </Label>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full rounded-full font-bold text-sm tracking-wide h-12 shimmer-button transition-all duration-200"
            style={{
              background: agreed
                ? "linear-gradient(135deg, oklch(0.88 0.18 85) 0%, oklch(0.75 0.2 72) 50%, oklch(0.68 0.22 68) 100%)"
                : "oklch(0.2 0.015 60)",
              color: agreed ? "oklch(0.08 0.005 60)" : "oklch(0.45 0.02 60)",
              fontWeight: 800,
              boxShadow: agreed
                ? "0 0 24px oklch(0.88 0.18 85 / 0.5), 0 4px 16px rgba(0,0,0,0.4)"
                : "none",
              border: `1.5px solid ${agreed ? "oklch(0.88 0.18 85 / 0.5)" : "oklch(0.28 0.015 60)"}`,
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            disabled={!agreed}
            onClick={handleAccept}
            data-ocid="consent.confirm_button"
          >
            {agreed ? "✓ Start My Dental Scan" : "Agree to Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
