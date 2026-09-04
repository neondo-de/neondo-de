import type { Metadata } from "next";
import "./globals.css";
import "./stagework-home.css";
import "./detail.css";
import "./role-emblems.css";
import "./profile-overrides.css";
import "./app-pages.css";
import "./public-profile.css";
import "./settings-completion.css";
import "./theme-preferences.css";
import "./neondo-mobile-fixes.css";
import SitePreferences from "@/components/site-preferences";

export const metadata: Metadata = {
  title: "NEONDO — Global event & creative network",
  description:
    "Discover events, connect with people, and find work and creative opportunities across cities worldwide.",
};

const themeInitScript = `(() => { try { const saved = localStorage.getItem('neondo-theme'); const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches; const dark = saved === 'dark' || (!saved && prefers); document.documentElement.classList.toggle('neondo-dark', dark); document.documentElement.style.colorScheme = dark ? 'dark' : 'light'; } catch (_) {} })()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <SitePreferences />
      </body>
    </html>
  );
}
