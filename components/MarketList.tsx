import clsx from "clsx";
import type { Quote } from "./MarketQuoteCard";
import Sparkline from "./Sparkline";

export default function MarketList({ quotes }: { quotes: Quote[] }) {
  if (!quotes?.length) return null;
  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white/70 shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/40">
      {quotes.map((q) => {
        const up = (q.change ?? 0) >= 0;
        const pct = q.changePercent != null ? `${q.changePercent.toFixed(2)}%` : "";
        return (
          <li key={q.symbol} className="flex items-center gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-500 dark:text-slate-400">{q.name || q.symbol}</p>
              <p className="font-heading text-base font-semibold leading-tight">{q.symbol}</p>
            </div>
            <div className="flex items-center gap-4">
              {Array.isArray((q as any).spark) && (q as any).spark.length > 1 ? (
                <div className="hidden sm:block">
                  <Sparkline values={(q as any).spark as number[]} width={120} height={36} strokeClassName={up ? "stroke-emerald-600" : "stroke-rose-600"} />
                </div>
              ) : null}
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                  {q.currency ? <span className="ml-1 text-xs text-gray-500">{q.currency}</span> : null}
                </div>
                <div className={clsx("text-sm", up ? "text-emerald-600" : "text-rose-600")}>{up ? "▲" : "▼"} {pct}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
