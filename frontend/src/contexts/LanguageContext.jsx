import { createContext, useContext, useState } from "react";
import { translations } from "../lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("mk_lang") || "en"
  );

  const toggle = () => {
    const next = lang === "en" ? "zh" : "en";
    setLang(next);
    localStorage.setItem("mk_lang", next);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
