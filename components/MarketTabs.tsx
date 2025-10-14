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
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-4 -mx-1 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none]">
        {/* hide scrollbar in webkit */}
        <style jsx>{`
          div::-webkit-scrollbar{display:none}
        `}</style>
        {tabs.map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`mx-1 rounded-full border px-3 py-1 text-sm transition whitespace-nowrap ${
              active === key
                ? "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-200"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
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
    </div>
  );
}
