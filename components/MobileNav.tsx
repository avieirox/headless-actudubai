"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Cat } from "@/components/Nav";

export default function MobileNav({ cats }: { cats: Cat[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const first = pathname.split("/")[1] || "";

  return (
    <div className="md:hidden relative">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md border border-gray-300/70 dark:border-slate-700 px-3 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-30 bg-black/20 dark:bg-black/30"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl border border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm shadow-lg">
          <nav aria-label="Mobile">
            <ul className="p-2 divide-y divide-gray-100 dark:divide-slate-800 text-sm">
              <li>
                {(() => {
                  const active = pathname === "/";
                  const cls = [
                    "block px-3 py-2 rounded-md transition-colors",
                    active
                      ? "bg-gray-100 dark:bg-slate-800/70 text-gray-900 dark:text-white font-medium border-l-2 border-sky-500"
                      : "text-gray-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60",
                  ].join(" ");
                  return (
                    <Link
                      href="/"
                      aria-current={active ? "page" : undefined}
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      Home
                    </Link>
                  );
                })()}
              </li>
              {cats.map((c) => (
                <li key={c.id}>
                  {(() => {
                    const active = first === c.slug;
                    const cls = [
                      "block px-3 py-2 rounded-md transition-colors",
                      active
                        ? "bg-gray-100 dark:bg-slate-800/70 text-gray-900 dark:text-white font-medium border-l-2 border-sky-500"
                        : "text-gray-800 dark:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800/60",
                    ].join(" ");
                    return (
                      <Link
                        href={`/${c.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={cls}
                        onClick={() => setOpen(false)}
                      >
                        {c.name}
                      </Link>
                    );
                  })()}
                </li>
              ))}
            </ul>
          </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
