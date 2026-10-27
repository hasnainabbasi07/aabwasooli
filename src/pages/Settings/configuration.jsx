import { useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import Modal from "../../component/ui/Modal";
import TextField from "../../component/ui/TextField";
import ToggleSwitch from "../../component/ui/ToggleSwitch";
import { HandGearIcon } from "../../component/ui/Icon";
import { applicationFeatures, configurationCopy, initialConfigurationFeatures } from "./mock/configurationData";

const FEATURE_STATE_KEY = "wasooli-aab-feature-states";

const getInitialApplicationFeatures = () => {
  try {
    const savedStates = JSON.parse(localStorage.getItem(FEATURE_STATE_KEY) || "{}");
    return applicationFeatures.map((feature) => ({
      ...feature,
      enabled: savedStates[feature.title] ?? true,
    }));
  } catch {
    return applicationFeatures.map((feature) => ({ ...feature, enabled: true }));
  }
};

export default function Configuration() {
  const [features, setFeatures] = useState(initialConfigurationFeatures);
  const [applicationFeatureStates, setApplicationFeatureStates] = useState(getInitialApplicationFeatures);
  const [activeFeature, setActiveFeature] = useState(null);
  const [scheduleTime, setScheduleTime] = useState("08:00");
  const openSchedule = (feature) => { setActiveFeature(feature); setScheduleTime(feature.time); };
  const closeSchedule = () => setActiveFeature(null);
  const saveSchedule = (event) => {
    event.preventDefault();
    if (!activeFeature || !scheduleTime) return;
    setFeatures((rows) => rows.map((feature) => feature.id === activeFeature.id ? { ...feature, enabled: true, time: scheduleTime } : feature));
    closeSchedule();
  };
  const toggleFeature = (feature, enabled) => {
    if (enabled) { openSchedule(feature); return; }
    setFeatures((rows) => rows.map((item) => item.id === feature.id ? { ...item, enabled: false } : item));
  };
  const toggleApplicationFeature = (title, enabled) => {
    setApplicationFeatureStates((current) => {
      const next = current.map((feature) => feature.title === title ? { ...feature, enabled } : feature);
      localStorage.setItem(FEATURE_STATE_KEY, JSON.stringify(Object.fromEntries(next.map(({ title: featureTitle, enabled: isEnabled }) => [featureTitle, isEnabled]))));
      return next;
    });
  };
  const formatTime = (time) => new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return <div className="settings-page settings-configuration grid gap-5">
    <header className="settings-hero"><div className="settings-hero-mark">⚙</div><div><span className="settings-eyebrow">SYSTEM PREFERENCES</span><h1>Configuration</h1><p>Manage application modules and scheduled tasks for your water service.</p></div><span className="settings-hero-chip">{applicationFeatureStates.filter((feature) => feature.enabled).length} MODULES ON</span></header>
    <Card bodyClassName="settings-panel-body px-5 py-5 sm:px-6">
      <div className="settings-panel-heading"><div><h2 className="settings-panel-title">APPLICATION FEATURES</h2><p className="text-small text-menu">Turn available tools and reports on or off for this workspace.</p></div><span className="settings-count">{applicationFeatureStates.filter((feature) => feature.enabled).length} / {applicationFeatureStates.length} ON</span></div>
      <div className="application-feature-grid">
        {applicationFeatureStates.map((feature, index) => <article key={feature.title} className={`application-feature-card ${feature.enabled ? "is-enabled" : "is-disabled"}`}>
          <span className="application-feature-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="application-feature-copy"><span>{feature.category}</span><h3>{feature.title}</h3><p>{feature.description}</p></div>
          <ToggleSwitch checked={feature.enabled} label={`${feature.enabled ? "Turn off" : "Turn on"} ${feature.title}`} onChange={(enabled) => toggleApplicationFeature(feature.title, enabled)} />
        </article>)}
      </div>
    </Card>
    <Card bodyClassName="settings-panel-body px-5 py-5 sm:px-6">
      <div className="settings-panel-heading"><div><h2 className="settings-panel-title">{configurationCopy.title}</h2><p className="text-small text-menu">{configurationCopy.description}</p></div><span className="settings-count">{features.length} FEATURES</span></div>
      <div className="config-feature-grid">
        {features.map((feature) => <article key={feature.id} className={`config-feature ${feature.enabled ? "is-enabled" : ""}`}>
          <span className="config-feature-icon"><HandGearIcon /></span>
          <div className="config-feature-copy"><h3>{feature.title}</h3><p>{feature.description}</p>{feature.enabled && <button type="button" onClick={() => openSchedule(feature)} className="config-schedule">Runs at {formatTime(feature.time)} · Edit schedule</button>}</div>
          <ToggleSwitch checked={feature.enabled} label={`${feature.enabled ? "Disable" : "Enable"} ${feature.title}`} onChange={(enabled) => toggleFeature(feature, enabled)} />
        </article>)}
      </div>
    </Card>
    <Modal open={Boolean(activeFeature)} onClose={closeSchedule} title={configurationCopy.scheduleTitle} size="sm" footer={<><Button variant="soft" onClick={closeSchedule}>Cancel</Button><Button type="submit" form="cron-time-form">Save</Button></>}>
      <form id="cron-time-form" onSubmit={saveSchedule} className="grid gap-4"><p className="text-small text-muted">Set when {activeFeature?.title} should run.</p><TextField label="Cron Job Time" type="time" required value={scheduleTime} onChange={setScheduleTime} /></form>
    </Modal>
  </div>;
}
