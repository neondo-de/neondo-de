"use client";

import { useEffect, useState } from "react";
import { useSitePreferences, type Lang } from "@/components/site-preferences";
import Link from "next/link";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Españ±¾©ol" },
  { code: "fr", label: "FranÃ§ais" },
  { code: "ar", label: "Ø§Ù¶Ù¯Ø¹Ø±Ø¨Ù±Ù©Ø©" },
  { code: "zh", label: "ä¹¾­æ¶¾‡" },
];

export default function HomePage() {
  const { lang, setLang } = useSitePreferences();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">NEONDO</h1>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/events" className="hover:underline">Events</Link>
              <Link href="/people" className="hover:underline">People</Link>
              <Link href="/work" className="hover:underline">Work</Link>
            </nav>
            {mounted && (
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Discover whatâ¶¾™s happening</h2>
          <p className="text-gray-600 dark:text-gray-400">Find events, connect with people, and explore creative opportunities worldwide.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
