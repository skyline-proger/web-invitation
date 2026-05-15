import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, PauseCircle, PlayCircle } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import BottomBar from "@/components/layout/bottom-bar";

const Layout = ({ children, audioControls }) => {
  const config = useConfig();
  const [showToast, setShowToast] = useState(false);

  const { isPlaying, toggle } = audioControls || {};

  useEffect(() => {
    if (isPlaying) {
      setShowToast(true);
      const timer = setTimeout(
        () => setShowToast(false),
        config.audio?.toastDuration || 3000,
      );
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [isPlaying, config.audio?.toastDuration]);

  return (
    /* REMOVED: bg-secondary. Added bg-transparent */
    <div className="relative min-h-screen w-full bg-transparent flex items-center justify-center">
      <motion.div
        /* REMOVED: bg-background. Added bg-transparent */
        /* KEPT: max-w-[430px] and shadows to keep that "mobile card" feel if you want it, 
           but you might want to remove 'shadow-lg' and 'border' if you want a true full-screen look. */
        className="mx-auto w-full max-w-[430px] min-h-screen bg-transparent relative overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {toggle && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border"
          >
            {isPlaying ? (
              <div className="relative">
                <PauseCircle className="w-6 h-6 text-primary" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            ) : (
              <PlayCircle className="w-6 h-6 text-primary" />
            )}
          </motion.button>
        )}

        {/* MAIN CONTENT: Ensure this is also transparent */}
        <main className="relative h-full w-full bg-transparent">{children}</main>
        
        <BottomBar />

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full backdrop-blur-sm flex items-center space-x-2 shadow-lg">
                <Music className="w-4 h-4 animate-pulse" />
                <span className="text-sm whitespace-nowrap">
                  {config.audio?.title || "Фонды өнер"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Layout;