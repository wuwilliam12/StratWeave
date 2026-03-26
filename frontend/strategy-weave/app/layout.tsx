import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { GraphProvider } from "@/contexts/GraphContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "StratWeave - Gameplans & Strategy Graphs",
  description:
    "Create gameplans and develop skillsets with counters, strategies, and approaches in an interactive strategy graph. ML testing and predictions planned.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Layout stays minimal while app-level nav and shells are page-owned. */}
      <body>
        <GraphProvider>
          {children}
        </GraphProvider>
        <Toaster />
      </body>
    </html>
  );
}
