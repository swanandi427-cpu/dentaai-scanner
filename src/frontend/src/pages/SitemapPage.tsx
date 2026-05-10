import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  LayoutList,
  MessageSquare,
  QrCode,
  Search,
  Settings,
  Shield,
  Smile,
  Stethoscope,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface SitemapLink {
  path: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

interface SitemapSection {
  title: string;
  sectionIcon: LucideIcon;
  links: SitemapLink[];
}

const sections: SitemapSection[] = [
  {
    title: "For Patients",
    sectionIcon: Smile,
    links: [
      { path: "/", label: "Home", desc: "DantaNova landing page", icon: Home },
      {
        path: "/scan",
        label: "Start a Scan",
        desc: "5-step AI dental scan wizard",
        icon: Search,
      },
      {
        path: "/results",
        label: "Scan Results",
        desc: "View your latest AI analysis",
        icon: FileText,
      },
      {
        path: "/history",
        label: "Scan History",
        desc: "All your previous scans",
        icon: Clock,
      },
      {
        path: "/my-bookings",
        label: "My Bookings",
        desc: "Appointments you have requested",
        icon: Calendar,
      },
      {
        path: "/profile",
        label: "My Profile",
        desc: "Account details and settings",
        icon: User,
      },
      {
        path: "/risk-quiz",
        label: "Risk Quiz",
        desc: "10-question dental health assessment",
        icon: Shield,
      },
      {
        path: "/brush-timer",
        label: "Brushing Timer",
        desc: "2-minute guided brushing coach",
        icon: Clock,
      },
    ],
  },
  {
    title: "For Dentists",
    sectionIcon: Stethoscope,
    links: [
      {
        path: "/find-dentist",
        label: "Find a Dentist",
        desc: "Browse and book emergency dentists",
        icon: Search,
      },
      {
        path: "/dentist-register",
        label: "Dentist Registration",
        desc: "Join the DantaNova network",
        icon: User,
      },
      {
        path: "/dentist-dashboard",
        label: "Dentist Dashboard",
        desc: "Manage bookings and availability",
        icon: LayoutDashboard,
      },
      {
        path: "/book",
        label: "Book an Appointment",
        desc: "Request an appointment by email code",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Tools & Features",
    sectionIcon: Settings,
    links: [
      {
        path: "/passport",
        label: "Dental Passport",
        desc: "View and manage your dental passport",
        icon: Globe,
      },
      {
        path: "/issue-passport",
        label: "Issue Passport",
        desc: "Create a dental passport record",
        icon: FileText,
      },
      {
        path: "/passport-lookup",
        label: "Passport Lookup",
        desc: "Look up a patient’s dental passport",
        icon: Search,
      },
      {
        path: "/demo",
        label: "Animated Demo",
        desc: "See DantaNova in action",
        icon: Smile,
      },
      {
        path: "/qr",
        label: "QR Code",
        desc: "Share DantaNova via QR code",
        icon: QrCode,
      },
      {
        path: "/blog",
        label: "Blog",
        desc: "Dental health articles and insights",
        icon: BookOpen,
      },
      {
        path: "/changelog",
        label: "What’s New",
        desc: "Full release history and coming soon",
        icon: Clock,
      },
      {
        path: "/sitemap",
        label: "Sitemap",
        desc: "All pages in one place",
        icon: LayoutList,
      },
    ],
  },
  {
    title: "Business",
    sectionIcon: Briefcase,
    links: [
      {
        path: "/pricing",
        label: "Pricing",
        desc: "Dentist subscription tiers",
        icon: BarChart2,
      },
      {
        path: "/corporate-plan",
        label: "Corporate Plan",
        desc: "Dental plans for companies",
        icon: Briefcase,
      },
      {
        path: "/pitch",
        label: "Investor Pitch",
        desc: "Y Combinator-style pitch page",
        icon: FileText,
      },
    ],
  },
  {
    title: "Legal",
    sectionIcon: Shield,
    links: [
      {
        path: "/privacy",
        label: "Privacy Policy",
        desc: "How we handle your data",
        icon: Shield,
      },
      {
        path: "/terms",
        label: "Terms of Service",
        desc: "Platform terms and conditions",
        icon: FileText,
      },
    ],
  },
  {
    title: "Admin & Dashboards",
    sectionIcon: LayoutDashboard,
    links: [
      {
        path: "/marketing-dashboard",
        label: "Marketing Dashboard",
        desc: "Traffic and CTA analytics",
        icon: BarChart2,
      },
      {
        path: "/operations-dashboard",
        label: "Operations Dashboard",
        desc: "System health and workflows",
        icon: Settings,
      },
      {
        path: "/support-dashboard",
        label: "Support Dashboard",
        desc: "Tickets and satisfaction scores",
        icon: MessageSquare,
      },
      {
        path: "/ui-test",
        label: "UI Test Panel",
        desc: "Debug and design showcase",
        icon: Settings,
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "Satoshi, Inter, sans-serif" }}
    >
      <header
        className="sticky top-0 z-40 border-b border-border/40 backdrop-blur"
        style={{ background: "oklch(0.10 0.006 70 / 0.92)" }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-base font-bold"
            style={{ color: "oklch(0.88 0.18 85)" }}
            data-ocid="sitemap.home_link"
          >
            DantaNova
          </Link>
          <Link
            to="/scan"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="sitemap.scan_link"
          >
            Free Scan →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border"
            style={{
              background: "oklch(0.78 0.16 80 / 0.12)",
              borderColor: "oklch(0.78 0.16 80 / 0.3)",
              color: "oklch(0.88 0.18 85)",
            }}
          >
            <LayoutList className="w-3.5 h-3.5" /> All Pages
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
            DantaNova Site Map
          </h1>
          <p className="text-muted-foreground">
            Every page on DantaNova, organised for easy navigation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, si) => {
            const SectionIcon = section.sectionIcon;
            return (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: si * 0.06 }}
                className="p-6 rounded-2xl border border-border/40"
                style={{ background: "oklch(0.12 0.008 60 / 0.85)" }}
                data-ocid={`sitemap.section.${si + 1}`}
              >
                <h2 className="flex items-center gap-2.5 text-base font-bold mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "oklch(0.78 0.16 80 / 0.14)",
                      border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                    }}
                  >
                    <SectionIcon
                      className="w-4 h-4"
                      style={{ color: "oklch(0.88 0.18 85)" }}
                    />
                  </div>
                  <span style={{ color: "oklch(0.88 0.18 85)" }}>
                    {section.title}
                  </span>
                </h2>
                <ul className="space-y-2">
                  {section.links.map((link, li) => {
                    const LinkIcon = link.icon;
                    return (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-border/40 hover:bg-muted/20 transition-all group"
                          data-ocid={`sitemap.link.${si + 1}.${li + 1}`}
                        >
                          <LinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {link.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {link.desc}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.section>
            );
          })}
        </div>
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
