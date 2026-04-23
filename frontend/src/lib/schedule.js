/** Returns true if a mission is due on the given Date */
export function isMissionDueOn(mission, date) {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const created = new Date(mission.created_at);
  created.setHours(0, 0, 0, 0);

  switch (mission.frequency) {
    case "daily":
      return true;
    case "weekly":
      return target.getDay() === created.getDay();
    case "monthly":
      return target.getDate() === created.getDate();
    case "custom": {
      const n = mission.interval_days;
      if (!n || n <= 0) return false;
      const diffDays = Math.round((target - created) / 86400000);
      return diffDays >= 0 && diffDays % n === 0;
    }
    default:
      return false;
  }
}

/** Returns 7 Date objects for the week containing `date` (Mon→Sun) */
export function getWeekDays(date = new Date()) {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dow + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

/** Returns grid cells for a month calendar (always starts on Monday) */
export function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7; // Mon-based

  const cells = [];
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ date: d, currentMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    cells.push({ date: new Date(year, month, i), currentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month + 1, cells.length - startPad - lastDay.getDate() + 1);
    cells.push({ date: d, currentMonth: false });
  }
  return cells;
}

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatRecurrence(mission, t) {
  switch (mission.frequency) {
    case "daily":   return t.missionForm.frequencies.daily;
    case "weekly":  return t.missionForm.frequencies.weekly;
    case "monthly": return t.missionForm.frequencies.monthly;
    case "custom":
      return `${t.missionForm.every} ${mission.interval_days} ${t.missionForm.days}`;
    default: return mission.frequency;
  }
}
