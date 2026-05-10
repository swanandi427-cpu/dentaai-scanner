import { Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

const allResults = [
  {
    type: "page",
    title: "Start a Dental Scan",
    desc: "AI-powered oral health scan",
    href: "/scan",
  },
  {
    type: "page",
    title: "Find a Dentist",
    desc: "Search verified dentists near you",
    href: "/find-dentist",
  },
  {
    type: "page",
    title: "Dental Passport",
    desc: "Your portable dental record",
    href: "/passport",
  },
  {
    type: "blog",
    title: "Can AI Detect Cavities?",
    desc: "Blog article &middot; April 2026",
    href: "/blog/can-ai-detect-cavities",
  },
  {
    type: "blog",
    title: "10 Oral Health Tips for 2026",
    desc: "Blog article &middot; March 2026",
    href: "/blog/oral-health-tips",
  },
  {
    type: "tool",
    title: "2-Minute Brush Timer",
    desc: "Interactive brushing guide",
    href: "/brush-timer",
  },
  {
    type: "tool",
    title: "Dental Risk Quiz",
    desc: "10-question oral health assessment",
    href: "/risk-quiz",
  },
  {
    type: "page",
    title: "Pricing",
    desc: "Dentist subscription tiers",
    href: "/pricing",
  },
  {
    type: "page",
    title: "Book Appointment",
    desc: "Request a dentist appointment",
    href: "/book",
  },
] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results =
    query.length > 1
      ? allResults.filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.desc.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

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
          Search
        </span>
      </header>
      <main
        id="main-content"
        className="flex-1 max-w-xl mx-auto w-full px-4 py-6"
      >
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search DantaNova…"
            className="w-full pl-9 pr-4 py-3 rounded-full text-sm bg-card border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            data-ocid="search.input"
          />
        </div>
        {query.length > 1 && results.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No results found for &ldquo;{query}&rdquo;
          </p>
        )}
        {results.length > 0 && (
          <div className="flex flex-col gap-2">
            {results.map((r, i) => (
              <Link
                key={r.href}
                to={r.href}
                className="glass-card rounded-xl p-4 border border-border/20 hover:border-primary/40 transition-all flex items-start gap-3"
                data-ocid={`search.result.${i + 1}`}
              >
                <span className="text-lg mt-0.5">
                  {r.type === "blog"
                    ? "\uD83D\uDCD6"
                    : r.type === "tool"
                      ? "\uD83D\uDD27"
                      : "\uD83D\uDCC4"}
                </span>
                <div>
                  <p className="font-semibold text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query.length <= 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Popular
            </p>
            {allResults.slice(0, 5).map((r, i) => (
              <Link
                key={r.href}
                to={r.href}
                className="glass-card rounded-xl p-3 border border-border/20 hover:border-primary/40 transition-all text-sm flex items-center gap-2"
                data-ocid={`search.popular.${i + 1}`}
              >
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                {r.title}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
