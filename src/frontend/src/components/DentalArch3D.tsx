import type { ToothRecord } from "@/types";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLOR: Record<string, string> = {
  healthy: "#22c55e",
  risk: "#fbbf24",
  cavity: "#f87171",
};

const STATUS_GLOW: Record<string, string> = {
  healthy: "#16a34a",
  risk: "#d97706",
  cavity: "#dc2626",
};

const STATUS_EMISSIVE_COLOR: Record<string, THREE.ColorRepresentation> = {
  healthy: "#042a10",
  risk: "#2a1200",
  cavity: "#2a0404",
};

const STATUS_LABEL: Record<string, string> = {
  healthy: "Healthy",
  risk: "Risk Detected",
  cavity: "Cavity / Decay",
};

const STATUS_BG: Record<string, string> = {
  healthy: "rgba(4,42,16,0.96)",
  risk: "rgba(56,24,2,0.96)",
  cavity: "rgba(56,4,4,0.96)",
};

const STATUS_BORDER: Record<string, string> = {
  healthy: "#22c55e",
  risk: "#f59e0b",
  cavity: "#ef4444",
};

// ---------------------------------------------------------------------------
// Per-tooth deterministic roughness seed (0.08 – 0.32)
// ---------------------------------------------------------------------------
function toothRoughness(toothNum: number): number {
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const centerDistance = Math.abs(idx - 7.5) / 7.5;
  return 0.08 + 0.24 * centerDistance;
}

function toothColor(toothNum: number): THREE.Color {
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const centerDistance = Math.abs(idx - 7.5) / 7.5;
  const r = 0.974 + 0.014 * centerDistance;
  const g = 0.944 - 0.028 * centerDistance;
  const b = 0.882 - 0.058 * centerDistance;
  return new THREE.Color(r, g, b);
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

function getToothTransform(toothNum: number): {
  position: [number, number, number];
  rotationY: number;
} {
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const t = idx / 15;
  const rx = 2.45;
  const rz = 1.75;
  const angle = Math.PI * (1 - t);
  const x = rx * Math.cos(angle);
  const z = rz * Math.sin(angle);
  const y = isUpper ? 0.55 : -0.55;
  const rotationY = -(Math.PI / 2 - angle);
  return { position: [x, y, z], rotationY };
}

function getToothSize(idx: number): [number, number, number] {
  const t = idx / 15;
  const frontness = Math.max(0, 1 - Math.abs(t - 0.5) * 2.2);
  const w = 0.3 - 0.12 * frontness;
  const h = 0.42 + 0.1 * frontness;
  const d = 0.24 - 0.05 * frontness;
  return [w, h, d];
}

// ---------------------------------------------------------------------------
// Platform rings with gold pulse
// ---------------------------------------------------------------------------

function PlatformRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      // Gold pulse: faster oscillation, wider range
      mat.emissiveIntensity =
        0.5 + Math.sin(state.clock.elapsedTime * 1.8) * 0.3;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
      <ringGeometry args={[2.8, 3.5, 80]} />
      <meshStandardMaterial
        color="#1a0a00"
        emissive="#e8a010"
        emissiveIntensity={0.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function InnerGlowRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.2 + Math.sin(state.clock.elapsedTime * 0.9 + 1.2) * 0.14;
    }
  });
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.08, 0]}
    >
      <ringGeometry args={[1.8, 2.7, 80]} />
      <meshStandardMaterial
        color="#0a0500"
        emissive="#d08000"
        emissiveIntensity={0.2}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// ToothMesh — MeshPhysicalMaterial with per-tooth enamel + hover oscillation
// ---------------------------------------------------------------------------

interface ToothMeshProps {
  tooth: ToothRecord;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (tooth: ToothRecord | null) => void;
  onHover: (id: number | null) => void;
  selectedTooth: ToothRecord | null;
  onClose: () => void;
}

