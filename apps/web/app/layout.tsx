import type { Metadata } from "next";
import { Geist_Mono, Source_Sans_3, Montserrat, Outfit, Inter, Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Billy — Lightweight Invoice Editor",
  description:
    "Direct-edit invoices in your browser and export polished PDFs in seconds. No sign-up, no servers, no data leaves your machine.",
};

import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The inline script below sets data-js="1" before hydration; that
      // attribute is intentionally absent from the server HTML.
      suppressHydrationWarning
      className={`${sourceSans.variable} ${montserrat.variable} ${outfit.variable} ${inter.variable} ${dmSans.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Arms the landing page's scroll-reveal styles before the body paints.
          The reveals only hide themselves when this flag is present, so with
          JavaScript disabled — or if hydration never completes — the content
          renders plainly visible instead of staying at opacity 0. Inline and
          first in <body> so there is no flash of revealed content.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="1"`,
          }}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
