import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

const SCENE_DURATION = 3000;

const scenes = [
  { id: 1, title: "Meet Priya", subtitle: "She's worried about tooth pain" },
  {
    id: 2,
    title: "Opens DantaNova",
    subtitle: "She opens the app on her phone",
  },
  {
    id: 3,
    title: "Scanning Her Teeth",
    subtitle: "AI scan-line sweeps across",
  },
  {
    id: 4,
    title: "AI Detects 2 Cavities",
    subtitle: "Tooth 14 & Tooth 18 flagged",
  },
  { id: 5, title: "Severity Alert", subtitle: "Health Score drops to 52" },
  {
    id: 6,
    title: "Emergency Dentist Found",
    subtitle: "Dr. Ananya Sharma — 30 min away",
  },
  {
    id: 7,
    title: "Appointment Confirmed",
    subtitle: "3:00 PM today — booked!",
  },
  { id: 8, title: "Your Turn", subtitle: "Start Your Free Scan Now" },
];

// ── Gold HUD corner brackets ──────────────────────────────────────────────────
function HudCorners({ size = 20 }: { size?: number }) {
  const s = "oklch(0.88 0.18 85)";
  return (
    <>
      {/* top-left */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          width: size,
          height: size,
          borderTop: `2px solid ${s}`,
          borderLeft: `2px solid ${s}`,
        }}
      />
      {/* top-right */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: size,
          height: size,
          borderTop: `2px solid ${s}`,
          borderRight: `2px solid ${s}`,
        }}
      />
      {/* bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 8,
          width: size,
          height: size,
          borderBottom: `2px solid ${s}`,
          borderLeft: `2px solid ${s}`,
        }}
      />
      {/* bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: size,
          height: size,
          borderBottom: `2px solid ${s}`,
          borderRight: `2px solid ${s}`,
        }}
      />
    </>
  );
}

// ── Scene 1: Priya intro ──────────────────────────────────────────────────────
function Scene1() {
  return (
    <div className="flex flex-col items-center gap-6 relative">
      {/* Character SVG */}
      <svg
        viewBox="0 0 120 180"
        width="130"
        height="195"
        aria-label="Priya character — worried patient"
        style={{
          overflow: "visible",
          filter: "drop-shadow(0 0 20px oklch(0.88 0.18 85 / 0.3))",
        }}
      >
        <title>Priya — dental patient character</title>
        <ellipse cx="60" cy="152" rx="30" ry="36" fill="oklch(0.35 0.09 280)" />
        <rect
          x="52"
          y="102"
          width="16"
          height="18"
          rx="4"
          fill="oklch(0.80 0.09 65)"
        />
        <circle cx="60" cy="83" r="31" fill="oklch(0.80 0.09 65)" />
        <ellipse cx="60" cy="63" rx="33" ry="22" fill="oklch(0.15 0.01 60)" />
        <rect
          x="27"
          y="69"
          width="14"
          height="56"
          rx="7"
          fill="oklch(0.15 0.01 60)"
        />
        <rect
          x="79"
          y="69"
          width="14"
          height="56"
          rx="7"
          fill="oklch(0.15 0.01 60)"
        />
        <ellipse cx="60" cy="55" rx="31" ry="16" fill="oklch(0.15 0.01 60)" />
        {/* Worried eyes */}
        <ellipse cx="48" cy="85" rx="5" ry="4" fill="oklch(0.1 0.01 60)" />
        <ellipse cx="72" cy="85" rx="5" ry="4" fill="oklch(0.1 0.01 60)" />
        <path
          d="M43 77 Q48 73 53 77"
          stroke="oklch(0.1 0.01 60)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M67 77 Q72 73 77 77"
          stroke="oklch(0.1 0.01 60)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M50 97 Q60 92 70 97"
          stroke="oklch(0.1 0.01 60)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="42"
          cy="93"
          r="5"
          fill="oklch(0.72 0.15 25)"
          opacity="0.5"
        />
        <circle
          cx="78"
          cy="93"
          r="5"
          fill="oklch(0.72 0.15 25)"
          opacity="0.5"
        />
        <rect
          x="18"
          y="120"
          width="14"
          height="40"
          rx="7"
          fill="oklch(0.35 0.09 280)"
        />
        <rect
          x="88"
          y="120"
          width="14"
          height="40"
          rx="7"
          fill="oklch(0.35 0.09 280)"
        />
        <circle cx="25" cy="162" r="8" fill="oklch(0.80 0.09 65)" />
        <circle cx="95" cy="162" r="8" fill="oklch(0.80 0.09 65)" />
      </svg>
      {/* Speech bubble */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "10%",
          background: "oklch(0.12 0.015 60)",
          border: "1.5px solid oklch(0.88 0.18 85 / 0.6)",
          borderRadius: 14,
          padding: "10px 16px",
          zIndex: 20,
          boxShadow: "0 0 20px oklch(0.88 0.18 85 / 0.2)",
          animation: "bubblePop 0.5s ease both",
        }}
      >
        <div style={{ fontSize: 22, textAlign: "center" }}>😬</div>
        <div
          style={{
            color: "oklch(0.88 0.18 85)",
            fontSize: 11,
            fontWeight: 700,
            textAlign: "center",
            marginTop: 2,
          }}
        >
          Ouch!
        </div>
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "30%",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid oklch(0.88 0.18 85 / 0.6)",
          }}
        />
      </div>
      {/* HUD telemetry */}
      <div
        style={{
          position: "absolute",
          bottom: -12,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span className="hud-telemetry">STATUS: DENTAL PAIN DETECTED</span>
      </div>
    </div>
  );
}

