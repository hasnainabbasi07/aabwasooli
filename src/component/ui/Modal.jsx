import { useEffect } from "react";
import { createPortal } from "react-dom";
const SIZES = { sm: "sm:max-w-xs", md: "sm:max-w-sm", lg: "sm:max-w-xl", xl: "sm:max-w-3xl" };
export default function Modal({ open, title, onClose, size = "md", footer, closeOnBackdrop = true, className = "", bodyClassName = "", children }) {
 useEffect(() => { if (!open) return; const onKey = (e) => e.key === "Escape" && onClose(); const prev = document.body.style.overflow; document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; }; }, [open, onClose]);
 if (!open) return null;
 return createPortal(<div className={`fixed inset-0 z-50 grid place-items-center p-3 sm:p-6 ${className}`} role="dialog" aria-modal="true" aria-label={title}>
  <div className="absolute inset-0 bg-[#102b40]/45 backdrop-blur-[3px]" onClick={closeOnBackdrop ? onClose : undefined} />
  <div className={`relative grid max-h-[90dvh] w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_24px_80px_rgba(14,42,64,.25)] ${SIZES[size]}`}>
   <header className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#edf2f5] bg-[#fbfdfe] px-5 py-4 sm:px-6"><div><span className="mb-1 block text-[9px] font-bold uppercase tracking-[1.15px] text-primary">Wasooli Aab</span><h3 className="text-[15px] font-semibold text-navy">{title}</h3></div><button type="button" onClick={onClose} aria-label="Close" className="grid size-8 cursor-pointer place-items-center rounded-lg border border-[#e5edf2] text-menu transition hover:bg-soft hover:text-primary"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></header>
   <div className={`overflow-y-auto px-5 py-5 sm:px-6 ${bodyClassName}`}>{children}</div>{footer && <footer className="grid grid-flow-col justify-end gap-2 border-t border-[#edf2f5] bg-[#fbfdfe] px-5 py-3.5 sm:px-6">{footer}</footer>}
  </div>
 </div>, document.body);
}
