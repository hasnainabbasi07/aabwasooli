import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS = { green: "#19a77a", blue: "#416efe", red: "#df6470", cyan: "#2f92fe", violet: "#7866d9", aqua: "#4763fe" };
function ChartTooltip({ active, payload, label, formatter, color, seriesLabel }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-[#dceaf0] bg-white px-3.5 py-2.5 shadow-[0_12px_32px_rgba(19,67,94,.16)]">
    <p className="mb-1.5 text-[10px] font-semibold text-[#647b8e]">{label}</p>
    <p className="flex items-center gap-2 text-[12px] font-bold" style={{ color }}><span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />{formatter(payload[0].value)} <span className="text-[9px] font-medium text-[#8597a5]">{seriesLabel}</span></p>
  </div>;
}
export default function LineChart({ data, xKey, yKey, label, className = "text-primary", color = "blue", height = 325, smooth = true, dots = false, dashedGrid = false, yFormatter = (v) => v, variant = "area" }) {
  const stroke = COLORS[color] || COLORS.blue;
  const gradientId = `chart-fill-${String(yKey).replace(/[^a-z0-9]/gi, "")}-${color}`;
  const tick = { fill: "#8da2b0", fontSize: 10, fontWeight: 600 };
  return <div className={`chart-surface chart-surface-${variant} ${className}`} style={{ "--chart-height": `${height}px`, "--chart-color": stroke }}>
    <div className="chart-topline"><span><i style={{ background: stroke }} />{label}</span><span className="chart-trend-label">{variant === "bar" ? "DAILY TOTAL" : variant === "horizontalBar" ? "MONTHLY BREAKDOWN" : "REVENUE TREND"}</span></div>
    <div className="chart-plot"><ResponsiveContainer width="100%" height="100%">
      {variant === "horizontalBar" ? <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 2, bottom: 0 }} barCategoryGap="28%">
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={stroke} stopOpacity={0.58} /><stop offset="100%" stopColor={stroke} stopOpacity={1} /></linearGradient></defs>
        <CartesianGrid horizontal={false} stroke="#e6f0f4" strokeDasharray="3 6" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={tick} tickFormatter={yFormatter} />
        <YAxis type="category" dataKey={xKey} tickLine={false} axisLine={false} tick={{ ...tick, fill: "#52778a", fontWeight: 700 }} width={38} />
        <Tooltip cursor={{ fill: "#eaf7fa", radius: 8 }} content={<ChartTooltip formatter={yFormatter} color={stroke} seriesLabel={label} />} />
        <Bar dataKey={yKey} fill={`url(#${gradientId})`} radius={[0, 7, 7, 0]} maxBarSize={18} background={{ fill: "#edf5f7", radius: 7 }} activeBar={{ fill: stroke, stroke: "#fff", strokeWidth: 2 }} />
      </BarChart> : variant === "bar" ? <BarChart data={data} margin={{ top: 20, right: 10, left: -18, bottom: 0 }} barCategoryGap="28%">
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity={1} /><stop offset="100%" stopColor={stroke} stopOpacity={0.52} /></linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#e6f0f4" strokeDasharray="3 6" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={tick} dy={9} />
        <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={yFormatter} width={60} />
        <Tooltip cursor={{ fill: "#eaf7fa", radius: 10 }} content={<ChartTooltip formatter={yFormatter} color={stroke} seriesLabel={label} />} />
        <Bar dataKey={yKey} fill={`url(#${gradientId})`} radius={[7, 7, 3, 3]} maxBarSize={36} activeBar={{ fill: stroke, stroke: "#fff", strokeWidth: 2 }} />
      </BarChart> : <AreaChart data={data} margin={{ top: 18, right: 12, left: -10, bottom: 0 }}>
        <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity={0.28} /><stop offset="72%" stopColor={stroke} stopOpacity={0.08} /><stop offset="100%" stopColor={stroke} stopOpacity={0.01} /></linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#e8f0f4" strokeDasharray={dashedGrid ? "3 6" : "0"} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={tick} dy={9} />
        <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={yFormatter} width={60} />
        <Tooltip cursor={{ stroke: "#b9c9d3", strokeDasharray: "3 4" }} content={<ChartTooltip formatter={yFormatter} color={stroke} seriesLabel={label} />} />
        <Area type={smooth ? "monotone" : "linear"} dataKey={yKey} stroke={stroke} strokeWidth={3} fill={`url(#${gradientId})`} activeDot={{ r: 5, fill: stroke, stroke: "#fff", strokeWidth: 2.5 }} dot={dots ? { r: 3.5, fill: "#fff", stroke, strokeWidth: 2 } : false} />
      </AreaChart>}
    </ResponsiveContainer></div>
  </div>;
}

