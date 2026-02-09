import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TFT Aggregator",
  description:
    "Busca composiciones de Teamfight Tactics de multiples fuentes mediante tags automaticos.",
  keywords: [
    "TFT",
    "Teamfight Tactics",
    "composiciones TFT",
    "TFT comps",
    "meta TFT",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitScript = `
    (function () {
      try {
        var key = "tft-theme";
        var theme = localStorage.getItem(key);
        if (theme !== "light" && theme !== "dark") {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        var root = document.documentElement;
        if (theme === "dark") {
          root.classList.add("theme-dark");
        } else {
          root.classList.remove("theme-dark");
        }
        root.style.colorScheme = theme;
      } catch (error) {
        // Ignore theme bootstrap errors.
      }
    })();
  `;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
