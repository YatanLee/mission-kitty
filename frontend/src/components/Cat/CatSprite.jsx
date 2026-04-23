import { motion } from "framer-motion";

// Pure CSS pixel-art black cat — no image assets needed
// Each cat state has a different animation

const states = {
  sad: { emoji: "😿", label: "Sad", color: "text-blue-400", anim: "animate-pulse" },
  idle: { emoji: "🐱", label: "Idle", color: "text-gray-300", anim: "" },
  content: { emoji: "😺", label: "Content", color: "text-green-300", anim: "animate-float" },
  happy: { emoji: "😸", label: "Happy", color: "text-yellow-300", anim: "animate-float" },
  celebrating: { emoji: "🎉", label: "Celebrating", color: "text-kitty-gold", anim: "animate-wiggle" },
};

export default function CatSprite({ state = "idle" }) {
  const s = states[state] || states.idle;

  return (
    <motion.div
      key={state}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-2"
    >
      {/* Pixel art cat using CSS */}
      <div className={`text-8xl select-none ${s.anim}`} role="img" aria-label={`Cat is ${s.label}`}>
        {s.emoji}
      </div>

      {state === "celebrating" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-1 text-2xl"
        >
          🐟✨🎊
        </motion.div>
      )}
    </motion.div>
  );
}
