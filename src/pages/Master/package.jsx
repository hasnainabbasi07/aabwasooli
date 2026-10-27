import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon, AmountIcon } from "../../component/ui/Icon";
import { packages, packageTypes, adjustTypes } from "./mock/packageData";

const emptyForm = { name: "", counterPrice: "", deliveryPrice: "", type: "1", actualPrice: "" };
const digits = (v) => v.replace(/\D/g, "");

export default function Package() {
  const [modal, setModal] = useState(null); // "form" | "amount" | null

  // Add / Edit Package form
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding

  // Change Amount form
  const [selected, setSelected] = useState(null);
  const [adjustType, setAdjustType] = useState(adjustTypes[0].value);
  const [adjustAmount, setAdjustAmount] = useState("");

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setPrice = (key) => (value) => setField(key)(digits(value));
  const close = () => setModal(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      counterPrice: String(row.counterPrice),
      deliveryPrice: String(row.deliveryPrice),
      type: packageTypes.find((t) => t.label === row.type)?.value ?? "1",
      actualPrice: String(row.actualPrice),
    });
    setModal("form");
  };

  const openAmount = (row) => {
    setSelected(row);
    setAdjustType(adjustTypes[0].value);
    setAdjustAmount("");
    setModal("amount");
  };

  const newPrice = selected
    ? selected.actualPrice + (adjustType === "1" ? 1 : -1) * Number(adjustAmount || 0)
    : "";

  const isEdit = editingId !== null;

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Package Name" },
    { key: "type", label: "Type" },
    { key: "deliveryPrice", label: "Delivery Price" },
    { key: "actualPrice", label: "Actual Price" },
    { key: "count", label: "Count" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            { label: "Change Amount", icon: <AmountIcon />, onClick: () => openAmount(row) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Package</Button>
        </div>
        <DataTable columns={columns} rows={packages} maxHeight={480} paginated />
      </Card>

      {/* Add / Edit Package */}
      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Package" : "Add Package"}
        size="lg"
        footer={<Button type="submit" form="package-form">{isEdit ? "Update" : "Add"}</Button>}
      >
        <form
          id="package-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Package Name" required placeholder="Enter Package Name" autoComplete="off"
            value={form.name} onChange={setField("name")} />
          <TextField label="Counter Price" required placeholder="Enter Counter Price" inputMode="numeric"
            autoComplete="off" value={form.counterPrice} onChange={setPrice("counterPrice")} />
          <TextField label="Delivery Price" required placeholder="Enter Delivery Price" inputMode="numeric"
            autoComplete="off" value={form.deliveryPrice} onChange={setPrice("deliveryPrice")} />
          <SelectField label="Type" required options={packageTypes} value={form.type} onChange={setField("type")} />
          <TextField label="Buying / Actual Price" required placeholder="Enter Actual Price" inputMode="numeric"
            autoComplete="off" value={form.actualPrice} onChange={setPrice("actualPrice")} />
        </form>
      </Modal>

      {/* Change Amount */}
      <Modal
        open={modal === "amount"}
        onClose={close}
        title="Change Amount"
        size="lg"
        footer={<Button type="submit" form="package-amount-form">Update</Button>}
      >
        <form
          id="package-amount-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Package Name" required readOnly value={selected?.name ?? ""} />
          <SelectField label="Type" required options={adjustTypes} value={adjustType} onChange={setAdjustType} />
          <TextField label="Buying / Actual Price" required readOnly value={selected?.actualPrice ?? ""} />
          <TextField
            label={adjustType === "1" ? "Increment Price" : "Decrement Price"}
            required
            placeholder="Enter New Price"
            inputMode="numeric"
            autoComplete="off"
            value={adjustAmount}
            onChange={(v) => setAdjustAmount(digits(v))}
          />
          <TextField label="New Price" required readOnly value={newPrice} />
        </form>
      </Modal>
    </div>
  );
}