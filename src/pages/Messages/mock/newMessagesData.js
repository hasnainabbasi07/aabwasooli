export const messageParameters = [
  { value: "", label: "Select your Parameters" },
  { value: "Name", label: "Name" },
  { value: "Admin", label: "Admin" },
  { value: "Date", label: "Date" },
  { value: "Company Name", label: "Company Name" },
  { value: "Amount", label: "Amount" },
  { value: "Balance", label: "Balance" },
  { value: "Account Type", label: "Account Type" },
  { value: "Operator", label: "Operator" },
];

export const initialMessages = [
  { id: 1, title: "Payment Reminder", message: "Hello {{Name}}, your outstanding balance is {{Balance}}." },
  { id: 2, title: "Delivery Update", message: "Dear {{Name}}, your delivery is scheduled for {{Date}}." },
  { id: 3, title: "Welcome Message", message: "Welcome to {{Company Name}}, {{Name}}!" },
  { id: 4, title: "Monthly Bill", message: "Dear {{Name}}, your monthly water invoice of {{Amount}} is now generated." },
  { id: 5, title: "Bottle Security Deposit", message: "Dear {{Name}}, please clear your bottle deposit of {{Balance}}." },
];

export const initialMessageTemplates = [
  { id: 1, title: "Payment Reminder", message: "Hello {{Name}}, your outstanding balance is {{Balance}}." },
  { id: 2, title: "Delivery Update", message: "Dear {{Name}}, your delivery is scheduled for {{Date}}." },
  { id: 3, title: "Welcome Message", message: "Welcome to {{Company Name}}, {{Name}}!" },
];

