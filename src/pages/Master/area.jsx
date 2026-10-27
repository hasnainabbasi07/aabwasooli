import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon, AmountIcon } from "../../component/ui/Icon";
import { areas, areaTypes } from "./mock/areaData";
import { packages } from "./mock/packageData";

const emptyForm = { name: "", type: areaTypes[0].value };
const digits = (v) => v.replace(/\D/g, "");

const summaryColumns = [
  { key: "totalAreas", label: "Total Areas", align: "center" },
  { key: "totalUsers", label: "Total Users", align: "center" },
];

export default function Area() {
  const [modal, setModal] = useState(null); // "form" | "package" | null

  // Add / Edit Area
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding

  // Package prices for the selected area
  const [selected, setSelected] = useState(null);
  const [prices, setPrices] = useState({});

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const close = () => setModal(null);
  const isEdit = editingId !== null;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, type: row.type });
    setModal("form");
  };

  const openPackages = (row) => {
    setSelected(row);
    setPrices(Object.fromEntries(packages.map((p) => [p.id, String(p.deliveryPrice)])));
    setModal("package");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "userCount", label: "User Count" },
    { key: "date", label: "Date" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            { label: "Package", icon: <AmountIcon />, onClick: () => openPackages(row) },
          ]}
        />
      ),
    },
  ];

  const packageColumns = [
    { key: "name", label: "Package Name" },
    { key: "counterPrice", label: "Counter Price" },
    {
      key: "price",
      label: "Area Price",
      render: (_, row) => (
        <TextField
          className="w-28"
          placeholder="Enter Price"
          inputMode="numeric"
          autoComplete="off"
          value={prices[row.id] ?? ""}
          onChange={(v) => setPrices((p) => ({ ...p, [row.id]: digits(v) }))}
        />
      ),
    },
  ];

  const summary = [
    {
      id: 1,
      totalAreas: areas.length,
      totalUsers: areas.reduce((sum, a) => sum + a.userCount, 0),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Area</Button>
        </div>
        <DataTable columns={columns} rows={areas} maxHeight={480} paginated />
        <div className="mt-4">
          <DataTable columns={summaryColumns} rows={summary} />
        </div>
      </Card>

      {/* Add / Edit Area */}
      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Area" : "Add Area"}
        size="md"
        footer={<Button type="submit" form="area-form">{isEdit ? "Update" : "Add"}</Button>}
      >
        <form
          id="area-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Area" required placeholder="Enter Area" autoComplete="off"
            value={form.name} onChange={setField("name")} />
          <SelectField label="Area Type" required options={areaTypes} value={form.type} onChange={setField("type")} />
        </form>
      </Modal>

      {/* Package prices */}
      <Modal
        open={modal === "package"}
        onClose={close}
        title={selected ? `Package - ${selected.name}` : "Package"}
        size="lg"
        footer={<Button onClick={close}>Save</Button>}
      >
        <DataTable columns={packageColumns} rows={packages} maxHeight={320} />
      </Modal>
    </div>
  );
}