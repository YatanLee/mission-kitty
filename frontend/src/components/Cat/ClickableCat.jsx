import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REACTIONS = ["🐟", "❤️", "✨", "⭐", "💕", "🎉", "🐾"];

function Eyes({ eyeState }) {
  const L = { cx: 50, cy: 50 };
  const R = { cx: 70, cy: 50 };

  if (eyeState === "clicked") {
    return (
      <>
        <text x={L.cx - 7} y={L.cy + 5} fontSize="13" fill="#f43f5e">♥</text>
        <text x={R.cx - 5} y={R.cy + 5} fontSize="13" fill="#f43f5e">♥</text>
      </>
    );
  }
  if (eyeState === "happy" || eyeState === "celebrating") {
    return (
      <>
        <path d={`M ${L.cx - 6},${L.cy + 3} Q ${L.cx},${L.cy - 5} ${L.cx + 6},${L.cy + 3}`}
          stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d={`M ${R.cx - 6},${R.cy + 3} Q ${R.cx},${R.cy - 5} ${R.cx + 6},${R.cy + 3}`}
          stroke="#4ade80" strokeWidth="3" strokeLinecap="round" fill="none" />
        {eyeState === "celebrating" && (
          <>
            <text x={L.cx - 6} y={L.cy - 4} fontSize="9" fill="#fbbf24">✦</text>
            <text x={R.cx - 4} y={R.cy - 4} fontSize="9" fill="#fbbf24">✦</text>
          </>
        )}
      </>
    );
  }
  if (eyeState === "sad") {
    return (
      <>
        <ellipse cx={L.cx} cy={L.cy + 2} rx="5" ry="4" fill="#4ade80" />
        <circle cx={L.cx} cy={L.cy + 2} r="2.8" fill="#0a0a0a" />
        <circle cx={L.cx + 1} cy={L.cy} r="0.9" fill="white" />
        <ellipse cx={R.cx} cy={R.cy + 2} rx="5" ry="4" fill="#4ade80" />
        <circle cx={R.cx} cy={R.cy + 2} r="2.8" fill="#0a0a0a" />
        <circle cx={R.cx + 1} cy={R.cy} r="0.9" fill="white" />
        {/* sad brows */}
        <path d={`M ${L.cx - 4},${L.cy - 5} Q ${L.cx},${L.cy - 3} ${L.cx + 4},${L.cy - 6}`}
          stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d={`M ${R.cx - 4},${R.cy - 6} Q ${R.cx},${R.cy - 3} ${R.cx + 4},${R.cy - 5}`}
          stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (eyeState === "content") {
    return (
      <>
        <ellipse cx={L.cx} cy={L.cy} rx="6" ry="3" fill="#4ade80" />
        <ellipse cx={L.cx} cy={L.cy} rx="3.8" ry="2" fill="#0a0a0a" />
        <circle cx={L.cx + 1} cy={L.cy - 0.5} r="0.7" fill="white" />
        <ellipse cx={R.cx} cy={R.cy} rx="6" ry="3" fill="#4ade80" />
        <ellipse cx={R.cx} cy={R.cy} rx="3.8" ry="2" fill="#0a0a0a" />
        <circle cx={R.cx + 1} cy={R.cy - 0.5} r="0.7" fill="white" />
      </>
    );
  }
  // idle / default
  return (
    <>
      <ellipse cx={L.cx} cy={L.cy} rx="6" ry="7" fill="#4ade80" />
      <circle cx={L.cx} cy={L.cy} r="4" fill="#0a0a0a" />
      <circle cx={L.cx + 1.5} cy={L.cy - 2} r="1.3" fill="white" />
      <ellipse cx={R.cx} cy={R.cy} rx="6" ry="7" fill="#4ade80" />
      <circle cx={R.cx} cy={R.cy} r="4" fill="#0a0a0a" />
      <circle cx={R.cx + 1.5} cy={R.cy - 2} r="1.3" fill="white" />
    </>
  );
}

function BlackCatSVG({ state, isClicked }) {
  const eyeState = isClicked ? "clicked" : state;

  return (
    <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-2xl" aria-label="Black cat">
      {/* Left ear */}
      <polygon points="28,42 18,14 46,34" fill="#111" />
      <polygon points="31,40 23,18 43,33" fill="#f9a8d4" opacity="0.9" />
      {/* Right ear */}
      <polygon points="92,42 102,14 74,34" fill="#111" />
      <polygon points="89,40 97,18 77,33" fill="#f9a8d4" opacity="0.9" />
      {/* Head */}
      <circle cx="60" cy="52" r="28" fill="#111" />
      {/* Body */}
      <ellipse cx="60" cy="100" rx="26" ry="28" fill="#111" />
      {/* Front paws */}
      <ellipse cx="44" cy="123" rx="12" ry="7" fill="#111" />
      <ellipse cx="76" cy="123" rx="12" ry="7" fill="#111" />
      {/* Tail — wraps around right side */}
      <path d="M 83,112 Q 110,95 108,74 Q 106,60 88,62"
        stroke="#111" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* Tail tip slightly lighter */}
      <circle cx="88" cy="62" r="4.5" fill="#1a1a1a" />

      {/* Eyes */}
      <Eyes eyeState={eyeState} />

      {/* Nose */}
      <polygon points="60,59 56,64 64,64" fill="#f9a8d4" />
      {/* Mouth */}
      <path d="M 56,64 Q 60,68 64,64" stroke="#444" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Whiskers left */}
      <line x1="24" y1="60" x2="50" y2="60" stroke="#777" strokeWidth="0.9" opacity="0.5" />
      <line x1="24" y1="65" x2="50" y2="65" stroke="#777" strokeWidth="0.9" opacity="0.5" />
      {/* Whiskers right */}
      <line x1="70" y1="60" x2="96" y2="60" stroke="#777" strokeWidth="0.9" opacity="0.5" />
      <line x1="70" y1="65" x2="96" y2="65" stroke="#777" strokeWidth="0.9" opacity="0.5" />
    </svg>
  );
}

let particleId = 0;

export default function ClickableCat({ state = "idle" }) {
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = useCallback(() => {
    // Spawn 4 random reaction emojis
    const newParticles = Array.from({ length: 4 }, () => ({
      id: ++particleId,
      emoji: REACTIONS[Math.floor(Math.random() * REACTIONS.length)],
      x: (Math.random() - 0.5) * 90,
    }));
    setParticles((p) => [...p, ...newParticles]);

    // Heart eyes for 900 ms
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 900);

    // Remove particles after animation
    const ids = newParticles.map((p) => p.id);
    setTimeout(() => setParticles((p) => p.filter((x) => !ids.includes(x.id))), 1400);
  }, []);

  return (
    <div className="relative flex justify-center items-center select-none" style={{ width: 130, height: 130 }}>
      {/* Cat */}
      <motion.div
        onClick={handleClick}
        whileTap={{ scale: 0.88, rotate: [-3, 3, -2, 0] }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-full h-full cursor-pointer"
        title="Pet me! 🐾"
      >
        <BlackCatSVG state={state} isClicked={isClicked} />
      </motion.div>

      {/* Floating reaction particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ y: 0, x: p.x, opacity: 1, scale: 0.8 }}
            animate={{ y: -90, opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-2xl pointer-events-none"
            style={{ bottom: "40%" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
