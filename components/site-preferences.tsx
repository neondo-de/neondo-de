"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "de" | "es" | "fr" | "ar" | "zh";

export interface SitePreferencesContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

const SitePreferencesContext = createContext<SitePreferencesContextValue | null>(null);

export function useSitePreferences() {
  const ctx = useContext(SitePreferencesContext);
  if (!ctx) throw new Error("useSitePreferences must be used within SitePreferences");
  return ctx;
}

export default function SitePreferences({ children }: { children?: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("neondo_lang") as Lang | null;
    const storedTheme = localStorage.getItem("neondo_theme") as "light" | "dark" | "system" | null;
    if (storedLang) setLangState(storedLang);
    if (storedTheme) setThemeState(storedTheme);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("neondo_lang", lang);
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const applyTheme = (t: "light" | "dark" | "system") => {
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };
    applyTheme(theme);
    localStorage.setItem("neondo_theme", theme);
  }, [theme, mounted]);

  const setLang = (newLang: Lang) => setLangState(newLang);
  const setTheme = (newTheme: "light" | "dark" | "system") => setThemeState(newTheme);

  return (
    <SitePreferencesContext.Provider value={{ lang, setLang, theme, setTheme }}>
      {children}
    </SitePreferencesContext.Provider>
  );
}
