import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../contexts/LanguageContext";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const { lang, toggle, t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fn = isLogin ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) toast.error(error.message);
    else if (!isLogin) toast.success(t.auth.confirmEmail);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-kitty-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm space-y-6"
      >
        {/* Language toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggle}
            className="px-3 py-1 rounded-lg bg-kitty-card text-sm text-gray-300 hover:text-white hover:bg-kitty-purple transition-colors font-medium"
          >
            {lang === "en" ? "繁中" : "EN"}
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl">🐱</div>
          <h1 className="text-2xl font-bold text-kitty-gold">Mission Kitty</h1>
          <p className="text-gray-400 text-sm">{t.auth.tagline}</p>
        </div>

        {/* Form */}
        <form onSubmit={handle} className="bg-kitty-mid rounded-2xl p-6 space-y-4">
          <input
            type="email"
            placeholder={t.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-kitty-card rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-kitty-accent"
            required
          />
          <input
            type="password"
            placeholder={t.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-kitty-card rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-kitty-accent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-kitty-accent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t.auth.loading : isLogin ? t.auth.signIn : t.auth.signUp}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-gray-400 text-sm hover:text-white transition-colors"
        >
          {isLogin ? t.auth.toSignUp : t.auth.toSignIn}
        </button>
      </motion.div>
    </div>
  );
}
