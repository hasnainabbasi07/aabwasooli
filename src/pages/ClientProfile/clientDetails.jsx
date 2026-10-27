import { useMemo, useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import Badge from "../../component/ui/Badge";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Textarea from "../../component/ui/Textarea";
import Checkbox from "../../component/ui/Checkbox";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { AmountIcon, EditIcon, HistoryIcon, UserCheckIcon, UserOffIcon } from "../../component/ui/Icon";
import { digits, formatAmount, formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import { packages } from "../Master/mock/packageData";
import {
  clients, weekDays, statusFilter, sortOptions, dayFilter, payTypeFilter, payTypeOptions,
  reasonOptions, bottleHistory, clientHistory, depositHistory,
} from "./mock/clientData";

const emptyDays = Object.fromEntries(weekDays.map((d) => [d.key, { on: false, qty: "0" }]));

const emptyForm = {
  name: "", phone1: "0", phone2: "0", areaId: String(areas[0].id), address: "", installDate: "",
  secDeposit: "0", bottleDeposit: "0", payType: payTypeOptions[0].value,
  packageId: String(packages[0].id), amount: "0", latitude: "", longitude: "",
  days: emptyDays,
};

const emptyFilters = { area: "all", pkg: "all", status: "all", sort: "asc", day: "all", payType: "all" };

const areaOptions = areas.map((a) => ({ value: String(a.id), label: a.name }));
const packageOptions = packages.map((p) => ({ value: String(p.id), label: p.name }));
const areaFilter = [{ value: "all", label: "All" }, ...areaOptions];
const packageFilter = [{ value: "all", label: "All" }, ...packageOptions];

const statusBadge = (v) => <Badge tone={v === "Active" ? "success" : "danger"}>{v}</Badge>;
const amountCell = (v) => formatAmount(v);

const bottleColumns = [
  { key: "date", label: "Date", render: formatDate },
  { key: "bottles", label: "Bottles", align: "center" },
  { key: "type", label: "Type" },
];

const clientHistoryColumns = [
  { key: "status", label: "Status", render: statusBadge },
  { key: "date", label: "Date", render: formatDate },
  { key: "reason", label: "Reason" },
];

const depositColumns = [
  { key: "date", label: "Date", render: formatDate },
  { key: "security", label: "Security Deposit", align: "right", render: amountCell },
  { key: "bottle", label: "Bottle Deposit", align: "right", render: amountCell },
];

export default function ClientDetails() {
  const [modal, setModal] = useState(null);
  // "form" | "deactivate" | "activate" | "bottles" | "bottleHistory" | "clientHistory" | "depositHistory" | null

  const [filters, setFilters] = useState(emptyFilters);

  // Add / Edit Client
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding

  // Activate / Deactivate / Add Bottles / histories
  const [selected, setSelected] = useState(null);
  const [extra, setExtra] = useState({ date: "", reason: reasonOptions[0].value, bottle: "", deposit: "", comment: "" });

  const setFilter = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));
  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setDigits = (key) => (value) => setField(key)(digits(value));
  const setExtraField = (key) => (value) => setExtra((e) => ({ ...e, [key]: value }));
  const setDay = (key, patch) =>
    setForm((f) => ({ ...f, days: { ...f.days, [key]: { ...f.days[key], ...patch } } }));
  const close = () => setModal(null);
  const isEdit = editingId !== null;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      phone1: row.phone1,
      phone2: row.phone2,
      areaId: String(row.areaId),
      address: row.address,
      installDate: row.installDate,
      secDeposit: String(row.secDeposit),
      bottleDeposit: String(row.bottleDeposit),
      payType: row.payType,
      packageId: String(row.packageId),
      amount: String(row.amount),
      latitude: row.latitude,
      longitude: row.longitude,
      days: Object.fromEntries(
        weekDays.map((d) => [d.key, { on: row.days[d.key] > 0, qty: String(row.days[d.key]) }])
      ),
    });
    setModal("form");
  };

  const openExtra = (row, type) => {
    setSelected(row);
    setExtra({
      date: "",
      reason: reasonOptions[0].value,
      bottle: type === "activate" ? String(row.bottleDeposit) : "",
      deposit: type === "activate" ? String(row.secDeposit) : "",
      comment: "",
    });
    setModal(type);
  };

  const openHistory = (row, type) => {
    setSelected(row);
    setModal(type);
  };

  const rows = useMemo(() => {
    const list = clients.filter(
      (c) =>
        (filters.area === "all" || String(c.areaId) === filters.area) &&
        (filters.pkg === "all" || String(c.packageId) === filters.pkg) &&
        (filters.status === "all" || c.status === filters.status) &&
        (filters.day === "all" || c.days[filters.day] > 0) &&
        (filters.payType === "all" || c.payType === filters.payType)
    );
    return [...list].sort((a, b) =>
      filters.sort === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [filters]);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "phone1", label: "Contact" },
    { key: "address", label: "Address" },
    { key: "installDate", label: "Ins Date", render: formatDate },
    { key: "status", label: "Status", render: statusBadge },
    {
      key: "balance",
      label: "Balance",
      align: "right",
      render: (v) => <span className={v > 0 ? "font-medium text-danger" : ""}>{formatAmount(v)}</span>,
    },
    { key: "secDeposit", label: "Sec Deposit", align: "right", render: amountCell },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            row.status === "Active"
              ? { label: "Deactivate", icon: <UserOffIcon />, onClick: () => openExtra(row, "deactivate") }
              : { label: "Activate", icon: <UserCheckIcon />, onClick: () => openExtra(row, "activate") },
            { label: "Add Bottles", icon: <AmountIcon />, onClick: () => openExtra(row, "bottles") },
            { label: "Bottles History", icon: <HistoryIcon />, onClick: () => openHistory(row, "bottleHistory") },
            { label: "Client History", icon: <HistoryIcon />, onClick: () => openHistory(row, "clientHistory") },
            { label: "Deposit History", icon: <HistoryIcon />, onClick: () => openHistory(row, "depositHistory") },
          ]}
        />
      ),
    },
  ];

  const clientLabel = selected ? ` - ${selected.name}` : "";

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid grid-flow-col justify-end gap-2">
          <Button onClick={openAdd}>Add Client</Button>
          <Button variant="outline">Print All Bill</Button>
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <SelectField label="Area" options={areaFilter} value={filters.area} onChange={setFilter("area")} />
          <SelectField label="Packages" options={packageFilter} value={filters.pkg} onChange={setFilter("pkg")} />
          <SelectField label="Status" options={statusFilter} value={filters.status} onChange={setFilter("status")} />
          <SelectField label="Sort By" options={sortOptions} value={filters.sort} onChange={setFilter("sort")} />
          <SelectField label="Day Wise" options={dayFilter} value={filters.day} onChange={setFilter("day")} />
          <SelectField label="Payment Type" options={payTypeFilter} value={filters.payType} onChange={setFilter("payType")} />
        </div>

        <DataTable columns={columns} rows={rows} maxHeight={480} paginated />
      </Card>

      {/* Add / Edit Client */}
      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Client Details" : "Add Client Details"}
        size="xl"
        footer={<Button type="submit" form="client-form">{isEdit ? "Update" : "Submit"}</Button>}
      >
        <form
          id="client-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid gap-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextField label="Name" required placeholder="Please Enter Name" autoComplete="off"
              value={form.name} onChange={setField("name")} />
            <TextField label="Contact No.1" required placeholder="03XXXXXXXXX" inputMode="numeric" maxLength={11}
              autoComplete="off" value={form.phone1} onChange={setDigits("phone1")} />
            <TextField label="Contact No.2" placeholder="03XXXXXXXXX" inputMode="numeric" maxLength={11}
              autoComplete="off" value={form.phone2} onChange={setDigits("phone2")} />
            <SelectField label="Area" required options={areaOptions} value={form.areaId} onChange={setField("areaId")} />
            <TextField label="Address" required placeholder="Please Enter Address" autoComplete="off"
              value={form.address} onChange={setField("address")} />
            <TextField label="Install Date" required type="date" value={form.installDate}
              onChange={setField("installDate")} />
            <TextField label="Security Deposit" required inputMode="numeric" autoComplete="off"
              value={form.secDeposit} onChange={setDigits("secDeposit")} />
            <TextField label="Bottle Deposit" required inputMode="numeric" autoComplete="off"
              value={form.bottleDeposit} onChange={setDigits("bottleDeposit")} />
            <SelectField label="Payment Type" required options={payTypeOptions} value={form.payType}
              onChange={setField("payType")} />
            <SelectField label="Packages" required options={packageOptions} value={form.packageId}
              onChange={setField("packageId")} />
            <TextField label="Amount" required inputMode="numeric" autoComplete="off"
              value={form.amount} onChange={setDigits("amount")} />
            <TextField label="Latitude" placeholder="Enter Latitude" inputMode="decimal" autoComplete="off"
              value={form.latitude} onChange={setField("latitude")} />
            <TextField label="Longitude" placeholder="Enter Longitude" inputMode="decimal" autoComplete="off"
              value={form.longitude} onChange={setField("longitude")} />
          </div>

          <div>
            <h4 className="mb-2 text-small font-semibold text-navy">
              Delivery Days <span className="text-red-500">*</span>
            </h4>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {weekDays.map((d) => (
                <div key={d.key} className="grid grid-cols-[1fr_5rem] items-center gap-2">
                  <Checkbox label={d.label} checked={form.days[d.key].on}
                    onChange={(on) => setDay(d.key, { on, qty: on ? form.days[d.key].qty : "0" })} />
                  <TextField type="number" min="0" disabled={!form.days[d.key].on}
                    value={form.days[d.key].qty} onChange={(v) => setDay(d.key, { qty: digits(v) })} />
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Deactivate */}
      <Modal
        open={modal === "deactivate"}
        onClose={close}
        title="Deactivate"
        size="lg"
        footer={<Button type="submit" form="deactivate-form">Add</Button>}
      >
        <form
          id="deactivate-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Client Id" required readOnly value={selected?.id ?? ""} />
          <TextField label="Leaving Date" required type="date" value={extra.date} onChange={setExtraField("date")} />
          <SelectField label="Reason" required options={reasonOptions} value={extra.reason}
            onChange={setExtraField("reason")} />
          <TextField label="Bottle" required placeholder="Enter Bottle" inputMode="numeric" autoComplete="off"
            value={extra.bottle} onChange={(v) => setExtraField("bottle")(digits(v))} />
          <TextField label="Security Deposit" required placeholder="Enter Security Deposit" inputMode="numeric"
            autoComplete="off" value={extra.deposit} onChange={(v) => setExtraField("deposit")(digits(v))} />
          <Textarea label="Comment" required className="sm:col-span-2" value={extra.comment}
            onChange={setExtraField("comment")} />
        </form>
      </Modal>

      {/* Activate */}
      <Modal
        open={modal === "activate"}
        onClose={close}
        title="Activate"
        size="lg"
        footer={<Button type="submit" form="activate-form">Add</Button>}
      >
        <form
          id="activate-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Client Id" required readOnly value={selected?.id ?? ""} />
          <TextField label="Deposit Date" required type="date" value={extra.date} onChange={setExtraField("date")} />
          <TextField label="Security Deposit" required placeholder="Enter Security Deposit" inputMode="numeric"
            autoComplete="off" value={extra.deposit} onChange={(v) => setExtraField("deposit")(digits(v))} />
          <TextField label="Bottle" required placeholder="Enter Bottle Deposit" inputMode="numeric"
            autoComplete="off" value={extra.bottle} onChange={(v) => setExtraField("bottle")(digits(v))} />
        </form>
      </Modal>

      {/* Add Bottles */}
      <Modal
        open={modal === "bottles"}
        onClose={close}
        title={`Add Bottles${clientLabel}`}
        size="sm"
        footer={<Button type="submit" form="bottles-form">Add</Button>}
      >
        <form id="bottles-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
          <TextField label="Bottle" required placeholder="Enter Bottle" inputMode="numeric" autoComplete="off"
            value={extra.bottle} onChange={(v) => setExtraField("bottle")(digits(v))} />
        </form>
      </Modal>

      {/* Histories */}
      <Modal open={modal === "bottleHistory"} onClose={close} title={`Bottles History${clientLabel}`} size="md">
        <DataTable columns={bottleColumns} rows={bottleHistory} maxHeight={320} />
      </Modal>

      <Modal open={modal === "clientHistory"} onClose={close} title={`Client History${clientLabel}`} size="md">
        <DataTable columns={clientHistoryColumns} rows={clientHistory} maxHeight={320} />
      </Modal>

      <Modal open={modal === "depositHistory"} onClose={close} title={`Deposit History${clientLabel}`} size="md">
        <DataTable columns={depositColumns} rows={depositHistory} maxHeight={320} />
      </Modal>
    </div>
  );
}
