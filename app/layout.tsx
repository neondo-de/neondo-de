import type { Metadata } from "next";
import "./globals.css";
import "./detail.css";
import "./stagework-home.css";
import "./neondo-logo.css";
import "./logo-overrides.css";
import "./role-emblems.css";
import "./profile-overrides.css";
import "./app-pages.css";
import "./public-profile.css";
import "./settings-completion.css";
import "./theme-preferences.css";
import "./neondo-mobile-fixes.css";
import "./sitewide-theme.css";
import SitePreferences from "@/components/site-preferences";

export const metadata: Metadata = { title:"NEONDO — Global event & creative network", description:"Discover events, connect with people, and find work and creative opportunities across cities worldwide." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<SitePreferences/></body></html>}
