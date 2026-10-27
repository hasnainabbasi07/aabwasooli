import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login/login";
import CollectionInvoicePage from "./pages/Transaction/collectionInvoice";
import CollectionSummaryPage from "./pages/Transaction/collectionSummary";
import CounterSaleReceipt from "./pages/Transaction/counterSaleReceipt";
import DeliveryReceipt from "./pages/Transaction/deliveryReceipt";
import { appRoutes } from "./routes/routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/collection-invoice" element={<CollectionInvoicePage />} />
      <Route path="/collection-summary" element={<CollectionSummaryPage />} />
      <Route path="/counter-sale/receipt" element={<CounterSaleReceipt />} />
      <Route path="/delivery-receipt" element={<DeliveryReceipt />} />

      {/* Pages inside the sidebar + header layout */}
      <Route element={<MainLayout />}>
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
