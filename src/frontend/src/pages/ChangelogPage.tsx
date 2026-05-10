import { Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Release {
  version: string;
  date: string;
  label: string;
  dotColor: string;
  features: string[];
}

const releases: Release[] = [
  {
    version: "v1.5",
    date: "May 2025",
    label: "Biggest Free Feature Drop",
    dotColor: "oklch(0.88 0.18 85)",
    features: [
      "Blog with 3 dental health articles and SEO JSON-LD",
      "10-question Dental Risk Quiz with personalised results",
      "2-Minute Brushing Timer with animated quadrant guide",
      "Full HTML Sitemap page",
      "Changelog page",
      "Tony Stark HUD redesign — full gold theme throughout",
      "Cinematic loading intro animation with logo reveal",
      "Dark / light mode toggle with saved preference",
      "Impact stats counter and press strip on homepage",
      "Per-tooth hover animations on 3D dental arch",
      "Animated health score reveal on results page",
    ],
  },
  {
    version: "v1.4",
    date: "Apr 2025",
    label: "Gold HUD & Dashboards",
    dotColor: "oklch(0.78 0.16 80)",
    features: [
      "Tony Stark / Iron Man HUD hero section with animated scan-line",
      "Neural network animation on homepage",
      "Gold and amber colour system (replaced neon blue)",
      "Marketing, Operations, and Support dashboards",
      "Y Combinator-style pitch page at /pitch",
      "Dentist subscription pricing tiers at /pricing",
      "Corporate dental plan page at /corporate-plan",
    ],
  },
  {
    version: "v1.3",
    date: "Mar 2025",
    label: "Booking & Messaging",
    dotColor: "oklch(0.72 0.16 75)",
    features: [
      "Real-time messaging between patients and dentists",
      "Appointment booking via dentist email code",
      "My Bookings page for patients",
      "Dentist dashboard with availability management",
      "In-app notification badge for unread messages",
    ],
  },
  {
    version: "v1.2",
    date: "Feb 2025",
    label: "Dental Passport",
    dotColor: "oklch(0.68 0.14 70)",
    features: [
      "Dental Passport creation, issue, and lookup flows",
      "Travelling dentist reimbursement system",
      "Passport section on homepage above How It Works",
    ],
  },
  {
    version: "v1.1",
    date: "Jan 2025",
    label: "Emergency Dentist Finder",
    dotColor: "oklch(0.62 0.12 65)",
    features: [
      "Emergency dentist finder and registration",
      "Animated demo walk-through at /demo",
      "12 patient testimonials with before/after comparison",
      "Google AdSense and ads.txt configuration",
      "SEO meta tags, sitemap, robots.txt, and IndexNow",
    ],
  },
  {
    version: "v1.0",
    date: "Jan 2025",
    label: "Initial Launch",
    dotColor: "oklch(0.55 0.09 60)",
    features: [
      "AI-powered dental scan in 5 steps",
      "Realistic 3D dental arch with color-coded indicators",
      "Scan result report with health score and cavity detection",
      "Scan history per signed-in user",
      "Internet Identity (ICP) authentication",
      "QR code page linking to permanent live URL",
    ],
  },
];

const comingSoon = [
  "Multilingual support — Hindi, Spanish, Arabic",
  "Real AI model integration via HTTP outcalls",
  "Geolocation-based dentist search",
  "Google Analytics integration",
  "Before/after scan comparison view",
  "Patient health dashboard with score trends",
  "Referral / invite link system",
];

export default function ChangelogPage() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b border-border/40 backdrop-blur"
        style={{ background: "oklch(0.10 0.006 70 / 0.92)" }}
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-base font-bold"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="changelog.home_link"
          >
            DantaNova
          </Link>
          <Link
            to="/scan"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="changelog.scan_link"
          >
            Free Scan →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border"
            style={{
              background: "oklch(0.78 0.16 80 / 0.12)",
              borderColor: "oklch(0.78 0.16 80 / 0.3)",
              color: "oklch(0.88 0.18 85)",
            }}
          >
            <Rocket className="w-3.5 h-3.5" /> Release Notes
          </div>
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 85), oklch(0.72 0.19 76), oklch(0.95 0.12 90))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            What’s New in DantaNova
          </h1>
          <p className="text-muted-foreground">
            A full history of every feature, fix, and improvement.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-[18px] top-0 bottom-0 w-0.5"
            style={{ background: "oklch(0.78 0.16 80 / 0.2)" }}
          />
          <div className="space-y-10">
            {releases.map((rel, i) => (
              <motion.div
                key={rel.version}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="relative pl-12"
                data-ocid={`changelog.release.${i + 1}`}
              >
                <div
                  className="absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.78 0.16 80 / 0.15)",
                    border: `2px solid ${rel.dotColor}`,
                  }}
                >
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: rel.dotColor }}
                  />
                </div>
                <div
                  className="p-5 rounded-2xl border border-border/40"
                  style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
                >
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span
                      className="text-lg font-extrabold"
                      style={{ color: rel.dotColor }}
                    >
                      {rel.version}
                    </span>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "oklch(0.78 0.16 80 / 0.12)",
                        color: "oklch(0.88 0.18 85)",
                        border: "1px solid oklch(0.78 0.16 80 / 0.25)",
                      }}
                    >
                      {rel.label}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {rel.date}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {rel.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-foreground/85"
                      >
                        <Zap
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: rel.dotColor }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 p-6 rounded-2xl border border-border/40"
          style={{ background: "oklch(0.12 0.008 60 / 0.7)" }}
          data-ocid="changelog.coming_soon_section"
        >
          <h2
            className="text-xl font-bold mb-4 flex items-center gap-2"
            style={{ color: "oklch(0.88 0.18 85)" }}
          >
            <Rocket className="w-5 h-5" /> Coming Soon
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {comingSoon.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span style={{ color: "oklch(0.88 0.18 85)" }}>○</span> {item}
              </li>
            ))}
          </ul>
          <Link
            to="/scan"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.16 80), oklch(0.68 0.19 76))",
              color: "oklch(0.08 0.005 60)",
            }}
            data-ocid="changelog.scan_cta_button"
          >
            Try DantaNova Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>

      <footer
        className="border-t border-border/30 mt-16 py-8 text-center text-xs text-muted-foreground"
        style={{ background: "oklch(0.10 0.006 70 / 0.6)" }}
      >
        © {new Date().getFullYear()} DantaNova · Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
