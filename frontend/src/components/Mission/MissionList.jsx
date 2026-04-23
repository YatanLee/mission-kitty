import { AnimatePresence } from "framer-motion";
import MissionCard from "./MissionCard";
import { useLanguage } from "../../contexts/LanguageContext";

export default function MissionList({ missions, onToggle, onDelete, onIncrement }) {
  const { t } = useLanguage();
  const daily   = missions.filter((m) => m.frequency === "daily");
  const weekly  = missions.filter((m) => m.frequency === "weekly");
  const monthly = missions.filter((m) => m.frequency === "monthly");
  const custom  = missions.filter((m) => m.frequency === "custom");

  if (missions.length === 0) {
    return (
      <div className="text-center py-14 text-gray-600">
        <p className="text-5xl mb-4">📋</p>
        <p className="text-sm text-gray-400">{t.missionList.empty}</p>
        <p className="text-xs mt-2 text-gray-600">{t.missionList.emptyHint}</p>
      </div>
    );
  }

  const Section = ({ label, items }) => items.length === 0 ? null : (
    <section className="space-y-2">
      <h3 className="text-xs text-gray-600 uppercase tracking-[0.15em] px-1">{label}</h3>
      <AnimatePresence>
        {items.map((m) => (
          <MissionCard key={m.id} mission={m}
            onToggle={onToggle} onDelete={onDelete} onIncrement={onIncrement} />
        ))}
      </AnimatePresence>
    </section>
  );

  return (
    <div className="space-y-5">
      <Section label={t.missionList.daily}   items={daily} />
      <Section label={t.missionList.weekly}  items={weekly} />
      <Section label={t.missionList.monthly} items={monthly} />
      <Section label={t.missionList.custom}  items={custom} />
    </div>
  );
}
