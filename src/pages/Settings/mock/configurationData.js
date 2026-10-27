import { cronJobs, cronFeatures } from "../../CompanyProfile/mockData";

const toTimeInput = (value = "08:00 AM") => {
  const [clock, period] = value.split(" ");
  let [hours, minutes] = clock.split(":").map(Number);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const initialConfigurationFeatures = cronFeatures.map((feature) => {
  const job = cronJobs.find((item) => item.title === feature.label);
  return {
    id: Number(feature.value),
    title: feature.label,
    description: `Configure the ${feature.label.toLowerCase()} scheduled job.`,
    enabled: job?.status === "Active",
    time: toTimeInput(job?.time),
  };
});

export const configurationCopy = {
  title: "SCHEDULED TASKS",
  description: "Manage the automated reminders and reports configured for this workspace.",
  scheduleTitle: "Cron Job Time",
};

// Directory of capabilities already present in the application's navigation.
// Keep this separate from scheduled jobs so informational feature cards do not
// appear to be switches that enable or disable whole modules.
export const applicationFeatures = [
  { category: "Workspace", title: "Operations Dashboard", description: "Review delivery, orders, collection, and bottle activity at a glance." },
  { category: "Workspace", title: "Company Profile", description: "Maintain the water service business profile and contact details." },
  { category: "Master Data", title: "Package Catalog", description: "Manage bottle sizes, package types, and delivery pricing." },
  { category: "Master Data", title: "Area Management", description: "Organize service locations and delivery areas." },
  { category: "Master Data", title: "Transaction Types", description: "Maintain the transaction categories used in account entries." },
  { category: "Master Data", title: "Employee Directory", description: "Keep employee records available for daily operations." },
  { category: "Master Data", title: "Area Allocation", description: "Assign service areas for delivery operations." },
  { category: "Master Data", title: "Customer Inquiries", description: "Record and review incoming customer inquiries." },
  { category: "Clients", title: "Client Profiles", description: "Manage client details, addresses, and service information." },
  { category: "Transactions", title: "Order Management", description: "Review and manage customer water delivery orders." },
  { category: "Transactions", title: "Counter Sales", description: "Record walk-in and counter sales transactions." },
  { category: "Transactions", title: "Collection Management", description: "Track customer collections and received amounts." },
  { category: "Accounts", title: "Account Heads", description: "Organize account heads and sub-heads for reporting." },
  { category: "Accounts", title: "Account Entries", description: "Record financial entries against account heads." },
  { category: "Accounts", title: "Account Budgets", description: "Review and maintain account budget records." },
  { category: "Client Reports", title: "Client Collection Report", description: "Review customer collection history and totals." },
  { category: "Client Reports", title: "Client Defaulters", description: "Identify clients with outstanding balances." },
  { category: "Client Reports", title: "Advance Collections", description: "Review advance amounts collected from clients." },
  { category: "Client Reports", title: "New Client List", description: "View newly registered clients for a selected period." },
  { category: "Client Reports", title: "Today Delivery", description: "Summarize daily deliveries, quantities, and balances." },
  { category: "Client Reports", title: "Security Deposits", description: "Review client security and bottle deposit records." },
  { category: "Client Reports", title: "Bottle Report", description: "Track client deposits, refills, and company bottles." },
  { category: "Client Reports", title: "Counter Sale Report", description: "Review recorded counter sale activity." },
  { category: "Client Reports", title: "Week-wise Delivery", description: "Compare delivery activity across a selected week." },
  { category: "Client Reports", title: "Deleted Collections", description: "Review collection records that were deleted." },
  { category: "Client Reports", title: "Discount Report", description: "Review applied discounts and their amounts." },
  { category: "Client Reports", title: "Unpaid Report", description: "See unpaid client amounts and outstanding records." },
  { category: "Client Reports", title: "Sales Report", description: "Review sales activity over the selected date range." },
  { category: "Client Reports", title: "Logs Report", description: "Inspect available activity and audit log records." },
  { category: "Accounts", title: "Balance Sheet", description: "Review account totals and head-wise expenses." },
  { category: "Operations", title: "Vendor Management", description: "Maintain vendor contacts and company details." },
  { category: "Communication", title: "Message Center", description: "Create, draft, review, and send customer messages." },
  { category: "Administration", title: "Credential Management", description: "Update the account's login credentials." },
  { category: "Administration", title: "User Rights", description: "Review and manage the available user permissions." },
  { category: "Administration", title: "Theme Preferences", description: "Choose light, dark, or system appearance across the app." },
];
