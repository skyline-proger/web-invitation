// src/App.jsx
import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Heart } from "lucide-react";
import { useInvitation } from "@/features/invitation";
import { useAudio } from "@/hooks/use-audio";
import staticConfig from "@/config/config";

// Lazy load components for better performance
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

  const handleOpenInvitation = async () => {
    await audioControls.play();
    setIsInvitationOpen(true);
  };

  if (isLoading) {
    return (
      // ЗАМЕНИЛИ РОЗОВЫЙ ФОН НА БАЗОВЫЙ: bg-background
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          {/* ЗАМЕНИЛИ text-rose-500 НА text-primary (будет черным) */}
          <Heart
            className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse"
            fill="currentColor"
          />
          {/* ЗАМЕНИЛИ text-gray-600 НА text-muted-foreground */}
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Поменял theme-color на белый (для мобильных браузеров) */}
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
            <LandingPage onOpenInvitation={handleOpenInvitation} />
          ) : (
            <Layout audioControls={audioControls}>
              <MainContent />
            </Layout>
          )}
        </AnimatePresence>
      </Suspense>
    </HelmetProvider>
  );
  
}

export default App;