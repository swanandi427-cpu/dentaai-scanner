import type { ToothRecord } from "@/types";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

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

const STATUS_EMISSIVE: Record<string, string> = {
  healthy: "#052e14",
  risk: "#2a1500",
  cavity: "#2e0505",
};

const STATUS_LABEL: Record<string, string> = {
  healthy: "Healthy",
  risk: "Risk Detected",
  cavity: "Cavity / Decay",
};

const STATUS_BG: Record<string, string> = {
  healthy: "rgba(5,46,22,0.95)",
  risk: "rgba(60,28,3,0.95)",
  cavity: "rgba(60,5,5,0.95)",
};

const STATUS_BORDER: Record<string, string> = {
  healthy: "#22c55e",
  risk: "#f59e0b",
  cavity: "#ef4444",
};

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

function PlatformRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.4 + Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
      <ringGeometry args={[2.8, 3.5, 80]} />
      <meshStandardMaterial
        color="#1a0800"
        emissive="#e8a010"
        emissiveIntensity={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/** Inner glow ring for extra depth */
function InnerGlowRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity =
        0.15 + Math.sin(state.clock.elapsedTime * 0.8 + 1) * 0.1;
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
        emissive="#c87800"
        emissiveIntensity={0.15}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

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
  const meshRef = useRef<THREE.Mesh>(null!);
  const startTimeRef = useRef<number | null>(null);
  const delayMs = index * 28;

  useFrame((state) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }
    const elapsed = (state.clock.elapsedTime - startTimeRef.current) * 1000;
    if (elapsed < delayMs) {
      meshRef.current.scale.setScalar(0);
      return;
    }
    const progress = Math.min(1, (elapsed - delayMs) / 350);
    const eased = 1 - (1 - progress) ** 3;
    const activeScale = isSelected ? 1.22 : isHovered ? 1.1 : 1.0;
    const targetScale = eased * activeScale;
    const curr = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(curr + (targetScale - curr) * 0.14);
  });

  const toothNum = Number(tooth.toothNumber);
  const isUpper = toothNum <= 16;
  const idx = isUpper ? toothNum - 1 : toothNum - 17;
  const { position, rotationY } = getToothTransform(toothNum);
  const [w, h, d] = getToothSize(idx);
  const glowColor = STATUS_GLOW[tooth.status] ?? "#16a34a";
  const statusEmissive = STATUS_EMISSIVE[tooth.status] ?? "#052e14";
  const isActive = isSelected || isHovered;

  const labelOffset: [number, number, number] = [
    position[0],
    position[1] + h / 2 + 0.6,
    position[2],
  ];

  return (
    <group>
      <pointLight
        position={[position[0], position[1], position[2] + 0.35]}
        intensity={isActive ? 1.5 : 0.5}
        color={glowColor}
        distance={1.4}
        decay={2}
      />

      <RoundedBox
        ref={meshRef}
        args={[w, h, d]}
        radius={0.06}
        smoothness={14}
        position={position}
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
        <meshStandardMaterial
          color="#f8f0e0"
          emissive={isActive ? glowColor : statusEmissive}
          emissiveIntensity={isActive ? 0.4 : 0.07}
          roughness={0.06}
          metalness={0.15}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {isSelected && selectedTooth?.toothNumber === tooth.toothNumber && (
        <Html
          position={labelOffset}
          center
          zIndexRange={[100, 200]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: STATUS_BG[tooth.status] ?? "rgba(5,46,22,0.95)",
              border: `2px solid ${STATUS_BORDER[tooth.status] ?? "#22c55e"}`,
              borderRadius: "18px",
              padding: "12px 16px",
              minWidth: "170px",
              maxWidth: "220px",
              color: "#f8fafc",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: `0 0 24px 4px ${STATUS_BORDER[tooth.status] ?? "#22c55e"}66, 0 8px 32px rgba(0,0,0,0.6)`,
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
            <meshStandardMaterial
              color="#b05868"
              roughness={0.75}
              metalness={0.0}
              emissive="#450820"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface DentalArch3DProps {
  teeth: ToothRecord[];
}

export default function DentalArch3D({ teeth }: DentalArch3DProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothRecord | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
        style={{ background: "#050403" }}
      >
        {/* Atmosphere fog for depth */}
        <fog attach="fog" args={["#050403", 12, 24]} />

        {/* Ambient base — warm dark */}
        <ambientLight intensity={0.28} color="#ffe8d0" />

        {/* Hemisphere for natural sky-ground gradient */}
        <hemisphereLight args={["#ffe8c0", "#1a0a10", 0.45]} />

        {/* Primary warm key light (golden) */}
        <directionalLight
          position={[4, 8, 5]}
          intensity={1.8}
          color="#ffe090"
          castShadow
        />

        {/* Top spotlight for enamel specular gloss */}
        <spotLight
          position={[0, 9, 2]}
          intensity={2.2}
          color="#fff5d0"
          angle={0.55}
          penumbra={0.65}
          castShadow
        />

        {/* Cool fill from left */}
        <directionalLight
          position={[-5, 3, 2]}
          intensity={0.4}
          color="#c8d8ff"
        />

        {/* Strong rim from behind — tooth separation */}
        <directionalLight
          position={[0, -2, -7]}
          intensity={0.9}
          color="#ffffff"
        />

        {/* Warm under-platform glow */}
        <pointLight
          position={[0, -2.5, 2]}
          intensity={0.5}
          color="#b07800"
          distance={6}
        />

        {/* Side rim lights for 3D depth */}
        <pointLight
          position={[4, 0, 0]}
          intensity={0.3}
          color="#d4a030"
          distance={8}
        />
        <pointLight
          position={[-4, 0, 0]}
          intensity={0.3}
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
            onSelect={setSelectedTooth}
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
