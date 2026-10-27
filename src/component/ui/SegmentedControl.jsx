export default function SegmentedControl({ options, value, onChange }) {
 const index = Math.max(0, options.findIndex((o) => o.value === value));
 return <div role="group" className="relative inline-grid rounded-xl border border-[#e7edf2] bg-[#f0f4f7] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
  <span aria-hidden="true" className="absolute top-1 bottom-1 left-1 rounded-lg bg-white shadow-[0_1px_4px_rgba(28,60,84,.12)] transition-transform duration-300 ease-out" style={{ width: `calc((100% - .5rem) / ${options.length})`, transform: `translateX(${index * 100}%)` }} />
  {options.map((o) => <button key={o.value} type="button" onClick={() => onChange(o.value)} className={`relative z-10 cursor-pointer rounded-lg px-3.5 py-1.5 text-[10px] font-semibold transition-colors ${value === o.value ? "text-primary" : "text-[#788c9d] hover:text-ink"}`}>{o.label}</button>)}
 </div>;
}
