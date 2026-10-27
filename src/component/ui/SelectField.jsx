export default function SelectField({ label, required, options, value, onChange, className = "", selectClassName = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-small font-semibold text-navy">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-pointer rounded-lg border border-line bg-card px-3 py-1.5 text-copy text-ink outline-none transition hover:border-primary/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 ${selectClassName}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}