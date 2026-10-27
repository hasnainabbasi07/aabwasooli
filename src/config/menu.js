import counterIcon from "../assets/counter.png";
import deliveryManIcon from "../assets/delivery-man.png";
import collectionIcon from "../assets/Counter-08.png";
import bottlesIcon from "../assets/bottles.png";
import reportsIcon from "../assets/image.png";

const item = (label, to) => ({ label, to });

// Left blue rail (shortcuts)
export const railItems = [
  { label: "Counter Sale", to: "/counter-sale", icon: counterIcon },
  { label: "Orders", to: "/orders", icon: deliveryManIcon },
  { label: "Collection", to: "/collection-details", icon: collectionIcon },
  { label: "Packages", to: "/packages", icon: bottlesIcon },
  {
    label: "Reports",
    to: "/reports/client-collection",
    icon: reportsIcon,
    children: [
      {
        label: "Client Collection",
        to: "/reports/client-collection",
        icon: "collection",
      },
      {
        label: "Today Delivery",
        to: "/reports/today-delivery",
        icon: "delivery",
      },
      { label: "Bottles Report", to: "/reports/bottles", icon: "bottles" },
      { label: "Balance Sheet", to: "/balance-sheet", icon: "balance" },
    ],
  },
];
// White secondary sidebar
export const menu = [
  item("Dashboard", "/dashboard"),
  item("Company Profile", "/company-profile"),
  {
    label: "Master",
    children: [
      item("Packages", "/packages"),
      item("Area", "/area"),
      item("Transaction Type", "/transaction-type"),
      item("Employee", "/employee"),
      item("Area Allocation", "/area-allocation"),
      item("Inquiry", "/inquiry"),
    ],
  },
  { label: "Client Profile", children: [item("Client Detail", "/clients")] },
  {
    label: "Transaction",
    children: [
      item("Orders", "/orders"),
      item("Counter Sale", "/counter-sale"),
      item("Collection Details", "/collection-details"),
    ],
  },
  {
    label: "Accounts",
    children: [
      item("Account Heads", "/account-heads"),
      item("Account Entry", "/account-entry"),
      item("Account Budget", "/account-budget"),
    ],
  },
  {
    label: "Client Report",
    children: [
      item("Client Collection", "/reports/client-collection"),
      item("Client Defaulter", "/reports/client-defaulter"),
      item("Advance Collection", "/reports/advance-collection"),
      item("New Client List", "/reports/new-clients"),
      item("Today Delivery", "/reports/today-delivery"),
      item("Security Deposit", "/reports/security-deposit"),
      item("Bottles", "/reports/bottles"),
      item("Counter Sale Report", "/reports/counter-sale"),
      item("Week Wise Delivery", "/reports/week-delivery"),
      item("Deleted Collection", "/reports/deleted-collection"),
      item("Discount Report", "/reports/discount"),
      item("Unpaid Report", "/reports/unpaid"),
      item("Sales Report", "/reports/sales"),
      item("Logs Report", "/reports/logs"),
    ],
  },
  {
    label: "Accounts Report",
    children: [item("Balance Sheet", "/balance-sheet")],
  },
  { label: "Vendor", children: [item("Vendor Details", "/vendors")] },
  {
    label: "Messages",
    children: [
      item("New Messages", "/messages"),
      item("Draft Message", "/messages/draft"),
      item("Other Message", "/messages/other"),
      item("Sent Message", "/messages/sent"),
      item("Whatsapp Draft Messages", "/messages/whatsapp-draft"),
    ],
  },
  {
    label: "Setting",
    children: [
      item("Change Credentials", "/settings/credentials"),
      item("Configuration", "/settings/configuration"),
      item("Users Rights", "/settings/users-rights"),
    ],
  },
];

// Page title for the header, taken from the menu
export const findTitle = (pathname) => {
  const all = menu.flatMap((m) => m.children ?? [m]);
  return all.find((m) => m.to === pathname)?.label ?? "Dashboard";
};
