import { supabase } from "./supabase";

const BASE = import.meta.env.VITE_API_URL || "";

async function getHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  async getMissions() {
    const res = await fetch(`${BASE}/api/missions`, { headers: await getHeaders() });
    return res.json();
  },

  async getCatState() {
    const res = await fetch(`${BASE}/api/missions/cat-state`, { headers: await getHeaders() });
    return res.json();
  },

  async createMission(data) {
    const res = await fetch(`${BASE}/api/missions`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateMission(id, data) {
    const res = await fetch(`${BASE}/api/missions/${id}`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteMission(id) {
    const res = await fetch(`${BASE}/api/missions/${id}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });
    return res.json();
  },

  async chat(message) {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify({ message }),
    });
    return res.json();
  },
};
