import { useLocation, useNavigate } from "react-router-dom";
import Receipt from "../../component/ui/Receipt";
import { company } from "../CompanyProfile/mockData";
import { transactionTypes } from "../Master/mock/transactionTypeData";
import { formatAmount } from "../../utils/format";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB");
};

export default function DeliveryReceipt() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { client, delivery, amounts } = state || {};

  if (!client || !delivery || !amounts) {
    return (
      <main className="grid min-h-screen place-items-center bg-page p-6 text-center">
        <div className="grid justify-items-center gap-3 rounded-card bg-white p-6 shadow-card">
          <p className="text-copy text-ink">Delivery receipt data nahi mila.</p>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="rounded-lg bg-primary px-4 py-2 text-small font-semibold text-white"
          >
            Orders par wapas jayen
          </button>
        </div>
      </main>
    );
  }

  const transactionType =
    transactionTypes.find(
      (type) => String(type.id) === String(delivery.transType),
    )?.name || "—";

  const data = {
    logo: company.logo,
    companyName: company.name,
    address: company.address,
    phone: [company.phone1, company.phone2].filter(Boolean).join(" / "),
    title: "(Delivery Receipt)",
    details: [
      { label: "User", value: client.name },
      { label: "Contact", value: client.phone },
      { label: "Package Name", value: client.packageName },
      { label: "Payment Type", value: client.payType },
      { label: "Date", value: formatDate(delivery.date) },
      { label: "Transaction Type", value: transactionType },
      ...(delivery.transId
        ? [{ label: "Transaction ID", value: delivery.transId }]
        : []),
    ],
    items: [
      { name: "Refill Delivery Bottle", quantity: delivery.refill || 0 },
      { name: "New Order Bottle", quantity: delivery.newOrder || 0 },
      { name: "Empty Bottle Receive", quantity: delivery.emptyReceive || 0 },
    ],
    totals: [
      { label: "Balance Amount", value: formatAmount(amounts.balance) },
      { label: "Previous Balance", value: formatAmount(amounts.previous) },
      { label: "Total Amount", value: formatAmount(amounts.total) },
      { label: "Receive Amount", value: formatAmount(delivery.receive) },
      { label: "Discount", value: formatAmount(delivery.discount) },
    ],
    footerTitle: "THANK YOU",
    footerMessage: "Please visit again",
  };

  return <Receipt data={data} />;
}
