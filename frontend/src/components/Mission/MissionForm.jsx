import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

const CATEGORIES = ["health", "work", "personal", "custom"];
const FREQUENCIES = ["daily", "weekly", "monthly", "custom"];

export default function MissionForm({ onSubmit, onClose, prefill = {} }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    title:        prefill.title        || "",
    description:  prefill.description  || "",
    category:     prefill.category     || "custom",
    frequency:    prefill.frequency    || "daily",
    interval_days: prefill.interval_days || 3,
    target_count: prefill.target_count  || 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const data = { ...form };
    if (data.frequency !== "custom") delete data.interval_days;
    onSubmit(data);
    onClose();
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 flex items-end justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.form
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-bold text-kitty-gold">{t.missionForm.title}</h2>

        {/* Title */}
        <input autoFocus type="text"
          placeholder={t.missionForm.titlePlaceholder}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-kitty-accent/60"
          required
        />

        {/* Description */}
        <textarea
          placeholder={t.missionForm.descPlaceholder}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-kitty-accent/60 resize-none h-16"
        />

        {/* Category */}
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">{t.missionForm.category}</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" onClick={() => set("category", c)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                  form.category === c
                    ? "bg-kitty-accent text-white shadow-[0_0_12px_rgba(233,69,96,0.5)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>
                {t.missionForm.categories[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">{t.missionForm.frequency}</p>
          <div className="flex gap-2 flex-wrap">
            {FREQUENCIES.map((f) => (
              <button key={f} type="button" onClick={() => set("frequency", f)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all ${
                  form.frequency === f
                    ? "bg-kitty-purple text-white shadow-[0_0_12px_rgba(83,52,131,0.6)]"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}>
                {t.missionForm.frequencies[f]}
              </button>
            ))}
          </div>

          {/* Custom interval */}
          {form.frequency === "custom" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex items-center gap-3">
              <span className="text-sm text-gray-400">{t.missionForm.every}</span>
              <input type="number" min={1} max={365} value={form.interval_days}
                onChange={(e) => set("interval_days", parseInt(e.target.value) || 1)}
                className="w-16 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center outline-none focus:ring-2 focus:ring-kitty-purple/60"
              />
              <span className="text-sm text-gray-400">{t.missionForm.days}</span>
            </motion.div>
          )}
        </div>

        {/* Times per day */}
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">{t.missionForm.timesPerDay}</p>
          <div className="flex items-center gap-3">
            <button type="button"
              onClick={() => set("target_count", Math.max(1, form.target_count - 1))}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white text-lg hover:bg-white/10 transition-colors flex items-center justify-center">
              −
            </button>
            <span className="text-white font-bold text-lg w-8 text-center">{form.target_count}</span>
            <button type="button"
              onClick={() => set("target_count", Math.min(99, form.target_count + 1))}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white text-lg hover:bg-white/10 transition-colors flex items-center justify-center">
              +
            </button>
            <span className="text-xs text-gray-500">{t.missionForm.timesLabel}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
            {t.missionForm.cancel}
          </button>
          <button type="submit"
            className="flex-1 py-3 rounded-xl bg-kitty-accent text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(233,69,96,0.4)]">
            {t.missionForm.add}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
