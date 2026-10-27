import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../component/layout/Sidebar";
import Header from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { findTitle } from "../config/menu";

export default function MainLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="app-shell min-h-screen lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
    <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    <div className="workspace min-w-0"><Header title={findTitle(pathname)} onMenuClick={() => setMobileOpen(true)} /><main className="page-content min-w-0"><Outlet /></main><Footer /></div>
  </div>;
}
