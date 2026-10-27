import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import SelectField from "../../component/ui/SelectField";
import ToggleSwitch from "../../component/ui/ToggleSwitch";
import { employees } from "../Master/mock/employeeData";
import { makeDefaultUserRights } from "./mock/userRightData";

const emptySelection = { value: "", label: "Select User" };
export default function UserRight() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [shownUserId, setShownUserId] = useState("");
  const [rightsByUser, setRightsByUser] = useState({});
  const [visibleRights, setVisibleRights] = useState([]);
  const [saved, setSaved] = useState(false);
  const userOptions = useMemo(() => [emptySelection, ...employees.map((employee) => ({ value: String(employee.id), label: employee.name }))], []);
  const showRights = () => {
    if (!selectedUserId) return;
    const savedRights = rightsByUser[selectedUserId];
    setVisibleRights(savedRights ? savedRights.map((right) => ({ ...right })) : makeDefaultUserRights());
    setShownUserId(selectedUserId); setSaved(false);
  };
  const updatePermission = (moduleId, permission, value) => { setVisibleRights((rows) => rows.map((row) => row.id === moduleId ? { ...row, [permission]: value } : row)); setSaved(false); };
  const saveRights = () => { if (!shownUserId) return; setRightsByUser((current) => ({ ...current, [shownUserId]: visibleRights.map((right) => ({ ...right })) })); setSaved(true); };
  const counts = visibleRights.reduce((total, item) => ({ web: total.web + Number(item.web), mobile: total.mobile + Number(item.mobile) }), { web: 0, mobile: 0 });
  const columns = [
    { key: "id", label: "ID", align: "center" }, { key: "name", label: "Module" },
    { key: "web", label: "Web access", align: "center", render: (enabled, row) => <div className="grid justify-items-center"><ToggleSwitch checked={enabled} label={`Web access for ${row.name}`} onChange={(value) => updatePermission(row.id, "web", value)} /></div> },
    { key: "mobile", label: "Mobile access", align: "center", render: (enabled, row) => <div className="grid justify-items-center"><ToggleSwitch checked={enabled} label={`Mobile access for ${row.name}`} onChange={(value) => updatePermission(row.id, "mobile", value)} /></div> },
  ];
  return <div className="settings-page settings-rights grid gap-5">
    <header className="settings-hero"><div className="settings-hero-mark">▦</div><div><span className="settings-eyebrow">TEAM ACCESS CONTROL</span><h1>User Rights</h1><p>Set which modules each team member can access from web and mobile.</p></div><span className="settings-hero-chip">WEB + MOBILE</span></header>
    <Card bodyClassName="settings-panel-body p-4 sm:p-6">
      <div className="rights-filter"><div><h2 className="settings-panel-title">Choose a team member</h2><p className="text-small text-menu">Permissions are managed separately for each account.</p></div><div className="rights-filter-controls"><SelectField label="User account" options={userOptions} value={selectedUserId} onChange={(value) => { setSelectedUserId(value); setSaved(false); }} /><Button onClick={showRights} disabled={!selectedUserId}>Load Permissions</Button></div></div>
      {shownUserId ? <div className="rights-workspace"><div className="rights-summary"><div><span>EDITING ACCESS FOR</span><strong>{employees.find((employee) => String(employee.id) === shownUserId)?.name}</strong></div><div className="rights-counts"><span><i className="web-dot" />Web <b>{counts.web}/{visibleRights.length}</b></span><span><i className="mobile-dot" />Mobile <b>{counts.mobile}/{visibleRights.length}</b></span></div><Button onClick={saveRights} disabled={saved}>{saved ? "Changes saved" : "Save access"}</Button></div><DataTable columns={columns} rows={visibleRights} maxHeight={520} /></div> : <div className="rights-empty"><span>▣</span><strong>Permissions appear here</strong><p>Select a user and load their module access to get started.</p></div>}
    </Card>
  </div>;
}
