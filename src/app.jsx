import { useState, lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Heart } from "lucide-react";
import { useInvitation } from "@/features/invitation";
import { useAudio } from "@/hooks/use-audio";

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
  // 1. Destructure uid from the hook alongside config
  const { uid, config, isLoading, error } = useInvitation();

  // 2. Safely initialize audio using dynamic config (hooks must always execute at the top)
  const audioControls = useAudio({
    src: config?.audio?.src || "/audio/fulfilling-humming.mp3",
    loop: config?.audio?.loop !== false,
  });

  // --- BACKGROUND THEME MANAGER ---
  useEffect(() => {
    if (!uid) return; // Don't run the observer on the "Coming Soon" page

    if (!isInvitationOpen) {
      document.body.classList.remove("theme-hero", "theme-wishes");
      return;
    }

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

    let checkInterval;
    
    const startObserving = () => {
      const heroSection = document.getElementById("hero");
      const wishesSection = document.getElementById("wishes");
      
      if (heroSection && wishesSection) {
        observer.observe(heroSection);
        observer.observe(wishesSection);
        clearInterval(checkInterval);
      }
    };

    checkInterval = setInterval(startObserving, 100);

    const timeoutFallback = setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      clearTimeout(timeoutFallback);
    };
  }, [isInvitationOpen, uid]);

  const handleOpenInvitation = async () => {
    await audioControls.play();
    setIsInvitationOpen(true);
  };

  // --- EARLY RETURNS ---

  // 1. COMING SOON PAGE (No UID detected in URL or Storage)
  if (!uid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6">
        <h1 className="text-4xl font-serif mb-4 text-foreground">MyShaqury.kz</h1>
        <p className="text-muted-foreground tracking-widest uppercase text-sm">
          Платформа жақында ашылады...
        </p>
      </div>
    );
  }

  // 2. LOADING STATE
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

  // 3. ERROR STATE (UID detected, but database fetch failed)
  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-primary text-6xl mb-4">!</div>
          <h1 className="text-2xl font-serif text-foreground mb-2">
            Шақыру Табылмады
          </h1>
          <p className="text-muted-foreground mb-4">{error || "Деректер табылмады"}</p>
          <p className="text-sm text-muted-foreground">
            Өтінем URL-ыңызды тексеріңіз немесе ұйымдастырушыға хабарласыңыз.
          </p>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER (Config is guaranteed to exist here) ---
  return (
    <HelmetProvider>
      <Helmet>
        <title>{config.title}</title>
        <meta name="title" content={config.title} />
        <meta name="description" content={config.description} />
        <meta name="robots" content="noindex, nofollow, noarchive, nocache" />
        <meta name="googlebot" content="noindex, nofollow, noarchive" />
        <meta name="bingbot" content="noindex, nofollow, noarchive" />
        <meta name="archive" content="no" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content={config.ogImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={config.title} />
        <meta property="twitter:description" content={config.description} />
        <meta property="twitter:image" content={config.ogImage} />
        <link rel="icon" type="image/x-icon" href={config.favicon} />
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