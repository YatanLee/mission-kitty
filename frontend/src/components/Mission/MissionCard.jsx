import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  health: "border-green-500 bg-green-500/10",
  work: "border-blue-500 bg-blue-500/10",
  personal: "border-purple-500 bg-purple-500/10",
  custom: "border-gray-500 bg-gray-500/10",
};

const CATEGORY_ICONS = {
  health: "💪",
  work: "💼",
  personal: "✨",
  custom: "📌",
};

export default function MissionCard({ mission, onToggle, onDelete }) {
  const colorClass = CATEGORY_COLORS[mission.category] || CATEGORY_COLORS.custom;
  const icon = CATEGORY_ICONS[mission.category] || "📌";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`rounded-xl border p-4 flex items-center gap-3 ${colorClass} ${
        mission.is_done_today ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(mission.id, !mission.is_done_today)}
        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          mission.is_done_today
            ? "bg-kitty-gold border-kitty-gold text-black"
            : "border-gray-500 hover:border-kitty-gold"
        }`}
        aria-label="Toggle mission"
      >
        {mission.is_done_today && "✓"}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <p className={`font-medium truncate ${mission.is_done_today ? "line-through text-gray-500" : ""}`}>
            {mission.title}
          </p>
        </div>
        {mission.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{mission.description}</p>
        )}
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-gray-500 capitalize">{mission.frequency}</span>
          {mission.streak > 0 && (
            <span className="text-xs text-kitty-gold">🔥 {mission.streak}</span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(mission.id)}
        className="text-gray-600 hover:text-kitty-accent text-lg flex-shrink-0"
        aria-label="Delete mission"
      >
        ×
      </button>
    </motion.div>
  );
}
