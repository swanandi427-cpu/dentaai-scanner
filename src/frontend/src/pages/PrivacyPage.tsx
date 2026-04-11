import { Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="text-primary hover:text-primary/80 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Shield className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">
          Privacy Policy — DantaNova
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-display font-bold text-gradient-gold">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Effective Date: January 1, 2026 · Last Updated: April 9, 2026
          </p>
        </div>

        <Section title="1. Introduction">
          DantaNova (&quot;we&quot;, &quot;our&quot;, or &quot;the App&quot;) is
          committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and protect information when you use our AI-powered
          dental health analysis service at{" "}
          <strong>dentaai-scanner-n0h.caffeine.xyz</strong>.
        </Section>

        <Section title="2. Data We Collect">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Identity:</strong> A pseudonymous principal identifier
              issued by Internet Identity (no external password stored by us).
            </li>
            <li>
              <strong>Profile Info:</strong> Name and email address that you
              optionally provide in your Profile for booking and communication
              purposes.
            </li>
            <li>
              <strong>Scan Results:</strong> AI analysis outputs — tooth status,
              health score, detected conditions, and timestamps.{" "}
              <em>Raw camera images are never stored.</em>
            </li>
            <li>
              <strong>Bookings &amp; Messages:</strong> Appointment data and
              chat messages associated with your account.
            </li>
            <li>
              <strong>Dental Passport:</strong> Treatment history, conditions,
              allergies, and pre-approved budget that you voluntarily enter for
              cross-dentist care.
            </li>
            <li>
              <strong>Feedback (optional):</strong> Text submitted via the
              feedback button, linked to your principal.
            </li>
            <li>
              <strong>Session Data:</strong> Browser localStorage is used to
              save your session token and UI preferences. No third-party
              tracking cookies are set.
            </li>
          </ul>
          <p className="mt-3 text-sm bg-card border border-primary/30 rounded-xl p-4 text-primary">
            🔒 DantaNova does not store raw camera images. Only scan analysis
            results are saved.
          </p>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="list-disc list-inside space-y-2">
            <li>
              Display your personal scan history and Dental Passport within the
              app.
            </li>
            <li>
              Facilitate booking and messaging between patients and dentists.
            </li>
            <li>Improve the accuracy of our AI analysis engine.</li>
            <li>Respond to feedback you submit.</li>
          </ul>
          <p className="mt-2">
            We do <strong>not</strong> sell, share, or rent your data to any
            third party.
          </p>
        </Section>

        <Section title="4. Data Storage">
          All data is stored on the{" "}
          <strong>Internet Computer blockchain</strong> (by DFINITY Foundation).
          Data is encrypted at rest by the platform. No centralised cloud
          database is used. Your data is accessible only through your Internet
          Identity principal.
        </Section>

        <Section title="5. GDPR Rights (EU/EEA Users)">
          If you are located in the EU or EEA, you have the following rights
          under the General Data Protection Regulation (GDPR):
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Right of Access:</strong> Request a copy of your stored
              scan data via the History page.
            </li>
            <li>
              <strong>Right to Deletion:</strong> Contact us to request deletion
              of your account data.
            </li>
            <li>
              <strong>Right to Portability:</strong> Your scan history is
              viewable in-app; contact us for a data export.
            </li>
            <li>
              <strong>Right to Objection:</strong> You may object to any
              processing by ceasing to use the App and requesting deletion.
            </li>
          </ul>
          <p className="mt-2">
            To exercise these rights, email:{" "}
            <a
              href="mailto:DANTANOVA.14@gmail.com"
              className="text-primary hover:underline"
            >
              DANTANOVA.14@gmail.com
            </a>
          </p>
        </Section>

        <Section title="6. Data Retention">
          Scan results and passport data are retained for as long as your
          Internet Identity account is active. If you stop using the App, your
          data persists on-chain until deletion is requested. We do not
          automatically delete inactive accounts.
        </Section>

        <Section title="7. Cookies &amp; Local Storage">
          DantaNova does <strong>not</strong> use tracking cookies or analytics
          cookies. We use browser{" "}
          <code className="bg-card px-1 rounded text-primary">
            localStorage
          </code>{" "}
          only for:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your Internet Identity session token.</li>
            <li>
              Cookie-notice dismissal preference (
              <code className="text-primary text-xs">
                dantanova_cookie_dismissed
              </code>
              ).
            </li>
          </ul>
          This data never leaves your device and is not transmitted to any third
          party.
        </Section>

        <Section title="8. Google AdSense">
          This site may display ads served by Google AdSense (publisher ID:
          ca-pub-1241457566096778). Google may use cookies to serve ads based on
          your prior visits to this and other websites. You can opt out of
          personalised advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Ads Settings
          </a>
          .
        </Section>

        <Section title="9. Contact">
          For privacy-related questions or data requests:
          <br />📧{" "}
          <a
            href="mailto:DANTANOVA.14@gmail.com"
            className="text-primary hover:underline"
          >
            DANTANOVA.14@gmail.com
          </a>
        </Section>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/30">
        <p>
          © {new Date().getFullYear()} DantaNova ·{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-1">Developed by Swanandi Manoj Vispute</p>
        <p className="mt-1">
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

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-display font-bold text-primary border-b border-primary/20 pb-1">
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
