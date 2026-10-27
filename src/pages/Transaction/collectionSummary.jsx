import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import { formatAmount } from "../../utils/format";

function getSavedSummary() {
  try {
    const raw = window.sessionStorage.getItem("wasooli-aab-current-summary");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toISODate(date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function rowDateValue(value) {
  if (!value) return null;
  const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const monthYear = String(value).match(/^([A-Za-z]{3,})\/?(\d{4})$/);
  if (monthYear) {
    const monthIndex = new Date(`${monthYear[1]} 1, ${monthYear[2]}`).getMonth();
    if (!Number.isNaN(monthIndex)) return `${monthYear[2]}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  }
  return null;
}

function displayDate(value) {
  if (!value) return "—";
  if (!/^\d{4}-\d{2}-\d{2}/.test(String(value))) return String(value);
  const parsed = rowDateValue(value);
  if (!parsed) return String(value);
  const [year, month, day] = parsed.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(year, month - 1, day));
}

export default function CollectionSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state?.summary ?? getSavedSummary();
  const today = toISODate(new Date());
  const [fromDate, setFromDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [toDate, setToDate] = useState(today);
  const [shownRange, setShownRange] = useState({ from: `${new Date().getFullYear()}-01-01`, to: today });
  const rows = useMemo(() => (summary?.rows ?? []).filter((row) => {
    const date = rowDateValue(row.date);
    return !date || ((!shownRange.from || date >= shownRange.from) && (!shownRange.to || date <= shownRange.to));
  }), [summary, shownRange]);
  const totalBalance = rows.reduce((sum, row) => sum + Number(row.balance || 0), 0);
  const totalReceived = rows.reduce((sum, row) => sum + Number(row.received || 0), 0);

  return (
    <main className="collection-summary-page">
      <header className="collection-summary-toolbar">
        <div><span>CLIENT COLLECTIONS</span><h1>Collection Summary</h1></div>
        <div className="collection-summary-toolbar-actions">
          <Button variant="soft" onClick={() => navigate("/collection-details")}>Back to Collection</Button>
          {summary && <Button onClick={() => window.print()}>Print</Button>}
        </div>
      </header>

      {summary ? (
        <div className="collection-summary-content">
          <section className="collection-summary-filters">
            <label>From date<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label>
            <label>To date<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></label>
            <Button onClick={() => setShownRange({ from: fromDate, to: toDate })}>Show</Button>
          </section>

          <article className="collection-summary-sheet">
            <div className="collection-summary-sheet-head">
              <div><span>COLLECTION HISTORY</span><h2>{summary.customer.name}</h2></div>
              <div className="collection-summary-customer-id"><span>CLIENT ID</span><b>{summary.customer.id}</b></div>
            </div>
            <div className="collection-summary-table-wrap">
              <table className="collection-summary-table">
                <thead><tr><th>Bill ID</th><th className="summary-number">Balance</th><th className="summary-number">Received</th><th>Date</th></tr></thead>
                <tbody>{rows.length ? rows.map((row) => (
                  <tr key={row.id}><td>{row.id}</td><td className="summary-number">{formatAmount(row.balance)}</td><td className="summary-number summary-received">{formatAmount(row.received)}</td><td>{displayDate(row.date)}</td></tr>
                )) : <tr><td colSpan={4} className="collection-summary-empty">No collection records found for this date range.</td></tr>}</tbody>
              </table>
            </div>
            <footer className="collection-summary-totals">
              <span>{rows.length} record{rows.length === 1 ? "" : "s"}</span>
              <div><p><span>Total Balance</span><b>{formatAmount(totalBalance)} PKR</b></p><p><span>Total Received</span><b>{formatAmount(totalReceived)} PKR</b></p></div>
            </footer>
          </article>
        </div>
      ) : (
        <section className="collection-summary-missing"><h2>Summary data is unavailable</h2><p>Open Summary from a selected client in Collection.</p><Button onClick={() => navigate("/collection-details")}>Go to Collection</Button></section>
      )}
    </main>
  );
}
