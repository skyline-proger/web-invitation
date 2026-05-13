import EventCards from "@/features/events/components/events-card";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Events() {
  const config = useConfig(); 

  return (
    <>
      <section id="event" className="relative w-screen left-1/2 -translate-x-1/2">
        {/* Анимированный фон, который плавно перетекает в черный */}
        <motion.div
    // Вместо переменных используем HEX-коды для анимации
        initial={{ backgroundColor: "var(--background)" }}
        whileInView={{ backgroundColor: "#000000" }} // Явный черный для инверсии
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
          className="inverted-section min-h-screen w-screen relative overflow-hidden"
        >
          {/* Декоративный градиент сверху для мягкого перехода */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent opacity-100 z-20" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-4 py-24"
          >
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 mb-16"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-block text-primary font-medium mb-2 uppercase tracking-[0.2em] text-xs opacity-80"
              >
                Бұл Маңызды Күнді Есте Сақтаңыз
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-serif text-foreground leading-tight tracking-tight"
              >
                Той Іс-Әрекеттерінің Тізбелеуі
              </motion.h2>

              {/* Decorative Line с анимацией ширины */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 1 }}
                className="flex items-center justify-center gap-6 mt-8"
              >
                <div className="h-[1px] w-16 bg-gradient-to-l from-primary to-transparent opacity-30" />
                <div className="text-primary">
                  <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
                </div>
                <div className="h-[1px] w-16 bg-gradient-to-r from-primary to-transparent opacity-30" />
              </motion.div>
            </motion.div>

            {/* Events Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <EventCards events={config.agenda} />
            </motion.div>
          </motion.div>

          {/* Декоративный градиент снизу для возврата к белому */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent opacity-100 z-20" />
        </motion.div>
      </section>
    </>
  );
}