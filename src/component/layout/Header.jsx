import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const ModeIcon = ({ mode }) => mode === "light" ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : mode === "dark" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>;
const Chevron = ({ open }) => <svg className={`admin-chevron ${open ? "is-open" : ""}`} viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4"/></svg>;

export default function Header({ title, onMenuClick, children }) {
  const navigate = useNavigate();
  const { mode, setMode } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const onPointerDown = (event) => { if (!profileRef.current?.contains(event.target)) { setProfileOpen(false); setModeOpen(false); } };
    const onKeyDown = (event) => { if (event.key === "Escape") { setProfileOpen(false); setModeOpen(false); } };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, []);
  const currentMode = mode.charAt(0).toUpperCase() + mode.slice(1);
  const closeProfile = () => { setProfileOpen(false); setModeOpen(false); };
  const signOut = () => { closeProfile(); navigate("/", { replace: true }); };

  return <header className="topbar">
    <div className="topbar-heading"><button type="button" onClick={onMenuClick} aria-label="Open menu" className="menu-toggle lg:hidden"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button><div><span className="eyebrow topbar-brand-title">WATER DELIVERY MANAGEMENT SYSTEM</span><h1>{title}</h1></div></div>
    <div className="topbar-tools">
      <label className="global-search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" placeholder="Search anything..." aria-label="Search"/><kbd>⌘ K</kbd></label>
      <Link to="/counter-sale" className="quick-action">+ <span>New sale</span></Link>
      <button type="button" aria-label="Notifications" className="icon-button"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/></svg><i /></button>
      <div className="profile-menu-wrap" ref={profileRef}>
        <button type="button" className="profile-button" aria-haspopup="menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen((open) => !open); setModeOpen(false); }}><span className="avatar">A</span><span className="profile-meta"><b>Admin</b><small>Administrator</small></span><Chevron open={profileOpen} /></button>
        {profileOpen && <div className="admin-dropdown" role="menu" aria-label="Administrator menu">
          <div className="admin-dropdown-heading"><span className="avatar">A</span><span><b>Admin</b><small>Administrator</small></span></div>
          <div className="admin-dropdown-separator" />
          <div className="admin-mode-wrap" onMouseEnter={() => setModeOpen(true)} onMouseLeave={() => setModeOpen(false)}>
            <button type="button" className="admin-dropdown-item" role="menuitem" aria-haspopup="menu" aria-expanded={modeOpen} onFocus={() => setModeOpen(true)} onClick={() => setModeOpen((open) => !open)}><ModeIcon mode={themeModeIcon(mode)} /><span>Mode</span><small>{currentMode}</small><Chevron open={modeOpen} /></button>
            {modeOpen && <div className="admin-mode-submenu" role="menu" aria-label="Choose appearance mode">{["light", "dark", "system"].map((option) => <button type="button" key={option} role="menuitemradio" aria-checked={mode === option} className={`admin-dropdown-item admin-mode-option ${mode === option ? "selected" : ""}`} onClick={() => { setMode(option); closeProfile(); }}><ModeIcon mode={option} /><span>{option[0].toUpperCase() + option.slice(1)}</span>{mode === option && <span className="admin-mode-check">✓</span>}</button>)}</div>}
          </div>
          <Link to="/settings/credentials" role="menuitem" className="admin-dropdown-item" onClick={closeProfile}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8 3 3-2 2-2-2m-2 4-2-2"/></svg><span>Change Password</span></Link>
          <div className="admin-dropdown-separator" />
          <button type="button" className="admin-dropdown-item signout-item" role="menuitem" onClick={signOut}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></svg><span>Sign Out</span></button>
        </div>}
      </div>
    </div>
    {children && <div className="topbar-extra">{children}</div>}
  </header>;
}
function themeModeIcon(mode) { return mode === "system" ? "system" : mode; }


