import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { LanguageProvider } from "./contexts/LanguageContext";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-kitty-dark flex items-center justify-center">
        <div className="text-4xl animate-bounce">🐾</div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: "#16213e", color: "#fff", border: "1px solid #0f3460" },
        }}
      />
      {user ? <HomePage /> : <AuthPage />}
    </LanguageProvider>
  );
}
