import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import { formatAmount } from "../../utils/format";

function getSavedInvoice() {
  try {
    const raw = window.sessionStorage.getItem("wasooli-aab-current-invoice");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function CollectionInvoiceTwo({ invoice }) {
  const totalQuantity = invoice.rows.reduce((sum, row) => sum + Number(row.bottles || 0), 0);
  const totalBill = invoice.rows.reduce((sum, row) => sum + Number(row.balance || 0), 0);

  return (
    <article className="collection-invoice collection-invoice-v2">
      <div className="collection-invoice-v2-content">
        <header className="collection-invoice-v2-header">
          <div className="collection-invoice-v2-heading">INVOICE<span /></div>
          <div className="collection-invoice-v2-brand">
            <img src={invoice.company.logo} alt={`${invoice.company.name} logo`} />
            <div><h2>{invoice.company.name}</h2><p>WATER DELIVERY</p></div>
          </div>
        </header>

        <section className="collection-invoice-v2-company">
          <p>{invoice.company.address}</p>
          <p>Phone: {invoice.company.phone1}{invoice.company.phone2 ? ` · ${invoice.company.phone2}` : ""}</p>
          <p>{invoice.company.email}</p>
        </section>

        <section className="collection-invoice-v2-customer">
          <div>
            <p><b>Customer:</b><span>{invoice.customer.name}</span></p>
            <p><b>Phone No:</b><span>{invoice.customer.phone1 || invoice.customer.phone2 || "—"}</span></p>
            <p><b>Address:</b><span>{invoice.customer.address || "—"}</span></p>
          </div>
          <div className="collection-invoice-v2-number">
            <span>INVOICE NO.</span><b>{invoice.collectionId ?? "—"}</b>
            <span>ISSUE DATE</span><b>{invoice.issuedOn}</b>
          </div>
        </section>

        <div className="collection-invoice-v2-table-wrap">
          <table className="collection-invoice-v2-table">
            <thead><tr><th>#</th><th>Date</th><th>Bill No</th><th>Note</th><th>Description</th><th>QTY</th><th>Price</th><th>Amount</th></tr></thead>
            <tbody>
              {invoice.rows.length ? invoice.rows.map((row, index) => {
                const quantity = Number(row.bottles || 0);
                const amount = Number(row.balance || 0);
                const price = quantity ? amount / quantity : amount;
                return (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.monthYear || invoice.issuedOn}</td>
                    <td>{row.id}</td>
                    <td>—</td>
                    <td>Water delivery · {row.monthYear || "Collection"}</td>
                    <td>{quantity}</td>
                    <td>{formatAmount(price)}</td>
                    <td>{formatAmount(amount)}</td>
                  </tr>
                );
              }) : <tr><td colSpan={8} className="collection-invoice-v2-empty">No collection records found.</td></tr>}
            </tbody>
          </table>
        </div>

        <section className="collection-invoice-v2-totals">
          <p><span>Total Quantity:</span><b>{formatAmount(totalQuantity)}</b></p>
          <p><span>Total Bill:</span><b>{formatAmount(totalBill)} PKR</b></p>
        </section>

        <section className="collection-invoice-v2-payment">
                    <div className="collection-invoice-v2-payment-info">
            <h3>PAYMENT DETAILS</h3>
            {(invoice.company.paymentAccounts ?? []).map((account) => (
              <p key={account.label}><b>{account.label}:</b> {account.value}</p>
            ))}
            <p>Contact: {invoice.company.phone1}{invoice.company.phone2 ? ` · ${invoice.company.phone2}` : ""}</p>
          </div>
          <div className="collection-invoice-v2-balance"><span>AMOUNT DUE</span><b>{formatAmount(invoice.netAmount)} PKR</b></div>
        </section>

        <footer className="collection-invoice-v2-footer">
          <div><b>Terms &amp; Conditions</b><p>{invoice.company.description}</p></div>
          <div className="collection-invoice-v2-thanks">Thank you for choosing us.<br /><b>{invoice.company.name}</b></div>
        </footer>
      </div>
    </article>
  );
}
export default function CollectionInvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice ?? getSavedInvoice();

  return (
    <main className="collection-invoice-page">
      <div className="collection-invoice-toolbar">
        <div>
          <span>COLLECTIONS</span>
          <h1>{invoice?.version ?? "Collection Invoice"}</h1>
        </div>
        <div className="collection-invoice-toolbar-actions">
          <Button variant="soft" onClick={() => navigate("/collection-details")}>Back to Collection</Button>
          {invoice && <Button onClick={() => window.print()}>Print Invoice</Button>}
        </div>
      </div>

      {invoice ? (invoice.version === "Invoice 2" ? <CollectionInvoiceTwo invoice={invoice} /> : (
        <article className="collection-invoice">
          <div className="collection-invoice-accent" aria-hidden="true" />
          <div className="collection-invoice-content">
            <header className="collection-invoice-header">
              <div className="collection-invoice-company">
                <img src={invoice.company.logo} alt={`${invoice.company.name} logo`} />
                <div>
                  <span className="collection-invoice-kicker">WATER DELIVERY &amp; COLLECTION</span>
                  <h2>{invoice.company.name}</h2>
                  <p><b>Address:</b> {invoice.company.address}</p>
                  <p><b>Phone:</b> {invoice.company.phone1}</p>
                  <p><b>Cell:</b> {invoice.company.phone2}</p>
                </div>
              </div>
              <div className="collection-invoice-title">
                <span>COLLECTION STATEMENT</span>
                <h1>INVOICE</h1>
                <p>{invoice.version}</p>
              </div>
            </header>

            <div className="collection-invoice-rule"><span /></div>

            <section className="collection-invoice-parties">
              <div>
                <span className="collection-invoice-label">INVOICE TO</span>
                <h3>{invoice.customer?.name ?? "All clients"}</h3>
                <p><b>Issue Date:</b> {invoice.issuedOn}</p>
                {!invoice.customer && <p>{invoice.clientCount} clients in this collection</p>}
              </div>
              <div className="collection-invoice-meta">
                <p><span>PHONE</span><b>{invoice.customer?.phone1 || invoice.customer?.phone2 || "—"}</b></p>
                <p><span>ADDRESS</span><b>{invoice.customer?.address || "—"}</b></p>
                <p><span>REFILL BOTTLES</span><b>{invoice.bottleCount}</b></p>
              </div>
            </section>
            <div className="collection-invoice-table-wrap">
              <table className="collection-invoice-table">
                <thead><tr><th>TYPE</th><th>MONTH</th><th className="invoice-number">AMOUNT</th></tr></thead>
                <tbody>
                  {invoice.rows.length ? invoice.rows.map((row) => (
                    <tr key={row.id}>
                      <td><strong>Refill, Security Deposit, Bottle Deposit</strong>{!invoice.customer && <small>{row.name}</small>}</td>
                      <td>{row.monthYear}</td>
                      <td className="invoice-number">{formatAmount(row.balance)} PKR</td>
                    </tr>
                  )) : <tr><td colSpan={3} className="invoice-empty">No collection records found.</td></tr>}
                </tbody>
              </table>
            </div>

            <section className="collection-invoice-summary">
              <div className="collection-invoice-note">
                <span className="collection-invoice-label">PAYMENT &amp; NOTES</span>
                <p><b>Note:</b> {invoice.company.description}</p>
                <p>For any query contact us at {invoice.company.phone1}{invoice.company.phone2 ? ` or ${invoice.company.phone2}` : ""}.</p>
              </div>
              <div className="collection-invoice-totals">
                <p><span>Total Amount</span><b>{formatAmount(invoice.actualAmount)} PKR</b></p>
                <p><span>Received</span><b>{formatAmount(invoice.received)} PKR</b></p>
                <p><span>Discount</span><b>{formatAmount(invoice.discount)} PKR</b></p>
                <p className="collection-invoice-net"><span>Net Amount</span><b>{formatAmount(invoice.netAmount)} PKR</b></p>
              </div>
            </section>

            <footer className="collection-invoice-footer">
              <div><span>AUTHORIZED SIGNATURE</span><i /></div>
              <p>Powered by <b>LogicsLabs</b> Software Solutions</p>
            </footer>
          </div>
        </article>
      )) : (
        <section className="collection-invoice-missing">
          <h2>Invoice data is unavailable</h2>
          <p>Open the invoice from Collection to load its current client and payment details.</p>
          <Button onClick={() => navigate("/collection-details")}>Go to Collection</Button>
        </section>
      )}
    </main>
  );
}
