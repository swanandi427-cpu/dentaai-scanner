import CookieNotice from "@/components/CookieNotice";
import FloatingFeedback from "@/components/FloatingFeedback";
import IntroScreen from "@/components/IntroScreen";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import { useKeyboardShortcuts } from "@/components/KeyboardShortcutsModal";
import { Toaster } from "@/components/ui/sonner";
import { ScanProvider } from "@/context/ScanContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import AnalysisPage from "@/pages/AnalysisPage";
import BookByCodePage from "@/pages/BookByCodePage";
import CorporatePlanPage from "@/pages/CorporatePlanPage";
import DemoPage from "@/pages/DemoPage";
import DentistDashboardPage from "@/pages/DentistDashboardPage";
import DentistRegisterPage from "@/pages/DentistRegisterPage";
import FindDentistPage from "@/pages/FindDentistPage";
import HistoryPage from "@/pages/HistoryPage";
import HomePage from "@/pages/HomePage";
import IssuePassportPage from "@/pages/IssuePassportPage";
import MarketingDashboardPage from "@/pages/MarketingDashboardPage";
import MessagesPage from "@/pages/MessagesPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import OperationsDashboardPage from "@/pages/OperationsDashboardPage";
import PassportLookupPage from "@/pages/PassportLookupPage";
import PassportPage from "@/pages/PassportPage";
import PricingPage from "@/pages/PricingPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ProfilePage from "@/pages/ProfilePage";
import QRCodePage from "@/pages/QRCodePage";
import ResultsPage from "@/pages/ResultsPage";
import ScanPage from "@/pages/ScanPage";
import SupportDashboardPage from "@/pages/SupportDashboardPage";
import TermsPage from "@/pages/TermsPage";
import UITestPage from "@/pages/UITestPage";
import YStatementPage from "@/pages/YStatementPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Bug, Keyboard, Moon, Sun } from "lucide-react";
import { type ComponentType, Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";

const TeledentistryPageLazy = lazy(() => import("./pages/TeledentistryPage"));
const DentalAgeCalculatorPageLazy = lazy(
  () => import("./pages/DentalAgeCalculatorPage"),
);
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogArticle1Page = lazy(() => import("./pages/BlogArticle1Page"));
const BlogArticle2Page = lazy(() => import("./pages/BlogArticle2Page"));
const BlogArticle3Page = lazy(() => import("./pages/BlogArticle3Page"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const BrushTimerPage = lazy(() => import("./pages/BrushTimerPage"));
const RiskQuizPage = lazy(() => import("./pages/RiskQuizPage"));
const CompareScansPage = lazy(() => import("./pages/CompareScansPage"));
const FindDentistNearMePage = lazy(
  () => import("./pages/FindDentistNearMePage"),
);
const SearchPage = lazy(() => import("./pages/SearchPage"));
const TipsArchivePage = lazy(() => import("./pages/TipsArchivePage"));
const ReferralPage = lazy(() => import("./pages/ReferralPage"));

function LazyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

function withSuspense(Component: ComponentType) {
  return function SuspenseWrapper() {
    return (
      <Suspense fallback={<LazyFallback />}>
        <Component />
      </Suspense>
    );
  };
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const tooltip = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={tooltip}
      title={tooltip}
      data-ocid="nav.theme_toggle"
      className="fixed top-3 right-4 z-50 flex items-center justify-center w-9 h-9 rounded-full border border-border/40 bg-card/80 backdrop-blur transition-all shadow-md hover:scale-105 active:scale-95"
      style={{
        borderColor: "oklch(0.88 0.18 85 / 0.3)",
        background: "oklch(0.10 0.006 70 / 0.85)",
      }}
    >
      {isDark ? (
        // In dark mode: show Moon icon in gold
        <Moon className="w-4 h-4" style={{ color: "oklch(0.88 0.18 85)" }} />
      ) : (
        // In light mode: show Sun icon in gold
        <Sun className="w-4 h-4" style={{ color: "oklch(0.72 0.19 76)" }} />
      )}
    </button>
  );
}

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDebugPage = pathname === "/ui-test";
  const [kbdOpen, setKbdOpen] = useState(false);

  useKeyboardShortcuts(() => setKbdOpen(true));

  useEffect(() => {
    function handleOffline() {
      toast.warning("You are offline", {
        description: "Please check your internet connection.",
        duration: 6000,
      });
    }
    function handleOnline() {
      toast.success("You're back online!", { duration: 3000 });
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <IntroScreen />
      <div id="main-content">
        <Outlet />
      </div>
      <ThemeToggle />
      <FloatingFeedback />
      <CookieNotice />
      <KeyboardShortcutsModal
        open={kbdOpen}
        onClose={() => setKbdOpen(false)}
      />
      <output aria-live="polite" aria-atomic="true">
        <Toaster />
      </output>
      {!isDebugPage && (
        <>
          <Link
            to="/ui-test"
            className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border border-border/50 bg-card/90 backdrop-blur text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-lg"
            data-ocid="debug.open_modal_button"
          >
            <Bug className="w-3.5 h-3.5" />
            Debug
          </Link>
          <button
            type="button"
            onClick={() => setKbdOpen(true)}
            className="hidden md:flex fixed bottom-4 left-24 z-50 items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border border-border/50 bg-card/90 backdrop-blur text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-lg"
            data-ocid="kbd.open_modal_button"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
            Shortcuts
          </button>
        </>
      )}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: ScanPage,
});

const analysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analysis",
  component: AnalysisPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const qrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/qr",
  component: QRCodePage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const findDentistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/find-dentist",
  component: FindDentistPage,
});

const dentistRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dentist-register",
  component: DentistRegisterPage,
});

const dentistDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dentist-dashboard",
  component: DentistDashboardPage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookByCodePage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$bookingId",
  component: MessagesPage,
});

const passportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passport",
  component: PassportPage,
});

const issuePassportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/issue-passport",
  component: IssuePassportPage,
});

const passportLookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passport-lookup",
  component: PassportLookupPage,
});

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demo",
  component: DemoPage,
});

const uiTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ui-test",
  component: UITestPage,
});

const pitchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pitch",
  component: YStatementPage,
});

const marketingDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketing-dashboard",
  component: MarketingDashboardPage,
});

const operationsDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/operations-dashboard",
  component: OperationsDashboardPage,
});

const supportDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support-dashboard",
  component: SupportDashboardPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: PricingPage,
});

const corporatePlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/corporate-plan",
  component: CorporatePlanPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: withSuspense(BlogPage),
});

const blogArticle1Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/can-ai-detect-cavities",
  component: withSuspense(BlogArticle1Page),
});

const blogArticle2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/oral-health-tips",
  component: withSuspense(BlogArticle2Page),
});

const blogArticle3Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/dental-passport-guide",
  component: withSuspense(BlogArticle3Page),
});

const changelogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/changelog",
  component: withSuspense(ChangelogPage),
});

const sitemapPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sitemap",
  component: withSuspense(SitemapPage),
});

const brushTimerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/brush-timer",
  component: withSuspense(BrushTimerPage),
});

const riskQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/risk-quiz",
  component: withSuspense(RiskQuizPage),
});

const compareScansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compare",
  component: withSuspense(CompareScansPage),
});

const findDentistNearMeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/find-dentist-near-me",
  component: withSuspense(FindDentistNearMePage),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: withSuspense(SearchPage),
});

const tipsArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tips",
  component: withSuspense(TipsArchivePage),
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/referral",
  component: withSuspense(ReferralPage),
});

const teledentistryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teledentistry",
  component: withSuspense(TeledentistryPageLazy),
});

const dentalAgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dental-age",
  component: withSuspense(DentalAgeCalculatorPageLazy),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  teledentistryRoute,
  dentalAgeRoute,
  scanRoute,
  analysisRoute,
  resultsRoute,
  historyRoute,
  qrRoute,
  profileRoute,
  privacyRoute,
  termsRoute,
  findDentistRoute,
  dentistRegisterRoute,
  dentistDashboardRoute,
  bookRoute,
  myBookingsRoute,
  messagesRoute,
  passportRoute,
  issuePassportRoute,
  passportLookupRoute,
  demoRoute,
  uiTestRoute,
  pitchRoute,
  marketingDashboardRoute,
  operationsDashboardRoute,
  supportDashboardRoute,
  pricingRoute,
  corporatePlanRoute,
  blogRoute,
  blogArticle1Route,
  blogArticle2Route,
  blogArticle3Route,
  changelogRoute,
  sitemapPageRoute,
  brushTimerRoute,
  riskQuizRoute,
  compareScansRoute,
  findDentistNearMeRoute,
  searchRoute,
  tipsArchiveRoute,
  referralRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ScanProvider>
          <RouterProvider router={router} />
        </ScanProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
