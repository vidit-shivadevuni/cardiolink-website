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
        {/* Voice runs in the browser over the mic; it never places a phone call. Text chat is the "Message" button. */}
        {createElement("elevenlabs-convai", {
          "agent-id": "agent_4001m762q675e39v6khaw1b347jn",
          // The current widget reads labels from this JSON; the older *-text attributes are ignored.
          "text-contents": JSON.stringify({
            main_label: "Questions? Ask CardioLink",
            start_call: "Talk by voice",
            start_chat: "Chat with us",
            end_call: "End voice chat",
          }),
        })}
        <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
      </body>
    </html>
  );
}
