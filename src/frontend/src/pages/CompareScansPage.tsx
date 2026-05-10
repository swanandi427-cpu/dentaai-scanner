import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function CompareScansPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Link
          to="/history"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">History</span>
        </Link>
        <span className="font-display font-bold text-sm flex-1 text-center">
          Compare Scans
        </span>
      </header>
      <main
        id="main-content"
        className="flex-1 max-w-2xl mx-auto w-full px-4 py-8"
      >
        <h1 className="font-display font-bold text-2xl text-gradient-gold mb-2">
          Side-by-Side Scan Comparison
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Select two scan dates from your history to compare your oral health
          over time.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(["Scan A", "Scan B"] as const).map((label) => (
            <div
              key={label}
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 border border-border/20 min-h-48"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{
                  background: "oklch(0.78 0.16 80 / 0.1)",
                  border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                }}
              >
                &#x1F9B7;
              </div>
              <p className="font-semibold text-sm">{label}</p>
              <Link
                to="/history"
                className="text-xs text-primary hover:underline mt-auto"
                data-ocid="compare.select_link"
              >
                Select from history &rarr;
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 glass-card rounded-2xl p-6 border border-border/20 text-center">
          <p className="text-sm text-muted-foreground">
            Complete at least 2 scans to enable comparison. Visit{" "}
            <Link to="/scan" className="text-primary hover:underline">
              Start Scan
            </Link>{" "}
            to begin.
          </p>
        </div>
      </main>
    </div>
  );
}
