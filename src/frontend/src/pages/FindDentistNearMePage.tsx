import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { useState } from "react";

const dentists = [
  {
    name: "Dr. Priya Sharma",
    specialty: "General & Cosmetic",
    location: "Bandra, Mumbai",
    dist: "1.2 km",
    rating: 4.9,
  },
  {
    name: "Dr. Arjun Mehta",
    specialty: "Emergency Dental Care",
    location: "Andheri, Mumbai",
    dist: "2.8 km",
    rating: 4.8,
  },
  {
    name: "Dr. Kavya Nair",
    specialty: "Orthodontics",
    location: "Powai, Mumbai",
    dist: "4.1 km",
    rating: 4.7,
  },
  {
    name: "Dr. Rohan Gupta",
    specialty: "Oral Surgery",
    location: "Dadar, Mumbai",
    dist: "5.5 km",
    rating: 4.6,
  },
] as const;

export default function FindDentistNearMePage() {
  const [query, setQuery] = useState("");
  const filtered = dentists.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.location.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/80 backdrop-blur-xl">
        <Link
          to="/find-dentist"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Dentist Finder</span>
        </Link>
        <span className="font-display font-bold text-sm flex-1 text-center">
          Near Me
        </span>
      </header>
      <main
        id="main-content"
        className="flex-1 max-w-xl mx-auto w-full px-4 py-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h1 className="font-display font-bold text-xl text-gradient-gold">
            Dentists Near You
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Showing dentists sorted by proximity. Enable location for real-time
          results.
        </p>
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or area…"
            className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm bg-card border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            data-ocid="find_near_me.search_input"
          />
        </div>
        <div className="flex flex-col gap-3">
          {filtered.map((d, i) => (
            <div
              key={d.name}
              className="glass-card rounded-2xl p-4 border border-border/20 flex items-start gap-3"
              data-ocid={`find_near_me.item.${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
                style={{
                  background: "oklch(0.78 0.16 80 / 0.1)",
                  border: "1px solid oklch(0.78 0.16 80 / 0.3)",
                }}
              >
                &#x1F9B7;
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3 h-3 text-primary/60" />
                  <span className="text-xs text-muted-foreground">
                    {d.location} &middot; {d.dist}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.88 0.18 85)" }}
                >
                  {d.rating} &#9733;
                </span>
                <Link
                  to="/book"
                  className="text-xs text-primary hover:underline"
                  data-ocid="find_near_me.book_link"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
