import type {
  ScanResult,
  ScanSeverity,
  ToothRecord,
  ToothStatus,
} from "@/types";

const CONDITION_MAP: Record<
  ToothStatus,
  Array<{ condition: string; recommendation: string }>
> = {
  healthy: [
    {
      condition: "Healthy",
      recommendation: "Excellent! Keep brushing twice daily and flossing.",
    },
    {
      condition: "Optimal Enamel",
      recommendation:
        "Tooth enamel is in excellent condition. Maintain routine dental hygiene.",
    },
    {
      condition: "No Detectable Issues",
      recommendation:
        "No signs of disease. Continue with regular 6-month check-ups.",
    },
    {
      condition: "Well-Maintained",
      recommendation:
        "Tooth looks great. Continue your current oral hygiene routine.",
    },
  ],
  risk: [
    {
      condition: "Early Plaque Buildup",
      recommendation:
        "Professional cleaning recommended within 3 months. Improve brushing technique.",
    },
    {
      condition: "Gingivitis Risk",
      recommendation:
        "Increase flossing frequency. Consider antibacterial mouthwash.",
    },
    {
      condition: "Enamel Erosion",
      recommendation:
        "Reduce acidic food intake. Use fluoride toothpaste. Consult dentist.",
    },
    {
      condition: "Tooth Crack Risk",
      recommendation:
        "Avoid hard foods and ice. A dental checkup within 1 month is advised.",
    },
    {
      condition: "Gum Recession",
      recommendation:
        "Use a soft-bristle toothbrush. Schedule a periodontal screening.",
    },
    {
      condition: "Dental Hypersensitivity",
      recommendation:
        "Use desensitizing toothpaste. Avoid very hot or cold foods.",
    },
    {
      condition: "Calculus (Tartar) Deposit",
      recommendation:
        "Professional scaling required. Improve daily flossing and brushing habits.",
    },
    {
      condition: "Bruxism Signs",
      recommendation:
        "Signs of teeth grinding detected. Ask your dentist about a night guard.",
    },
    {
      condition: "Periodontal Pocket Risk",
      recommendation:
        "Early periodontal pocketing suspected. Deep cleaning and monitoring advised.",
    },
    {
      condition: "Interproximal Staining",
      recommendation:
        "Staining between teeth detected. Improve interdental brushing or flossing.",
    },
    {
      condition: "Mild Tooth Discoloration",
      recommendation:
        "Surface stains detected. Consider professional whitening.",
    },
    {
      condition: "Dry Socket Risk",
      recommendation:
        "Reduced saliva flow signs. Stay hydrated and consult a dentist if discomfort persists.",
    },
  ],
  cavity: [
    {
      condition: "Surface Cavity",
      recommendation:
        "Schedule a dental appointment within 2 weeks for a filling.",
    },
    {
      condition: "Deep Cavity",
      recommendation:
        "Urgent dental care needed. Risk of nerve involvement if untreated.",
    },
    {
      condition: "Root Canal Risk",
      recommendation:
        "Immediate dental consultation required. May need endodontic treatment.",
    },
    {
      condition: "Interproximal Cavity",
      recommendation:
        "Cavity between teeth detected. Prompt dental visit required before spreading.",
    },
    {
      condition: "Secondary Caries",
      recommendation:
        "Decay around an existing filling detected. Replacement filling needed urgently.",
    },
    {
      condition: "Cervical Caries",
      recommendation:
        "Decay at the gum line detected. Dental treatment required to prevent bone loss.",
    },
    {
      condition: "Pulpitis (Pulp Inflammation)",
      recommendation:
        "Tooth pulp may be inflamed. Seek immediate dental care to avoid abscess.",
    },
    {
      condition: "Periapical Abscess Risk",
      recommendation:
        "Signs of infection at root tip. Urgent dental assessment and possible antibiotics needed.",
    },
    {
      condition: "Tooth Fracture with Decay",
      recommendation:
        "Cracked tooth with decay detected. Immediate dental evaluation for possible crown or extraction.",
    },
  ],
};

// Deterministic RNG — same seed = same result
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickFrom<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Deterministic scan simulation by severity
export function simulateScan(severity: ScanSeverity = "moderate"): ScanResult {
  // Fixed seeds per severity so same severity always gives same result
  const seedMap: Record<ScanSeverity, number> = {
    mild: 42_001,
    moderate: 88_332,
    severe: 13_579,
  };
  const rng = seededRng(seedMap[severity]);

  const CAVITY_TEETH: Record<ScanSeverity, number[]> = {
    mild: [],
    moderate: [14, 18],
    severe: [3, 7, 14, 18],
  };

  const RISK_TEETH: Record<ScanSeverity, number[]> = {
    mild: [5, 19, 27],
    moderate: [4, 8, 13, 16, 21, 24],
    severe: [2, 5, 9, 12, 17, 20, 25, 28, 30],
  };

  const cavitySet = new Set(CAVITY_TEETH[severity]);
  const riskSet = new Set(RISK_TEETH[severity]);

  const teeth: ToothRecord[] = [];

  for (let i = 1; i <= 32; i++) {
    let status: ToothStatus = "healthy";
    if (cavitySet.has(i)) status = "cavity";
    else if (riskSet.has(i)) status = "risk";

    const options = CONDITION_MAP[status];
    const { condition, recommendation } = pickFrom(rng, options);

    teeth.push({
      toothNumber: BigInt(i),
      status,
      condition,
      recommendation,
    });
  }

  const healthScoreMap: Record<ScanSeverity, number> = {
    mild: 91,
    moderate: 63,
    severe: 28,
  };

  const healthScore = healthScoreMap[severity];

  return {
    teeth,
    healthScore: BigInt(healthScore),
    severity,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}

// Randomized scan for image-based analysis (uses time-seeded RNG)
export function generateScanResult(imageCount = 5): ScanResult {
  const seed = (Date.now() + imageCount * 7919) & 0x7fffffff;
  const rng = seededRng(seed);

  const teeth: ToothRecord[] = [];

  for (let i = 0; i < 32; i++) {
    const r = rng();
    let status: ToothStatus;
    if (r < 0.6) status = "healthy";
    else if (r < 0.85) status = "risk";
    else status = "cavity";

    const options = CONDITION_MAP[status];
    const { condition, recommendation } = pickFrom(rng, options);

    teeth.push({
      toothNumber: BigInt(i + 1),
      status,
      condition,
      recommendation,
    });
  }

  const cavityCount = teeth.filter((t) => t.status === "cavity").length;
  const riskCount = teeth.filter((t) => t.status === "risk").length;
  const healthScore = Math.max(
    0,
    Math.min(100, 100 - cavityCount * 8 - riskCount * 3),
  );
  const severity: ScanSeverity =
    healthScore >= 70 ? "mild" : healthScore >= 40 ? "moderate" : "severe";

  return {
    teeth,
    healthScore: BigInt(healthScore),
    severity,
    timestamp: BigInt(Date.now()) * BigInt(1_000_000),
  };
}
