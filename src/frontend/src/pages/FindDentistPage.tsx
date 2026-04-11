import type { DentistProfile } from "@/backend.d";
import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  MapPin,
  Search,
  Shield,
  Star,
  UserPlus,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const URGENCY_FILTERS = ["all", "routine", "urgent", "emergency"] as const;
type UrgencyFilter = (typeof URGENCY_FILTERS)[number];

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
    specialties: ["Endodontics", "Root Canal"],
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? "fill-primary text-primary" : "text-border"}`}
        />
      ))}
    </div>
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
        ✓ Available
      </Badge>
    );
  return (
    <Badge className="bg-muted text-muted-foreground border-border text-xs shrink-0">
      Busy
    </Badge>
  );
}

function DentistCard({
  dentist,
  index,
}: { dentist: DentistProfile; index: number }) {
  const navigate = useNavigate();
  const rating = 4 + (dentist.name.charCodeAt(0) % 2 === 0 ? 0 : 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass-card rounded-3xl p-5 border border-primary/10 hover:border-primary/30 transition-all hover-lift group flex flex-col"
      data-ocid={`find_dentist.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="circle-icon w-12 h-12 bg-primary/10 border-2 border-primary/40 shrink-0">
            <span className="text-primary font-bold font-display text-lg">
              {dentist.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {dentist.name}
              </h3>
              {dentist.isVerified && (
                <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
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

      {dentist.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3 text-primary/60 shrink-0" />
          <span className="truncate">{dentist.location}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={rating} />
        <span className="text-xs text-muted-foreground">{rating}.0 / 5.0</span>
        {dentist.isVerified && (
          <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
            Verified
          </Badge>
        )}
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
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");

  const { data: registeredDentists = [] } = useQuery<DentistProfile[]>({
    queryKey: ["allDentists"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDentists();
    },
    enabled: !!actor && !isFetching,
  });

  const allDentists =
    registeredDentists.length > 0 ? registeredDentists : SAMPLE_DENTISTS;

  const filtered = allDentists.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.specialties ?? []).some((s) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );

    const matchUrgency =
      urgencyFilter === "all" ||
      (urgencyFilter === "emergency" &&
        (d.specialties ?? []).some((s) =>
          s.toLowerCase().includes("emergency"),
        )) ||
      (urgencyFilter === "routine" && d.available) ||
      (urgencyFilter === "urgent" && d.available);

    return matchSearch && matchUrgency;
  });

  const emergencyCount = allDentists.filter((d) =>
    (d.specialties ?? []).some((s) => s.toLowerCase().includes("emergency")),
  ).length;

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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-4 flex flex-col sm:flex-row gap-3 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, location, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50"
              data-ocid="find_dentist.search_input"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
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
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {filtered.length} dentist{filtered.length !== 1 ? "s" : ""} found
            {registeredDentists.length > 0 && (
              <span className="text-primary ml-1">(verified on DantaNova)</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full glass-card rounded-3xl p-10 text-center"
              data-ocid="find_dentist.empty_state"
            >
              <div className="circle-icon w-16 h-16 bg-primary/10 border border-primary/30 mx-auto mb-4 text-3xl">
                🦷
              </div>
              <h3 className="font-display font-bold text-gradient-gold mb-2">
                No Dentists Found
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Be the first verified dentist on DantaNova.
              </p>
              <Link to="/dentist-register">
                <Button
                  className="rounded-full glow-primary"
                  data-ocid="find_dentist.register_cta"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register as Dentist
                </Button>
              </Link>
            </motion.div>
          ) : (
            filtered.map((d, i) => (
              <DentistCard
                key={`${d.email}-${d.licenseNumber}`}
                dentist={d}
                index={i}
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
