import { useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = ["health", "work", "personal", "custom"];
const FREQUENCIES = ["daily", "weekly"];

export default function MissionForm({ onSubmit, onClose, prefill = {} }) {
  const [form, setForm] = useState({
    title: prefill.title || "",
    description: prefill.description || "",
    category: prefill.category || "custom",
    frequency: prefill.frequency || "daily",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.form
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onSubmit={handleSubmit}
        className="bg-kitty-mid rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-bold text-kitty-gold">New Mission 🐾</h2>

        <input
          autoFocus
          type="text"
          placeholder="What's the mission?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-kitty-card rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-kitty-accent"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-kitty-card rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-kitty-accent resize-none h-20"
        />

        {/* Category */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, category: c })}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  form.category === c
                    ? "bg-kitty-accent text-white"
                    : "bg-kitty-card text-gray-400 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Frequency</p>
          <div className="flex gap-2">
            {FREQUENCIES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setForm({ ...form, frequency: f })}
                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                  form.frequency === f
                    ? "bg-kitty-purple text-white"
                    : "bg-kitty-card text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-kitty-card text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-kitty-accent text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Add Mission
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
