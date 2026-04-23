import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export function useMissions() {
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
      toast.error("Meow... couldn't load missions 😿");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const completeMission = useCallback(async (id, isDone) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_done_today: isDone } : m))
    );
    try {
      await api.updateMission(id, { is_done_today: isDone });
      const cat = await api.getCatState();
      setCatState(cat);
      if (isDone) toast.success("Kitty is happy! 🐾");
    } catch {
      // Rollback
      setMissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_done_today: !isDone } : m))
      );
    }
  }, []);

  const addMission = useCallback(async (data) => {
    try {
      const mission = await api.createMission(data);
      setMissions((prev) => [mission, ...prev]);
      toast.success("Mission added! Nyaa~ 😸");
      return mission;
    } catch {
      toast.error("Couldn't add mission 😿");
    }
  }, []);

  const removeMission = useCallback(async (id) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    await api.deleteMission(id);
  }, []);

  return { missions, catState, loading, fetchAll, completeMission, addMission, removeMission };
}
