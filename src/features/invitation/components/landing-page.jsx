import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig();

  return (
    <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen relative overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: "url('/images/landing_bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            /* No fixed attachment needed since it doesn't scroll! */
          }}
        >

      {/* ЕДИНАЯ ПАНОРАМНАЯ ЛЕНТА */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="w-full relative z-10"
      >
        {/* Стеклянный фон от края до края */}
        <div className="backdrop-blur-2xl bg-white/5 py-12 md:py-20 border-y border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-2xl mx-4">
          <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
            
            {/* 1. Дата и Время */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-8 text-black/70"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium tracking-widest uppercase">
                  {formatEventDate(config.date)}
                </span>
              </div>
              <div className="h-4 w-px bg-black/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium tracking-widest uppercase">
                  {config.time}
                </span>
              </div>
            </motion.div>

            {/* 2. Имена Пары */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mb-12 w-full flex flex-col items-center"
            >
              <h1 className="flex flex-col items-center font-serif text-black leading-[0.9] tracking-tighter">
                <motion.span 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl uppercase"
                >
                  {config.groomName}
                </motion.span>
                
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="text-black/40 font-light italic text-3xl sm:text-5xl md:text-6xl my-2 sm:my-4"
                >
                  &
                </motion.span>
                
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl uppercase"
                >
                  {config.brideName}
                </motion.span>
              </h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ delay: 1.5, duration: 1 }}
                className="h-[1px] bg-black/20 mt-10" 
              />
            </motion.div>

            {/* 3. Кнопка "Открыть" */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full max-w-xs"
            >
              <motion.button
                whileHover={{ scale: 1.05, letterSpacing: "0.3em" }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenInvitation}
                className="w-full py-4 bg-black text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black/90 transition-all duration-500"
              >
                Шақыруды Ашу
              </motion.button>
            </motion.div>
            
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default LandingPage;