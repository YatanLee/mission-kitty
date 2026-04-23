import { motion } from "framer-motion";
import CatSprite from "./CatSprite";
import { useLanguage } from "../../contexts/LanguageContext";

function HappinessBar({ value }) {
  const color =
    value === 100 ? "bg-kitty-gold" :
    value >= 80 ? "bg-green-400" :
    value >= 50 ? "bg-yellow-400" :
    value > 0 ? "bg-orange-400" : "bg-gray-600";

  return (
    <div className="w-full bg-kitty-mid rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
    <div className="bg-kitty-mid rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg border border-kitty-card">
      <CatSprite state={state} />

      {/* Speech bubble */}
      <motion.div
        key={msg}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-kitty-card rounded-xl px-4 py-2 text-sm text-center text-gray-200 max-w-xs relative"
      >
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-kitty-card text-lg">▲</span>
        {msg}
      </motion.div>

      {/* Happiness bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{t.cat.happiness}</span>
          <span>{happiness}%</span>
        </div>
        <HappinessBar value={happiness} />
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-center w-full justify-around">
        <div>
          <p className="text-kitty-gold font-bold text-xl">{done}/{total}</p>
          <p className="text-xs text-gray-400">{t.cat.today}</p>
        </div>
        <div>
          <p className="text-kitty-accent font-bold text-xl">{streak}</p>
          <p className="text-xs text-gray-400">{t.cat.streak}</p>
        </div>
      </div>
    </div>
  );
}
