import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEONDO — Berlin's event crew network",
  description: "Connect event professionals, crews and opportunities across Berlin.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
