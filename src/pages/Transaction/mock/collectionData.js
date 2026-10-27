import { clients } from "../../ClientProfile/mock/clientData";
import { transactionTypes } from "../../Master/mock/transactionTypeData";

const months = ["Sep/2026", "Oct/2026"];

export const initialClients = clients.slice(0, 12).map((c, i) => ({
  ...c,
  advanceAmount: i % 4 === 0 ? 500 + i * 50 : 0,
}));

export const initialCollections = initialClients.flatMap((c, i) => {
  const rows = [
    {
      id: 2000 + i,
      clientId: c.id,
      name: c.name,
      address: c.address,
      monthYear: months[1],
      balance: c.balance || (i % 5) * 150,
      status: (c.balance || (i % 5) * 150) === 0 ? "Paid" : "Unpaid",
      bottles: ((i % 4) + 1),
      payType: c.payType,
    },
  ];
  if (i % 3 === 0) {
    rows.unshift({
      id: 1900 + i,
      clientId: c.id,
      name: c.name,
      address: c.address,
      monthYear: months[0],
      balance: 150,
      status: "Unpaid",
      bottles: 1,
      payType: c.payType,
    });
  }
  return rows;
});

export const initialHistory = initialClients.slice(0, 10).map((c, i) => ({
  id: 8001 + i,
  clientId: c.id,
  name: c.name,
  address: c.address,
  bottleCount: ((i % 4) + 1),
  monthYear: i % 2 === 0 ? months[0] : months[1],
  discount: i % 3 === 0 ? 20 : 0,
  received: 150 * ((i % 3) + 1),
  status: i % 4 === 0 ? "Partial" : "Paid",
}));

export { transactionTypes };
