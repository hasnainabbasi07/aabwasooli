export default function Textarea({ label, required, value, onChange, rows = 3, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1 block text-small font-semibold text-navy">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full resize-none rounded-lg border border-line bg-card px-3 py-1.5 text-copy text-ink outline-none transition placeholder:text-menu/70 hover:border-primary/40 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
        {...props}
      />
    </label>
  );
}
