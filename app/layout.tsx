import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { createElement } from "react";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CardioLink – Connected care. Beyond the clinic.",
  description:
    "A remote patient monitoring concept that brings home readings, patient check-ins and care-team review into one cardiology workspace.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        {createElement("elevenlabs-convai", { "agent-id": "agent_4001m762q675e39v6khaw1b347jn" })}
        <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
      </body>
    </html>
  );
}
