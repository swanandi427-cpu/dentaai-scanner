import { motion } from "motion/react";

interface ScanArchGuideProps {
  step: 1 | 2 | 3 | 4 | 5;
}

// Tooth number → region membership
// Step 1 Front Teeth: upper 6-11, lower 22-27
// Step 2 Upper Jaw:   upper 1-16
// Step 3 Lower Jaw:   lower 17-32
// Step 4 Left Side:   upper 12-16, lower 17-21
// Step 5 Right Side:  upper 1-5, lower 28-32
const STEP_REGIONS: Record<number, Set<number>> = {
  1: new Set([6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27]),
  2: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
  3: new Set([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]),
  4: new Set([12, 13, 14, 15, 16, 17, 18, 19, 20, 21]),
  5: new Set([1, 2, 3, 4, 5, 28, 29, 30, 31, 32]),
};

const STEP_LABELS: Record<number, string> = {
  1: "Front Teeth",
  2: "Upper Jaw",
  3: "Lower Jaw",
  4: "Left Side",
  5: "Right Side",
};

// Generate parabolic tooth positions along a U-shaped arch (top-down view)
// Returns normalized SVG coordinates within a 220×90 viewBox row
function getArchPositions(): { x: number; y: number; angle: number }[] {
  const positions: { x: number; y: number; angle: number }[] = [];
  for (let i = 0; i < 16; i++) {
    const t = i / 15; // 0..1
    const angle = Math.PI * (1 - t); // π..0
    const rx = 88;
    const ry = 36;
    const cx = 110;
    const cy = 0;
    const x = cx + rx * Math.cos(angle);
    const y = cy + ry * Math.sin(angle);
    const tangentAngle = -Math.atan2(
      ry * Math.cos(angle),
      rx * Math.sin(angle),
    );
    positions.push({ x, y, angle: tangentAngle });
  }
  return positions;
}

const UPPER_POSITIONS = getArchPositions();
// Lower arch is mirrored vertically (flipped y)
const LOWER_POSITIONS = UPPER_POSITIONS.map(({ x, y, angle }) => ({
  x,
  y: -y,
  angle: -angle,
}));

