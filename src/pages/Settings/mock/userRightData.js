export const userRightModules = [
  { id: 1, name: "Dashboard" },
  { id: 2, name: "Company Profile" },
  { id: 3, name: "Packages" },
  { id: 4, name: "Area" },
  { id: 5, name: "Transaction Type" },
  { id: 6, name: "Employee" },
  { id: 7, name: "Area Allocation" },
  { id: 8, name: "Inquiry" },
  { id: 9, name: "Client Details" },
  { id: 10, name: "Orders" },
  { id: 11, name: "Counter Sale" },
  { id: 12, name: "Collection Details" },
  { id: 13, name: "Account Heads" },
  { id: 14, name: "Account Entry" },
  { id: 15, name: "Account Budget" },
  { id: 16, name: "Balance Sheet" },
  { id: 17, name: "Vendor Details" },
  { id: 18, name: "Change Credentials" },
  { id: 19, name: "Configuration" },
  { id: 20, name: "Users Rights" },
];

export const makeDefaultUserRights = () => userRightModules.map((module) => ({
  ...module,
  web: true,
  mobile: true,
}));