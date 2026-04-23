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
  const { missions, catState, loading, completeMission, addMission, removeMission, fetchAll } = useMissions();
  const { signOut } = useAuth();
  const { lang, toggle, t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("missions");
  const [scheduleView, setScheduleView] = useState("week"); // "week" | "month"

  return (
    <div className="min-h-screen bg-kitty-dark flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <h1 className="text-kitty-gold font-bold text-lg">{t.header.title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="px-3 py-1 rounded-lg bg-kitty-card text-sm text-gray-300 hover:text-white hover:bg-kitty-purple transition-colors font-medium"
            title="Switch language / 切換語言"
          >
            {lang === "en" ? "繁中" : "EN"}
          </button>
          <button onClick={signOut} className="text-xs text-gray-500 hover:text-gray-300">
            {t.header.signOut}
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {/* Cat Dashboard */}
        <CatDashboard catState={catState} />

        {/* Tabs */}
        <div className="flex bg-kitty-mid rounded-xl p-1 gap-1">
          {TABS.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                tab === tabKey ? "bg-kitty-accent text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {t.tabs[tabKey]}
            </button>
          ))}
        </div>

        {/* Tab: Missions */}
        {tab === "missions" && (
          loading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">{t.missionList.loading}</div>
          ) : (
            <MissionList missions={missions} onToggle={completeMission} onDelete={removeMission} />
          )
        )}

        {/* Tab: Schedule */}
        {tab === "schedule" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Week / Month toggle */}
            <div className="flex bg-kitty-mid rounded-xl p-1 gap-1 w-fit mx-auto">
              {["week", "month"].map((v) => (
                <button
                  key={v}
                  onClick={() => setScheduleView(v)}
                  className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    scheduleView === v ? "bg-kitty-purple text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t.schedule[v]}
                </button>
              ))}
            </div>

            {scheduleView === "week"
              ? <WeekView missions={missions} />
              : <MonthView missions={missions} />
            }
          </motion.div>
        )}

        {/* Tab: Chat */}
        {tab === "chat" && <ChatBox onMissionCreated={fetchAll} />}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-14 h-14 bg-kitty-accent rounded-full text-white text-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label={t.missionForm.title}
        >
          +
        </button>
      </div>

      {/* Mission Form Modal */}
      <AnimatePresence>
        {showForm && (
          <MissionForm onSubmit={addMission} onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
