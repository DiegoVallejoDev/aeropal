import { useState, useCallback } from "react";
import type { Language } from "../types";

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("aeropal_language");
    return (stored as Language) || "en";
  });

  const toggleLanguage = useCallback(() => {
    setCurrentLanguage((prev) => {
      const newLang: Language = prev === "en" ? "es" : "en";
      localStorage.setItem("aeropal_language", newLang);
      return newLang;
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("aeropal_language", lang);
  }, []);

  return {
    currentLanguage,
    toggleLanguage,
    setLanguage,
  };
}
