// title = the log type chosen in the filter. date = the date the report filters on.
export const logTitleOptions = [
  { value: "new-user", label: "New User" },
  { value: "order-created", label: "Order Created" },
  { value: "payment-received", label: "Payment Received" },
  { value: "login", label: "Login" },
];

export const logRecords = [
  {
    id: 1,
    title: "new-user",
    name: "Test1",
    date: "2026-09-24",
    status: "success",
  },
  {
    id: 2,
    title: "new-user",
    name: "Test2",
    date: "2026-09-27",
    status: "success",
  },
  {
    id: 3,
    title: "new-user",
    name: "Test5",
    date: "2026-10-01",
    status: "failed",
  },
  {
    id: 4,
    title: "order-created",
    name: "Test7",
    date: "2026-10-03",
    status: "success",
  },
  {
    id: 5,
    title: "order-created",
    name: "Test8",
    date: "2026-10-08",
    status: "success",
  },
  {
    id: 6,
    title: "payment-received",
    name: "Test9",
    date: "2026-10-12",
    status: "failed",
  },
  {
    id: 7,
    title: "payment-received",
    name: "Test10",
    date: "2026-10-18",
    status: "success",
  },
  {
    id: 8,
    title: "login",
    name: "Tanveer",
    date: "2026-10-22",
    status: "success",
  },
];
