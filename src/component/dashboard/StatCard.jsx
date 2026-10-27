import { statIcons } from "./statIcons";
const TONES = {
  blue: { card: "from-[#dff5fc]/38 via-[#effbfe]/24 to-[#d8f2fa]/16", bar: "bg-primary", icon: "bg-[#f1fbff]/55 text-primary ring-1 ring-white/70", glow: "bg-primary/15" },
  cyan: { card: "from-[#eaf0ff]/38 via-[#f6f8ff]/24 to-[#e7edff]/16", bar: "bg-info", icon: "bg-[#f4f6ff]/60 text-info ring-1 ring-white/75", glow: "bg-info/15" },
  violet: { card: "from-[#eeebfc]/35 via-[#faf9ff]/22 to-[#e9e5fa]/14", bar: "bg-violet", icon: "bg-[#f8f5ff]/60 text-violet ring-1 ring-white/70", glow: "bg-violet/15" },
  green: { card: "from-[#e0f7ed]/36 via-[#f4fcf8]/22 to-[#d9f3e7]/15", bar: "bg-success", icon: "bg-[#f0fff8]/60 text-success ring-1 ring-white/70", glow: "bg-success/15" },
};
export default function StatCard({ icon, tone = "blue", title, value, items = [] }) {
 const t = TONES[tone] || TONES.blue;
 return <section className={`stat-card relative isolate grid w-full max-w-[190px] min-h-[96px] content-start gap-1.5 overflow-hidden rounded-[11px] border border-white/75 bg-gradient-to-br ${t.card} px-2.5 py-2.5 shadow-[0_2px_9px_rgba(17,105,145,.045)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_18px_rgba(17,105,145,.12)]`}>
  <span className={`absolute inset-x-0 top-0 h-[2px] opacity-80 ${t.bar}`} /><span aria-hidden="true" className={`pointer-events-none absolute -right-8 -top-10 -z-10 size-20 rounded-full ${t.glow} blur-2xl`} />
  <div className="flex min-w-0 items-center gap-1.5"><span className={`grid size-6 shrink-0 place-items-center rounded-md ${t.icon}`}>{statIcons[icon]}</span><h3 className="min-w-0 flex-1 truncate text-[9px] font-semibold text-[#315d76]">{title}</h3><span className="text-[12px] leading-none text-[#7095a8]">···</span></div>
  <div className="pl-0.5"><p className="mb-1 text-[18px] leading-none font-bold tracking-[-.5px] text-[#12496b]">{value}</p><ul className="grid grid-cols-1 gap-0.5">{items.map((text) => <li key={text} className="flex min-w-0 items-center gap-1 truncate text-[8px] leading-tight text-[#4d758b]"><span className={`size-1 shrink-0 rounded-full ${t.bar}`} />{text}</li>)}</ul></div>
 </section>;
}


