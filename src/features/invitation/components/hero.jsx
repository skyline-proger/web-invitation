import { Calendar, Clock, Heart, ChevronDown } from "lucide-react";
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
      <div className="w-full max-w-md sm:max-w-2xl mx-auto mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {Object.keys(timeLeft).map((interval) => (
            <motion.div
              key={interval}
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-md w-full"
            >
              <span className="text-3xl sm:text-4xl font-bold text-primary drop-shadow-sm mb-1">
                {timeLeft[interval]}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                {interval}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 8,
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: hearts.initialX,
              y: "100vh",
            }}
            animate={{
              opacity: [0, 0.4, 0.4, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: "-20vh",
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
    <section
      id="hero"
      className="w-full relative overflow-hidden bg-background/10 backdrop-blur-[3px]"
    >
      <FloatingHearts />
      
      {/* ==================== ПЕРВЫЙ ЭКРАН (100vh) ==================== */}
      <div className="min-h-[100dvh] flex flex-col items-center justify-between px-4 pt-16 pb-28 text-center relative z-10 w-full max-w-4xl mx-auto">
        
        <div className="flex-1 flex flex-col justify-start items-center w-full mt-4">
          
          {/* top_divider.PNG (сверху всех текстов). Путь исправлен, размер увеличен (mb-8 w-full max-w-[150px] sm:max-w-[200px]) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8 w-full max-w-[400px] sm:max-w-[300px]"
          >
            <img 
              src="/images/top_divider.PNG" 
              alt="Top Decoration" 
              className="w-full h-auto object-contain mx-auto opacity-90"
            />
          </motion.div>

          {/* --- БЛОК 1: ОСНОВНОЙ ТЕКСТ ПРИГЛАШЕНИЯ --- */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center gap-3 sm:gap-6 w-full px-4"
            >
              <div className="h-[2px] flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-r from-transparent to-primary/80 rounded-full" />
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-primary font-medium tracking-wide drop-shadow-md">
                Құрметті құдалар, <br className="sm:hidden" /> қадірлі қонақтар!
              </h3>
              <div className="h-[2px] flex-1 max-w-[60px] sm:max-w-[120px] bg-gradient-to-l from-transparent to-primary/80 rounded-full" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl font-serif text-muted-foreground italic pt-4"
            >
              Біздің балаларымыздың
            </motion.p>

            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-serif text-foreground tracking-tight drop-shadow-lg"
            >
              {config.groomName} & {config.brideName}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl font-serif text-muted-foreground italic pb-4"
            >
              үйлену тойына шақырамыз!
            </motion.p>
          </div>

          {/* --- БЛОК 2: ТОЙ ИЕЛЕРІ (В СТИЛЕ КАРТОЧКИ) --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 sm:mt-16 relative max-w-sm sm:max-w-md w-full mx-auto shadow-xl rounded-2xl"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-lg rounded-2xl" />

            <div className="relative px-4 py-6 sm:py-8 rounded-2xl border border-border">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
                <div className="w-16 sm:w-24 h-[1px] bg-border" />
              </div>

              <div className="space-y-3 text-center z-10 relative">
                <p className="text-sm sm:text-base font-medium text-muted-foreground uppercase tracking-[0.2em]">
                  Той иелері
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-6 sm:w-10 bg-border" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="h-px w-6 sm:w-10 bg-border" />
                </div>
                <p className="text-2xl sm:text-3xl font-serif text-foreground drop-shadow-sm pt-2">
                  {config.parentGroom || "Ата-аналардың есімдері"}
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
                <div className="w-16 sm:w-24 h-[1px] bg-border" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- ИНДИКАТОР ПРОКРУТКИ --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-2 mt-auto pt-8 mb-10 w-full"
        >
          <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">
            Төмен жылжытыңыз
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 text-primary drop-shadow-md mx-auto" />
          </motion.div>

          {/* base_divider.PNG (после стрелочки). Путь исправлен, размер увеличен (mt-4 w-full max-w-[120px] sm:max-w-[160px]) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-4 w-full max-w-[400px] sm:max-w-[300px]"
          >
            <img 
              src="/images/base_divider.PNG" 
              alt="Bottom Decoration" 
              className="w-full h-auto object-contain mx-auto opacity-90"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ==================== ВТОРОЙ ЭКРАН (100vh) ==================== */}
      <div className="flex flex-col items-center justify-start px-4 pt-12 pb-20 text-center relative z-10 w-full max-w-4xl mx-auto">
        {/* --- БЛОК 3: ИНФОРМАЦИОННАЯ КАРТОЧКА --- */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md mx-auto shadow-xl rounded-2xl w-full"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-lg rounded-2xl" />

          <div className="relative px-4 sm:px-8 py-8 sm:py-10 rounded-2xl border border-border">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
              <div className="w-20 sm:w-32 h-[1px] bg-border" />
            </div>

            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium text-sm sm:text-base">
                    {formatEventDate(config.date, "full")}
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium text-sm sm:text-base">
                    {config.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
              <div className="w-20 sm:w-32 h-[1px] bg-border" />
            </div>
          </div>
        </motion.div>

        {/* --- ОБНОВЛЕННЫЙ ТАЙМЕР --- */}
        {/* Добавили mt-8 вместо mt-12 внутри самого компонента, чтобы контролировать привязку */}
        <div className="w-full mt-8">
          <CountdownTimer targetDate={config.date} />
        </div>

        {/* Декоративное сердце снизу уходит в flex-grow, чтобы быть внизу, но не слишком далеко */}
        <div className="mt-auto pt-12 pb-4">
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
            <Heart
              className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto drop-shadow-md"
              fill="currentColor"
            />
          </motion.div>
        </div>

      </div>

      
    </section>
  );
}