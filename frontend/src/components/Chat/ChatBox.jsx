import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";

export default function ChatBox({ onMissionCreated }) {
  const [messages, setMessages] = useState([
    { role: "kitty", text: "Meow~ I'm Kitty! Tell me a new mission or just chat! 🐾" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await api.chat(text);
      setMessages((prev) => [...prev, { role: "kitty", text: res.message }]);
      if (res.type === "create_mission" && res.mission_created) {
        onMissionCreated?.();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "kitty", text: "Nyaa... something went wrong 😿 Try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-kitty-mid rounded-2xl flex flex-col h-72 border border-kitty-card">
      {/* Header */}
      <div className="px-4 py-3 border-b border-kitty-card flex items-center gap-2">
        <span className="text-lg">🐱</span>
        <span className="text-sm font-semibold text-kitty-gold">Chat with Kitty</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-kitty-accent text-white rounded-br-sm"
                    : "bg-kitty-card text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-kitty-card rounded-2xl px-4 py-2 text-gray-400 text-sm animate-pulse">
              Kitty is thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-kitty-card flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Talk to Kitty..."
          className="flex-1 bg-kitty-card rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="bg-kitty-accent text-white rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </div>
    </div>
  );
}
