import LogoCircle from "@/components/LogoCircle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Oral Surgery",
  "Cosmetic Dentistry",
  "Pediatric Dentistry",
  "Prosthodontics",
  "Emergency Dentistry",
];

const STEPS = [
  { label: "Personal Info", icon: "👤" },
  { label: "Professional Details", icon: "🏥" },
  { label: "Location & Hours", icon: "📍" },
];

type FormState = {
  name: string;
  email: string;
  licenseNumber: string;
  specialty: string;
  bio: string;
  location: string;
  availableForEmergency: boolean;
};

const INIT: FormState = {
  name: "",
  email: "",
  licenseNumber: "",
  specialty: "General Dentistry",
  bio: "",
  location: "",
  availableForEmergency: false,
};

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function DentistRegisterPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INIT);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const upd =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const canNext = () => {
    if (step === 0) return !!(form.name && form.email);
    if (step === 1) return !!(form.licenseNumber && form.specialty && form.bio);
    if (step === 2) return !!form.location;
    return false;
  };

  const handleSubmit = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const specialties = [form.specialty];
      if (form.availableForEmergency) specialties.push("Emergency Dentistry");
      await actor.registerDentistProfile(
        form.name.trim(),
        form.email.trim(),
        form.licenseNumber.trim(),
        specialties,
        form.location.trim(),
        form.bio.trim(),
        form.availableForEmergency,
      );
      setSuccess(true);
    } catch (err: unknown) {
      toast.error(
        (err instanceof Error ? err.message : null) ||
          "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <LogoCircle size="md" />
        <p className="text-muted-foreground text-sm text-center">
          Sign in to register as a dentist
        </p>
        <Button
          className="rounded-full glow-primary px-8"
          onClick={() => login()}
          data-ocid="dentist_register.signin_button"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 max-w-md w-full text-center border border-primary/30"
        >
          <div className="circle-icon w-20 h-20 bg-primary/10 border-2 border-primary/40 mx-auto mb-5 circle-glow-ring">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gradient-gold mb-2">
            Registration Successful!
          </h2>
          <p className="text-muted-foreground text-sm mb-3">
            Welcome to DantaNova's dentist network,{" "}
            <span className="text-primary font-semibold">{form.name}</span>.
          </p>
          <p className="text-xs text-muted-foreground mb-5">
            Your profile is under verification. You can start managing bookings
            from your dashboard.
          </p>
          <Badge className="mb-5 bg-primary/10 text-primary border-primary/30 px-4 py-1.5">
            Pending Verification
          </Badge>
          <Button
            className="w-full rounded-full glow-primary shimmer-button"
            onClick={() => navigate({ to: "/dentist-dashboard" })}
            data-ocid="dentist_register.dashboard_button"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate({ to: "/" })}
          data-ocid="dentist_register.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <LogoCircle size="sm" />
        <div className="flex-1">
          <h1 className="font-display font-bold text-base">
            Register as Dentist
          </h1>
          <p className="text-xs text-muted-foreground">
            Join the DantaNova network
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
          Step {step + 1} of 3
        </Badge>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth ${
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-6 h-0.5 ${i < step ? "bg-primary/50" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="glass-card rounded-3xl p-6 flex flex-col gap-5 border border-primary/10"
              data-ocid="dentist_register.panel"
            >
              {step === 0 && (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="circle-icon w-10 h-10 bg-primary/10 border border-primary/40 text-xl">
                      👤
                    </div>
                    <h2 className="text-lg font-display font-semibold text-gradient-gold">
                      Personal Information
                    </h2>
                  </div>
                  <Field label="Full Name *">
                    <Input
                      value={form.name}
                      onChange={upd("name")}
                      placeholder="Dr. Ananya Sharma"
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50"
                      data-ocid="dentist_register.name_input"
                    />
                  </Field>
                  <Field label="Email Address *">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={upd("email")}
                      placeholder="doctor@clinic.com"
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50"
                      data-ocid="dentist_register.email_input"
                    />
                  </Field>
                  <p className="text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
                    💡 Your email becomes your{" "}
                    <span className="text-primary font-semibold">
                      Booking Email
                    </span>
                    . Share it with patients to receive appointment requests.
                  </p>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="circle-icon w-10 h-10 bg-primary/10 border border-primary/40 text-xl">
                      🏥
                    </div>
                    <h2 className="text-lg font-display font-semibold text-gradient-gold">
                      Professional Details
                    </h2>
                  </div>
                  <Field label="License Number *">
                    <Input
                      value={form.licenseNumber}
                      onChange={upd("licenseNumber")}
                      placeholder="MCI-12345"
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50"
                      data-ocid="dentist_register.license_input"
                    />
                  </Field>
                  <Field label="Specialty *">
                    <select
                      value={form.specialty}
                      onChange={upd("specialty")}
                      className="w-full px-3 py-2 rounded-2xl bg-background/60 border border-border/40 text-foreground text-sm focus:outline-none focus:border-primary/50"
                      data-ocid="dentist_register.specialty_select"
                    >
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Bio / About Yourself *">
                    <Textarea
                      value={form.bio}
                      onChange={upd("bio")}
                      placeholder="Tell patients about your experience and approach..."
                      rows={3}
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50 resize-none"
                      data-ocid="dentist_register.bio_input"
                    />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="circle-icon w-10 h-10 bg-primary/10 border border-primary/40 text-xl">
                      📍
                    </div>
                    <h2 className="text-lg font-display font-semibold text-gradient-gold">
                      Location &amp; Availability
                    </h2>
                  </div>
                  <Field label="City / Location *">
                    <Input
                      value={form.location}
                      onChange={upd("location")}
                      placeholder="Mumbai, Maharashtra"
                      className="rounded-2xl bg-background/60 border-border/40 focus:border-primary/50"
                      data-ocid="dentist_register.city_input"
                    />
                  </Field>

                  {/* Emergency toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-primary/5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Available for Emergency?
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Get listed in emergency searches. Earn more.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          availableForEmergency: !p.availableForEmergency,
                        }))
                      }
                      className={`relative w-12 h-6 rounded-full transition-all border-2 shrink-0 ${form.availableForEmergency ? "bg-primary border-primary" : "bg-muted border-border"}`}
                      data-ocid="dentist_register.emergency_toggle"
                      aria-label="Toggle emergency availability"
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-primary-foreground rounded-full shadow transition-transform ${form.availableForEmergency ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {/* Review summary */}
                  <div className="border border-primary/20 bg-primary/5 rounded-2xl p-4">
                    <p className="text-xs text-primary font-medium mb-2">
                      Review Summary
                    </p>
                    {[
                      { label: "Name", value: form.name },
                      { label: "Specialty", value: form.specialty },
                      { label: "License", value: form.licenseNumber },
                      {
                        label: "Emergency",
                        value: form.availableForEmergency
                          ? "Yes — listed for emergencies"
                          : "No",
                      },
                    ].map(({ label, value }) => (
                      <p key={label} className="text-xs text-muted-foreground">
                        {label}:{" "}
                        <span className="text-foreground">{value}</span>
                      </p>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-full border-border/50 text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                {step < 2 ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext()}
                    className="rounded-full glow-primary disabled:opacity-40"
                    data-ocid="dentist_register.next_button"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canNext() || loading}
                    className="rounded-full glow-primary shimmer-button disabled:opacity-40"
                    data-ocid="dentist_register.submit_button"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Stethoscope className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Registering..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
