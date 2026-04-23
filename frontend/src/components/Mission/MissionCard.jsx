import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import { formatRecurrence } from "../../lib/schedule";

const CATEGORY_COLORS = {
  health:   { border: "border-green-500/40",  bg: "bg-green-500/8",   dot: "bg-green-500" },
  work:     { border: "border-blue-500/40",   bg: "bg-blue-500/8",    dot: "bg-blue-500"  },
  personal: { border: "border-purple-400/40", bg: "bg-purple-500/8",  dot: "bg-purple-400"},
  custom:   { border: "border-gray-500/40",   bg: "bg-gray-500/8",    dot: "bg-gray-500"  },
};
const CATEGORY_ICONS = { health: "💪", work: "💼", personal: "✨", custom: "📌" };

export default function MissionCard({ mission, onToggle, onDelete, onIncrement }) {
  const { t } = useLanguage();
  const c = CATEGORY_COLORS[mission.category] || CATEGORY_COLORS.custom;
  const icon = CATEGORY_ICONS[mission.category] || "📌";

  const target    = mission.target_count    || 1;
  const completed = mission.completed_count || 0;
  const isMulti   = target > 1;
  const isDone    = mission.is_done_today || completed >= target;
  const progress  = Math.min(completed / target, 1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className={`rounded-2xl border ${c.border} ${c.bg} p-4 flex items-center gap-3
        backdrop-blur-sm shadow-md ${isDone ? "opacity-55" : ""}`}
    >
      {/* Checkbox / Count button */}
      {isMulti ? (
        <button
          onClick={() => onIncrement(mission.id, Math.min(completed + 1, target))}
          disabled={isDone}
          className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center"
          aria-label="Increment count"
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none"
              stroke={isDone ? "#f5a623" : "#a78bfa"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="94.2"
              animate={{ strokeDashoffset: 94.2 * (1 - progress) }}
              transition={{ duration: 0.4 }}
            />
          </svg>
          <span className={`text-xs font-bold z-10 ${isDone ? "text-kitty-gold" : "text-gray-300"}`}>
            {isDone ? "✓" : `${completed}/${target}`}
          </span>
        </button>
      ) : (
        <button
          onClick={() => onToggle(mission.id, !isDone)}
          className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isDone
              ? "bg-kitty-gold border-kitty-gold text-black font-bold shadow-[0_0_12px_rgba(245,166,35,0.6)]"
              : "border-white/20 hover:border-kitty-gold/60"
          }`}
          aria-label={t.missionCard.toggle}
        >
          {isDone && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>}
        </button>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <p className={`font-semibold text-sm truncate ${isDone ? "line-through text-gray-500" : "text-gray-100"}`}>
            {mission.title}
          </p>
        </div>
        {mission.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{mission.description}</p>
        )}
        {/* Progress bar for multi-count */}
        {isMulti && !isDone && (
          <div className="mt-1.5 w-full bg-black/30 rounded-full h-1">
            <motion.div
              className="h-full rounded-full bg-kitty-purple"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
        <div className="flex gap-2 mt-1 items-center flex-wrap">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
          <span className="text-xs text-gray-600">{formatRecurrence(mission, t)}</span>
          {mission.streak > 0 && (
            <span className="text-xs text-kitty-gold font-medium">🔥 {mission.streak}</span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(mission.id)}
        className="text-gray-700 hover:text-kitty-accent text-xl flex-shrink-0 transition-colors leading-none"
        aria-label={t.missionCard.delete}
      >
        ×
      </button>
    </motion.div>
  );
}
