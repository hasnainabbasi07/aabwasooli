const rows = [
  ["Cash", 50000],
  ["Easypaisa", 12000],
  ["JazzCash", 8500],
  ["Bank Transfer", 120000],
  ["Cheque", 30000],
  ["Advance", 0],
  ["Discount", 0],
  ["Security Deposit", 15000],
  ["Online Payment", 22000],
  ["Credit", 5000],
  ["Refund", 0],
  ["Other", 1000],
];

export const transactionTypes = rows.map(([name, openingBalance], i) => ({
  id: i + 1,
  name,
  openingBalance,
}));