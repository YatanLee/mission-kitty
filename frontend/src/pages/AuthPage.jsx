import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
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
    else if (!isLogin) toast.success("Check your email to confirm! 📧");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-kitty-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl">🐱</div>
          <h1 className="text-2xl font-bold text-kitty-gold">Mission Kitty</h1>
          <p className="text-gray-400 text-sm">Complete missions. Make Kitty happy~</p>
        </div>

        {/* Form */}
        <form onSubmit={handle} className="bg-kitty-mid rounded-2xl p-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-kitty-card rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-kitty-accent"
            required
          />
          <input
            type="password"
            placeholder="Password"
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
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-gray-400 text-sm hover:text-white transition-colors"
        >
          {isLogin ? "No account? Sign up here" : "Already have one? Sign in"}
        </button>
      </motion.div>
    </div>
  );
}
