import MarketQuoteCard, { type Quote } from "./MarketQuoteCard";

export default function MarketGrid({ quotes }: { quotes: Quote[] }) {
  if (!quotes.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {quotes.map((q) => (
        <MarketQuoteCard key={q.symbol} q={q} />
      ))}
    </div>
  );
}

