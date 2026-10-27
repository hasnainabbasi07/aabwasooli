import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import Badge from "../../component/ui/Badge";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Checkbox from "../../component/ui/Checkbox";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon, UserCheckIcon } from "../../component/ui/Icon";
import {
  inquiries, dayList, emptyDays, areaOptions, packageOptions, payTypeOptions,
} from "./mock/inquiryData";

const emptyForm = {
  name: "", contact: "0", contact2: "0", areaId: "", address: "", installDate: "",
  secDeposit: "0", bottleDeposit: "0", payType: "", packageId: "", amount: "0",
  longitude: "", latitude: "", days: emptyDays,
};

const digits = (v) => v.replace(/\D/g, "");
const decimal = (v) => v.replace(/[^\d.]/g, "");

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "/");

const statusBadge = (v) => <Badge tone={v === "Converted" ? "success" : "warning"}>{v}</Badge>;

export default function Inquiry() {
  const [modal, setModal] = useState(null); // "form" | "send" | null

  // Add / Edit Inquiry
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding
  const [selected, setSelected] = useState(null);

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setDigits = (key) => (value) => setField(key)(digits(value));
  const setDecimal = (key) => (value) => setField(key)(decimal(value));
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
      contact: row.contact,
      contact2: row.contact2,
      areaId: row.areaId,
      address: row.address,
      installDate: row.installDate,
      secDeposit: String(row.secDeposit),
      bottleDeposit: String(row.bottleDeposit),
      payType: row.payType,
      packageId: row.packageId,
      amount: String(row.amount),
      longitude: row.longitude,
      latitude: row.latitude,
      days: row.days,
    });
    setModal("form");
  };

  const openSend = (row) => {
    setSelected(row);
    setModal("send");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "contact", label: "Contact" },
    { key: "address", label: "Address" },
    { key: "installDate", label: "Ins Date", render: formatDate },
    { key: "status", label: "Status", render: statusBadge },
    { key: "balance", label: "Balance" },
    { key: "secDeposit", label: "Sec Dep" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            { label: "Send to User", icon: <UserCheckIcon />, onClick: () => openSend(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Inquiry</Button>
        </div>
        <DataTable columns={columns} rows={inquiries} maxHeight={480} paginated />
      </Card>

      {/* Add / Edit Inquiry */}
      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Inquiry Details" : "Add Inquiry Details"}
        size="xl"
        footer={<Button type="submit" form="inquiry-form">{isEdit ? "Update" : "Submit"}</Button>}
      >
        <form
          id="inquiry-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid gap-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextField label="Name" required placeholder="Please Enter Name" autoComplete="off"
              value={form.name} onChange={setField("name")} />
            <TextField label="Contact No.1" required placeholder="03XXXXXXXXX" inputMode="numeric" maxLength={11}
              autoComplete="off" value={form.contact} onChange={setDigits("contact")} />
            <TextField label="Contact No.2" required placeholder="03XXXXXXXXX" inputMode="numeric" maxLength={11}
              autoComplete="off" value={form.contact2} onChange={setDigits("contact2")} />
            <SelectField label="Area" required options={areaOptions} value={form.areaId}
              onChange={setField("areaId")} />
            <TextField label="Address" required placeholder="Please Enter Address" autoComplete="off"
              value={form.address} onChange={setField("address")} />
            <TextField label="Install Date" required type="date" value={form.installDate}
              onChange={setField("installDate")} />
            <TextField label="Security Deposit" required placeholder="Security Deposit" inputMode="numeric"
              autoComplete="off" value={form.secDeposit} onChange={setDigits("secDeposit")} />
            <TextField label="Bottle Deposit" required placeholder="Bottle Deposit" inputMode="numeric"
              autoComplete="off" value={form.bottleDeposit} onChange={setDigits("bottleDeposit")} />
            <SelectField label="Payment Type" required options={payTypeOptions} value={form.payType}
              onChange={setField("payType")} />
            <SelectField label="Packages" required options={packageOptions} value={form.packageId}
              onChange={setField("packageId")} />
            <TextField label="Amount" required placeholder="Enter Amount" inputMode="numeric"
              autoComplete="off" value={form.amount} onChange={setDigits("amount")} />
            <TextField label="Longitude" required placeholder="Enter Longitude" inputMode="decimal"
              autoComplete="off" value={form.longitude} onChange={setDecimal("longitude")} />
            <TextField label="Latitude" required placeholder="Enter Latitude" inputMode="decimal"
              autoComplete="off" value={form.latitude} onChange={setDecimal("latitude")} />
          </div>

          <div className="grid gap-3">
            <span className="text-small font-semibold text-navy">
              Delivery Days<span className="text-red-500"> *</span>
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {dayList.map(({ key, label }) => (
                <div key={key} className="grid grid-cols-[1fr_5rem] items-center gap-2">
                  <Checkbox label={label} checked={form.days[key].on}
                    onChange={(on) => setDay(key, { on })} />
                  <TextField type="number" min="0" inputMode="numeric" autoComplete="off"
                    disabled={!form.days[key].on} value={form.days[key].qty}
                    onChange={(qty) => setDay(key, { qty: digits(qty) })} />
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Send to User */}
      <Modal
        open={modal === "send"}
        onClose={close}
        title="Send to User"
        size="md"
        footer={
          <>
            <Button variant="soft" onClick={close}>Cancel</Button>
            <Button onClick={close}>Send</Button>
          </>
        }
      >
        <p className="text-copy text-ink">
          Are you sure you want to send <b>{selected?.name}</b> to users?
        </p>
      </Modal>
    </div>
  );
}