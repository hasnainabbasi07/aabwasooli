export const balanceSheetReportTypes = [
  { value: "balance-sheet", label: "Balance Sheet" },
  { value: "expense", label: "Expense" },
  { value: "head-expense", label: "Head Wise Expense" },
  { value: "account-summary", label: "Account Summary" },
  { value: "transaction-expense", label: "Transaction Wise Expense" },
];

export const reportTypeTitles = Object.fromEntries(
  balanceSheetReportTypes.map(({ value, label }) => [value, label]),
);