const names = [
  "Ali Khan", "Usman Ahmad", "Bilal Shah", "Zeeshan Ali", "Hamza Khan", "Imran Gul",
  "Farhan Iqbal", "Kamran Afridi", "Sajid Mehmood", "Naveed Khan", "Waqas Ahmad", "Adnan Shah",
];

export const employees = names.map((name, i) => ({
  id: i + 1,
  name,
  address: `House ${i + 10}, Street ${(i % 5) + 1}, Peshawar`,
  cnic: `17301${String(2345670 + i * 137).padStart(8, "0")}`,
  phone: `0300${String(1234567 + i * 811).padStart(7, "0")}`,
  joinDate: `2026-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
  username: name.split(" ")[0].toLowerCase(),
  password: "123456",
  salary: 25000 + (i % 5) * 2500,
  status: i % 4 === 3 ? "Inactive" : "Active",
}));

export const employeeHistory = [
  { id: 1, status: "Active", date: "2026-03-14" },
  { id: 2, status: "Inactive", date: "2026-06-30" },
  { id: 3, status: "Active", date: "2026-08-01" },
];

export const statusOptions = [
  { value: "0", label: "Inactive" },
  { value: "1", label: "Active" },
];

export const yesNoOptions = [
  { value: "0", label: "No" },
  { value: "1", label: "Yes" },
];