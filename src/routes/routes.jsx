import Dashboard from "../pages/Dashboard/dashboard";
import CompanyProfile from "../pages/CompanyProfile/companyProfile";

// Master
import Package from "../pages/Master/package";
import Area from "../pages/Master/area";
import TransactionType from "../pages/Master/transactionType";
import Employee from "../pages/Master/employee";
import AreaAllocation from "../pages/Master/areaAllocation";
import Inquiry from "../pages/Master/inquiry";

// Client Profile
import ClientDetails from "../pages/ClientProfile/clientDetails";

// Transaction
import Order from "../pages/Transaction/order";
import CounterSale from "../pages/Transaction/counterSale";
import CollectionDetails from "../pages/Transaction/collectionDetails";

// Accounts
import AccountHead from "../pages/Accounts/accountHead";
import AccountEntry from "../pages/Accounts/accountEntry";
import AccountBudget from "../pages/Accounts/accountBudget";

// Client Report
import ClientCollection from "../pages/ClientReport/clientCollection";
import ClientDefaulter from "../pages/ClientReport/clientDefaulter";
import AdvanceCollection from "../pages/ClientReport/advanceCollection";
import NewClientList from "../pages/ClientReport/newClientList";
import TodayDelivery from "../pages/ClientReport/todayDelivery";
import SecurityDeposit from "../pages/ClientReport/securityDeposit";
import Bottle from "../pages/ClientReport/bottle";
import CounterSaleReport from "../pages/ClientReport/counterSaleReport";
import WeekWiseReport from "../pages/ClientReport/weekWiseReport";
import DeletedCollection from "../pages/ClientReport/deletedCollection";
import DiscountReport from "../pages/ClientReport/discountReport";
import UnpaidReport from "../pages/ClientReport/unpaidReport";
import SalesReport from "../pages/ClientReport/salesReport";
import LogsReport from "../pages/ClientReport/logsReport";

// Accounts Report
import BalanceSheetReport from "../pages/AccountsReport/balanceSheetReport";

// Vendor
import VendorDetails from "../pages/Vendor/vendorDetails";

// Messages
import NewMessages from "../pages/Messages/newMessages";
import DraftMessage from "../pages/Messages/draftMessage";
import OtherMessages from "../pages/Messages/otherMessages";
import SentMessages from "../pages/Messages/sentMessages";
import WhatsappDraftMessages from "../pages/Messages/whatsappDraftMessages";

// Settings
import ChangeCredential from "../pages/Settings/changeCredential";
import Configuration from "../pages/Settings/configuration";
import UserRight from "../pages/Settings/userRight";

// Every page inside the sidebar + header layout. Paths match config/menu.js.
export const appRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/company-profile", element: <CompanyProfile /> },

  // Master
  { path: "/packages", element: <Package /> },
  { path: "/area", element: <Area /> },
  { path: "/transaction-type", element: <TransactionType /> },
  { path: "/employee", element: <Employee /> },
  { path: "/area-allocation", element: <AreaAllocation /> },
  { path: "/inquiry", element: <Inquiry /> },

  // Client Profile
  { path: "/clients", element: <ClientDetails /> },

  // Transaction
  { path: "/orders", element: <Order /> },
  { path: "/counter-sale", element: <CounterSale /> },
  { path: "/collection-details", element: <CollectionDetails /> },

  // Accounts
  { path: "/account-heads", element: <AccountHead /> },
  { path: "/account-entry", element: <AccountEntry /> },
  { path: "/account-budget", element: <AccountBudget /> },

  // Client Report
  { path: "/reports/client-collection", element: <ClientCollection /> },
  { path: "/reports/client-defaulter", element: <ClientDefaulter /> },
  { path: "/reports/advance-collection", element: <AdvanceCollection /> },
  { path: "/reports/new-clients", element: <NewClientList /> },
  { path: "/reports/today-delivery", element: <TodayDelivery /> },
  { path: "/reports/security-deposit", element: <SecurityDeposit /> },
  { path: "/reports/bottles", element: <Bottle /> },
  { path: "/reports/counter-sale", element: <CounterSaleReport /> },
  { path: "/reports/week-delivery", element: <WeekWiseReport /> },
  { path: "/reports/deleted-collection", element: <DeletedCollection /> },
  { path: "/reports/discount", element: <DiscountReport /> },
  { path: "/reports/unpaid", element: <UnpaidReport /> },
  { path: "/reports/sales", element: <SalesReport /> },
  { path: "/reports/logs", element: <LogsReport /> },

  // Accounts Report
  { path: "/balance-sheet", element: <BalanceSheetReport /> },

  // Vendor
  { path: "/vendors", element: <VendorDetails /> },

  // Messages
  { path: "/messages", element: <NewMessages /> },
  { path: "/messages/draft", element: <DraftMessage /> },
  { path: "/messages/other", element: <OtherMessages /> },
  { path: "/messages/sent", element: <SentMessages /> },
  { path: "/messages/whatsapp-draft", element: <WhatsappDraftMessages /> },

  // Settings
  { path: "/settings/credentials", element: <ChangeCredential /> },
  { path: "/settings/configuration", element: <Configuration /> },
  { path: "/settings/users-rights", element: <UserRight /> },
];