export const initialOtherMessages = [
  { id: 1, title: "Payment Reminder", message: "Hello {{Name}}, your outstanding balance is {{Balance}}." },
  { id: 2, title: "Delivery Update", message: "Dear {{Name}}, your delivery is scheduled for {{Date}}." },
  { id: 3, title: "Welcome Message", message: "Welcome to {{Company Name}}, {{Name}}!" },
  { id: 4, title: "Monthly Bill Notice", message: "Dear {{Name}}, your monthly water invoice is {{Amount}} for {{Account Type}} plan." },
  { id: 5, title: "Maintenance Alert", message: "Dear {{Name}}, supply maintenance is scheduled in your area on {{Date}}." },
];

export const otherMessageParameters = [
  { value: "Name", label: "Name" },
  { value: "Balance", label: "Balance" },
  { value: "Date", label: "Date" },
  { value: "Company Name", label: "Company Name" },
  { value: "Amount", label: "Amount" },
  { value: "Account Type", label: "Account Type" },
];

