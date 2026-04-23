import { motion } from "framer-motion";
import { getWeekDays, isMissionDueOn, sameDay } from "../../lib/schedule";
import { useLanguage } from "../../contexts/LanguageContext";

const CATEGORY_ICONS = { health: "💪", work: "💼", personal: "✨", custom: "📌" };

export default function WeekView({ missions }) {
  const { t } = useLanguage();
  const today = new Date();
  const days = getWeekDays(today);

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="grid grid-cols-7 gap-1 min-w-[480px]">
        {/* Day headers */}
        {days.map((day, i) => {
          const isToday = sameDay(day, today);
          return (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {t.schedule.dayNames[i]}
              </span>
              <span className={`text-sm font-bold mt-0.5 w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? "bg-kitty-accent text-white" : "text-gray-300"
              }`}>
                {day.getDate()}
              </span>
            </div>
          );
        })}

        {/* Mission dots per day */}
        {days.map((day, i) => {
          const due = missions.filter((m) => isMissionDueOn(m, day));
          const isToday = sameDay(day, today);
          return (
            <motion.div
              key={`cell-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`min-h-[80px] rounded-xl p-1.5 space-y-1 ${
                isToday ? "bg-kitty-card/60 border border-kitty-accent/30" : "bg-kitty-mid/40"
              }`}
            >
              {due.length === 0 ? (
                <span className="text-gray-700 text-xs flex justify-center mt-2">—</span>
              ) : (
                due.map((m) => (
                  <div
                    key={m.id}
                    title={m.title}
                    className={`text-center text-base leading-none ${
                      m.is_done_today && isToday ? "opacity-40" : ""
                    }`}
                  >
                    {CATEGORY_ICONS[m.category] || "📌"}
                  </div>
                ))
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-3 flex-wrap justify-center">
        {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
          <span key={cat} className="text-xs text-gray-500">
            {icon} {t.missionForm.categories[cat]}
          </span>
        ))}
      </div>
    </div>
  );
}
