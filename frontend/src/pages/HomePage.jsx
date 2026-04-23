import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CatDashboard from "../components/Cat/CatDashboard";
import MissionList from "../components/Mission/MissionList";
import MissionForm from "../components/Mission/MissionForm";
import ChatBox from "../components/Chat/ChatBox";
import { useMissions } from "../hooks/useMissions";
import { useAuth } from "../hooks/useAuth";

const TABS = ["missions", "chat"];

export default function HomePage() {
  const { missions, catState, loading, completeMission, addMission, removeMission, fetchAll } =
    useMissions();
  const { signOut, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("missions");

  return (
    <div className="min-h-screen bg-kitty-dark flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-6 pb-2">
        <h1 className="text-kitty-gold font-bold text-lg">🐾 Mission Kitty</h1>
        <button onClick={signOut} className="text-xs text-gray-500 hover:text-gray-300">
          Sign out
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 space-y-4">
        {/* Cat Dashboard */}
        <CatDashboard catState={catState} />

        {/* Tabs */}
        <div className="flex bg-kitty-mid rounded-xl p-1 gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-kitty-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "missions" ? "📋 Missions" : "💬 Chat"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "missions" ? (
          loading ? (
            <div className="text-center py-10 text-gray-500 animate-pulse">Loading missions...</div>
          ) : (
            <MissionList
              missions={missions}
              onToggle={completeMission}
              onDelete={removeMission}
            />
          )
        ) : (
          <ChatBox onMissionCreated={fetchAll} />
        )}
      </main>

      {/* FAB — Add Mission */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-14 h-14 bg-kitty-accent rounded-full text-white text-2xl shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          aria-label="Add mission"
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
