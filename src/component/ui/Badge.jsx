const DOT = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-primary",
};

export default function Badge({ tone = "info", children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-white px-2.5 py-0.5 text-small text-ink">
      <span className={`size-1.5 rounded-full ${DOT[tone]}`} />
      {children}
    </span>
  );
}