import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/aab-logo.png";
import illustration from "../../assets/boy.png";
import partnerLogo from "../../assets/ll-logo.png";
import ThemeToggle from "../../component/layout/ThemeToggle";

function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>; }
function EyeIcon({ open }) { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{open ? <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M3 10c2.2 3 5.4 4.5 9 4.5s6.8-1.5 9-4.5"/><path d="M7 14l-1.5 2.5M12 15.2V18M17 14l1.5 2.5"/></>}</svg>; }
export default function Login({ onSubmit }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => { event.preventDefault(); setLoading(true); try { await onSubmit?.({ username, password }); navigate("/dashboard"); } finally { setLoading(false); } };
  return <main className="login-page">
    <section className="login-showcase"><div className="login-orbit login-orbit-one"/><div className="login-orbit login-orbit-two"/><div className="login-brand"><img src={logo} alt=""/><span>WASOOLI <b>AAB</b><small>WATER DELIVERY ERP</small></span></div><div className="login-showcase-copy"><span className="login-overline">WATER DELIVERY MANAGEMENT</span><h1>Every delivery.<br/><em>In good flow.</em></h1><p>Manage your water business from one clear, connected workspace.</p><div className="login-showcase-points"><span><i>✓</i> Daily collections</span><span><i>✓</i> Team and client accounts</span></div></div><img src={illustration} alt="Water delivery team member" className="login-illustration"/><div className="login-system-pill"><i/> All systems ready</div></section>
    <section className="login-content"><ThemeToggle className="login-theme-toggle"/><div className="login-form-card"><div className="login-mobile-brand"><img src={logo} alt=""/><span>WASOOLI AAB<small>WATER DELIVERY ERP</small></span></div><span className="login-form-kicker">WELCOME BACK</span><h2>Sign in to your account</h2><p className="login-form-intro">Enter your account details to continue.</p>
      <form onSubmit={handleSubmit} className="login-form"><label htmlFor="login-username">Username</label><div className="login-input-wrap"><input id="login-username" type="text" placeholder="Your username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required/><UserIcon/></div><label htmlFor="login-password">Password</label><div className="login-input-wrap"><input id="login-password" type={showPassword ? "text" : "password"} placeholder="Your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}><EyeIcon open={showPassword}/></button></div><div className="login-form-meta"><span>Authorized team members only</span><span className="login-lock">● Secure login</span></div><button type="submit" disabled={loading} className="login-submit">{loading ? "Signing in…" : "Sign in"}<span>→</span></button></form>
      <div className="login-form-footer"><span>POWERED BY</span><img src={partnerLogo} alt="Logics Labs"/></div></div></section>
  </main>;
}


