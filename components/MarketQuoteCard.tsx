import clsx from "clsx";
import Sparkline from "./Sparkline";

export type Quote = {
  symbol: string;
  name?: string | null;
  price?: number | null;
  change?: number | null;
  changePercent?: number | null;
  currency?: string | null;
};

export default function MarketQuoteCard({ q }: { q: Quote }) {
  const up = (q.change ?? 0) >= 0;
  const pct = q.changePercent != null ? `${q.changePercent.toFixed(2)}%` : "";
  const changeStr = q.change != null ? `${up ? "+" : ""}${q.change.toFixed(2)}` : "";

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-sm hover:shadow-md transition p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{q.name || q.symbol}</p>
          <p className="font-heading text-lg font-semibold leading-tight">{q.symbol}</p>
        </div>
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap leading-none",
            up
              ? "text-emerald-700 bg-emerald-50 ring-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/30 dark:ring-emerald-800"
              : "text-rose-700 bg-rose-50 ring-rose-200 dark:text-rose-300 dark:bg-rose-950/30 dark:ring-rose-800"
          )}
        >
          {up ? "▲" : "▼"} {pct}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{q.price != null ? q.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}</span>
        <span className={clsx("text-sm", up ? "text-emerald-600" : "text-rose-600")}>{changeStr}</span>
        {q.currency ? <span className="text-xs text-gray-500">{q.currency}</span> : null}
      </div>
      {Array.isArray((q as any).spark) && (q as any).spark.length > 1 ? (
        <div className="mt-2">
          <Sparkline values={(q as any).spark as number[]} strokeClassName={up ? "stroke-emerald-600" : "stroke-rose-600"} />
        </div>
      ) : null}
    </div>
  );
}
