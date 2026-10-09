import { useCallback, useState } from "react";
import type { Lang } from "../types";
import { LANG_KEY, readPref, writePref } from "../lib/storage";

export function useLanguage() {
  const [lang, setLang] = useState<Lang>(() =>
    readPref(LANG_KEY, "en") === "es" ? "es" : "en"
  );

  const setLanguage = useCallback((next: Lang) => {
    setLang(next);
    writePref(LANG_KEY, next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "es" : "en";
      writePref(LANG_KEY, next);
      return next;
    });
  }, []);

  return { lang, setLanguage, toggleLanguage };
}
