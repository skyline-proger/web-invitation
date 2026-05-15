import { useState, lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Heart } from "lucide-react";
import { useInvitation } from "@/features/invitation";
import { useAudio } from "@/hooks/use-audio";
import staticConfig from "@/config/config";

// Lazy load components
const Layout = lazy(() => import("@/components/layout/layout"));
const MainContent = lazy(
  () => import("@/features/invitation/components/main-content"),
);
const LandingPage = lazy(
  () => import("@/features/invitation/components/landing-page"),
);

function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const { config, isLoading, error } = useInvitation();

  const activeConfig = config || staticConfig.data;

  const audioControls = useAudio({
    src: activeConfig?.audio?.src || "/audio/fulfilling-humming.mp3",
    loop: activeConfig?.audio?.loop !== false,
  });

  // --- BACKGROUND THEME MANAGER ---
  useEffect(() => {
    // 1. If on Landing Page, ensure no global background themes are active
    if (!isInvitationOpen) {
      document.body.classList.remove("theme-hero", "theme-wishes");
      return;
    }

    // INSTANT FIX: Force the hero background immediately so there is never a blank screen
    document.body.classList.add("theme-hero");

    const bgSections = ["hero", "wishes"];

    const observerOptions = {
      root: null,
      rootMargin: "300px 0px 300px 0px", 
      threshold: 0, 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && bgSections.includes(entry.target.id)) {
          document.body.classList.remove("theme-hero", "theme-wishes");
          document.body.classList.add(`theme-${entry.target.id}`);
        }
      });
    }, observerOptions);

    // SMART FIX: Poll for elements since they are Lazy Loaded
    let checkInterval;
    
    const startObserving = () => {
      const sections = document.querySelectorAll("section");
      // Once the lazy-loaded sections are actually in the DOM, observe them and stop polling
      if (sections.length > 0) {
        sections.forEach((section) => observer.observe(section));
        clearInterval(checkInterval);
      }
    };

    // Check every 100ms until the components are found
    checkInterval = setInterval(startObserving, 100);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
    };
  }, [isInvitationOpen]);

  const handleOpenInvitation = async () => {
    await audioControls.play();
    setIsInvitationOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Heart
            className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse"
            fill="currentColor"
          />
          <p className="text-muted-foreground">Шақыру құжаты жүктелуде...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-primary text-6xl mb-4">!</div>
          <h1 className="text-2xl font-serif text-foreground mb-2">
            Шақыру Табылмады
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Өтінем URL-ыңызды тексеріңіз немесе ұйымдастырушыға хабарласыңыз.
          </p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{activeConfig.title}</title>
        <meta name="title" content={activeConfig.title} />
        <meta name="description" content={activeConfig.description} />
        <meta name="robots" content="noindex, nofollow, noarchive, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive" />
        <meta name="bingbot" content="noindex, nofollow, noarchive" />
        <meta name="archive" content="no" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={activeConfig.title} />
        <meta property="og:description" content={activeConfig.description} />
        <meta property="og:image" content={activeConfig.ogImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={activeConfig.title} />
        <meta property="twitter:description" content={activeConfig.description} />
        <meta property="twitter:image" content={activeConfig.ogImage} />
        <link rel="icon" type="image/x-icon" href={activeConfig.favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0 viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <Heart
                className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse"
                fill="currentColor"
              />
              <p className="text-muted-foreground">Қажет істі орындау...</p>
            </div>
          </div>
        }
      >
        <AnimatePresence mode="wait">
          {!isInvitationOpen ? (
            <LandingPage key="landing" onOpenInvitation={handleOpenInvitation} />
          ) : (
            <Layout key="main" audioControls={audioControls}>
              <MainContent />
            </Layout>
          )}
        </AnimatePresence>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;