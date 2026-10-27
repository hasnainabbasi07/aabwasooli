import logo from "../../assets/aab-logo.png";

export const company = {
  id: "9",
  name: "AQUA PURA SMART",
  address: "office no 1 Saddiqi Mansion near Amin hotel GT Road Peshawar",
  phone1: "03239182016",
  phone2: "03309389987",
  email: "khawaja.sons14@yahoo.com",
  description: "Premium Drinking Mineral Water",
  paymentAccounts: [
    { label: "UBL Bank A/c", value: "PK03UNIL0110002010902447 - AQUA PURA SMART" },
    { label: "JazzCash", value: "03008512227 - Ahmad Murtaza Malhi" },
    { label: "Easypaisa", value: "03008512227 - Ahmad Murtaza Malhi" },
  ],
  logo,
};

export const bottleHistory = [
  { id: 36, count: 200, status: "In", addDate: "14/Mar/2026" },
];

export const bottleOperations = [
  { value: "0", label: "In" },
  { value: "1", label: "Out" },
  { value: "2", label: "Damage" },
];

export const cronFeatures = [
  { value: "1", label: "Daily Delivery Reminder" },
  { value: "2", label: "Payment Reminder" },
  { value: "3", label: "Pending Orders Report" },
];

export const cronJobs = [
  { id: 1, title: "Daily Delivery Reminder", time: "08:00 AM", status: "Active" },
  { id: 2, title: "Payment Reminder", time: "06:00 PM", status: "Active" },
  { id: 3, title: "Pending Orders Report", time: "10:00 PM", status: "Inactive" },
];