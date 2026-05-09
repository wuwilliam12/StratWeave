import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { GraphProvider } from "@/contexts/GraphContext";
import { SportProvider } from "@/contexts/SportContext";
import { SPORT_IDS, SPORT_STORAGE_KEY } from "@/lib/sports";
import "./globals.css";

export const metadata: Metadata = {
  title: "StratWeave - Gameplans & Strategy Graphs",
  description:
    "Create gameplans and develop skillsets with counters, strategies, and approaches in an interactive strategy graph. ML testing and predictions planned.",
};

const sportBootScript = `(function(){try{var k=${JSON.stringify(SPORT_STORAGE_KEY)};var a=${JSON.stringify([...SPORT_IDS])};var v=localStorage.getItem(k);var i=a.indexOf(v);document.documentElement.setAttribute("data-sport",i>=0?v:a[0]);}catch(e){document.documentElement.setAttribute("data-sport","boxing");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="stratweave-sport-boot" strategy="beforeInteractive">
          {sportBootScript}
        </Script>
        <SportProvider>
          <GraphProvider>{children}</GraphProvider>
        </SportProvider>
        <Toaster />
      </body>
    </html>
  );
}
