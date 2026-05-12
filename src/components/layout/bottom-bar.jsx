import React, { useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, CalendarHeart, MapPin, MessageCircleHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/features/invitation/hooks/use-config";

const baseMenuItems = [
  { icon: Home, label: "Үй", href: "#home", id: "home" },
  { icon: CalendarHeart, label: "Іс-әрекет", href: "#event", id: "event" },
  { icon: MapPin, label: "Орны", href: "#location", id: "location" },
  { icon: MessageCircleHeart, label: "Тілек", href: "#wishes", id: "wishes" },
];

const BottomBar = () => {
  const config = useConfig();
  const [active, setActive] = React.useState("home");

  const menuItems = useMemo(() => {
    const hasBanks = config?.banks && config.banks.length > 0;
    return baseMenuItems.filter((item) => {
      if (item.requiresBanks && !hasBanks) {
        return false;
      }
      return true;
    });
  }, [config?.banks]);

  const handleMenuClick = useCallback((e, href, id) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      setActive(id);
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const validSection = menuItems.find((item) => item.id === sectionId);
          if (validSection) {
            setActive(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [menuItems]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <motion.div
        className="w-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* Заменили bg-white на bg-background/90 и border-gray-200 на border-border */}
        <div className="backdrop-blur-md bg-background/90 border border-border rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-3 py-2">
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 ease-in-out",
                  // Заменили hover на более мягкий bg-accent/50
                  "hover:bg-accent/50 cursor-pointer min-w-[60px]",
                  active === item.id
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground",
                )}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleMenuClick(e, item.href, item.id)}
              >
                <motion.div
                  animate={{
                    scale: active === item.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon
                    className={cn(
                      "h-[18px] w-[18px] sm:h-5 sm:w-5 mb-0.5 sm:mb-1 transition-all duration-300",
                      // Заменили stroke-rose-500 на stroke-primary
                      active === item.id
                        ? "stroke-primary stroke-[2.5px]"
                        : "stroke-muted-foreground stroke-2",
                    )}
                  />
                </motion.div>
                <motion.span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium transition-all duration-300 line-clamp-1",
                    // Заменили text-rose-500 на text-primary
                    active === item.id
                      ? "text-primary font-bold"
                      : "text-muted-foreground",
                  )}
                  animate={{
                    scale: active === item.id ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </motion.a>
            ))}
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default BottomBar;