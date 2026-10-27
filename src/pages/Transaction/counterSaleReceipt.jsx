import { useLocation, useNavigate } from "react-router-dom";
import { packages } from "../Master/mock/packageData";
import { transactionTypes } from "./mock/counterSaleData";
import { formatAmount } from "../../utils/format";
import Receipt from "../../component/ui/Receipt";
import aquaLogo from "../../assets/aab-logo.png";

const receiptDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB");
};

export default function CounterSaleReceipt() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sale = state?.sale;

  if (!sale) {
    return (
      <main className="grid min-h-screen place-items-center bg-page p-6 text-center">
        <div className="grid justify-items-center gap-3 rounded-card bg-white p-6 shadow-card">
          <p className="text-copy text-ink">Receipt data nahi mila.</p>
          <button
            type="button"
            onClick={() => navigate("/counter-sale")}
            className="rounded-lg bg-primary px-4 py-2 text-small font-semibold text-white"
          >
            Counter Sale par wapas jayen
          </button>
        </div>
      </main>
    );
  }

  const product =
    sale.packageName ||
    packages.find((item) => String(item.id) === String(sale.packageId))?.name ||
    "—";
  const transactionType =
    transactionTypes.find(
      (item) => String(item.id) === String(sale.transType),
    )?.name || "—";
  const total = Number(sale.totalAmount || 0);
  const discount = Number(sale.discount || 0);
  const received = Number(sale.paidAmount || 0);
  const balance = Math.max(0, total - discount - received);
  const data = {
    logo: aquaLogo,
    companyName: "AQUA PURA SMART",
    address: "Address: Add company address here",
    phone: "Contact: Add phone number here",
    title: "(Receipt)",
    details: [
      { label: "Bill ID", value: sale.id },
      { label: "Date", value: receiptDate(sale.date) },
      { label: "Transaction", value: transactionType },
      ...(sale.transId ? [{ label: "Transaction ID", value: sale.transId }] : []),
    ],
    itemHeaders: { name: "Product", quantity: "Qty" },
    items: [{ name: product, quantity: sale.quantity }],
    totals: [
      { label: "Total Amount", value: formatAmount(total) },
      { label: "Discount", value: formatAmount(discount) },
      { label: "Received", value: formatAmount(received) },
      { label: "Balance", value: formatAmount(balance), emphasis: true },
    ],
    footerTitle: "THANK YOU",
    footerMessage: "Please visit again",
  };

  return (
    <Receipt data={data} />
  );
}