function ToothMesh({
  tooth,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  selectedTooth,
  onClose,
}: ToothMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const startTimeRef = useRef<number | null>(null);
  const hoverOscillationRef = useRef<number>(0);
  const delayMs = index * 28;

  const toothNum = Number(tooth.toothNumber);
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const { position, rotationY } = getToothTransform(toothNum);
  const [w, h, d] = getToothSize(idx);
  const glowColor = STATUS_GLOW[tooth.status] ?? "#16a34a";
  const emissiveColor = STATUS_EMISSIVE_COLOR[tooth.status] ?? "#042a10";
  const roughness = toothRoughness(toothNum);
  const baseColor = toothColor(toothNum);
  const isHealthy = tooth.status === "healthy";

  // Unique per-tooth phase offsets for organic variation
  const breathPhase = (toothNum * 1.618) % (Math.PI * 2);
  const breathFreq = 0.38 + (toothNum % 7) * 0.04;
  // Random Y-axis oscillation seed for hover
  const oscillationSeed = (toothNum * 2.39) % (Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }
    const elapsed = (state.clock.elapsedTime - startTimeRef.current) * 1000;

    // Staggered entrance
    if (elapsed < delayMs) {
      groupRef.current.scale.setScalar(0);
      return;
    }
    const progress = Math.min(1, (elapsed - delayMs) / 350);
    const eased = 1 - (1 - progress) ** 3;

    // Hover: scale to 1.25x; selected: 1.22x
    const activeScale = isSelected ? 1.22 : isHovered ? 1.25 : 1.0;
    const targetScale = eased * activeScale;
    const curr = groupRef.current.scale.x;
    const smoothScale = curr + (targetScale - curr) * 0.14;
    groupRef.current.scale.setScalar(smoothScale);

    // Idle breath: tiny oscillating Y
    const breathY =
      Math.sin(state.clock.elapsedTime * breathFreq + breathPhase) * 0.002;

    // Hover: subtle random Y-axis oscillation using delta-driven sin
    if (isHovered) {
      hoverOscillationRef.current += 0.06;
      const oscillation =
        Math.sin(hoverOscillationRef.current + oscillationSeed) * 0.04;
      groupRef.current.rotation.y = oscillation;
    } else {
      groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.12;
    }

    // Hover float
    const targetFloatY = isHovered ? 0.06 : isSelected ? 0.03 : 0.0;
    const currFloatY = groupRef.current.position.y;
    const newFloatY =
      currFloatY + (position[1] + breathY + targetFloatY - currFloatY) * 0.1;
    groupRef.current.position.set(position[0], newFloatY, position[2]);

    // Material emissive update
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    if (mat) {
      // Healthy teeth: idle pulse between 0.05 and 0.15 via sin wave
      const healthyIdlePulse = isHealthy
        ? 0.05 +
          (Math.sin(state.clock.elapsedTime * 0.8 + breathPhase) * 0.5 + 0.5) *
            0.1
        : 0.07;

      const targetEmissiveIntensity = isSelected
        ? 0.58
        : isHovered
          ? 0.42 // 2× hover boost
          : healthyIdlePulse;

      mat.emissiveIntensity +=
        (targetEmissiveIntensity - mat.emissiveIntensity) * 0.12;

      if (isHovered || isSelected) {
        mat.emissive.set(glowColor);
      } else {
        mat.emissive.set(emissiveColor);
      }
    }
  });

  const labelOffset: [number, number, number] = [0, h / 2 + 0.6, 0];

  return (
    <group ref={groupRef} position={position}>
      {/* Point light for glow */}
      <pointLight
        position={[0, 0, 0.35]}
        intensity={isHovered || isSelected ? 1.8 : 0.55}
        color={glowColor}
        distance={1.5}
        decay={2}
      />

      <RoundedBox
        ref={meshRef}
        args={[w, h, d]}
        radius={0.065}
        smoothness={16}
        rotation={[0, rotationY, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(isSelected ? null : tooth);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(toothNum);
        }}
        onPointerOut={() => onHover(null)}
      >
        {/* MeshPhysicalMaterial: glass-enamel effect
            clearcoat=0.8, clearcoatRoughness=0.1, reflectivity=0.4 */}
        <meshPhysicalMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.07}
          roughness={roughness}
          metalness={0.02}
          transmission={0.1}
          ior={1.63}
          thickness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          reflectivity={0.4}
          envMapIntensity={1.8}
          sheenRoughness={0.45}
          sheenColor={new THREE.Color(0.9, 0.85, 0.75)}
        />
      </RoundedBox>

      {/* Ambient occlusion darkening at tooth base (subtle dark plane) */}
      <mesh position={[0, -(h / 2) + 0.01, 0]} rotation={[0, rotationY, 0]}>
        <planeGeometry args={[w * 0.9, d * 0.9]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {isSelected && selectedTooth?.toothNumber === tooth.toothNumber && (
        <Html
          position={labelOffset}
          center
          zIndexRange={[100, 200]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: STATUS_BG[tooth.status] ?? "rgba(4,42,16,0.96)",
              border: `2px solid ${STATUS_BORDER[tooth.status] ?? "#22c55e"}`,
              borderRadius: "18px",
              padding: "12px 16px",
              minWidth: "170px",
              maxWidth: "220px",
              color: "#f8fafc",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: `0 0 28px 5px ${STATUS_BORDER[tooth.status] ?? "#22c55e"}55, 0 8px 36px rgba(0,0,0,0.65)`,
              fontSize: "12px",
              lineHeight: "1.5",
              textAlign: "center",
              pointerEvents: "auto",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
                padding: 0,
                pointerEvents: "auto",
              }}
              aria-label="Close"
            >
              ×
            </button>

            <div
              style={{
                fontSize: "10px",
                color: STATUS_COLOR[tooth.status],
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "5px",
              }}
            >
              Tooth #{toothNum}
            </div>

            <div
              style={{
                color: STATUS_COLOR[tooth.status],
                fontWeight: 800,
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              {STATUS_LABEL[tooth.status]}
            </div>

            <div
              style={{
                fontWeight: 600,
                fontSize: "12px",
                marginBottom: "5px",
                color: "#e2e8f0",
              }}
            >
              {tooth.condition}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                lineHeight: "1.4",
              }}
            >
              {tooth.recommendation}
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: `10px solid ${STATUS_BORDER[tooth.status] ?? "#22c55e"}`,
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// JawBase — pink/coral gum with MeshPhysicalMaterial
// ---------------------------------------------------------------------------

const GUM_INDICES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

function JawBase({ isUpper }: { isUpper: boolean }) {
  const y = isUpper ? 0.28 : -0.28;

  return (
    <group>
      {GUM_INDICES.map((idx) => {
        const t = idx / 15;
        const rx = 2.55;
        const rz = 1.85;
        const angle = Math.PI * (1 - t);
        const x = rx * Math.cos(angle);
        const z = rz * Math.sin(angle);
        const rotY = -(Math.PI / 2 - angle);
        return (
          <mesh
            key={`gum-seg-${idx}`}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
          >
            <boxGeometry args={[0.36, 0.24, 0.3]} />
            {/* MeshPhysicalMaterial: moist pink/coral gum tissue */}
            <meshPhysicalMaterial
              color="#d0607a"
              roughness={0.42}
              metalness={0.0}
              clearcoat={0.35}
              clearcoatRoughness={0.28}
              emissive="#5c0c28"
              emissiveIntensity={0.16}
              envMapIntensity={0.9}
              sheen={0.3}
              sheenColor={new THREE.Color(0.9, 0.4, 0.55)}
              sheenRoughness={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// DentalArch3D — main export
// ---------------------------------------------------------------------------

interface DentalArch3DProps {
  teeth: ToothRecord[];
  toothStatuses?: Record<number, string>;
  onToothClick?: (toothNum: number) => void;
}

export default function DentalArch3D({
  teeth,
  onToothClick,
}: DentalArch3DProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothRecord | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleSelect = (tooth: ToothRecord | null) => {
    setSelectedTooth(tooth);
    if (tooth && onToothClick) {
      onToothClick(Number(tooth.toothNumber));
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden canvas-glow-ring"
      style={{ height: "500px" }}
      data-ocid="results.canvas_target"
    >
      <Canvas
        camera={{ position: [0, 2.8, 6.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        shadows
        style={{ background: "#050302" }}
      >
        {/* Atmosphere fog for depth */}
        <fog attach="fog" args={["#050302", 12, 24]} />

        {/* Ambient base — warm dark */}
        <ambientLight intensity={0.3} color="#ffe8d0" />

        {/* Hemisphere for natural sky-ground gradient */}
        <hemisphereLight args={["#ffe8c0", "#1a0a10", 0.48]} />

        {/* Primary warm key light (golden) */}
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.9}
          color="#ffe090"
          castShadow
        />

        {/* Top spotlight for enamel specular gloss */}
        <spotLight
          position={[0, 9, 2]}
          intensity={2.5}
          color="#fff5d0"
          angle={0.52}
          penumbra={0.62}
          castShadow
        />

        {/* Specular light aimed directly at arch for clearcoat reflection */}
        <spotLight
          position={[2, 5, 4]}
          intensity={1.4}
          color="#ffffff"
          angle={0.45}
          penumbra={0.5}
          target-position={[0, 0, 0]}
        />

        {/* Cool fill from left for contrast */}
        <directionalLight
          position={[-5, 3, 2]}
          intensity={0.45}
          color="#c8d8ff"
        />

        {/* Strong rim from behind — tooth separation */}
        <directionalLight
          position={[0, -2, -7]}
          intensity={0.95}
          color="#ffffff"
        />

        {/* Warm under-platform glow */}
        <pointLight
          position={[0, -2.5, 2]}
          intensity={0.55}
          color="#b07800"
          distance={6}
        />

        {/* Side rim lights for 3D depth */}
        <pointLight
          position={[4, 0, 0]}
          intensity={0.35}
          color="#d4a030"
          distance={8}
        />
        <pointLight
          position={[-4, 0, 0]}
          intensity={0.35}
          color="#d4a030"
          distance={8}
        />

        {/* Platform glow rings */}
        <PlatformRing />
        <InnerGlowRing />

        {/* Jaw bases */}
        <JawBase isUpper />
        <JawBase isUpper={false} />

        {teeth.map((tooth, i) => (
          <ToothMesh
            key={Number(tooth.toothNumber)}
            tooth={tooth}
            index={i}
            isSelected={selectedTooth?.toothNumber === tooth.toothNumber}
            isHovered={hoveredId === Number(tooth.toothNumber)}
            onSelect={handleSelect}
            onHover={setHoveredId}
            selectedTooth={selectedTooth}
            onClose={() => setSelectedTooth(null)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI * 0.12}
          maxPolarAngle={Math.PI * 0.72}
          minDistance={3.5}
          maxDistance={10}
          autoRotate={!selectedTooth}
          autoRotateSpeed={0.6}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {!selectedTooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground pointer-events-none whitespace-nowrap px-3 py-1 rounded-full glass-card">
          Tap any tooth to see its report · Drag to rotate
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        {(["healthy", "risk", "cavity"] as const).map((status) => (
          <div key={status} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                background: STATUS_COLOR[status],
                boxShadow: `0 0 6px ${STATUS_COLOR[status]}`,
              }}
            />
            <span
              style={{ color: STATUS_COLOR[status] }}
              className="font-semibold capitalize"
            >
              {STATUS_LABEL[status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
