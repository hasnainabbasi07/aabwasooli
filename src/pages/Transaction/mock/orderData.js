import { clients } from "../../ClientProfile/mock/clientData";
import { areas } from "../../Master/mock/areaData";
import { packages } from "../../Master/mock/packageData";
import { transactionTypes } from "../../Master/mock/transactionTypeData";

// Initial All Orders / Client List for Orders tab
export const initialAllClients = clients.slice(0, 15).map((c, i) => ({
  id: c.id,
  name: c.name,
  phone: c.phone1,
  address: c.address,
  packageId: c.packageId,
  packageName: packages.find((p) => p.id === c.packageId)?.name ?? "19 Litre Bottle",
  payType: c.payType,
  balance: c.balance,
  bottles: ((i * 3) % 5) + 1,
}));

// Initial Today Deliveries
export const initialTodayOrders = clients.slice(0, 10).map((c, i) => ({
  sno: i + 1,
  clientId: c.id,
  name: c.name,
  bottles: ((i * 2) % 4) + 1,
  phone: c.phone1,
  address: c.address,
  packageId: c.packageId,
  packageName: packages.find((p) => p.id === c.packageId)?.name ?? "19 Litre Bottle",
  payType: c.payType,
  balance: c.balance,
  status: i % 3 === 0 ? "Delivered" : "Delivery Pending",
}));

// Initial Active Orders List
export const initialOrderList = clients.slice(3, 12).map((c, i) => ({
  id: 5001 + i,
  clientId: c.id,
  name: c.name,
  phone: c.phone1,
  bottles: ((i * 2) % 5) + 2,
  address: c.address,
  packageId: c.packageId,
  packageName: packages.find((p) => p.id === c.packageId)?.name ?? "19 Litre Bottle",
  payType: c.payType,
  balance: c.balance,
  orderDate: "2026-03-24",
}));

// Initial Bulk Collection Data
export const initialBulkRows = clients.slice(0, 8).map((c, i) => ({
  id: c.id,
  sno: i + 1,
  name: c.name,
  areaId: c.areaId,
  areaName: areas.find((a) => a.id === c.areaId)?.name ?? "Hayatabad Phase 1",
  bottles: ((i * 2) % 4) + 1,
  ebReceive: ((i * 2) % 3) + 1,
  tAmount: ((i * 2) % 4 + 1) * 150,
  aReceive: ((i * 2) % 4 + 1) * 150,
  discount: 0,
  status: i % 2 === 0 ? "Paid" : "Pending",
  reason: "",
  selected: false,
}));

export const tabOptions = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "order", label: "Order" },
];

export const deliveryFilterOptions = [
  { value: "all", label: "All" },
  { value: "Delivered", label: "Delivered" },
  { value: "Delivery Pending", label: "Delivery Pending" },
];

export { areas, packages, transactionTypes };

