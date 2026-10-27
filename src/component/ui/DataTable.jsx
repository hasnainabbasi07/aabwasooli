import { useState } from "react";
import SearchInput from "./SearchInput";
import Pagination from "./Pagination";

// columns: [{ key, label, align?: "left" | "center" | "right", render?: (value, row) => node }]
// paginated: shows "Showing N entries" + search above, and pagination below.
const ALIGN = { left: "text-left", center: "text-center", right: "text-right" };
const PAGE_SIZES = [10, 25, 50, 100];

export default function DataTable({ columns, rows, maxHeight, paginated = false, pageSize: initialSize = 10, searchPlaceholder = "Search table", emptyMessage = "No records found" }) {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(initialSize);
  const [page, setPage] = useState(1);
  const q = query.trim().toLowerCase();
  const filtered = paginated && q ? rows.filter((row) => columns.some((column) => String(row[column.key] ?? "").toLowerCase().includes(q))) : rows;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);
  const start = (current - 1) * pageSize;
  const visible = paginated ? filtered.slice(start, start + pageSize) : filtered;

  return <div className="grid gap-3 min-w-0">
    {paginated && <div className="table-controls grid grid-flow-col items-center justify-between gap-3 text-small text-ink">
      <label className="grid grid-flow-col items-center gap-2">Showing<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="cursor-pointer rounded-lg border border-[#e3ebf1] bg-white px-2.5 py-1.5 text-[11px] outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10">{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select>Entries</label>
      <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder={searchPlaceholder} />
    </div>}
    <div className="table-scroll-area min-w-0 overflow-x-auto rounded-xl border border-[#e5edf2]" style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}>
      <table className="w-full min-w-max border-separate border-spacing-0 text-small">
        <thead className="sticky top-0 z-[1]"><tr>{columns.map((column) => <th key={column.key} className={`whitespace-nowrap bg-[#f4f8fb] px-3.5 py-3 text-[9px] font-bold uppercase tracking-[.08em] text-[#718698] ${ALIGN[column.align ?? "left"]}`}>{column.label}</th>)}</tr></thead>
        <tbody>{visible.map((row, index) => <tr key={row.id ?? index} className="group">{columns.map((column) => <td key={column.key} className={`whitespace-nowrap border-b border-[#edf2f5] px-3.5 py-2.5 font-normal text-ink/80 transition-colors group-last:border-0 group-hover:bg-[#f7fbfd] ${ALIGN[column.align ?? "left"]}`}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>)}</tr>)}</tbody>
      </table>
      {visible.length === 0 && <div className="table-empty-state" role="status">{emptyMessage}</div>}
    </div>
    {paginated && <div className="table-footer grid items-center gap-2 text-small text-ink sm:grid-flow-col sm:justify-between"><span>Showing {total ? start + 1 : 0} to {Math.min(start + pageSize, total)} of {total} entries</span><Pagination page={current} pages={pages} onChange={setPage} /></div>}
  </div>;
}
