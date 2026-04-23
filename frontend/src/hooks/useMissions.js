import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { useLanguage } from "../contexts/LanguageContext";
import toast from "react-hot-toast";

export function useMissions() {
  const { t } = useLanguage();
  const [missions, setMissions] = useState([]);
  const [catState, setCatState] = useState({ happiness: 0, state: "idle", streak: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [{ missions: m }, cat] = await Promise.all([
        api.getMissions(),
        api.getCatState(),
      ]);
      setMissions(m || []);
      setCatState(cat);
    } catch {
      toast.error(t.toast.loadError);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const completeMission = useCallback(async (id, isDone) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_done_today: isDone } : m))
    );
    try {
      await api.updateMission(id, { is_done_today: isDone });
      const cat = await api.getCatState();
      setCatState(cat);
      if (isDone) toast.success(t.toast.missionDone);
    } catch {
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_done_today: !isDone } : m))
      );
    }
  }, [t]);

  const addMission = useCallback(async (data) => {
    try {
      const mission = await api.createMission(data);
      setMissions((prev) => [mission, ...prev]);
      toast.success(t.toast.missionAdded);
      return mission;
    } catch {
      toast.error(t.toast.loadError);
    }
  }, [t]);

  const removeMission = useCallback(async (id) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    await api.deleteMission(id);
  }, []);

  return { missions, catState, loading, fetchAll, completeMission, addMission, removeMission };
}
