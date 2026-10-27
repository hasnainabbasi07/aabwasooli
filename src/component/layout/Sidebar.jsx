import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menu, railItems } from "../../config/menu";
import logo from "../../assets/aab-logo.png";

const glyphs = { Dashboard: "◫", "Company Profile": "▦", Master: "◈", "Client Profile": "♙", Transaction: "⇄", Accounts: "▤", "Client Report": "▥", "Accounts Report": "◉", Vendor: "♧", Messages: "✉", Setting: "⚙" };
const Chevron = ({ open }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;

export default function Sidebar({ mobileOpen, onClose }) {
  const { pathname } = useLocation();
  const activeModule = menu.find((group) => group.children?.some((child) => child.to === pathname))?.label ?? null;
  const activeQuick = railItems.find((group) => group.children?.some((child) => child.to === pathname))?.label ?? null;
  const [openGroup, setOpenGroup] = useState(activeModule);
  const [quickGroup, setQuickGroup] = useState(activeQuick);
  useEffect(() => {
    if (activeModule) { setOpenGroup(activeModule); setQuickGroup(null); }
    else if (activeQuick) { setQuickGroup(activeQuick); setOpenGroup(null); }
  }, [activeModule, activeQuick]);

  return <>
    {mobileOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-[#073a59]/45 backdrop-blur-[2px] lg:hidden" onClick={onClose} />}
    <aside className={`app-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Application navigation">
      <div className="app-sidebar-brand"><img src={logo} alt="" /><div><b>Wasooli Aab</b><small>WATER DELIVERY ERP</small></div><button type="button" className="sidebar-close lg:hidden" aria-label="Close menu" onClick={onClose}>×</button></div>
      <div className="app-sidebar-scroll">
        <section className="sidebar-section">
          <p className="sidebar-section-title">QUICK ACCESS</p>
          <div className="quick-links">
            {railItems.map((item) => item.children ? <div className="quick-group" key={item.label}>
              <button type="button" className={`quick-link ${activeQuick === item.label ? "active" : ""}`} aria-expanded={quickGroup === item.label} onClick={() => { setQuickGroup(quickGroup === item.label ? null : item.label); setOpenGroup(null); }}><span className="quick-icon"><img src={item.icon} alt="" /></span><span>{item.label}</span><Chevron open={quickGroup === item.label} /></button>
              {quickGroup === item.label && <ul className="quick-children">{item.children.map((child) => <li key={child.to}><NavLink to={child.to} onClick={onClose} className={({ isActive }) => `quick-child ${isActive ? "active" : ""}`}>{child.label}</NavLink></li>)}</ul>}
            </div> : <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => `quick-link ${isActive ? "active" : ""}`}><span className="quick-icon"><img src={item.icon} alt="" /></span><span>{item.label}</span></NavLink>)}
          </div>
        </section>
        <section className="sidebar-section all-modules">
          <p className="sidebar-section-title">ALL MODULES</p>
          <nav aria-label="All modules"><ul className="module-list">
            {menu.map((item) => {
              const open = openGroup === item.label;
              const active = item.to === pathname || item.children?.some((child) => child.to === pathname);
              return <li key={item.label}>
                {item.children ? <>
                  <button type="button" className={`module-item ${active ? "active" : ""}`} aria-expanded={open} onClick={() => { setOpenGroup(open ? null : item.label); setQuickGroup(null); }}><span className="module-glyph">{glyphs[item.label] || "•"}</span><span className="module-label">{item.label}</span><Chevron open={open} /></button>
                  {open && <ul className="module-children">{item.children.map((child) => <li key={child.to}><NavLink to={child.to} onClick={onClose} className={({ isActive }) => `module-child ${isActive ? "active" : ""}`}>{child.label}</NavLink></li>)}</ul>}
                </> : <NavLink to={item.to} onClick={onClose} className={({ isActive }) => `module-item ${isActive ? "active" : ""}`}><span className="module-glyph">{glyphs[item.label] || "•"}</span><span className="module-label">{item.label}</span></NavLink>}
              </li>;
            })}
          </ul></nav>
        </section>
      </div>
      <div className="sidebar-status"><span /> All systems operational</div>
    </aside>
  </>;
}
