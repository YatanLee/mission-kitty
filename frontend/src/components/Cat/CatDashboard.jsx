import { motion } from "framer-motion";
import RealCat from "./RealCat";
import { useLanguage } from "../../contexts/LanguageContext";

function HappinessBar({ value }) {
  const color =
    value === 100 ? "bg-kitty-gold" :
    value >= 80   ? "bg-green-400" :
    value >= 50   ? "bg-yellow-400" :
    value > 0     ? "bg-orange-400" : "bg-gray-700";

  return (
    <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

export default function CatDashboard({ catState }) {
  const { t } = useLanguage();
  const { happiness = 0, state = "idle", done = 0, total = 0, streak = 0 } = catState;
  const messages = t.cat.states[state] || t.cat.states.idle;
  const msg = messages[Math.floor(Date.now() / 10000) % messages.length];

  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center gap-3 shadow-xl">
      {/* Real cat photo */}
      <RealCat state={state} />

      {/* Speech bubble */}
      <motion.div
        key={msg}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl px-4 py-2.5 text-sm text-center text-gray-200 max-w-xs w-full relative"
      >
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-kitty-card text-base leading-none">▲</span>
        {msg}
      </motion.div>

      {/* Happiness bar */}
      <div className="w-full space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{t.cat.happiness}</span>
          <span className={happiness === 100 ? "text-kitty-gold neon-gold font-bold" : ""}>{happiness}%</span>
        </div>
        <HappinessBar value={happiness} />
      </div>

      {/* Stats row */}
      <div className="flex w-full justify-around pt-1">
        <div className="text-center">
          <p className="text-kitty-gold font-bold text-2xl leading-none">{done}<span className="text-gray-500 text-base">/{total}</span></p>
          <p className="text-xs text-gray-500 mt-1">{t.cat.today}</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-kitty-accent font-bold text-2xl leading-none">{streak} <span className="text-base">🔥</span></p>
          <p className="text-xs text-gray-500 mt-1">{t.cat.streak}</p>
        </div>
      </div>
    </div>
  );
}
