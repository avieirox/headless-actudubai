type Props = {
  values: number[];
  width?: number;
  height?: number;
  strokeClassName?: string;
  fillClassName?: string;
};

export default function Sparkline({ values, width = 140, height = 48, strokeClassName = "stroke-emerald-600", fillClassName = "fill-emerald-100/60 dark:fill-emerald-400/10" }: Props) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="block">
      <path d={area} className={fillClassName} />
      <path d={d} className={`fill-none stroke-[2] ${strokeClassName}`} />
    </svg>
  );
}

