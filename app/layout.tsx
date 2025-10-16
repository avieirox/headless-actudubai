import "./globals.css";
import { montserrat, lato } from "@/lib/fonts";
import type { ReactNode } from "react";
import Script from "next/script";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Nav, { type Cat } from "@/components/Nav";
import MobileNav from "@/components/MobileNav";
import { wpRequest } from "@/lib/wpClient";
import { ALL_CATEGORIES_QUERY } from "@/lib/wpQueries";

export const metadata = {
  title: "ACTU Dubai | Financial News",
  description: "Financial news, analysis and articles.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let cats: Cat[] = [];
  try {
    const data = await wpRequest<{ categories?: { nodes?: Cat[] } }>(ALL_CATEGORIES_QUERY);
    cats = (data?.categories?.nodes || [])
      .filter((c) => (c.count ?? 0) > 0 && c.slug !== "uncategorized")
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    cats = [];
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${lato.className} ${montserrat.variable} ${lato.variable} bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 leading-relaxed antialiased`}>
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
          <header className={`sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 shadow-sm py-2 sm:py-2.5 lg:py-3 ${montserrat.className}`}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-4">
              <div className="flex items-center">
                <Link href="/" aria-label="ACTU Dubai home" className="flex items-center">
                  <Image
                    src="/actudubai_logo.png"
                    alt="ACTU Dubai"
                    width={300}
                    height={80}
                    priority
                    sizes="(min-width: 1024px) 190px, (min-width: 640px) 160px, 140px"
                    className="w-[140px] sm:w-[160px] lg:w-[190px] h-auto object-contain"
                  />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <Nav cats={cats} />
                </div>
                <div className="hidden md:block md:ml-6 lg:ml-10 xl:ml-14 2xl:ml-16">
                  <ThemeToggle />
                </div>
                <MobileNav cats={cats} />
              </div>
            </div>
          </header>
          <main className="py-0">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
