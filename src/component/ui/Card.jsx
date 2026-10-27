export default function Card({ title, subtitle, action, className = "", bodyClassName = "px-5 pb-5 pt-4", children }) {
 return <section className={`overflow-hidden rounded-[14px] border border-[#dce5f6] bg-gradient-to-br from-white via-white to-[#f5f7ff] shadow-[0_5px_18px_rgba(65,110,254,.07)] ${className}`}>
  {(title || action) && <header className="water-card-header card-header grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[#e4eaf7] bg-gradient-to-r from-[#f0f4ff] to-white px-5 py-4">
   <div><h3 className="text-[13px] font-semibold tracking-[-.1px] text-[#26385e]">{title}</h3>{subtitle && <p className="mt-1 text-[10px] text-[#7282a0]">{subtitle}</p>}</div>{action && <div className="flex items-center justify-end">{action}</div>}
  </header>}
  <div className={bodyClassName}>{children}</div>
 </section>;
}

