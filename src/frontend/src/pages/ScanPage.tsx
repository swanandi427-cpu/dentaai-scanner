import { useCamera } from "@/camera/useCamera";
import ConsentModal from "@/components/ConsentModal";
import LogoCircle from "@/components/LogoCircle";
import ScanArchGuide from "@/components/ScanArchGuide";
import { Button } from "@/components/ui/button";
import { useScanContext } from "@/context/ScanContext";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImageIcon,
  LogIn,
  Scan,
  SwitchCamera,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Front Teeth",
    instruction:
      "Open your mouth slightly and show your front teeth. Center your smile in the frame.",
    tip: "Relax your lips for best coverage",
    icon: "",
  },
  {
    id: 2,
    title: "Upper Jaw",
    instruction:
      "Tilt your head back slightly to show the upper jaw and roof of your mouth.",
    tip: "Open wide so upper molars are visible",
    icon: "⬆️",
  },
  {
    id: 3,
    title: "Lower Jaw",
    instruction:
      "Lower your jaw fully to expose the lower teeth and the floor of your mouth.",
    tip: "Keep the camera steady for a sharp image",
    icon: "⬇️",
  },
  {
    id: 4,
    title: "Left Side",
    instruction:
      "Turn your head to the right so the camera captures the left side of your teeth.",
    tip: "Show both upper and lower left molars",
    icon: "◀️",
  },
  {
    id: 5,
    title: "Right Side",
    instruction:
      "Turn your head to the left so the camera captures the right side of your teeth.",
    tip: "Show both upper and lower right molars",
    icon: "▶️",
  },
];

type Mode = "camera" | "upload";

