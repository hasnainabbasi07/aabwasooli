function getPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

const base = "grid size-6 place-items-center rounded-md border text-small font-medium transition";

export default function Pagination({ page, pages, onChange }) {
  return (
    <nav aria-label="Pagination" className="grid grid-flow-col items-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${base} border-transparent text-menu enabled:cursor-pointer enabled:hover:bg-primary/10 disabled:opacity-40`}
      >
        ‹
      </button>

      {getPages(page, pages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={`${base} cursor-pointer ${
              item === page
                ? "border-primary bg-primary text-white"
                : "border-line text-ink hover:border-primary hover:text-primary"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="px-1 text-menu">…</span>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={`${base} border-transparent text-menu enabled:cursor-pointer enabled:hover:bg-primary/10 disabled:opacity-40`}
      >
        ›
      </button>
    </nav>
  );
}