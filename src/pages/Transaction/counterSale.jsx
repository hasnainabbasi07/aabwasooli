import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import { EditIcon, MinusIcon, PlusIcon, PrinterIcon } from "../../component/ui/Icon";
import { digits, formatAmount, formatDate } from "../../utils/format";
import {
  initialSales,
  packages,
  transactionTypes,
} from "./mock/counterSaleData";

const todayIso = new Date().toISOString().split("T")[0];

const productOptions = packages.map((p) => ({
  value: String(p.id),
  label: p.name,
}));

const transTypeOptions = transactionTypes.map((t) => ({
  value: String(t.id),
  label: t.name,
}));

const unitPriceOf = (productId) =>
  packages.find((p) => String(p.id) === productId)?.counterPrice ?? 0;

const emptyForm = () => ({
  productId: productOptions[0]?.value ?? "1",
  quantity: 0,
  discount: "0",
  date: todayIso,
  transType: transTypeOptions[0]?.value ?? "1",
  transId: "",
});

export default function CounterSale() {
  const navigate = useNavigate();
  const [sales, setSales] = useState(initialSales);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const close = () => {
    setModal(null);
    setEditingId(null);
  };

  const unitPrice = unitPriceOf(form.productId);
  const totalAmount = unitPrice * form.quantity;
  const paidAmount = Math.max(0, totalAmount - Number(form.discount || 0));
  const isEdit = editingId !== null;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setModal("form");
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      productId: String(row.packageId),
      quantity: row.quantity,
      discount: String(row.discount ?? 0),
      date: row.date,
      transType: row.transType,
      transId: row.transId ?? "",
    });
    setModal("form");
  };

  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const save = (e) => {
    e.preventDefault();
    const pkg = packages.find((p) => String(p.id) === form.productId);
    const next = {
      packageId: Number(form.productId),
      packageName: pkg?.name ?? "",
      quantity: form.quantity,
      totalAmount,
      discount: Number(form.discount || 0),
      paidAmount,
      date: form.date,
      transType: form.transType,
      transId: form.transId,
    };

    if (isEdit) {
      setSales((rows) =>
        rows.map((row) => (row.id === editingId ? { ...row, ...next } : row)),
      );
    } else {
      const id = sales.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setSales((rows) => [{ id, ...next }, ...rows]);
    }
    close();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "packageName", label: "Package Name" },
    { key: "quantity", label: "Quantity", align: "center" },
    {
      key: "totalAmount",
      label: "Total Amount",
      align: "right",
      render: (v) => formatAmount(v),
    },
    { key: "date", label: "Date", render: formatDate },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
            {
              label: "Receipt",
              icon: <PrinterIcon />,
              onClick: () =>
                navigate("/counter-sale/receipt", { state: { sale: row } }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid justify-items-end">
          <Button onClick={openAdd}>Add Counter Sale</Button>
        </div>
        <DataTable columns={columns} rows={sales} maxHeight={480} paginated />
      </Card>

      <Modal
        open={modal === "form"}
        onClose={close}
        title={isEdit ? "Edit Counter Sale" : "Add Counter Sale"}
        size="lg"
        footer={
          <Button type="submit" form="counter-sale-form">
            {isEdit ? "Update" : "Add"}
          </Button>
        }
      >
        <form
          id="counter-sale-form"
          onSubmit={save}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <SelectField
            label="Product"
            required
            options={productOptions}
            value={form.productId}
            onChange={setField("productId")}
          />

          <div>
            <span className="mb-1 block text-small font-semibold text-navy">
              Quantity <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    quantity: Math.max(0, f.quantity - 1),
                  }))
                }
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-card font-bold text-navy hover:bg-line/60"
              >
                <MinusIcon />
              </button>
              <span className="grid h-9 min-w-16 place-items-center rounded-lg border border-line bg-white px-3 font-semibold text-navy">
                {form.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({ ...f, quantity: f.quantity + 1 }))
                }
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-card font-bold text-navy hover:bg-line/60"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          <TextField
            label="Total Amount"
            required
            readOnly
            value={formatAmount(totalAmount)}
          />
          <TextField
            label="Paid Amount"
            required
            readOnly
            value={formatAmount(paidAmount)}
          />
          <TextField
            label="Discount"
            required
            placeholder="Enter Discount"
            inputMode="numeric"
            autoComplete="off"
            value={form.discount}
            onChange={(v) => setField("discount")(digits(v))}
          />
          <TextField
            label="Date"
            type="date"
            required
            value={form.date}
            onChange={setField("date")}
          />
          <SelectField
            label="Transaction Type"
            required
            options={transTypeOptions}
            value={form.transType}
            onChange={setField("transType")}
          />
          <TextField
            label="Transaction Id"
            placeholder="Enter Transaction Id"
            inputMode="numeric"
            autoComplete="off"
            value={form.transId}
            onChange={(v) => setField("transId")(digits(v))}
          />
        </form>
      </Modal>
    </div>
  );
}
