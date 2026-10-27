import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import { EyeIcon, EyeOffIcon } from "../../component/ui/Icon";
import { employees as initialEmployees } from "../Master/mock/employeeData";
import { credentialModes, credentialSuccessMessages } from "./mock/changeCredentialData";
import securityIllustration from "../../assets/login page.png";

const emptyUsernameForm = { newUsername: "", confirmUsername: "" };
const emptyPasswordForm = { newPassword: "", confirmPassword: "" };
export default function ChangeCredential() {
  const [mode, setMode] = useState("username");
  const [users, setUsers] = useState(initialEmployees);
  const [usernameUserId, setUsernameUserId] = useState("");
  const [passwordUserId, setPasswordUserId] = useState("");
  const [usernameForm, setUsernameForm] = useState(emptyUsernameForm);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [visiblePasswords, setVisiblePasswords] = useState({ newPassword: false, confirmPassword: false });
  const [feedback, setFeedback] = useState(null);
  const userOptions = useMemo(() => [{ value: "", label: "Select User" }, ...users.map((user) => ({ value: String(user.id), label: user.name }))], [users]);
  const updateMode = (value) => { setMode(value); setFeedback(null); };
  const saveUsername = (event) => {
    event.preventDefault(); const newUsername = usernameForm.newUsername.trim();
    if (!usernameUserId || !newUsername || newUsername !== usernameForm.confirmUsername.trim()) { setFeedback({ type: "error", message: "Select a user and enter matching usernames." }); return; }
    const userId = Number(usernameUserId); setUsers((rows) => rows.map((user) => user.id === userId ? { ...user, username: newUsername } : user));
    setUsernameForm(emptyUsernameForm); setFeedback({ type: "success", message: credentialSuccessMessages.username });
  };
  const savePassword = (event) => {
    event.preventDefault();
    if (!passwordUserId || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) { setFeedback({ type: "error", message: "Select a user and enter matching passwords." }); return; }
    const userId = Number(passwordUserId); setUsers((rows) => rows.map((user) => user.id === userId ? { ...user, password: passwordForm.newPassword } : user));
    setPasswordForm(emptyPasswordForm); setFeedback({ type: "success", message: credentialSuccessMessages.password });
  };
  const togglePassword = (field) => setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  return <div className="settings-page settings-credentials grid gap-5">
    <header className="settings-hero"><div className="settings-hero-mark">♙</div><div><span className="settings-eyebrow">ACCOUNT SECURITY</span><h1>Credentials</h1><p>Safely manage usernames and passwords for your team accounts.</p></div><span className="settings-hero-chip">SECURE ACCESS</span></header>
    <Card bodyClassName="settings-credential-body p-4 sm:p-6">
      <div className="credential-mode-row"><div><h2 className="settings-panel-title">Update account credentials</h2><p className="text-small text-menu">Choose what you want to update, then select the account.</p></div><div className="credential-mode-field"><SelectField label="Update" options={credentialModes} value={mode} onChange={updateMode} /></div></div>
      <div className="credential-layout">
        <aside className="credential-art"><div className="credential-art-copy"><span>WASOOLI AAB · SECURITY</span><h3>Keep every account protected.</h3><p>Use a strong, unique password for each team member.</p></div><img src={securityIllustration} alt="Wasooli Aab secure account access" /></aside>
        {mode === "username" ? <section className="credential-form-panel"><div className="credential-form-heading"><span>01</span><div><h2>Change username</h2><p>Choose an account and set its new username.</p></div></div><form onSubmit={saveUsername} className="grid max-w-md gap-4">
          <SelectField label="Select User" required options={userOptions} value={usernameUserId} selectClassName="px-4 py-2.5" onChange={(value) => { setUsernameUserId(value); setFeedback(null); }} />
          <TextField label="New Username" required autoComplete="username" placeholder="Enter new username" value={usernameForm.newUsername} inputClassName="px-4 py-2.5" onChange={(value) => setUsernameForm((current) => ({ ...current, newUsername: value }))} />
          <TextField label="Confirm Username" required autoComplete="off" placeholder="Confirm new username" value={usernameForm.confirmUsername} inputClassName="px-4 py-2.5" onChange={(value) => setUsernameForm((current) => ({ ...current, confirmUsername: value }))} />
          {feedback && <FeedbackMessage feedback={feedback} />}<Button type="submit" className="justify-self-start">Update Username</Button>
        </form></section> : <section className="credential-form-panel"><div className="credential-form-heading"><span>02</span><div><h2>Change password</h2><p>Choose an account and create a new password.</p></div></div><form onSubmit={savePassword} className="grid max-w-md gap-4">
          <SelectField label="Select User" required options={userOptions} value={passwordUserId} selectClassName="px-4 py-2.5" onChange={(value) => { setPasswordUserId(value); setFeedback(null); }} />
          <PasswordField label="New Password" value={passwordForm.newPassword} visible={visiblePasswords.newPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} onToggle={() => togglePassword("newPassword")} />
          <PasswordField label="Confirm Password" value={passwordForm.confirmPassword} visible={visiblePasswords.confirmPassword} onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))} onToggle={() => togglePassword("confirmPassword")} />
          {feedback && <FeedbackMessage feedback={feedback} />}<Button type="submit" className="justify-self-start">Update Password</Button>
        </form></section>}
      </div>
    </Card>
  </div>;
}
function PasswordField({ label, value, visible, onChange, onToggle }) {
  return <div className="relative"><TextField label={label} required type={visible ? "text" : "password"} autoComplete="new-password" placeholder={label} value={value} onChange={onChange} inputClassName="px-4 py-2.5" className="pr-11" /><button type="button" onClick={onToggle} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-2 top-[1.55rem] grid size-8 place-items-center rounded-md text-menu transition hover:bg-page hover:text-primary">{visible ? <EyeOffIcon /> : <EyeIcon />}</button></div>;
}
function FeedbackMessage({ feedback }) { return <p role={feedback.type === "error" ? "alert" : "status"} className={`text-small ${feedback.type === "error" ? "text-danger" : "text-success"}`}>{feedback.message}</p>; }
