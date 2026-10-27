import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import Badge from "../../component/ui/Badge";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon, HistoryIcon, UserCheckIcon, UserOffIcon } from "../../component/ui/Icon";
import { employees, employeeHistory, statusOptions, yesNoOptions } from "./mock/employeeData";

const emptyForm = {
  name: "", phone: "", cnic: "", address: "", salary: "",
  status: "1", makeUser: "0", joinDate: "",
};

const digits = (v) => v.replace(/\D/g, "");

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "/");

const statusBadge = (v) => <Badge tone={v === "Active" ? "success" : "danger"}>{v}</Badge>;

const historyColumns = [
  { key: "status", label: "Status", render: statusBadge },
  { key: "date", label: "Date", render: formatDate },
];

export default function Employee() {
  const [modal, setModal] = useState(null); // "form" | "active" | "inactive" | "history" | null

  // Add / Edit Operator
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding

  // Active / In Active
  const [selected, setSelected] = useState(null);
  const [statusDate, setStatusDate] = useState("");

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setDigits = (key) => (value) => setField(key)(digits(value));
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
      phone: row.phone,
      cnic: row.cnic,
      address: row.address,
      salary: String(row.salary),
      status: row.status === "Active" ? "1" : "0",
      makeUser: "0",
      joinDate: row.joinDate,
    });
    setModal("form");
  };

  const openStatus = (row, type) => {
    setSelected(row);
    setStatusDate("");
    setModal(type);
  };

  const openHistory = (row) => {
    setSelected(row);
    setModal("history");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "cnic", label: "CNIC" },
    { key: "phone", label: "Cell-phone" },
    { key: "joinDate", label: "Join Date", render: formatDate },
    { key: "username", label: "Username" },
    { key: "password", label: "Password", render: () => "••••••" },
    { key: "salary", label: "Salary" },
    { key: "status", label: "Status", render: statusBadge },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            row.status === "Active"
              ? { label: "In Active", icon: <UserOffIcon />, onClick: () => openStatus(row, "inactive") }
              : { label: "Active", icon: <UserCheckIcon />, onClick: () => openStatus(row, "active") },
            { label: "History", icon: <HistoryIcon />, onClick: () => openHistory(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Operator</Button>
        </div>
        <DataTable columns={columns} rows={employees} maxHeight={480} paginated />
      </Card>

      {/* Add / Edit Operator */}
      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Operator" : "Add Operator"}
        size="xl"
        footer={<Button type="submit" form="operator-form">{isEdit ? "Update" : "Add"}</Button>}
      >
        <form
          id="operator-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <TextField label="Name" required placeholder="Operator Name" autoComplete="off"
            value={form.name} onChange={setField("name")} />
          <TextField label="Phone" required placeholder="03XXXXXXXXX" inputMode="numeric" maxLength={11}
            autoComplete="off" value={form.phone} onChange={setDigits("phone")} />
          <TextField label="CNIC" required placeholder="XXXXXXXXXXXXX" inputMode="numeric" maxLength={13}
            autoComplete="off" value={form.cnic} onChange={setDigits("cnic")} />
          <TextField label="Address" required placeholder="Address" autoComplete="off"
            value={form.address} onChange={setField("address")} />
          <TextField label="Salary" required placeholder="Salary" inputMode="numeric" autoComplete="off"
            value={form.salary} onChange={setDigits("salary")} />
          {!isEdit && (
            <SelectField label="Status" required options={statusOptions} value={form.status}
              onChange={setField("status")} />
          )}
          {!isEdit && (
            <SelectField label="Make User" required options={yesNoOptions} value={form.makeUser}
              onChange={setField("makeUser")} />
          )}
          <TextField label="Join Date" required type="date" value={form.joinDate}
            onChange={setField("joinDate")} />
        </form>
      </Modal>

      {/* Active */}
      <Modal
        open={modal === "active"}
        onClose={close}
        title="Active"
        size="md"
        footer={<Button type="submit" form="active-form">Add</Button>}
      >
        <form
          id="active-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Employee Id" required readOnly value={selected?.id ?? ""} />
          <TextField label="Joining Date" required type="date" value={statusDate} onChange={setStatusDate} />
        </form>
      </Modal>

      {/* In Active */}
      <Modal
        open={modal === "inactive"}
        onClose={close}
        title="In Active"
        size="md"
        footer={<Button type="submit" form="inactive-form">Add</Button>}
      >
        <form
          id="inactive-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Employee ID" required readOnly value={selected?.id ?? ""} />
          <TextField label="Leaving Date" required type="date" value={statusDate} onChange={setStatusDate} />
        </form>
      </Modal>

      {/* Employee History */}
      <Modal
        open={modal === "history"}
        onClose={close}
        title={selected ? `Employee History - ${selected.name}` : "Employee History"}
        size="md"
      >
        <DataTable columns={historyColumns} rows={employeeHistory} maxHeight={320} />
      </Modal>
    </div>
  );
}