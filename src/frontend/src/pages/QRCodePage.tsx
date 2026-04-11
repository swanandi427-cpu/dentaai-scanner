import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  LogIn,
  LogOut,
  QrCode,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const APP_URL = "https://dentaai-scanner-n0h.caffeine.xyz/";

function useQRCode(value: string, size = 260) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const url = `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size}&margin=1&dark=000000&light=ffffff`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      setImgSrc(canvas.toDataURL("image/png"));
      setIsLoading(false);
    };
    img.onerror = () => setIsLoading(false);
    img.src = url;
  }, [value, size]);

  return { canvasRef, imgSrc, isLoading };
}

export default function QRCodePage() {
  const navigate = useNavigate();
  const { identity, login, clear } = useInternetIdentity();
  const { canvasRef, imgSrc, isLoading } = useQRCode(APP_URL, 260);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "dantanova-qr.png";
    a.href = url;
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "DantaNova — AI Dental Scanner",
          url: APP_URL,
        });
      } catch {
        /* cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(APP_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        /* noop */
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid-mesh opacity-20 pointer-events-none" />

      {/* Glow orbs */}
      <div className="glow-orb w-80 h-80 top-0 left-1/4 opacity-20" />
      <div
        className="glow-orb w-60 h-60 bottom-20 right-1/4 opacity-15"
        style={{ animationDelay: "5s" }}
      />

      {/* Header */}
      <header className="grid grid-cols-3 items-center px-6 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          className="justify-start rounded-full px-4 w-fit"
          data-ocid="qr.link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-center gap-2">
          <div
            className="flex items-center justify-center rounded-full overflow-hidden"
            style={{
              width: 36,
              height: 36,
              border: "2px solid oklch(0.78 0.16 80 / 0.6)",
              background: "oklch(0.78 0.16 80 / 0.1)",
            }}
          >
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl">
            Danta<span className="text-yellow-400">Nova</span>
          </span>
        </div>
        <div className="flex justify-end">
          {identity ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              data-ocid="qr.secondary_button"
              className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => login()}
              data-ocid="qr.primary_button"
              className="rounded-full px-3 border border-primary/30 text-primary hover:bg-primary/10"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-md w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="circle-icon w-16 h-16 mb-6"
            style={{
              background: "oklch(0.78 0.16 80 / 0.1)",
              border: "2px solid oklch(0.78 0.16 80 / 0.5)",
              boxShadow: "0 0 30px oklch(0.78 0.16 80 / 0.2)",
            }}
          >
            <QrCode className="w-7 h-7 text-primary" />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Scan to Open <span className="text-gradient-gold">DantaNova</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Point any phone camera at this code to open DantaNova instantly — no
            app download required.
          </p>

          {/* QR card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-3xl p-6 mb-4 flex flex-col items-center relative hud-corner"
            style={{
              background: "oklch(0.07 0.005 60)",
              border: "2px solid oklch(0.78 0.16 80 / 0.5)",
              boxShadow:
                "0 0 40px oklch(0.78 0.16 80 / 0.15), inset 0 0 20px oklch(0.78 0.16 80 / 0.03)",
            }}
          >
            {/* HUD telemetry corners */}
            <div className="absolute top-2 left-3">
              <p className="hud-telemetry" style={{ fontSize: "8px" }}>
                SCAN CODE
              </p>
            </div>
            <div className="absolute top-2 right-3">
              <p className="hud-telemetry" style={{ fontSize: "8px" }}>
                ACTIVE
              </p>
            </div>

            {/* QR canvas (hidden) + visible image */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 10,
                display: "inline-block",
                width: 280,
                height: 280,
                boxShadow: "0 0 0 1px oklch(0.78 0.16 80 / 0.2)",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: 260,
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                    style={{
                      borderColor: "oklch(0.78 0.16 80)",
                      borderTopColor: "transparent",
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#888" }}>
                    Generating QR…
                  </span>
                </div>
              ) : imgSrc ? (
                <img
                  src={imgSrc}
                  alt="QR Code for DantaNova — scan to open the app"
                  style={{ width: 260, height: 260, display: "block" }}
                />
              ) : (
                <div
                  style={{
                    width: 260,
                    height: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  QR unavailable
                </div>
              )}
            </div>

            {/* URL below QR — font-size: 9px per spec */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 font-mono tracking-wide text-center hover:underline"
              style={{
                color: "oklch(0.78 0.16 80)",
                fontSize: "9px",
                wordBreak: "break-all",
                maxWidth: 280,
              }}
            >
              {APP_URL}
            </a>

            {/* Gold bottom bar */}
            <div
              className="mt-3 h-0.5 w-32 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.88 0.18 85 / 0.6), transparent)",
              }}
            />
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-3 w-full max-w-xs mt-2"
          >
            <Button
              className="flex-1 rounded-full font-semibold glow-primary shimmer-button"
              onClick={handleDownload}
              data-ocid="qr.download_button"
              disabled={!imgSrc}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleShare}
              data-ocid="qr.share_button"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 glass-card rounded-3xl p-5 w-full text-left"
          >
            <h3 className="font-display font-semibold text-sm text-primary mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              How to Use This QR Code
            </h3>
            <div className="flex flex-col gap-2">
              {[
                "Open the Camera app on any iPhone or Android phone",
                "Point the camera at the QR code — no need to take a photo",
                "Tap the notification that appears to open DantaNova",
                "Start your AI dental scan immediately — no download needed!",
              ].map((step, idx) => (
                <div key={step} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: "oklch(0.78 0.16 80 / 0.15)",
                      color: "oklch(0.88 0.18 85)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30 bg-card/40 relative z-10">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
        <p className="mt-1">
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-yellow-400 hover:text-yellow-300"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
