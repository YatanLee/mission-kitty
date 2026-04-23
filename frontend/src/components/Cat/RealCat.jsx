import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REACTIONS = ["🐟", "❤️", "✨", "⭐", "💕", "🎉", "🐾", "😻"];

// CSS filter per emotional state
const STATE_FILTER = {
  sad:         "grayscale(35%) brightness(0.75) saturate(0.5)",
  idle:        "brightness(1) saturate(1)",
  content:     "brightness(1.08) saturate(1.15)",
  happy:       "brightness(1.18) saturate(1.4)",
  celebrating: "brightness(1.3) saturate(1.6)",
};

// Glow ring color per state
const STATE_GLOW = {
  sad:         "0 0 20px rgba(96,165,250,0.4)",
  idle:        "0 0 15px rgba(139,92,246,0.4)",
  content:     "0 0 20px rgba(74,222,128,0.5)",
  happy:       "0 0 28px rgba(245,166,35,0.7)",
  celebrating: "0 0 36px rgba(245,166,35,1), 0 0 60px rgba(233,69,96,0.6)",
};

// Small badge shown on the photo
const STATE_BADGE = {
  sad: "😿", idle: null, content: "😺", happy: "😸", celebrating: "🎉",
};

let particleId = 0;

export default function RealCat({ state = "idle" }) {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = useCallback(() => {
    const newParticles = Array.from({ length: 5 }, () => ({
      id: ++particleId,
      emoji: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
      x: (Math.random() - 0.5) * 120,
      rot: (Math.random() - 0.5) * 40,
    }));
    setParticles((p) => [...p, ...newParticles]);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 900);
    const ids = newParticles.map((p) => p.id);
    setTimeout(() => setParticles((p) => p.filter((x) => !ids.includes(x.id))), 1500);
  }, []);

  const currentFilter = STATE_FILTER[isClicked ? "celebrating" : state] || STATE_FILTER.idle;
  const currentGlow   = STATE_GLOW[isClicked ? "celebrating" : state]   || STATE_GLOW.idle;
  const badge         = isClicked ? "❤️" : STATE_BADGE[state];

  return (
    <div className="relative flex justify-center items-center select-none" style={{ width: 148, height: 148 }}>
      {/* Cat photo */}
      <motion.div
        onClick={handleClick}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="cursor-pointer relative"
        style={{ width: 148, height: 148 }}
        title="Pet me! 🐾"
      >
        {/* Glow ring — animates per state */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ boxShadow: currentGlow }}
          transition={{ duration: 0.6 }}
        />

        <motion.img
          src="/kitty.jpg"
          alt="Mission Kitty"
          className="w-full h-full object-cover rounded-full border-[3px] border-kitty-purple"
          animate={{ filter: currentFilter }}
          transition={{ duration: 0.5 }}
          style={{ objectPosition: "center 20%" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {/* State badge — bottom-right of photo */}
        <AnimatePresence>
          {badge && (
            <motion.span
              key={badge}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute bottom-1 right-1 text-xl drop-shadow-lg pointer-events-none"
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating reaction particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ y: 0, x: p.x, opacity: 1, scale: 0.8, rotate: p.rot }}
            animate={{ y: -100, opacity: 0, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none z-10"
            style={{ bottom: "45%" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
