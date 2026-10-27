export const initialAccountHeads = [
  { id: 1, masterAccount: "Assets", description: "Cash and bank accounts", accountType: "Asset" },
  { id: 2, masterAccount: "Operating Expenses", description: "Day-to-day business expenses", accountType: "Expenses Account" },
  { id: 3, masterAccount: "Revenue", description: "Income from sales and services", accountType: "Revenue or Income" },
];

export const initialAccountSubHeads = [
  { id: 101, headId: 1, name: "Cash in Hand", description: "Cash available at counter", budget: 0 },
  { id: 102, headId: 1, name: "Bank Account", description: "Business bank balance", budget: 0 },
  { id: 103, headId: 2, name: "Fuel Expense", description: "Delivery and vehicle fuel", budget: 25000 },
  { id: 104, headId: 3, name: "Water Sales", description: "Monthly water sales", budget: 0 },
];

export const accountTypeOptions = [
  { value: "Expenses Account", label: "Expenses Account" },
  { value: "Revenue or Income", label: "Revenue or Income" },
  { value: "Asset", label: "Asset" },
  { value: "Liability", label: "Liability" },
];