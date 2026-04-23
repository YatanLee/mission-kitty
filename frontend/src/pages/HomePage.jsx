import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CatDashboard from "../components/Cat/CatDashboard";
import MissionList from "../components/Mission/MissionList";
import MissionForm from "../components/Mission/MissionForm";
import ChatBox from "../components/Chat/ChatBox";
import WeekView from "../components/Schedule/WeekView";
import MonthView from "../components/Schedule/MonthView";
import { useMissions } from "../hooks/useMissions";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../contexts/LanguageContext";

const TABS = ["missions", "schedule", "chat"];

export default function HomePage() {
  const { missions, catState, loading, completeMission, incrementMission, addMission, removeMission, fetchAll } = useMissions();
  const { signOut } = useAuth();
  const { lang, toggle, t } = useLanguage();
  const [showForm, setShowForm]       = useState(false);
  const [tab, setTab]                 = useState("missions");
  const [scheduleView, setScheduleView] = useState("week");

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-8 pb-3 sticky top-0 z-20 bg-transparent">
        <h1 className="text-kitty-gold font-bold text-lg neon-gold tracking-wide">{t.header.title}</h1>
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="px-3 py-1.5 rounded-xl glass text-xs text-gray-300 hover:text-white transition-colors font-medium border border-white/10">
            {lang === "en" ? "繁中" : "EN"}
          </button>
          <button onClick={signOut} className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
            {t.header.signOut}
          </button>
        </div>
      </header>

      {/* Main scroll area */}
      <main className="flex-1 overflow-y-auto px-4 pb-28 space-y-4">
        {/* Cat */}
        <CatDashboard catState={catState} />

        {/* Tabs */}
        <div className="glass rounded-2xl p-1 flex gap-1">
          {TABS.map((tabKey) => (
            <button key={tabKey} onClick={() => setTab(tabKey)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                tab === tabKey
                  ? "bg-kitty-accent text-white shadow-[0_0_14px_rgba(233,69,96,0.45)]"
                  : "text-gray-500 hover:text-gray-300"
              }`}>
              {t.tabs[tabKey]}
            </button>
          ))}
        </div>

        {/* Tab: Missions */}
        {tab === "missions" && (
          loading
            ? <div className="text-center py-14 text-gray-600 animate-pulse">{t.missionList.loading}</div>
            : <MissionList missions={missions} onToggle={completeMission}
                onDelete={removeMission} onIncrement={incrementMission} />
        )}

        {/* Tab: Schedule */}
        {tab === "schedule" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="glass rounded-xl p-1 flex gap-1 w-fit mx-auto">
              {["week", "month"].map((v) => (
                <button key={v} onClick={() => setScheduleView(v)}
                  className={`px-6 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    scheduleView === v
                      ? "bg-kitty-purple text-white shadow-[0_0_12px_rgba(83,52,131,0.6)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}>
                  {t.schedule[v]}
                </button>
              ))}
            </div>
            {scheduleView === "week" ? <WeekView missions={missions} /> : <MonthView missions={missions} />}
          </motion.div>
        )}

        {/* Tab: Chat */}
        {tab === "chat" && <ChatBox onMissionCreated={fetchAll} />}
      </main>

      {/* FAB */}
      <div className="fixed bottom-8 right-5 z-30">
        <motion.button
          onClick={() => setShowForm(true)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          className="w-14 h-14 bg-kitty-accent rounded-2xl text-white text-3xl shadow-[0_0_24px_rgba(233,69,96,0.6)] flex items-center justify-center"
          aria-label={t.missionForm.title}
        >
          +
        </motion.button>
      </div>

      {/* Mission Form Modal */}
      <AnimatePresence>
        {showForm && <MissionForm onSubmit={addMission} onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
