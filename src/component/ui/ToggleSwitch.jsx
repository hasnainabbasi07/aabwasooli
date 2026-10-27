export default function ToggleSwitch({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative grid h-5 w-10 shrink-0 items-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "justify-items-end border-primary bg-primary" : "justify-items-start border-line bg-line"
      }`}
    >
      <span className="mx-0.5 size-4 rounded-full bg-white shadow-sm" />
    </button>
  );
}
