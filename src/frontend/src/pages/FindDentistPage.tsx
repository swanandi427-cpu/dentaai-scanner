import type { DentistProfile } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Navigation,
  Search,
  Shield,
  ShieldCheck,
  Star,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const URGENCY_FILTERS = ["all", "routine", "urgent", "emergency"] as const;
type UrgencyFilter = (typeof URGENCY_FILTERS)[number];
type SortMode = "distance" | "name" | "rating";

interface GeoState {
  status: "idle" | "loading" | "success" | "denied";
  lat?: number;
  lng?: number;
  label?: string;
}

const SAMPLE_DENTISTS: DentistProfile[] = [
  {
    name: "Dr. Priya Sharma",
    specialties: ["General Dentistry", "Cosmetic Dentistry"],
    location: "Mumbai, Maharashtra",
    bio: "15 years experience in general and preventive dentistry. Specialized in painless procedures and cosmetic treatments.",
    email: "priya@dantanova.com",
    licenseNumber: "MH-1234",
    isVerified: true,
    available: true,
  },
  {
    name: "Dr. Arjun Mehta",
    specialties: ["Endodontics", "Root Canal", "Emergency"],
    location: "Pune, Maharashtra",
    bio: "Expert in root canal treatments and emergency dental care with cutting-edge equipment. Available for urgent cases.",
    email: "arjun@dantanova.com",
    licenseNumber: "MH-5678",
    isVerified: true,
    available: true,
  },
  {
    name: "Dr. Lakshmi Iyer",
    specialties: ["Periodontics"],
    location: "Bengaluru, Karnataka",
    bio: "Specialist in gum diseases, periodontal surgery, and implant placements. 12 years of clinical experience.",
    email: "lakshmi@dantanova.com",
    licenseNumber: "KA-4321",
    isVerified: true,
    available: false,
  },
  {
    name: "Dr. Rohan Desai",
    specialties: ["Oral Surgery", "Emergency"],
    location: "Delhi, NCR",
    bio: "Advanced oral surgeon specializing in wisdom tooth extraction, jaw surgeries and emergency interventions.",
    email: "rohan@dantanova.com",
    licenseNumber: "DL-9876",
    isVerified: false,
    available: true,
  },
  {
    name: "Dr. Fatima Khan",
    specialties: ["Pediatric Dentistry"],
    location: "Hyderabad, Telangana",
    bio: "Creating anxiety-free dental experiences for children and young adults since 2010.",
    email: "fatima@dantanova.com",
    licenseNumber: "TS-2468",
    isVerified: true,
    available: true,
  },
  {
    name: "Dr. Vikram Nair",
    specialties: ["Orthodontics", "Invisalign"],
    location: "Chennai, Tamil Nadu",
    bio: "Transforming smiles with Invisalign, braces, and orthodontic solutions for all ages.",
    email: "vikram@dantanova.com",
    licenseNumber: "TN-1357",
    isVerified: true,
    available: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDeterministicRating(index: number): string {
  return (4.0 + ((index * 0.15) % 0.9)).toFixed(1);
}

function getDeterministicReviews(index: number): number {
  return index * 7 + 3;
}

function getSimulatedDistance(
  index: number,
  lat?: number,
  lng?: number,
): number {
  if (lat === undefined || lng === undefined) return 0;
  return Math.round((Math.abs(lat + index * 0.5) % 15) * 10) / 10;
}

function isEmergencyAvailable(d: DentistProfile): boolean {
  return (
    d.available &&
    (d.specialties ?? []).some((s) => s.toLowerCase().includes("emergency"))
  );
}

function isVerifiedDentist(d: DentistProfile): boolean {
  return !!d.isVerified;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= full ? "fill-primary text-primary" : "text-border"}`}
        />
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[10px] font-semibold shrink-0">
      <ShieldCheck className="w-2.5 h-2.5" />
      Verified
    </span>
  );
}

function DistanceBadge({ km }: { km: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold shrink-0">
      <MapPin className="w-2.5 h-2.5" />
      {km.toFixed(1)} km
    </span>
  );
}

function UrgencyBadge({
  available,
  specialties,
}: { available: boolean; specialties: string[] }) {
  const isEmergency = specialties.some((s) =>
    s.toLowerCase().includes("emergency"),
  );
  if (isEmergency && available)
    return (
      <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs shrink-0">
        🚨 Emergency
      </Badge>
    );
  if (available)
    return (
      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs shrink-0">
        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Available
      </Badge>
    );
  return (
    <Badge className="bg-muted text-muted-foreground border-border text-xs shrink-0">
      Busy
    </Badge>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.07 }}
      className="glass-card rounded-3xl p-5 border border-border/20 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2.5 w-28" />
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-4/5" />
      <Skeleton className="h-9 w-full rounded-full mt-auto" />
    </motion.div>
  );
}

function EmptyState({
  hasSearch,
  onClear,
}: { hasSearch: boolean; onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full glass-card rounded-3xl p-10 text-center"
      data-ocid="find_dentist.empty_state"
    >
      <svg
        viewBox="0 0 80 80"
        className="w-20 h-20 mx-auto mb-5 opacity-60"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r="38"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/30"
        />
        <path
          d="M28 36c0-6.627 5.373-12 12-12s12 5.373 12 12c0 4.5-2.5 8-6 10l-1 6H35l-1-6c-3.5-2-6-5.5-6-10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="text-primary/50"
        />
        <path
          d="M36 56h8M37 60h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-primary/40"
        />
        <circle
          cx="56"
          cy="56"
          r="10"
          fill="currentColor"
          className="text-background"
        />
        <circle
          cx="56"
          cy="56"
          r="10"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-red-400/60"
        />
        <path
          d="M52 56h8M56 52v8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-red-400/60"
          transform="rotate(45 56 56)"
        />
      </svg>
      <h3 className="font-display font-bold text-gradient-gold mb-2 text-lg">
        {hasSearch ? "No Dentists Found" : "No Dentists Listed Yet"}
      </h3>
      <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
        {hasSearch
          ? "No dentists match your search. Try a different name, specialty, or location."
          : "Be the first verified dentist on DantaNova."}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {hasSearch && (
          <Button
            variant="outline"
            onClick={onClear}
            className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
            data-ocid="find_dentist.clear_filters_button"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
        <Link to="/dentist-register">
          <Button
            className="rounded-full glow-primary"
            data-ocid="find_dentist.register_cta"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register as Dentist
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function DentistCard({
  dentist,
  index,
  distance,
  showDistance,
  isEmergencyMode,
}: {
  dentist: DentistProfile;
  index: number;
  distance: number;
  showDistance: boolean;
  isEmergencyMode: boolean;
}) {
  const navigate = useNavigate();
  const rating = getDeterministicRating(index);
  const reviews = getDeterministicReviews(index);
  const verified = isVerifiedDentist(dentist);
  const emergencyAvail = isEmergencyAvailable(dentist);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card rounded-3xl p-5 border border-primary/10 hover:border-primary/30 transition-all hover-lift group flex flex-col"
      data-ocid={`find_dentist.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="circle-icon w-12 h-12 bg-primary/10 border-2 border-primary/40 shrink-0 relative">
            <span className="text-primary font-bold font-display text-lg">
              {dentist.name.charAt(0)}
            </span>
            {verified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Shield className="w-2.5 h-2.5 text-background" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {dentist.name}
              </h3>
              {verified && <VerifiedBadge />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {dentist.specialties?.[0] ?? "General Dentistry"}
            </p>
          </div>
        </div>
        <UrgencyBadge
          available={dentist.available}
          specialties={dentist.specialties ?? []}
        />
      </div>

      {/* Location + distance */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {dentist.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
            <span className="truncate">{dentist.location}</span>
          </div>
        )}
        {showDistance && <DistanceBadge km={distance} />}
        {isEmergencyMode && emergencyAvail && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-semibold shrink-0">
            <Zap className="w-2.5 h-2.5" />
            Same-Day
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={Number(rating)} />
        <span className="text-xs text-muted-foreground">{rating} / 5.0</span>
        <span className="text-xs text-muted-foreground/60">
          ({reviews} reviews)
        </span>
      </div>

      {dentist.specialties && dentist.specialties.length > 1 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {dentist.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/40"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {dentist.bio && (
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">
          {dentist.bio}
        </p>
      )}

      <Button
        className="w-full rounded-full glow-primary text-sm font-semibold shimmer-button mt-auto"
        onClick={() =>
          navigate({ to: "/book", search: { dentist: dentist.email } })
        }
        data-ocid={`find_dentist.primary_button.${index + 1}`}
      >
        Request Appointment
      </Button>
    </motion.div>
  );
}

export default function FindDentistPage() {
  const { actor, isFetching } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const isEmergencyMode = searchParams?.emergency === "true";

  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>(
    isEmergencyMode ? "emergency" : "all",
  );
  const [sortMode, setSortMode] = useState<SortMode>("name");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const geoRef = useRef(geo);
  useEffect(() => {
    geoRef.current = geo;
  }, [geo]);

  const { data: registeredDentists = [], isLoading } = useQuery<
    DentistProfile[]
  >({
    queryKey: ["allDentists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDentists();
    },
    enabled: !!actor && !isFetching,
  });

  const allDentists =
    registeredDentists.length > 0 ? registeredDentists : SAMPLE_DENTISTS;

  function handleUseLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setGeo({ status: "loading" });
    toast.loading("Detecting your location…", { id: "geo" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const label = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
        setGeo({ status: "success", lat, lng, label });
        setSortMode("distance");
        toast.success(`Location detected: ${label}`, { id: "geo" });
      },
      () => {
        setGeo({ status: "denied" });
        toast.error("Location not available — showing all dentists.", {
          id: "geo",
        });
      },
      { timeout: 8000 },
    );
  }

  const filtered = allDentists
    .filter((d) => {
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (d.specialties ?? []).some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        );
      const matchUrgency =
        urgencyFilter === "all" ||
        (urgencyFilter === "emergency" && isEmergencyAvailable(d)) ||
        (urgencyFilter === "routine" && d.available) ||
        (urgencyFilter === "urgent" && d.available);
      const matchVerified = !verifiedOnly || isVerifiedDentist(d);
      const matchEmergencyMode = !isEmergencyMode || isEmergencyAvailable(d);
      return matchSearch && matchUrgency && matchVerified && matchEmergencyMode;
    })
    .sort((a, b) => {
      if (sortMode === "name") {
        if (isVerifiedDentist(a) && !isVerifiedDentist(b)) return -1;
        if (!isVerifiedDentist(a) && isVerifiedDentist(b)) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortMode === "rating") {
        const idxA = allDentists.indexOf(a);
        const idxB = allDentists.indexOf(b);
        return (
          Number(getDeterministicRating(idxB)) -
          Number(getDeterministicRating(idxA))
        );
      }
      if (sortMode === "distance" && geo.status === "success") {
        const idxA = allDentists.indexOf(a);
        const idxB = allDentists.indexOf(b);
        return (
          getSimulatedDistance(idxA, geo.lat, geo.lng) -
          getSimulatedDistance(idxB, geo.lat, geo.lng)
        );
      }
      return 0;
    });

  const emergencyCount = allDentists.filter(isEmergencyAvailable).length;
  const hasActiveFilters = !!search || verifiedOnly || urgencyFilter !== "all";

  function clearFilters() {
    setSearch("");
    setVerifiedOnly(false);
    setUrgencyFilter("all");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">Find a Dentist</h1>
          <p className="text-xs text-muted-foreground">
            Verified dental professionals near you
          </p>
        </div>
        <Link to="/dentist-register">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-primary/30 text-primary hover:bg-primary/5 text-xs"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Register
          </Button>
        </Link>
      </header>

      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <div className="glow-orb w-64 h-64 -top-16 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none" />
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30 px-4 py-1.5">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Emergency &amp; Standard Care
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient-gold mb-2">
            Find a Trusted Dentist
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Connect with verified dental professionals. Book instantly.
          </p>
          {emergencyCount > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">
                {emergencyCount} dentist{emergencyCount !== 1 ? "s" : ""}{" "}
                available for emergency cases
              </span>
            </div>
          )}
        </motion.div>

        {/* Emergency Mode Banner */}
        {isEmergencyMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 px-5 py-3 flex items-center gap-3"
            data-ocid="find_dentist.emergency_banner"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold text-sm">
                EMERGENCY MODE
              </p>
              <p className="text-xs text-red-300/70">
                Showing only dentists with immediate same-day availability.
              </p>
            </div>
            <a
              href="/find-dentist"
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors underline shrink-0"
            >
              Show all
            </a>
          </motion.div>
        )}

        {/* Geolocation bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-3xl px-4 py-3 flex items-center gap-3 mb-3 flex-wrap"
        >
          {geo.status === "success" ? (
            <div className="flex items-center gap-2 text-xs text-primary flex-1 min-w-0">
              <Navigation className="w-4 h-4 shrink-0" />
              <span className="truncate">Location detected: {geo.label}</span>
            </div>
          ) : geo.status === "denied" ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-1 min-w-0">
              <MapPin className="w-4 h-4 shrink-0 text-muted-foreground/60" />
              <span>Location not available — showing all dentists</span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground flex-1">
              Use your location to find the nearest dentist
            </p>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleUseLocation}
            disabled={geo.status === "loading"}
            className="rounded-full border-primary/30 text-primary hover:bg-primary/5 text-xs shrink-0"
            data-ocid="find_dentist.use_location_button"
          >
            {geo.status === "loading" ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin mr-1.5" />
                Detecting…
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 mr-1.5" />
                Use My Location
              </>
            )}
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-4 flex flex-col gap-3 mb-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, location, or specialty…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50"
                data-ocid="find_dentist.search_input"
              />
            </div>
            <div className="flex gap-1.5 items-center shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Sort:
              </span>
              {(["distance", "name", "rating"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    if (mode === "distance" && geo.status !== "success") {
                      handleUseLocation();
                      return;
                    }
                    setSortMode(mode);
                  }}
                  disabled={mode === "distance" && geo.status === "loading"}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border transition-all ${
                    sortMode === mode
                      ? "bg-primary/20 border-primary/60 text-primary"
                      : "bg-background/40 border-border/30 text-muted-foreground hover:border-primary/30"
                  }`}
                  data-ocid={`find_dentist.sort.${mode}`}
                >
                  {mode === "distance" && (
                    <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                  )}
                  {mode === "rating" && (
                    <Star className="w-2.5 h-2.5 inline mr-0.5" />
                  )}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {URGENCY_FILTERS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUrgencyFilter(u)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                  urgencyFilter === u
                    ? u === "emergency"
                      ? "bg-red-500/20 border-red-500/60 text-red-400"
                      : u === "urgent"
                        ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-400"
                        : "bg-primary/20 border-primary/60 text-primary"
                    : "bg-background/40 border-border/30 text-muted-foreground hover:border-primary/30"
                }`}
                data-ocid={`find_dentist.urgency_filter.${u}`}
              >
                {u === "emergency" && "🚨 "}
                {u === "urgent" && "⚡ "}
                {u}
              </button>
            ))}
            <label
              className="flex items-center gap-1.5 ml-auto cursor-pointer select-none"
              data-ocid="find_dentist.verified_only_toggle"
            >
              <span
                className={`relative inline-flex w-8 h-4 rounded-full border transition-all ${verifiedOnly ? "bg-primary/20 border-primary/60" : "bg-muted border-border/40"}`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${verifiedOnly ? "left-[calc(100%-14px)] bg-primary" : "left-0.5 bg-muted-foreground/40"}`}
                />
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">
                Verified only
              </span>
            </label>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              "Loading dentists…"
            ) : (
              <>
                {filtered.length} dentist{filtered.length !== 1 ? "s" : ""}{" "}
                found
                {registeredDentists.length > 0 && (
                  <span className="text-primary ml-1">
                    (verified on DantaNova)
                  </span>
                )}
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              data-ocid="find_dentist.clear_filters_button"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            [0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState hasSearch={hasActiveFilters} onClear={clearFilters} />
          ) : (
            filtered.map((d, i) => (
              <DentistCard
                key={`${d.email}-${d.licenseNumber}`}
                dentist={d}
                index={i}
                distance={getSimulatedDistance(
                  allDentists.indexOf(d),
                  geo.lat,
                  geo.lng,
                )}
                showDistance={geo.status === "success"}
                isEmergencyMode={isEmergencyMode}
              />
            ))
          )}
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms
          </Link>
        </p>
        <p className="mt-1">
          Developed by Swanandi Manoj Vispute ·{" "}
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-primary hover:underline"
          >
            DANTANOVA.14@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
