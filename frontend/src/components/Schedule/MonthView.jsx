import { useState } from "react";
import { motion } from "framer-motion";
import { getMonthGrid, isMissionDueOn, sameDay } from "../../lib/schedule";
import { useLanguage } from "../../contexts/LanguageContext";

export default function MonthView({ missions }) {
  const { t } = useLanguage();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = getMonthGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-kitty-card transition-colors">
          ‹
        </button>
        <span className="font-semibold text-sm text-gray-200">
          {t.schedule.monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-kitty-card transition-colors">
          ›
        </button>
      </div>

      {/* Day name row */}
      <div className="grid grid-cols-7 mb-1">
        {t.schedule.dayNames.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-600 pb-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          const isToday = sameDay(cell.date, today);
          const dueMissions = missions.filter((m) => isMissionDueOn(m, cell.date));
          const doneCount = dueMissions.filter((m) => m.is_done_today && isToday).length;
          const totalCount = dueMissions.length;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.008 }}
              className={`relative rounded-lg p-1 min-h-[44px] flex flex-col items-center ${
                !cell.currentMonth ? "opacity-25" : ""
              } ${isToday ? "bg-kitty-card border border-kitty-accent/50" : "bg-kitty-mid/30"}`}
            >
              <span className={`text-xs font-medium ${isToday ? "text-kitty-accent" : "text-gray-400"}`}>
                {cell.date.getDate()}
              </span>

              {/* Mission dots */}
              {totalCount > 0 && (
                <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                  {dueMissions.slice(0, 3).map((m) => (
                    <span
                      key={m.id}
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.is_done_today && isToday ? "bg-kitty-gold" :
                        m.category === "health" ? "bg-green-500" :
                        m.category === "work" ? "bg-blue-500" :
                        m.category === "personal" ? "bg-purple-500" : "bg-gray-500"
                      }`}
                    />
                  ))}
                  {totalCount > 3 && (
                    <span className="text-gray-600 text-xs leading-none">+</span>
                  )}
                </div>
              )}

              {/* Completion badge */}
              {isToday && totalCount > 0 && (
                <span className="text-xs text-kitty-gold leading-none mt-0.5">
                  {doneCount}/{totalCount}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Color legend */}
      <div className="mt-3 flex gap-3 flex-wrap text-xs text-gray-500 justify-center">
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Health</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Work</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" />Personal</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-1" />Custom</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-kitty-gold mr-1" />Done</span>
      </div>
    </div>
  );
}
