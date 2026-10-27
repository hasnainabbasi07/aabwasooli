
export const stats = [
  { icon: "clients", tone: "blue", title: "Clients", value: 9, items: ["Active: 9", "Not Active: 0"] },
  { icon: "delivery", tone: "cyan", title: "Delivery", value: 68, items: ["Delivery Pending: 64", "Delivered: 4"] },
  { icon: "orders", tone: "violet", title: "Orders", value: 1, items: ["Delivered Orders: 1", "Pending Orders: 0"] },
  { icon: "counter", tone: "green", title: "Counter Sale", value: 0, items: ["Counter Sale: 0", "Total Amount: 0 PKR"] },
];

export const periods = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "today", label: "Today" },
];

export const collection = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day, amount: [1, 3, 2, 4, 2, 5, 3][i],
}));

export const bottleSummary = [
  { label: "Company bottles", value: 200 },
  { label: "Empty received", value: 234 },
  { label: "Remaining", value: -12 },
];
export const bottles = [
  { id: 1, client: "Test4", count: 2 }, { id: 2, client: "Test6", count: 5 },
  { id: 3, client: "Test2", count: 2 }, { id: 4, client: "Testing", count: 1 },
  { id: 5, client: "Test5", count: 3 },
];

export const revenue = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, i) => ({
  month, revenue: [0, 0, 0, 0, 0, 0, 1150, 880, 1370, 0][i],
}));
export const years = ["2026", "2025", "2024"].map((y) => ({ value: y, label: y }));

export const deliveryOptions = [
  { value: "0", label: "All" }, { value: "1", label: "Delivered" }, { value: "2", label: "Delivery Pending" },
];
export const deliveries = [
  { id: 1, client: "Test2", status: "Delivery Pending" },
  { id: 2, client: "Test3", status: "Delivery Pending" },
  { id: 3, client: "Test6", status: "Delivery Pending" },
];


