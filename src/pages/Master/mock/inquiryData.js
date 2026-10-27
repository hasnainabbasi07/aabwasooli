import { areas } from "./areaData";
import { packages } from "./packageData";

export const dayList = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];

export const emptyDays = Object.fromEntries(dayList.map((d) => [d.key, { on: false, qty: "0" }]));

export const areaOptions = [
  { value: "", label: "Select Area" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];

export const packageOptions = [
  { value: "", label: "Select Package" },
  ...packages.map((p) => ({ value: String(p.id), label: p.name })),
];

export const payTypeOptions = [
  { value: "", label: "Select Option" },
  { value: "Monthly", label: "Monthly" },
  { value: "Weekly", label: "Weekly" },
  { value: "Daily", label: "Daily" },
];

const names = [
  "Ahmad Raza", "Sana Malik", "Tariq Jameel", "Noman Siddiqui", "Hira Fatima", "Asif Mehmood",
  "Rubina Akhtar", "Junaid Khan", "Saad Hussain", "Mariam Bibi", "Fahad Ali", "Kashif Nawaz",
];

export const inquiries = names.map((name, i) => ({
  id: i + 1,
  name,
  contact: `0300${String(1234567 + i * 811).padStart(7, "0")}`,
  contact2: "0",
  areaId: String((i % 12) + 1),
  address: `House ${i + 10}, Street ${(i % 5) + 1}`,
  installDate: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
  status: i % 3 === 2 ? "Converted" : "Pending",
  balance: (i % 4) * 500,
  secDeposit: 1000 + (i % 3) * 500,
  bottleDeposit: (i % 3) * 200,
  payType: ["Monthly", "Weekly", "Daily"][i % 3],
  packageId: String((i % 12) + 1),
  amount: 120 + (i % 4) * 20,
  longitude: "71.5249",
  latitude: "34.0151",
  days: {
    ...emptyDays,
    mon: { on: true, qty: "2" },
    thu: { on: i % 2 === 0, qty: i % 2 === 0 ? "1" : "0" },
  },
}));