/**
 * LogoCircle — DantaNova logo displayed inside a circular bordered frame.
 * Use size="sm" for headers, size="md" for nav, size="lg" for hero, size="xl" for splash.
 */

const LOGO_URL =
  "/assets/uploads/file_00000000a88c720bbdf9639edb08e122-3-1.png";

interface LogoCircleProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  glow?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: "w-9 h-9", imgSize: 28 },
  md: { outer: "w-12 h-12", imgSize: 38 },
  lg: { outer: "w-20 h-20", imgSize: 60 },
  xl: { outer: "w-52 h-52", imgSize: 180 },
};

export default function LogoCircle({
  size = "md",
  animate = false,
  glow = false,
  className = "",
}: LogoCircleProps) {
  const { outer, imgSize } = SIZE_MAP[size];
  return (
    <div
      className={`logo-circle ${outer} ${glow ? "animate-pulse-glow" : ""} ${className}`}
      style={{ overflow: "hidden", flexShrink: 0 }}
    >
      <img
        src={LOGO_URL}
        alt="DantaNova Logo"
        width={imgSize}
        height={imgSize}
        style={{
          width: imgSize,
          height: imgSize,
          objectFit: "contain",
          display: "block",
          animation: animate ? "float 3s ease-in-out infinite" : undefined,
        }}
      />
    </div>
  );
}