export default function ScanArchGuide({ step }: ScanArchGuideProps) {
  const activeSet = STEP_REGIONS[step];
  const label = STEP_LABELS[step];

  // SVG viewBox: 220 wide, 120 tall
  // Upper arch: centered at y=30, Lower arch: centered at y=90
  const upperCY = 32;
  const lowerCY = 88;
  const toothW = 9;
  const toothH = 7;

  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative"
      style={{
        background: "oklch(0.08 0.005 60 / 0.85)",
        border: "1.5px solid oklch(0.78 0.16 80 / 0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      data-ocid="scan.arch_guide"
    >
      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.78 0.16 80 / 0.04) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 220 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ height: "96px", display: "block" }}
        role="img"
        aria-labelledby="arch-guide-title"
      >
        <title id="arch-guide-title">{`Dental arch diagram — scanning ${label}`}</title>
        {/* Upper arch label */}
        <text
          x="110"
          y="9"
          textAnchor="middle"
          fill="oklch(0.65 0.05 60 / 0.7)"
          fontSize="5.5"
          fontFamily="monospace"
          letterSpacing="0.5"
        >
          UPPER JAW
        </text>

        {/* Lower arch label */}
        <text
          x="110"
          y="118"
          textAnchor="middle"
          fill="oklch(0.65 0.05 60 / 0.7)"
          fontSize="5.5"
          fontFamily="monospace"
          letterSpacing="0.5"
        >
          LOWER JAW
        </text>

        {/* ── Upper arch gum line ── */}
        <path
          d="M 22 32 Q 110 -4 198 32"
          fill="none"
          stroke="oklch(0.45 0.04 30 / 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ── Lower arch gum line ── */}
        <path
          d="M 22 88 Q 110 124 198 88"
          fill="none"
          stroke="oklch(0.45 0.04 30 / 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* ── Upper teeth (1–16, left to right in SVG = right to left anatomically) ── */}
        {UPPER_POSITIONS.map((pos, i) => {
          const toothNum = i + 1; // teeth 1..16
          const isActive = activeSet.has(toothNum);
          const svgX = pos.x;
          const svgY = upperCY + pos.y;

          const fill = isActive
            ? "oklch(0.72 0.16 80)"
            : "oklch(0.22 0.01 60 / 0.8)";
          const stroke = isActive
            ? "oklch(0.88 0.18 85 / 0.9)"
            : "oklch(0.38 0.02 60 / 0.4)";
          const strokeWidth = isActive ? 1.2 : 0.7;

          // Scale tooth size: front teeth slightly larger
          const frontness = Math.max(0, 1 - Math.abs(i / 15 - 0.5) * 2.2);
          const w = toothW - 2.5 * frontness;
          const h = toothH + 1.5 * frontness;

          return (
            <g key={`upper-${toothNum}`}>
              <rect
                x={svgX - w / 2}
                y={svgY - h / 2}
                width={w}
                height={h}
                rx="2"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 3px oklch(0.88 0.18 85 / 0.7))"
                    : "none",
                }}
              />
            </g>
          );
        })}

        {/* ── Lower teeth (17–32, left to right) ── */}
        {LOWER_POSITIONS.map((pos, i) => {
          const toothNum = i + 17; // teeth 17..32
          const isActive = activeSet.has(toothNum);
          const svgX = pos.x;
          const svgY = lowerCY + pos.y;

          const fill = isActive
            ? "oklch(0.72 0.16 80)"
            : "oklch(0.22 0.01 60 / 0.8)";
          const stroke = isActive
            ? "oklch(0.88 0.18 85 / 0.9)"
            : "oklch(0.38 0.02 60 / 0.4)";
          const strokeWidth = isActive ? 1.2 : 0.7;

          const frontness = Math.max(0, 1 - Math.abs(i / 15 - 0.5) * 2.2);
          const w = toothW - 2.5 * frontness;
          const h = toothH + 1.5 * frontness;

          return (
            <g key={`lower-${toothNum}`}>
              <rect
                x={svgX - w / 2}
                y={svgY - h / 2}
                width={w}
                height={h}
                rx="2"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 3px oklch(0.88 0.18 85 / 0.7))"
                    : "none",
                }}
              />
            </g>
          );
        })}

        {/* Animated gold pulse ring over active region centroid */}
        <AnimatedPulse step={step} upperCY={upperCY} lowerCY={lowerCY} />
      </svg>

      {/* Label strip */}
      <div
        className="flex items-center justify-center gap-2 py-1.5 border-t"
        style={{ borderColor: "oklch(0.78 0.16 80 / 0.2)" }}
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5"
        >
          {/* Pulsing dot */}
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "oklch(0.88 0.18 85)" }}
          />
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{
              color: "oklch(0.88 0.18 85)",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            SCANNING: {label.toUpperCase()}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// Animated SVG pulse shown at the centroid of active teeth
function AnimatedPulse({
  step,
  upperCY,
  lowerCY,
}: {
  step: number;
  upperCY: number;
  lowerCY: number;
}) {
  // Compute centroid x,y of the active region
  const activeSet = STEP_REGIONS[step];

  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let i = 0; i < 16; i++) {
    const toothNum = i + 1;
    if (activeSet.has(toothNum)) {
      sumX += UPPER_POSITIONS[i].x;
      sumY += upperCY + UPPER_POSITIONS[i].y;
      count++;
    }
  }
  for (let i = 0; i < 16; i++) {
    const toothNum = i + 17;
    if (activeSet.has(toothNum)) {
      sumX += LOWER_POSITIONS[i].x;
      sumY += lowerCY + LOWER_POSITIONS[i].y;
      count++;
    }
  }

  if (count === 0) return null;

  const cx = sumX / count;
  const cy = sumY / count;

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="18"
        fill="none"
        stroke="oklch(0.88 0.18 85 / 0.18)"
        strokeWidth="1"
      >
        <animate
          attributeName="r"
          values="12;26;12"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill="none"
        stroke="oklch(0.88 0.18 85 / 0.35)"
        strokeWidth="1.2"
      >
        <animate
          attributeName="r"
          values="6;16;6"
          dur="2.4s"
          begin="0.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2.4s"
          begin="0.4s"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
}
