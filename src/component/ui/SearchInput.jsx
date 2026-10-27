export default function SearchInput({ value, onChange, placeholder = "Search" }) {
  return (
    <label className="relative block">
      <svg className="absolute top-1/2 left-2.5 -translate-y-1/2 text-menu" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-36 rounded-lg border border-line bg-white py-1.5 pr-3 pl-8 text-copy outline-none transition placeholder:text-menu hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}