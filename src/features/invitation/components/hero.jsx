import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";

export default function Hero() {
  const config = useConfig(); 
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
    }
  }, []);

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          күн: Math.floor(difference / (1000 * 60 * 60 * 24)),
          сағат: Math.floor((difference / (1000 * 60 * 60)) % 24),
          минут: Math.floor((difference / 1000 / 60) % 60),
          секунд: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {Object.keys(timeLeft).map((interval) => (
          <motion.div
            key={interval}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            // Поменяли границу на нейтральную
            className="flex flex-col items-center p-3 bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-sm"
          >
            {/* Число теперь основного цвета (черное) */}
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {timeLeft[interval]}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{interval}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 8,
        // Сделали сердечки в стиле нуар: черные, серые и прозрачные
        color:
          i % 3 === 0
            ? "text-primary"
            : i % 3 === 1
              ? "text-muted-foreground"
              : "text-muted/50",
        initialX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
        animateX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
      })),
    );

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: typeof window !== "undefined" ? window.innerHeight : 0,
            }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -100,
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute"
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 4}px`,
                height: `${heart.size * 4}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center relative overflow-hidden bg-background"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mx-auto"
          >
            {/* Значок стал строгим: черный текст на сером фоне */}
            <span className="px-4 py-1 text-xs tracking-widest uppercase bg-secondary text-primary rounded-full border border-border">
              Бұл Маңызды Күнді Есте Сақтаңыз
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground font-light italic text-base sm:text-lg"
            >
              Құда-жұрт құрмалы Бізде Сінеген Өнеге Ұстау Табыс Ет
            </motion.p>
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              // Убрали розовый градиент на тексте, оставили строгий черный
              className="text-4xl sm:text-6xl font-serif text-foreground tracking-tight"
            >
              {config.groomName} & {config.brideName}
            </motion.h2>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative max-w-md mx-auto"
          >
            {/* Подложка теперь просто белая с блюром */}
            <div className="absolute inset-0 bg-background/50 backdrop-blur-md rounded-2xl" />

            <div className="relative px-4 sm:px-8 py-8 sm:py-10 rounded-2xl border border-border">
              {/* Линии-разделители стали темно-серыми */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
                <div className="w-20 sm:w-32 h-[1px] bg-border" />
              </div>

              <div className="space-y-6 text-center">
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium text-sm sm:text-base">
                      {formatEventDate(config.date, "full")}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground font-medium text-sm sm:text-base">
                      {config.time}
                    </span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 sm:w-12 bg-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="h-px w-8 sm:w-12 bg-border" />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2"
                >
                  <p className="text-muted-foreground font-serif italic text-sm">
                    Құрметті
                  </p>
                  <p className="text-muted-foreground font-medium text-sm">
                    Ажыны/Апа/Іні/Қарындас
                  </p>
                  {/* Имя гостя — главный акцент */}
                  <p className="text-primary font-bold text-xl uppercase tracking-wider">
                    {guestName || "Шақырылған Қонақ"}
                  </p>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
                <div className="w-20 sm:w-32 h-[1px] bg-border" />
              </div>
            </div>
          </motion.div>

          <CountdownTimer targetDate={config.date} />

          <div className="pt-6 relative">
            <FloatingHearts />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Главное сердце внизу — теперь черное */}
              <Heart
                className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto"
                fill="currentColor"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}