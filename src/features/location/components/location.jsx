import { useConfig } from "@/features/invitation/hooks/use-config";
import { Clock, MapPin, CalendarCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { formatEventDate } from "@/lib/format-event-date";

export default function Location() {
  const config = useConfig(); 

  return (
    <>
      {/* Location section */}
      <section id="location" className="min-h-screen relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              // Заменили text-rose-500 на text-primary (черный)
              className="inline-block text-primary font-medium uppercase tracking-widest text-sm"
            >
              Іс-Әрекеттің Орны
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-foreground"
            >
              Орны
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              {/* Заменили bg-rose-200 на bg-border */}
              <div className="h-[1px] w-12 bg-border" />
              {/* Иконка теперь text-primary */}
              <MapPin className="w-5 h-5 text-primary" />
              <div className="h-[1px] w-12 bg-border" />
            </motion.div>
          </motion.div>

          {/* Location Content */}
          <div className="max-w-6xl mx-auto grid md:grid-row-2 gap-8 items-center">
            {/* Map Container */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              // Поменяли границу на border и добавили легкий фон
              className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border-4 border-border bg-muted"
            >
              <iframe
                src={config.maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </motion.div>

            {/* Venue Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Карточка теперь bg-background с нашей границей */}
              <div className="bg-background rounded-2xl p-8 shadow-sm border border-border">
                <h3 className="text-2xl font-serif text-foreground mb-6 uppercase tracking-tight">
                  {config.location}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    {/* Все иконки в text-primary */}
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <p className="text-muted-foreground flex-1">{config.address}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    <p className="text-muted-foreground">
                      {formatEventDate(config.date)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <p className="text-muted-foreground">{config.time}</p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <motion.a
                      href={config.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      viewport={{ once: true }}
                      // Кнопка в стиле аутлайн: белая с черной границей
                      className="w-full flex items-center justify-center gap-1.5 bg-background text-primary px-4 py-3 rounded-lg border border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm font-bold uppercase tracking-widest"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Картаны көру</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}