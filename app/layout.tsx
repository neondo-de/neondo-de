import type { Metadata } from "next";
import "./globals.css";
import "./detail.css";

export const metadata: Metadata = { title:"NEONDO — Berlin's event crew network", description:"Connect event professionals, crews and opportunities across Berlin." };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
