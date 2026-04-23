import { AnimatePresence } from "framer-motion";
import MissionCard from "./MissionCard";
import { useLanguage } from "../../contexts/LanguageContext";

export default function MissionList({ missions, onToggle, onDelete }) {
  const { t } = useLanguage();
  const today = missions.filter((m) => m.frequency === "daily");
  const weekly = missions.filter((m) => m.frequency === "weekly");

  if (missions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-sm">{t.missionList.empty}</p>
        <p className="text-xs mt-1">{t.missionList.emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {today.length > 0 && (
        <section>
          <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            {t.missionList.daily}
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {today.map((m) => (
                <MissionCard key={m.id} mission={m} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
      {weekly.length > 0 && (
        <section>
          <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            {t.missionList.weekly}
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {weekly.map((m) => (
                <MissionCard key={m.id} mission={m} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
    </div>
  );
}
