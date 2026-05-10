import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const sections = [
  {
    category: "Brushing",
    tips: [
      "Brush for a full 2 minutes, twice daily.",
      "Use a soft-bristle toothbrush.",
      "Replace your brush every 3 months.",
      "Brush your tongue gently to remove bacteria.",
    ],
  },
  {
    category: "Flossing",
    tips: [
      "Floss once daily, ideally before bed.",
      "Use 18 inches of floss per session.",
      "Curve the floss around each tooth's base.",
      "Consider a water flosser for braces.",
    ],
  },
  {
    category: "Diet",
    tips: [
      "Limit sugary and acidic beverages.",
      "Drink water after meals to rinse teeth.",
      "Eat calcium-rich foods for strong enamel.",
      "Chew sugar-free gum to stimulate saliva.",
    ],
  },
  {
    category: "Habits",
    tips: [
      "Never use your teeth as tools.",
      "Wear a mouthguard during contact sports.",
      "Quit smoking to prevent gum disease.",
      "Stay hydrated \u2014 dry mouth promotes decay.",
    ],
  },
  {
    category: "Appointments",
    tips: [
      "Visit your dentist at least once a year.",
      "Get a professional clean every 6 months.",
      "Book emergency care promptly for tooth pain.",
      "Use DantaNova for monthly AI check-ups.",
    ],
  },
] as const;

export default function TipsArchivePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Home</span>
        </Link>
        <span className="font-display font-bold text-sm flex-1 text-center">
          Dental Tips
        </span>
      </header>
      <main
        id="main-content"
        className="flex-1 max-w-xl mx-auto w-full px-4 py-6"
      >
        <h1 className="font-display font-bold text-2xl text-gradient-gold mb-1">
          Dental Tips Archive
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          20 expert-backed tips across 5 categories.
        </p>
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.category}>
              <h2
                className="font-display font-bold text-sm mb-2"
                style={{ color: "oklch(0.88 0.18 85)" }}
              >
                {section.category}
              </h2>
              <div className="flex flex-col gap-2">
                {section.tips.map((tip) => (
                  <div
                    key={tip}
                    className="glass-card rounded-xl px-4 py-3 border border-border/20 text-sm flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">&bull;</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
