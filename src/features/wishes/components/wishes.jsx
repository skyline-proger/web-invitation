import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Marquee from "@/components/ui/marquee";
import {
  Calendar,
  Clock,
  ChevronDown,
  User,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatEventDate } from "@/lib/format-event-date";
import { useInvitation } from "@/features/invitation";
import { fetchWishes, createWish, checkWishSubmitted } from "@/services/api";
import { getGuestName } from "@/lib/invitation-storage";

export default function Wishes() {
  const { uid } = useInvitation();
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isNameFromInvitation, setIsNameFromInvitation] = useState(false);
  const [hasSubmittedWish, setHasSubmittedWish] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWish, setSelectedWish] = useState(null);

  useEffect(() => {
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameFromInvitation(true);
    }
  }, []);

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (uid && guestName && isNameFromInvitation) {
        try {
          const response = await checkWishSubmitted(uid, guestName);
          if (response.success && response.hasSubmitted) {
            setHasSubmittedWish(true);
          }
        } catch (error) {
          console.error("Error checking wish status:", error);
        }
      }
    };
    checkSubmissionStatus();
  }, [uid, guestName, isNameFromInvitation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    { value: "ATTENDING", label: "Иә, мен келемін" },
    { value: "NOT_ATTENDING", label: "Жоқ, мен келе алмаймын" },
    { value: "MAYBE", label: "Қалай болса да, кейін растаймын" },
  ];

  const { data: wishes = [], isLoading, error } = useQuery({
    queryKey: ["wishes", uid],
    queryFn: async () => {
      const response = await fetchWishes(uid);
      if (response) return response;
      throw new Error("Failed to load wishes");
    },
    enabled: !!uid,
    staleTime: 30 * 1000,
  });

  const createWishMutation = useMutation({
    mutationFn: (wishData) => createWish(uid, wishData),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.setQueryData(["wishes", uid], (old = []) => [response.data, ...old]);
        setNewWish("");
        setAttendance("");
        setHasSubmittedWish(true);
        setErrorMessage("");
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    },
    onError: (err) => {
      if (err.code === "DUPLICATE_WISH" || err.message.includes("already submitted")) {
        setHasSubmittedWish(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Хабарлама жіберу сәтсіз. Қайта көрініңіз.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    },
  });

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!newWish.trim() || !guestName.trim()) return;
    if (!uid) {
      setErrorMessage("Шақыру табылмады. Өтінем URL-ыңызды тексеріңіз.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    setErrorMessage("");
    createWishMutation.mutate({
      name: guestName.trim(),
      message: newWish.trim(),
      attendance: attendance || "MAYBE",
    });
  };

  const getAttendanceIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "attending":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "not_attending":
      case "not-attending":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <section 
        id="wishes" 
        className="min-h-screen w-screen left-1/2 -translate-x-1/2 relative overflow-hidden flex flex-col items-center justify-center py-20"
      >
        <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ clipPath: 'inset(0 0 0 0)' }}
          >
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'url("/images/wishes_bg.png")',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: 'translateZ(0)',
                willChange: 'transform'
              }}
            />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        {showConfetti && (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <Confetti recycle={false} numberOfPieces={200} colors={['#fff', '#ccc', '#999']} />
          </div>
        )}

        <div className="container mx-auto px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-white/70 font-medium uppercase tracking-[0.3em] text-xs"
            >
              Ең жақсы дұаларыңыз бен тіліктеріңізді жіберіңіз
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-serif text-white tracking-tighter"
            >
              Қонақтар тілегі
            </motion.h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-[1px] w-12 bg-white/20" />
              <MessageCircle className="w-5 h-5 text-white/40" />
              <div className="h-[1px] w-12 bg-white/20" />
            </motion.div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
              </div>
            )}

            {!isLoading && wishes && wishes.length > 0 && (
              <AnimatePresence>
                <Marquee pauseOnHover={true} repeat={2} className="[--duration:60s] py-2">
                  {wishes.map((wish) => (
                    <motion.div
                      key={wish.id}
                      className="group relative w-[300px] h-[160px] mx-4 cursor-pointer"
                      onClick={() => setSelectedWish(wish)}
                      whileHover={{ scale: 1.02 }}
                      style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
                    >
                      {/* Стеклянный эффект для карточки */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl" style={{ zIndex: -1, backfaceVisibility: 'hidden' }} />
                      
                      <div className="relative z-10 h-full p-4 flex flex-col text-white pointer-events-none">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold shadow-sm">
                            {wish.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-xs truncate max-w-[140px] uppercase tracking-wider">
                                {wish.name}
                              </h4>
                              {getAttendanceIcon(wish.attendance)}
                            </div>
                            <div className="flex items-center space-x-1 opacity-50 text-[10px] mt-0.5">
                              <Clock className="w-3 h-3" />
                              <time>{formatEventDate(wish.created_at, "short", true)}</time>
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="opacity-80 text-sm italic leading-relaxed line-clamp-3">
                            "{wish.message}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Marquee>
              </AnimatePresence>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto mt-12 px-4">
            {hasSubmittedWish ? (
              <div className="backdrop-blur-xl bg-white/20 p-10 rounded-3xl border border-white/30 text-center text-white shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h3 className="text-3xl font-serif">Рахмет!</h3>
                <p className="opacity-70 mt-2">Сіздің хабарламаңыз қабылданды.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} className="backdrop-blur-xl bg-white/15 p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2 ml-1">
                      <User className="w-3 h-3" /> Сіздің Атыңыз
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => { setGuestName(e.target.value); setIsNameFromInvitation(false); }}
                      disabled={isNameFromInvitation}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white outline-none focus:bg-white/20 transition-all disabled:opacity-50"
                      required
                    />
                  </div>

                  <div className="space-y-2 relative" ref={dropdownRef}>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2 ml-1">
                      <Calendar className="w-3 h-3" /> Келу статусы
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-left flex justify-between items-center text-sm"
                    >
                      <span className={attendance ? "text-white" : "text-white/40"}>
                        {attendance ? options.find(opt => opt.value === attendance)?.label : "Таңдаңыз..."}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl overflow-hidden py-1">
                          {options.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-xs text-black font-medium"
                              onClick={() => { setAttendance(opt.value); setIsOpen(false); }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2 ml-1">
                      <MessageCircle className="w-3 h-3" /> Тілек сөздері
                    </label>
                    <textarea
                      value={newWish}
                      onChange={(e) => setNewWish(e.target.value)}
                      className="w-full h-32 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white outline-none focus:bg-white/20 transition-all resize-none text-sm"
                      required
                    />
                  </div>

                  {errorMessage && <p className="text-red-300 text-xs text-center">{errorMessage}</p>}

                  <button
                    type="submit"
                    disabled={createWishMutation.isPending}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl"
                  >
                    {createWishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Жіберу
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
{/* Footer Section */}
      <footer className="w-screen left-1/2 -translate-x-1/2 relative z-10 bg-black py-8 pb-32 flex flex-col items-center justify-center border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-light">
            Invitation by
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10" />
        </div>
        
        <a 
          href="https://github.com/skyline-proger" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col items-center"
        >
          <span className="text-sm tracking-[0.2em] font-serif italic text-white/40 group-hover:text-white transition-all duration-700">
            skyline-proger
          </span>
          {/* Маленькая точка-индикатор под ником */}
          <motion.div 
            className="w-1 h-1 bg-white/40 rounded-full mt-2"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </a>
      </footer>

      <AnimatePresence>
        {selectedWish && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedWish(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl text-black"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-serif mx-auto">
                  {selectedWish.name[0].toUpperCase()}
                </div>
                <h3 className="text-3xl font-serif uppercase tracking-tight">{selectedWish.name}</h3>
                <p className="text-lg leading-relaxed font-light italic text-gray-700">"{selectedWish.message}"</p>
                <button 
                  onClick={() => setSelectedWish(null)}
                  className="px-10 py-3 bg-black text-white rounded-full text-[10px] uppercase tracking-widest font-bold"
                >
                  Жабу
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
