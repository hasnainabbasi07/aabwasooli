export default function Checkbox({ label, checked, onChange, className = "" }) {
 return <label className={`inline-grid cursor-pointer grid-flow-col items-center justify-start gap-2.5 text-[11px] font-medium text-[#40596d] ${className}`}><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 cursor-pointer rounded accent-primary" />{label}</label>;
}
