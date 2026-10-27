const names = [
  "Ali Raza", "Usman Ghani", "Bilal Ahmad", "Zeeshan Khan", "Hamza Shah", "Imran Afridi",
  "Farhan Gul", "Kamran Ali", "Sajid Khan", "Naveed Iqbal", "Waqas Shah", "Adnan Khan",
  "Fahad Mehmood", "Shoaib Akhtar", "Junaid Ali", "Rizwan Ahmad", "Tariq Jamil", "Noman Khan",
  "Haris Rauf", "Asad Ullah", "Danish Shah", "Faisal Gul", "Ghazi Khan", "Hassan Ali", "Irfan Khan",
];

const payTypes = ["Monthly", "Weekly", "Daily"];
const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const clients = names.map((name, i) => ({
  id: 1001 + i,
  name,
  phone1: `0300${String(1234567 + i * 811).padStart(7, "0")}`,
  phone2: i % 3 === 0 ? `0333${String(7654321 - i * 523).padStart(7, "0")}` : "0",
  areaId: (i % 12) + 1,
  address: `House ${i + 10}, Street ${(i % 5) + 1}`,
  installDate: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
  status: i % 5 === 4 ? "Inactive" : "Active",
  balance: i % 4 === 0 ? 0 : (i % 6) * 450,
  secDeposit: i % 3 === 0 ? 2000 : 1000,
  bottleDeposit: (i % 4) * 500,
  packageId: (i % 4) + 1,
  payType: payTypes[i % 3],
  amount: 120 * ((i % 4) + 1),
  latitude: (34.0151 + i * 0.002).toFixed(4),
  longitude: (71.5249 + i * 0.002).toFixed(4),
  days: Object.fromEntries(dayKeys.map((d, k) => [d, (i + k) % 3 === 0 ? 1 + (k % 2) : 0])),
}));

export const weekDays = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export const statusFilter = [
  { value: "all", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export const sortOptions = [
  { value: "asc", label: "Name (A-Z)" },
  { value: "desc", label: "Name (Z-A)" },
];

export const dayFilter = [{ value: "all", label: "All" }, ...weekDays.map((d) => ({ value: d.key, label: d.label }))];

export const payTypeFilter = [{ value: "all", label: "All" }, ...payTypes.map((p) => ({ value: p, label: p }))];

export const payTypeOptions = payTypes.map((p) => ({ value: p, label: p }));

export const reasonOptions = [
  { value: "1", label: "Temporary Close" },
  { value: "2", label: "Block Due To Payment" },
  { value: "3", label: "Shift From Current House" },
];

// Shown inside the history modals (same sample rows for every client).
export const bottleHistory = [
  { id: 1, date: "2026-03-14", bottles: 2, type: "Added" },
  { id: 2, date: "2026-05-02", bottles: 1, type: "Added" },
  { id: 3, date: "2026-08-19", bottles: 1, type: "Returned" },
];

export const clientHistory = [
  { id: 1, status: "Active", date: "2026-03-14", reason: "-" },
  { id: 2, status: "Inactive", date: "2026-06-30", reason: "Temporary Close" },
  { id: 3, status: "Active", date: "2026-08-01", reason: "-" },
];

export const depositHistory = [
  { id: 1, date: "2026-03-14", security: 1000, bottle: 500 },
  { id: 2, date: "2026-08-01", security: 1000, bottle: 1000 },
];
