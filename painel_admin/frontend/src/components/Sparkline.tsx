interface Props {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
}

export function Sparkline({ data, width = 120, height = 32, stroke = "var(--accent)" }: Props) {
  if (!data || data.length === 0) {
    return <span style={{ color: "var(--text-dimmer)", fontSize: "var(--fz-xs)" }}>—</span>;
  }
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
        points={points}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
