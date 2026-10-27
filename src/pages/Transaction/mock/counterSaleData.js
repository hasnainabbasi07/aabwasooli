import { packages } from "../../Master/mock/packageData";
import { transactionTypes } from "../../Master/mock/transactionTypeData";

const dates = ["2026-10-20", "2026-10-21", "2026-10-22"];

export const initialSales = packages.slice(0, 8).map((pkg, i) => {
  const quantity = ((i * 2) % 4) + 1;
  const totalAmount = pkg.counterPrice * quantity;
  const discount = i % 3 === 0 ? 10 : 0;
  return {
    id: i + 1,
    packageId: pkg.id,
    packageName: pkg.name,
    quantity,
    totalAmount,
    discount,
    paidAmount: Math.max(0, totalAmount - discount),
    date: dates[i % dates.length],
    transType: String(transactionTypes[i % 3].id),
    transId: i % 3 === 0 ? "" : String(1000 + i),
  };
});

export { packages, transactionTypes };
