"use client";

import { useState } from "react";
import MarketList from "./MarketList";
import MarketGrid from "./MarketGrid";
import type { Quote } from "./MarketQuoteCard";

type TabKey = "trackers" | "stocks" | "crypto" | "etfs";

const TAB_LABELS: Record<TabKey, string> = {
  trackers: "Market trackers",
  stocks: "Stocks",
  crypto: "Crypto",
  etfs: "ETFs",
};

export default function MarketTabs({ data }: { data: Partial<Record<TabKey, Quote[]>> }) {
  const [active, setActive] = useState<TabKey>("trackers");

  const tabs = (Object.keys(TAB_LABELS) as TabKey[]).filter((k) => (data as any)[k]?.length);
  if (!tabs.length) return null;

  return (
    <section className="w-full rounded-3xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-900/20 dark:ring-white/5">
      <div
        role="tablist"
        aria-label="Market categories"
        className="mb-5 flex w-full flex-wrap items-center gap-2"
      >
        {tabs.map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400 ${
              active === key
                ? "bg-sky-600 text-white shadow-sm dark:bg-sky-500"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
            }`}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>

      {tabs.map((key) => (
        <div key={key} hidden={active !== key}>
          {key === "trackers" ? (
            <MarketList quotes={(data as any)[key] as Quote[]} />
          ) : (
            <MarketGrid quotes={(data as any)[key] as Quote[]} />
          )}
        </div>
      ))}
    </section>
  );
}
