import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, CalendarPlus, X, Chrome } from "lucide-react";
import { formatEventDate } from "@/lib/format-event-date";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Фон (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
          />
          
          {/* Контейнер-обертка для центрирования */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 w-full max-w-sm pointer-events-auto"
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const SingleEventCard = ({ eventData, index }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const googleCalendarLink = () => {
    const startDate = new Date(`${eventData.date}T${eventData.startTime}:00`);
    const endDate = new Date(`${eventData.date}T${eventData.endTime}:00`);
    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}&ctz=${eventData.timeZone}`;
  };

  return (
    <div className={`relative flex items-start group mb-16 md:mb-24 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
      {/* Время — теперь висит в воздухе */}
      <div className="hidden md:block w-[42%] px-8 text-right group-odd:text-left">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-serif font-light tracking-tighter text-primary/80"
        >
          {eventData.startTime?.substring(0, 5)}
        </motion.span>
      </div>

      {/* Центральная точка */}
      <div className="relative flex items-center justify-center w-4 h-4 mt-2 md:mt-4 z-10 shrink-0 
        absolute left-4 md:left-1/2 -translate-x-1/2">
        <div className="w-full h-full rounded-full bg-primary animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full border border-primary/20 scale-150" />
      </div>

      {/* Контент — БЕЗ БЛОКА (прозрачный фон) */}
      <motion.div
        className="w-full pl-12 md:pl-0 md:w-[42%] md:px-8"
        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-2 md:hidden">
          <span className="text-2xl font-serif font-bold text-primary">
            {eventData.startTime?.substring(0, 5)}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3 leading-tight tracking-wide">
          {eventData.title.split(" - ")[0]}
        </h3>

        <div className="flex flex-col space-y-3">
          <div className="flex items-start space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
            <span className="text-sm md:text-base leading-snug">{eventData.location}</span>
          </div>
          
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors w-fit"
          >
            <CalendarPlus className="w-4 h-4" />
            Күнтізбеге қосу
          </button>
        </div>
      </motion.div>

      <Modal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Күнтізбе</h3>
            <button onClick={() => setShowCalendarModal(false)}><X /></button>
          </div>
          <button 
            onClick={() => window.open(googleCalendarLink(), "_blank")}
            className="w-full p-4 border border-black rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-black hover:text-white transition-all"
          >
            <Chrome className="w-5 h-5" /> Google Calendar
          </button>
        </div>
      </Modal>
    </div>
  );
};

const EventCards = ({ events }) => {
  return (
    <div className="relative max-w-5xl mx-auto py-10">
      {/* Тонкая элегантная линия */}
      <div className="absolute left-[1.125rem] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/40 to-transparent md:left-1/2" />
      
      <div className="relative">
        {events.map((event, index) => (
          <SingleEventCard key={index} eventData={event} index={index} />
        ))}
      </div>
    </div>
  );
};

export default EventCards;