import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon } from "../../component/ui/Icon";
import { transactionTypes } from "./mock/transactionTypeData";

const emptyForm = { name: "", openingBalance: "" };
const digits = (v) => v.replace(/\D/g, "");

export default function TransactionType() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = adding

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const close = () => setOpen(false);
  const isEdit = editingId !== null;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, openingBalance: String(row.openingBalance) });
    setOpen(true);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "openingBalance", label: "Opening Balance" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu items={[{ label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) }]} />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Transaction</Button>
        </div>
        <DataTable columns={columns} rows={transactionTypes} maxHeight={480} paginated />
      </Card>

      {/* Add / Edit Transaction */}
      <Modal
        open={open}
        onClose={close}
        title={isEdit ? "Edit Transaction" : "Add Transaction"}
        size="md"
        footer={<Button type="submit" form="transaction-form">{isEdit ? "Update" : "Add"}</Button>}
      >
        <form
          id="transaction-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <TextField label="Name" required placeholder="Enter Transaction" autoComplete="off"
            value={form.name} onChange={setField("name")} />
          <TextField label="Opening Balance" required placeholder="Enter Amount" inputMode="numeric"
            autoComplete="off" value={form.openingBalance}
            onChange={(v) => setField("openingBalance")(digits(v))} />
        </form>
      </Modal>
    </div>
  );
}