// ── Scene 2: Phone UI ─────────────────────────────────────────────────────────
function Scene2() {
  return (
    <div
      style={{ position: "relative", animation: "sceneSlideUp 0.6s ease both" }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 130,
          height: 220,
          borderRadius: 22,
          border: "3px solid oklch(0.88 0.18 85)",
          background: "oklch(0.08 0.015 60)",
          boxShadow:
            "0 0 40px oklch(0.88 0.18 85 / 0.4), inset 0 0 20px oklch(0.88 0.18 85 / 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Notch */}
        <div
          style={{
            width: 44,
            height: 9,
            background: "oklch(0.12 0.01 60)",
            borderRadius: "0 0 10px 10px",
            marginTop: 8,
            marginBottom: 6,
          }}
        />
        {/* Status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "85%",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              color: "oklch(0.88 0.18 85)",
              fontSize: 8,
              fontFamily: "monospace",
            }}
          >
            9:41
          </span>
          <span style={{ color: "oklch(0.88 0.18 85)", fontSize: 8 }}>🔋</span>
        </div>
        {/* Logo */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2.5px solid oklch(0.88 0.18 85)",
            background: "oklch(0.10 0.02 75)",
            margin: "0 auto 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 0 20px oklch(0.88 0.18 85 / 0.5)",
            animation: "pulsGlow 1.8s ease-in-out infinite",
          }}
        >
          🦷
        </div>
        <div
          style={{
            color: "oklch(0.88 0.18 85)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          DantaNova
        </div>
        <div
          style={{ color: "oklch(0.55 0.06 80)", fontSize: 9, marginTop: 2 }}
        >
          AI Dental Scanner
        </div>
        <div
          style={{
            marginTop: 14,
            background:
              "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.16 80))",
            borderRadius: 20,
            padding: "6px 16px",
            color: "oklch(0.08 0.01 60)",
            fontSize: 9,
            fontWeight: 800,
            boxShadow: "0 0 12px oklch(0.88 0.18 85 / 0.4)",
          }}
        >
          Start Free Scan
        </div>
        {/* Nav dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  i === 1 ? "oklch(0.88 0.18 85)" : "oklch(0.25 0.02 60)",
              }}
            />
          ))}
        </div>
        {/* Gold glow overlay at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            background:
              "linear-gradient(transparent, oklch(0.88 0.18 85 / 0.08))",
          }}
        />
      </div>
      {/* HUD telemetry */}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span className="hud-telemetry">APP LAUNCHED · READY TO SCAN</span>
      </div>
    </div>
  );
}

// ── Scene 3: Camera scan ──────────────────────────────────────────────────────
function Scene3() {
  return (
    <div
      style={{ position: "relative", animation: "sceneSlideUp 0.6s ease both" }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          border: "2px solid oklch(0.88 0.18 85 / 0.6)",
          background: "oklch(0.05 0.01 60)",
          boxShadow: "0 0 30px oklch(0.88 0.18 85 / 0.3)",
        }}
      >
        {/* Camera feed BG */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, oklch(0.18 0.04 60) 0%, oklch(0.05 0.01 60) 100%)",
          }}
        />
        {/* Teeth emoji subject */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
          }}
        >
          😁
        </div>
        {/* Gold scan line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, oklch(0.88 0.18 85), oklch(0.92 0.18 88), oklch(0.88 0.18 85), transparent)",
            animation: "goldScanLine 1.8s linear infinite",
            boxShadow: "0 0 12px oklch(0.88 0.18 85 / 0.8)",
            zIndex: 10,
          }}
        />
        {/* Corner brackets */}
        <HudCorners size={18} />
        {/* AI overlay text */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "oklch(0.88 0.18 85)",
            fontSize: 9,
            fontFamily: "monospace",
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          ◉ AI SCANNING...
        </div>
        {/* Detection dots */}
        {[
          { x: 40, y: 80, delay: 0 },
          { x: 120, y: 100, delay: 0.2 },
          { x: 160, y: 70, delay: 0.4 },
        ].map((dot) => (
          <div
            key={`dot-${dot.x}-${dot.y}`}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "oklch(0.88 0.18 85)",
              boxShadow: "0 0 10px oklch(0.88 0.18 85)",
              animation: `nodePop 0.4s ease ${dot.delay}s both`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <span className="hud-telemetry">
          NEURAL NET ACTIVE · 32 TEETH MAPPED
        </span>
      </div>
    </div>
  );
}

// ── Scene 4: Cavity detection ─────────────────────────────────────────────────
function Scene4() {
  return (
    <div
      className="flex flex-col items-center gap-5"
      style={{ animation: "sceneSlideUp 0.6s ease both" }}
    >
      {/* 3D tooth with glow */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.96 0.02 85), oklch(0.80 0.06 80) 60%, oklch(0.60 0.10 75))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          boxShadow: "0 0 40px oklch(0.88 0.18 85 / 0.5)",
          animation: "toothFloat 2s ease-in-out infinite",
        }}
      >
        🦷
      </div>
      {/* Condition cards */}
      <div style={{ display: "flex", gap: 16 }}>
        {[14, 18].map((tooth, i) => (
          <div
            key={tooth}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              animation: `condCardIn 0.5s ease ${i * 0.15}s both`,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
                background: "oklch(0.12 0.03 25)",
                border: "2px solid oklch(0.62 0.22 25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px oklch(0.62 0.22 25 / 0.5)",
                animation: "pulseDanger 1s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "oklch(0.62 0.22 25)",
                }}
              />
              <div
                style={{
                  color: "oklch(0.72 0.22 25)",
                  fontSize: 10,
                  marginTop: 3,
                  fontWeight: 700,
                }}
              >
                #{tooth}
              </div>
            </div>
            <span
              style={{
                color: "oklch(0.62 0.22 25)",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              CAVITY
            </span>
          </div>
        ))}
      </div>
      {/* Alert badge */}
      <div
        style={{
          background: "oklch(0.12 0.04 25)",
          border: "1.5px solid oklch(0.62 0.22 25)",
          borderRadius: 30,
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 0 20px oklch(0.62 0.22 25 / 0.3)",
          animation: "alertBounce 0.6s ease both",
        }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span
          style={{
            color: "oklch(0.72 0.22 25)",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          2 Cavities Detected!
        </span>
      </div>
    </div>
  );
}

// ── Scene 5: Health score ─────────────────────────────────────────────────────
function Scene5() {
  const [score, setScore] = useState(100);

  useEffect(() => {
    const t = setTimeout(() => {
      let cur = 100;
      const interval = setInterval(() => {
        cur -= 3;
        if (cur <= 52) {
          clearInterval(interval);
          setScore(52);
          return;
        }
        setScore(cur);
      }, 55);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const pct = score;
  const color =
    pct > 70
      ? "oklch(0.72 0.18 142)"
      : pct > 40
        ? "oklch(0.82 0.18 75)"
        : "oklch(0.62 0.22 25)";

  return (
    <div
      className="flex flex-col items-center gap-5 w-full max-w-xs"
      style={{ animation: "sceneSlideUp 0.6s ease both" }}
    >
      {/* Severity banner */}
      <div
        style={{
          width: "100%",
          background: "oklch(0.12 0.04 25)",
          border: "2px solid oklch(0.62 0.22 25)",
          borderRadius: 14,
          padding: "14px 18px",
          boxShadow: "0 0 30px oklch(0.62 0.22 25 / 0.3)",
        }}
      >
        <div
          style={{
            color: "oklch(0.82 0.15 25)",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          ⚠️ Moderate Severity Detected
        </div>
        <div
          style={{ color: "oklch(0.65 0.12 25)", fontSize: 12, marginTop: 4 }}
        >
          Cavities in Tooth #14 & #18
        </div>
      </div>
      {/* Score gauge */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: "oklch(0.55 0.05 80)",
            marginBottom: 8,
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          HEALTH SCORE
        </div>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `conic-gradient(${color} ${pct * 3.6}deg, oklch(0.15 0.02 60) 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.1s",
            boxShadow: `0 0 30px ${color.replace(")", " / 0.4)")}`,
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: "oklch(0.08 0.01 60)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color, fontWeight: 800, fontSize: 22 }}>
              {score}
            </span>
          </div>
        </div>
        <div
          style={{ color: "oklch(0.60 0.06 80)", fontSize: 11, marginTop: 6 }}
        >
          {score > 70 ? "Good" : score > 40 ? "Moderate" : "Poor"}
        </div>
      </div>
    </div>
  );
}

// ── Scene 6: Dentist finder ────────────────────────────────────────────────────
function Scene6() {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setClicked(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-4 w-full max-w-xs"
      style={{ animation: "sceneSlideUp 0.6s ease both" }}
    >
      {/* Find button */}
      <button
        type="button"
        style={{
          background: clicked
            ? "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.16 80))"
            : "transparent",
          border: "2px solid oklch(0.88 0.18 85)",
          borderRadius: 30,
          padding: "12px 24px",
          color: clicked ? "oklch(0.08 0.01 60)" : "oklch(0.88 0.18 85)",
          fontWeight: 800,
          fontSize: 13,
          cursor: "pointer",
          boxShadow: "0 0 24px oklch(0.88 0.18 85 / 0.4)",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        🚨 Find Emergency Dentist
      </button>
      {/* Dentist card */}
      {clicked && (
        <div
          style={{
            width: "100%",
            background: "oklch(0.11 0.02 80)",
            border: "2px solid oklch(0.88 0.18 85 / 0.5)",
            borderRadius: 18,
            padding: "16px",
            boxShadow: "0 0 30px oklch(0.88 0.18 85 / 0.2)",
            animation: "cardSlideIn 0.5s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.14 75))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 0 16px oklch(0.88 0.18 85 / 0.4)",
              }}
            >
              👩‍⚕️
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "oklch(0.88 0.18 85)",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Dr. Ananya Sharma
              </div>
              <div
                style={{
                  color: "oklch(0.60 0.06 80)",
                  fontSize: 11,
                  marginTop: 1,
                }}
              >
                ⭐ 4.9 · Endodontist
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 4,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    background: "oklch(0.15 0.06 142)",
                    border: "1px solid oklch(0.62 0.18 142 / 0.4)",
                    borderRadius: 20,
                    padding: "2px 10px",
                    color: "oklch(0.72 0.18 142)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  ✓ Available Today
                </span>
                <span style={{ color: "oklch(0.65 0.06 80)", fontSize: 10 }}>
                  📍 1.2 km
                </span>
              </div>
            </div>
            {/* Gold verified badge */}
            <div
              style={{
                background: "oklch(0.88 0.18 85)",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                boxShadow: "0 0 8px oklch(0.88 0.18 85)",
              }}
            >
              ✓
            </div>
          </div>
          <div
            style={{ marginTop: 8, color: "oklch(0.62 0.08 85)", fontSize: 11 }}
          >
            ⏱ Available in 30 minutes
          </div>
          <button
            type="button"
            style={{
              marginTop: 10,
              width: "100%",
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.16 80))",
              border: "none",
              borderRadius: 22,
              padding: "10px",
              color: "oklch(0.08 0.01 60)",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
              boxShadow: "0 0 16px oklch(0.88 0.18 85 / 0.3)",
            }}
          >
            Book Appointment →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Scene 7: Confirmation ─────────────────────────────────────────────────────
function Scene7() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 260,
    y: -(Math.random() * 180 + 20),
    color: [
      "oklch(0.88 0.18 85)",
      "oklch(0.82 0.18 80)",
      "oklch(0.72 0.18 142)",
      "oklch(0.68 0.18 25)",
      "oklch(0.75 0.14 75)",
    ][i % 5],
    size: Math.random() * 9 + 4,
    rot: Math.random() * 360,
    delay: Math.random() * 0.8,
  }));

  return (
    <div
      className="flex flex-col items-center gap-4 w-full max-w-xs"
      style={{ position: "relative", animation: "sceneSlideUp 0.6s ease both" }}
    >
      {/* Confetti */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: "50%",
              top: "30%",
              width: p.size,
              height: p.size,
              borderRadius: 2,
              background: p.color,
              animation: `confettiFall 1.8s ease-out ${p.delay}s both`,
              transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      {/* Gold checkmark */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.15 0.04 80), oklch(0.10 0.02 60))",
          border: "3px solid oklch(0.88 0.18 85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          boxShadow:
            "0 0 50px oklch(0.88 0.18 85 / 0.5), 0 0 100px oklch(0.88 0.18 85 / 0.2)",
          animation: "checkBounce 0.7s ease both",
          position: "relative",
          zIndex: 10,
        }}
      >
        ✅
      </div>
      <div
        style={{
          color: "oklch(0.88 0.18 85)",
          fontWeight: 800,
          fontSize: 18,
          position: "relative",
          zIndex: 10,
        }}
      >
        Appointment Confirmed!
      </div>
      <div
        style={{
          background: "oklch(0.11 0.03 80)",
          border: "2px solid oklch(0.88 0.18 85 / 0.5)",
          borderRadius: 16,
          padding: "14px 20px",
          width: "100%",
          textAlign: "center",
          animation: "cardSlideIn 0.5s 0.4s ease both",
          position: "relative",
          zIndex: 10,
          boxShadow: "0 0 24px oklch(0.88 0.18 85 / 0.15)",
        }}
      >
        <div style={{ color: "oklch(0.75 0.10 80)", fontSize: 12 }}>
          Dr. Sharma confirmed your slot
        </div>
        <div
          style={{
            color: "oklch(0.88 0.18 85)",
            fontWeight: 800,
            fontSize: 18,
            marginTop: 6,
          }}
        >
          3:00 PM Today
        </div>
        <div
          style={{ color: "oklch(0.62 0.06 80)", fontSize: 11, marginTop: 4 }}
        >
          📍 MediSmile Clinic, Mumbai · 1.2 km away
        </div>
      </div>
    </div>
  );
}

// ── Scene 8: CTA ──────────────────────────────────────────────────────────────
function Scene8({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-6"
      style={{ animation: "sceneSlideUp 0.7s ease both" }}
    >
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: "3px solid oklch(0.88 0.18 85)",
          background: "oklch(0.10 0.02 75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
          boxShadow:
            "0 0 60px oklch(0.88 0.18 85 / 0.6), 0 0 120px oklch(0.88 0.18 85 / 0.2)",
          animation: "toothFloat 2.5s ease-in-out infinite",
        }}
      >
        🦷
      </div>
      <div style={{ textAlign: "center", maxWidth: 280 }}>
        <div
          style={{
            color: "oklch(0.88 0.18 85)",
            fontWeight: 900,
            fontSize: 22,
            background:
              "linear-gradient(135deg, oklch(0.92 0.18 88), oklch(0.75 0.2 72))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 10,
          }}
        >
          Your smile deserves the same care
        </div>
        <div
          style={{
            color: "oklch(0.55 0.06 80)",
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          "Because Every Smile Matters The Most"
        </div>
      </div>
      <button
        type="button"
        onClick={onStart}
        data-ocid="demo.start_scan.primary_button"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.65 0.17 75))",
          border: "none",
          borderRadius: 40,
          padding: "18px 48px",
          color: "oklch(0.08 0.01 60)",
          fontWeight: 900,
          fontSize: 17,
          cursor: "pointer",
          boxShadow:
            "0 0 40px oklch(0.88 0.18 85 / 0.6), 0 8px 32px oklch(0.88 0.18 85 / 0.3)",
          animation: "ctaPulse 2s ease-in-out infinite",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>
          🦷 Start Your Free Scan →
        </span>
        {/* Shimmer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.2), transparent)",
            animation: "shimmerBtn 2s ease-in-out infinite",
          }}
        />
      </button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const navigate = useNavigate();
  const [currentScene, setCurrentScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [sceneProgress, setSceneProgress] = useState(0);

  const goToScene = useCallback((idx: number) => {
    setCurrentScene(Math.max(0, Math.min(scenes.length - 1, idx)));
    setSceneProgress(0);
  }, []);

  useEffect(() => {
    if (!playing || currentScene >= scenes.length - 1) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / SCENE_DURATION, 1);
      setSceneProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCurrentScene((s) => s + 1);
        setSceneProgress(0);
      }
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, currentScene]);

  const overallProgress =
    ((currentScene + sceneProgress) / (scenes.length - 1)) * 100;
  const scene = scenes[currentScene];
  const timeRemaining = Math.ceil(
    (SCENE_DURATION * (1 - sceneProgress)) / 1000,
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "oklch(0.06 0.015 60)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        fontFamily: '"Satoshi", system-ui, sans-serif',
        position: "relative",
      }}
    >
      <style>{`
        @keyframes goldScanLine { 0% { top: 5%; } 50% { top: 90%; } 100% { top: 5%; } }
        @keyframes sceneSlideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toothFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes condCardIn { from { opacity: 0; transform: scale(0.7) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes alertBounce { 0% { opacity: 0; transform: scale(0.5); } 60% { transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulsGlow { 0%, 100% { box-shadow: 0 0 16px oklch(0.88 0.18 85 / 0.4); } 50% { box-shadow: 0 0 36px oklch(0.88 0.18 85 / 0.8); } }
        @keyframes pulseDanger { 0%, 100% { box-shadow: 0 0 10px oklch(0.62 0.22 25 / 0.4); } 50% { box-shadow: 0 0 24px oklch(0.62 0.22 25 / 0.9); transform: scale(1.06); } }
        @keyframes cardSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes checkBounce { 0% { opacity: 0; transform: scale(0.3); } 60% { transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes confettiFall { 0% { opacity: 1; transform: translate(0,0) rotate(0deg); } 100% { opacity: 0; transform: translate(var(--cx, 60px), var(--cy, 80px)) rotate(360deg); } }
        @keyframes bubblePop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes nodePop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes ctaPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes shimmerBtn { 0% { transform: translateX(-150%) skewX(-15deg); } 100% { transform: translateX(300%) skewX(-15deg); } }
        .scene-fade { animation: sceneSlideUp 0.55s ease both; }
      `}</style>

      {/* Progress bar */}
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}
      >
        <div style={{ height: 3, background: "oklch(0.15 0.02 60)" }}>
          <div
            style={{
              height: "100%",
              width: `${overallProgress}%`,
              transition: "width 0.1s linear",
              background:
                "linear-gradient(90deg, oklch(0.88 0.18 85), oklch(0.92 0.18 88))",
              boxShadow: "0 0 10px oklch(0.88 0.18 85 / 0.6)",
            }}
          />
        </div>
        {/* Segment dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            display: "flex",
          }}
        >
          {scenes.map((sc) => (
            <div
              key={sc.id}
              style={{
                flex: 1,
                borderRight:
                  sc.id < scenes.length
                    ? "1px solid oklch(0.08 0.01 60 / 0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Back */}
      <div style={{ position: "fixed", top: 14, left: 14, zIndex: 50 }}>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="demo.back.button"
          style={{
            background: "oklch(0.12 0.015 60)",
            border: "1px solid oklch(0.88 0.18 85 / 0.3)",
            borderRadius: 22,
            padding: "6px 14px",
            color: "oklch(0.65 0.08 80)",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          ← Back
        </button>
      </div>
      {/* Scene counter */}
      <div style={{ position: "fixed", top: 14, right: 14, zIndex: 50 }}>
        <span
          style={{
            background: "oklch(0.12 0.015 60)",
            border: "1px solid oklch(0.88 0.18 85 / 0.3)",
            borderRadius: 22,
            padding: "6px 12px",
            color: "oklch(0.65 0.08 80)",
            fontSize: 12,
          }}
        >
          {currentScene + 1} / {scenes.length}
        </span>
      </div>

      {/* Main scene */}
      <div
        key={currentScene}
        className="scene-fade"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 500,
          padding: "80px 24px 24px",
          position: "relative",
          minHeight: "70dvh",
        }}
      >
        {/* Scene visual */}
        <div style={{ marginBottom: 36, position: "relative" }}>
          {currentScene === 0 && <Scene1 />}
          {currentScene === 1 && <Scene2 />}
          {currentScene === 2 && <Scene3 />}
          {currentScene === 3 && <Scene4 />}
          {currentScene === 4 && <Scene5 />}
          {currentScene === 5 && <Scene6 />}
          {currentScene === 6 && <Scene7 />}
          {currentScene === 7 && (
            <Scene8 onStart={() => navigate({ to: "/scan" })} />
          )}
        </div>
        {/* Text (not shown for scene 8) */}
        {currentScene < 7 && (
          <div style={{ textAlign: "center", maxWidth: 340 }}>
            <div
              style={{
                color: "oklch(0.88 0.18 85)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 10,
                opacity: 0.7,
                fontFamily: "monospace",
              }}
            >
              {scene.title}
            </div>
            <div
              style={{
                color: "oklch(0.95 0.02 85)",
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              {scene.subtitle}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          padding: "16px 24px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Dots */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {scenes.map((sc, idx) => (
            <button
              type="button"
              key={sc.id}
              data-ocid={`demo.scene.${sc.id}`}
              onClick={() => {
                goToScene(idx);
                setPlaying(true);
              }}
              style={{
                width: idx === currentScene ? 28 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                background:
                  idx === currentScene
                    ? "oklch(0.88 0.18 85)"
                    : idx < currentScene
                      ? "oklch(0.88 0.18 85 / 0.4)"
                      : "oklch(0.22 0.02 60)",
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
                padding: 0,
                boxShadow:
                  idx === currentScene
                    ? "0 0 8px oklch(0.88 0.18 85 / 0.6)"
                    : "none",
              }}
            />
          ))}
        </div>
        {/* Prev / Play-Pause / Next */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button
            type="button"
            onClick={() => {
              goToScene(currentScene - 1);
              setPlaying(true);
            }}
            disabled={currentScene === 0}
            data-ocid="demo.pagination_prev"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "oklch(0.12 0.015 60)",
              border: "1px solid oklch(0.25 0.02 60)",
              color:
                currentScene === 0
                  ? "oklch(0.25 0.02 60)"
                  : "oklch(0.65 0.06 80)",
              cursor: currentScene === 0 ? "not-allowed" : "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            data-ocid="demo.toggle"
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: playing
                ? "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.16 80))"
                : "oklch(0.12 0.015 60)",
              border: "2px solid oklch(0.88 0.18 85)",
              color: playing ? "oklch(0.08 0.01 60)" : "oklch(0.88 0.18 85)",
              cursor: "pointer",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: playing
                ? "0 0 24px oklch(0.88 0.18 85 / 0.5)"
                : "none",
              transition: "all 0.2s",
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button
            type="button"
            onClick={() => {
              goToScene(currentScene + 1);
              setPlaying(true);
            }}
            disabled={currentScene === scenes.length - 1}
            data-ocid="demo.pagination_next"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "oklch(0.12 0.015 60)",
              border: "1px solid oklch(0.25 0.02 60)",
              color:
                currentScene === scenes.length - 1
                  ? "oklch(0.25 0.02 60)"
                  : "oklch(0.65 0.06 80)",
              cursor:
                currentScene === scenes.length - 1 ? "not-allowed" : "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>
        {playing && currentScene < scenes.length - 1 && (
          <div
            style={{
              color: "oklch(0.38 0.03 60)",
              fontSize: 11,
              fontFamily: "monospace",
            }}
          >
            Next scene in {timeRemaining}s
          </div>
        )}
      </div>
    </div>
  );
}
