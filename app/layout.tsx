import "./globals.css";
import { montserrat, lato } from "@/lib/fonts";
import type { ReactNode } from "react";
import Script from "next/script";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ACTU Dubai | Financial News",
  description: "Financial news, analysis and articles.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${lato.className} ${montserrat.variable} ${lato.variable} bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 leading-relaxed antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            const key = 'theme';
            const stored = localStorage.getItem(key);
            const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = stored ? stored === 'dark' : preferDark;
            document.documentElement.classList.toggle('dark', isDark);
          } catch {}
        `}</Script>
        <div className="min-h-screen">
          <header className={`border-b border-gray-200 dark:border-slate-800 py-4 ${montserrat.className}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">ACTU Dubai</h1>
              <ThemeToggle />
            </div>
          </header>
          <main className="py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