export default function ScanPage() {
  const navigate = useNavigate();
  const { setCapturedImages } = useScanContext();
  const { identity, login } = useInternetIdentity();
  const [mode, setMode] = useState<Mode>("camera");
  const [currentStep, setCurrentStep] = useState(0);
  const [captures, setCaptures] = useState<File[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    currentFacingMode,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", quality: 0.85 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once when mode/identity changes
  useEffect(() => {
    if (!identity || mode !== "camera") return;
    startCamera();
    return () => {
      stopCamera();
    };
  }, [!!identity, mode]);

  const handleCapture = async () => {
    setIsCapturing(true);
    const file = await capturePhoto();
    if (file) {
      const newCaptures = [...captures, file];
      setCaptures(newCaptures);
      if (currentStep < STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStep((s) => s + 1);
          setIsCapturing(false);
        }, 700);
      } else {
        setIsCapturing(false);
      }
    } else {
      setIsCapturing(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (validFiles.length > 0) {
      const combined = [...captures, ...validFiles].slice(0, STEPS.length);
      setCaptures(combined);
      setCurrentStep(Math.min(combined.length, STEPS.length - 1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleAnalyze = () => {
    setCapturedImages(captures);
    stopCamera();
    navigate({ to: "/analysis" });
  };

  // For upload mode: allow proceeding with at least 1 image
  const handleAnalyzeUpload = () => {
    if (captures.length === 0) return;
    setCapturedImages(captures);
    navigate({ to: "/analysis" });
  };

  const step = STEPS[currentStep];
  const allCaptured = captures.length >= STEPS.length;

  // ─── Sign-in gate ──────────────────────────────────────────────────────────
  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full glow-orb opacity-20" />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full glow-orb opacity-15"
          style={{ animationDelay: "3s" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-sm w-full relative z-10"
        >
          <div className="relative mb-8">
            <div className="absolute inset-[-20px] rounded-full border border-primary/10 animate-ring-pulse" />
            <div className="absolute inset-[-10px] rounded-full border border-primary/20" />
            <LogoCircle size="lg" animate />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card rounded-3xl p-8 w-full neon-border mb-6"
          >
            <h1 className="font-display text-3xl font-bold mb-3 text-gradient-gold">
              Sign In Required
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Sign in with Internet Identity to start your AI dental scan and
              save your results securely on-chain.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {["🔒 Private", "🤖 AI-Powered", "📊 Tracked"].map((item) => (
                <div
                  key={item}
                  className="text-center py-2 px-1 bg-primary/5 rounded-2xl border border-primary/15"
                >
                  <span className="text-xs text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="w-full text-base py-6 rounded-full font-semibold glow-primary shimmer-button"
              onClick={() => login()}
              data-ocid="scan.primary_button"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Start Scanning
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/" })}
            data-ocid="scan.cancel_button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ConsentModal />

      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-border/30 bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            stopCamera();
            navigate({ to: "/" });
          }}
          aria-label="Go back"
          className="rounded-full hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-gradient-gold">
            AI Dental Scan
          </h1>
          <p className="text-xs text-muted-foreground hud-telemetry">
            {mode === "camera"
              ? `STEP ${Math.min(currentStep + 1, STEPS.length)} / ${STEPS.length} — ${step.title.toUpperCase()}`
              : `UPLOAD MODE — ${captures.length} IMAGE${captures.length !== 1 ? "S" : ""} SELECTED`}
          </p>
        </div>
        <LogoCircle size="sm" />
      </header>

      {/* Mode toggle */}
      <div className="flex gap-2 px-4 pt-4">
        <button
          type="button"
          onClick={() => {
            setMode("camera");
            setCaptures([]);
            setCurrentStep(0);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all border ${
            mode === "camera"
              ? "bg-primary/15 border-primary/50 text-primary shadow-sm"
              : "bg-muted/30 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
          data-ocid="scan.mode_camera"
        >
          <Camera className="w-4 h-4" />
          Camera
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("upload");
            stopCamera();
            setCaptures([]);
            setCurrentStep(0);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all border ${
            mode === "upload"
              ? "bg-primary/15 border-primary/50 text-primary shadow-sm"
              : "bg-muted/30 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
          data-ocid="scan.mode_upload"
        >
          <ImageIcon className="w-4 h-4" />
          Upload Photo
        </button>
      </div>

      {/* ─── CAMERA MODE ──────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {mode === "camera" ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col px-4 gap-4 pt-2"
          >
            {/* Progress bar */}
            <div className="flex gap-1 pt-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className="flex-1 h-1 rounded-full bg-muted overflow-hidden"
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        i < captures.length
                          ? "100%"
                          : i === currentStep
                            ? "50%"
                            : "0%",
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.72 0.16 80), oklch(0.88 0.18 85))",
                      boxShadow:
                        i < captures.length
                          ? "0 0 6px oklch(0.78 0.16 80 / 0.5)"
                          : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Step circles */}
            <div className="flex gap-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      i < captures.length
                        ? "bg-primary text-primary-foreground circle-glow-ring"
                        : i === currentStep
                          ? "bg-primary/20 text-primary border border-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < captures.length ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[8px] text-muted-foreground text-center leading-tight">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Step instruction */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-2">
                  <span className="text-sm">{step.icon}</span>
                  <span className="text-xs font-semibold text-primary hud-telemetry">
                    {step.title.toUpperCase()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.instruction}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Camera frame */}
            <div
              className="relative rounded-3xl overflow-hidden bg-black flex-1 min-h-[280px] max-h-[360px]"
              style={{
                border: "2px solid oklch(0.78 0.16 80 / 0.6)",
                boxShadow:
                  "0 0 20px oklch(0.78 0.16 80 / 0.2), inset 0 0 20px oklch(0.78 0.16 80 / 0.04)",
              }}
            >
              {/* HUD corners */}
              {[
                "top-3 left-3",
                "top-3 right-3",
                "bottom-3 left-3",
                "bottom-3 right-3",
              ].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-5 h-5 pointer-events-none z-10`}
                  style={{
                    borderColor: "oklch(0.88 0.18 85 / 0.9)",
                    borderStyle: "solid",
                    borderWidth:
                      pos.includes("top") && pos.includes("left")
                        ? "2px 0 0 2px"
                        : pos.includes("top") && pos.includes("right")
                          ? "2px 2px 0 0"
                          : pos.includes("bottom") && pos.includes("left")
                            ? "0 0 2px 2px"
                            : "0 2px 2px 0",
                    boxShadow: "0 0 6px oklch(0.88 0.18 85 / 0.5)",
                  }}
                />
              ))}

              {isSupported === false ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="circle-icon w-16 h-16 bg-muted/30">
                    <Camera className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Camera not supported. Switch to Upload mode.
                  </p>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                  <div className="circle-icon w-16 h-16 bg-destructive/10">
                    <Camera className="w-8 h-8 text-destructive opacity-60" />
                  </div>
                  <p className="text-sm text-destructive text-center">
                    {error.message}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => startCamera()}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    style={{
                      transform:
                        currentFacingMode === "user" ? "scaleX(-1)" : "none",
                    }}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {isActive && (
                    <>
                      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                        <div
                          className="absolute left-0 right-0 animate-scan-line"
                          style={{
                            height: "2px",
                            background:
                              "linear-gradient(90deg, transparent, oklch(0.88 0.18 85), oklch(0.92 0.18 88), oklch(0.88 0.18 85), transparent)",
                            boxShadow:
                              "0 0 10px 2px oklch(0.88 0.18 85 / 0.8), 0 0 20px 4px oklch(0.78 0.16 80 / 0.4)",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
                        <div
                          className="w-4/5 rounded-3xl"
                          style={{
                            height: "60%",
                            border: "1.5px solid oklch(0.78 0.16 80 / 0.6)",
                            boxShadow: "0 0 0 9999px oklch(0 0 0 / 0.4)",
                          }}
                        />
                      </div>
                      <div className="absolute top-10 left-3 pointer-events-none z-10">
                        <p className="hud-telemetry text-[8px]">
                          AI SCAN ACTIVE
                        </p>
                        <p className="hud-telemetry text-[8px] opacity-60">
                          {step.title.toUpperCase()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await switchCamera();
                        }}
                        aria-label="Switch camera"
                        className="absolute top-3 right-8 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-20"
                      >
                        <SwitchCamera className="w-4 h-4 text-white" />
                      </button>
                    </>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <div
                        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "oklch(0.78 0.16 80)",
                          borderTopColor: "transparent",
                        }}
                      />
                    </div>
                  )}
                  <AnimatePresence>
                    {isCapturing && (
                      <motion.div
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-white z-30"
                      />
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              💡 {step.tip}
            </p>

            {/* Arch guide — highlights current scan region */}
            <ScanArchGuide step={(currentStep + 1) as 1 | 2 | 3 | 4 | 5} />

            {captures.length > 0 && (
              <div className="flex gap-2 justify-center">
                {captures.map((_, i) => (
                  <motion.div
                    key={STEPS[i]?.id ?? i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="circle-icon w-9 h-9 bg-primary/20 border border-primary/40 circle-glow-ring"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="pb-6 flex flex-col gap-3">
              {!allCaptured ? (
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 text-base py-6 rounded-full font-semibold shimmer-button glow-primary"
                    onClick={handleCapture}
                    disabled={!isActive || isLoading || isCapturing}
                    data-ocid="scan.capture_button"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {isCapturing ? "Capturing…" : `Capture ${step.title}`}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-4 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => fileInputRef.current?.click()}
                    data-ocid="scan.upload_button"
                    aria-label="Upload photo"
                  >
                    <Upload className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full text-base py-6 rounded-full font-semibold glow-primary shimmer-button"
                  onClick={handleAnalyze}
                  data-ocid="scan.primary_button"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Analyze My Teeth with AI
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                data-ocid="scan.file_input"
              />
            </div>
          </motion.div>
        ) : (
          /* ─── UPLOAD MODE ──────────────────────────────────────────────── */
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col px-4 gap-5 pt-4 pb-6"
          >
            <div className="text-center">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload clear, well-lit photos of your teeth.
                <br />
                <span className="text-primary/80">
                  Accepted: JPG, PNG, WebP · Up to 5 photos
                </span>
              </p>
            </div>

            {/* Drop zone */}
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              animate={{ scale: isDragging ? 1.02 : 1 }}
              className="relative rounded-3xl flex flex-col items-center justify-center gap-4 py-14 cursor-pointer transition-all"
              style={{
                border: isDragging
                  ? "2px dashed oklch(0.88 0.18 85 / 0.8)"
                  : "2px dashed oklch(0.78 0.16 80 / 0.4)",
                background: isDragging
                  ? "oklch(0.78 0.16 80 / 0.08)"
                  : "oklch(0.12 0.008 60 / 0.5)",
                boxShadow: isDragging
                  ? "0 0 30px oklch(0.78 0.16 80 / 0.2)"
                  : "none",
              }}
              data-ocid="scan.drop_zone"
            >
              <div
                className="circle-icon w-16 h-16 transition-all"
                style={{
                  background: isDragging
                    ? "oklch(0.78 0.16 80 / 0.15)"
                    : "oklch(0.78 0.16 80 / 0.08)",
                  border: "1.5px solid oklch(0.78 0.16 80 / 0.4)",
                }}
              >
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  {isDragging ? "Drop photos here" : "Drag & drop photos here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
              <div className="flex gap-2">
                {["JPG", "PNG", "WebP"].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 hud-telemetry"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Selected images preview */}
            {captures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold hud-telemetry text-muted-foreground">
                    {captures.length} PHOTO{captures.length !== 1 ? "S" : ""}{" "}
                    SELECTED
                  </p>
                  <button
                    type="button"
                    onClick={() => setCaptures([])}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {captures.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="relative w-16 h-16 rounded-2xl overflow-hidden border border-primary/30 flex-shrink-0"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Dental scan ${i + 1} of ${captures.length}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary/80 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
              data-ocid="scan.file_input"
            />

            {/* Arch guide — shows which area is being scanned */}
            <ScanArchGuide step={(currentStep + 1) as 1 | 2 | 3 | 4 | 5} />

            {/* Tips */}
            <div className="glass-card rounded-3xl p-4">
              <p className="text-xs font-semibold text-primary mb-2 hud-telemetry">
                📸 PHOTO TIPS FOR BEST RESULTS
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {[
                  "Use bright, even lighting (near a window works great)",
                  "Take separate photos for front, sides, upper and lower jaw",
                  "Keep the camera 15–25 cm from your mouth",
                  "Avoid blurry or dark images for accurate analysis",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5">
                    <span className="text-primary flex-shrink-0">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full text-base py-6 rounded-full font-semibold glow-primary shimmer-button"
              onClick={handleAnalyzeUpload}
              disabled={captures.length === 0}
              data-ocid="scan.analyze_button"
            >
              <Scan className="w-5 h-5 mr-2" />
              {captures.length === 0
                ? "Select Photos to Continue"
                : `Analyze ${captures.length} Photo${captures.length !== 1 ? "s" : ""} with AI`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
