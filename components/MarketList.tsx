import clsx from "clsx";
import type { Quote } from "./MarketQuoteCard";
import Sparkline from "./Sparkline";

export default function MarketList({ quotes }: { quotes: Quote[] }) {
  if (!quotes?.length) return null;
  return (
    <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
      {quotes.map((q) => {
        const up = (q.change ?? 0) >= 0;
        const pct = q.changePercent != null ? `${q.changePercent.toFixed(2)}%` : "";
        return (
          <li key={q.symbol} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 border-b last:border-b-0 border-slate-100 dark:border-slate-800">
            <div className="min-w-0">
              <p className="truncate text-[13px] text-slate-500 dark:text-slate-400">{q.name || q.symbol}</p>
              <p className="font-heading text-[15px] font-semibold leading-tight tracking-tight">{q.symbol}</p>
            </div>
            <div className="flex items-center gap-5">
              {Array.isArray((q as any).spark) && (q as any).spark.length > 1 ? (
                <div className="hidden sm:block">
                  <Sparkline values={(q as any).spark as number[]} width={160} height={44} strokeClassName={up ? "stroke-emerald-600" : "stroke-rose-600"} />
                </div>
              ) : null}
              <div className="text-right">
                <div className="text-xl font-semibold">
                  {q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                  {q.currency ? <span className="ml-1 text-xs text-slate-500">{q.currency}</span> : null}
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
