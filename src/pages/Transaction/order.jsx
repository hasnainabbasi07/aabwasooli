import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import Badge from "../../component/ui/Badge";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import Modal from "../../component/ui/Modal";
import ActionMenu from "../../component/ui/ActionMenu";
import SegmentedControl from "../../component/ui/SegmentedControl";
import {
  AmountIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  ReturnIcon,
  TruckIcon,
} from "../../component/ui/Icon";
import { digits, formatAmount } from "../../utils/format";
import {
  areas,
  deliveryFilterOptions,
  initialAllClients,
  initialBulkRows,
  initialOrderList,
  initialTodayOrders,
  packages,
  tabOptions,
  transactionTypes,
} from "./mock/orderData";

// Local date (YYYY-MM-DD), not UTC
const todayIso = new Date().toLocaleDateString("en-CA");

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];
const transTypeOptions = transactionTypes.map((t) => ({
  value: String(t.id),
  label: t.name,
}));
const defaultTransType = transTypeOptions[0]?.value ?? "1";

const cellInput =
  "rounded-md border border-line bg-white px-2 py-0.5 text-small outline-none focus:border-primary";

const clientIdOf = (row) => row.clientId ?? row.id;
const priceOf = (row) =>
  packages.find((p) => p.id === row?.packageId)?.deliveryPrice ?? 150;

// onChange helper: field(setForm, "key", digits)
const field =
  (setter, key, clean = (v) => v) =>
  (value) =>
    setter((f) => ({ ...f, [key]: clean(value) }));

const buildDeliveryForm = (row, special = false) => ({
  date: todayIso,
  quantity: 1,
  refill: special ? "0" : String(row.bottles || 1),
  newOrder: special ? "1" : "0",
  emptyReceive: "0",
  receive: "0",
  discount: "0",
  transType: defaultTransType,
  transId: "",
});

const calcDelivery = (row, f) => {
  const bottles = (Number(f.refill) || 0) + (Number(f.newOrder) || 0);
  const previous = row?.balance || 0;
  const total = previous + priceOf(row) * bottles;
  const balance = Math.max(
    0,
    total - (Number(f.receive) || 0) - (Number(f.discount) || 0),
  );
  return { bottles, previous, total, balance };
};

function Info({ label, value }) {
  return (
    <p className="text-small text-ink">
      <span className="font-semibold text-navy">{label}:</span> {value}
    </p>
  );
}

function Counter({ value, onChange }) {
  return (
    <div>
      <span className="mb-1 block text-small font-semibold text-navy">
        Quantity <span className="text-danger">*</span>
      </span>
      <div className="grid grid-flow-col items-center justify-start gap-2">
        <Button variant="soft" onClick={() => onChange(Math.max(1, value - 1))}>
          <MinusIcon />
        </Button>
        <span className="grid h-8 min-w-14 place-items-center rounded-md border border-line bg-white px-3 text-copy font-semibold text-navy">
          {value}
        </span>
        <Button variant="soft" onClick={() => onChange(value + 1)}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

export default function Order() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [deliveryFilter, setDeliveryFilter] = useState("Delivery Pending");

  const [allClients] = useState(initialAllClients);
  const [todayOrders, setTodayOrders] = useState(initialTodayOrders);
  const [orderList, setOrderList] = useState(initialOrderList);
  const [specialCount, setSpecialCount] = useState(0);

  // "addOrder" | "editOrder" | "delivery" | "special" | "collection" | "bulk" | null
  const [modal, setModal] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [orderDate, setOrderDate] = useState(todayIso);
  const [orderQty, setOrderQty] = useState(1);
  const [delivery, setDelivery] = useState(() => buildDeliveryForm({}));
  const [collection, setCollection] = useState({
    date: todayIso,
    receiptId: "",
    receive: "",
    discount: "",
    transType: defaultTransType,
    transId: "",
  });
  const [bulkArea, setBulkArea] = useState("all");
  const [bulkDate, setBulkDate] = useState(todayIso);
  const [bulkRows, setBulkRows] = useState(initialBulkRows);

  const closeModal = () => {
    setModal(null);
    setSelectedRow(null);
  };

  const openAddOrder = (row) => {
    setSelectedRow(row);
    setOrderDate(todayIso);
    setOrderQty(1);
    setModal("addOrder");
  };

  const openEditOrder = (row) => {
    setSelectedRow(row);
    setOrderDate(row.orderDate || todayIso);
    setOrderQty(row.bottles || 1);
    setModal("editOrder");
  };

  const openDelivery = (row) => {
    setSelectedRow(row);
    setDelivery(buildDeliveryForm(row));
    setModal("delivery");
  };

  const openCollection = (row) => {
    setSelectedRow(row);
    setCollection({
      date: todayIso,
      receiptId: "",
      receive: "",
      discount: "",
      transType: defaultTransType,
      transId: "",
    });
    setModal("collection");
  };

  // Past date in the Order modal opens Special Order Delivery
  const handleOrderDate = (value) => {
    if (value && value < todayIso) {
      setDelivery({ ...buildDeliveryForm(selectedRow, true), date: value });
      setModal("special");
      return;
    }
    setOrderDate(value);
  };

  const handleSaveOrder = () => {
    if (modal === "editOrder") {
      setOrderList((prev) =>
        prev.map((o) =>
          o.id === selectedRow.id ? { ...o, bottles: orderQty } : o,
        ),
      );
      closeModal();
      return;
    }
    const entry = {
      id: Math.max(5000, ...orderList.map((o) => o.id)) + 1,
      clientId: clientIdOf(selectedRow),
      name: selectedRow.name,
      phone: selectedRow.phone,
      bottles: orderQty,
      address: selectedRow.address,
      packageId: selectedRow.packageId,
      packageName: selectedRow.packageName,
      payType: selectedRow.payType,
      balance: selectedRow.balance,
      orderDate,
    };
    setOrderList((prev) => [entry, ...prev]);
    closeModal();
  };

  const dv = calcDelivery(selectedRow, delivery);

  const handleSaveDelivery = () => {
    if (modal === "special") {
      setSpecialCount((n) => n + 1);
    } else {
      setTodayOrders((prev) =>
        prev.map((r) =>
          clientIdOf(r) === clientIdOf(selectedRow)
            ? { ...r, status: "Delivered", balance: dv.balance }
            : r,
        ),
      );
    }
    closeModal();
  };

  const handleSaveCollection = () => {
    const received = Number(collection.receive) || 0;
    setTodayOrders((prev) =>
      prev.map((r) =>
        clientIdOf(r) === clientIdOf(selectedRow)
          ? { ...r, balance: Math.max(0, (r.balance || 0) - received) }
          : r,
      ),
    );
    closeModal();
  };

  // Bulk collection
  const filteredBulkRows = useMemo(
    () =>
      bulkArea === "all"
        ? bulkRows
        : bulkRows.filter((r) => String(r.areaId) === bulkArea),
    [bulkRows, bulkArea],
  );
  const selectedBulkCount = bulkRows.filter((r) => r.selected).length;

  const updateBulk = (id, key, value) =>
    setBulkRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );

  const toggleAllBulk = (checked) =>
    setBulkRows((rows) =>
      rows.map((r) =>
        filteredBulkRows.some((f) => f.id === r.id)
          ? { ...r, selected: checked }
          : r,
      ),
    );

  const handleSaveBulk = () => {
    setBulkRows((rows) =>
      rows.map((r) =>
        r.selected ? { ...r, status: "Paid", selected: false } : r,
      ),
    );
    closeModal();
  };

  const bulkColumns = [
    {
      key: "selected",
      align: "center",
      label: (
        <input
          type="checkbox"
          className="size-4 cursor-pointer accent-white"
          checked={
            filteredBulkRows.length > 0 &&
            filteredBulkRows.every((r) => r.selected)
          }
          onChange={(e) => toggleAllBulk(e.target.checked)}
        />
      ),
      render: (value, row) => (
        <input
          type="checkbox"
          className="size-4 cursor-pointer accent-primary"
          checked={!!value}
          onChange={(e) => updateBulk(row.id, "selected", e.target.checked)}
        />
      ),
    },
    { key: "sno", label: "S.No", align: "center" },
    { key: "name", label: "Name" },
    { key: "areaName", label: "Area" },
    { key: "bottles", label: "Bottles", align: "center" },
    {
      key: "ebReceive",
      label: "EB-Receive",
      align: "center",
      render: (value, row) => (
        <input
          className={`w-14 text-center ${cellInput}`}
          value={value}
          onChange={(e) =>
            updateBulk(row.id, "ebReceive", digits(e.target.value))
          }
        />
      ),
    },
    {
      key: "tAmount",
      label: "T-Amount",
      align: "right",
      render: (value) => formatAmount(value),
    },
    {
      key: "aReceive",
      label: "A-Receive",
      align: "right",
      render: (value, row) => (
        <input
          className={`w-20 text-right ${cellInput}`}
          value={value}
          onChange={(e) =>
            updateBulk(row.id, "aReceive", digits(e.target.value))
          }
        />
      ),
    },
    {
      key: "discount",
      label: "Discount",
      align: "right",
      render: (value, row) => (
        <input
          className={`w-16 text-right ${cellInput}`}
          value={value}
          onChange={(e) =>
            updateBulk(row.id, "discount", digits(e.target.value))
          }
        />
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => (
        <Badge tone={value === "Paid" ? "success" : "warning"}>{value}</Badge>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (value, row) => (
        <input
          className={`w-28 ${cellInput}`}
          placeholder="Reason"
          value={value || ""}
          onChange={(e) => updateBulk(row.id, "reason", e.target.value)}
        />
      ),
    },
  ];

  // Main tables
  const actionColumn = (getItems) => ({
    key: "action",
    label: "Action",
    align: "center",
    render: (_, row) => (
      <ActionMenu
        items={getItems(row).map((item) => ({
          ...item,
          onClick: () => item.onClick(row),
        }))}
      />
    ),
  });

  const allColumns = [
    { key: "id", label: "Id", align: "center" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Contact-Number" },
    { key: "address", label: "Address" },
    actionColumn(() => [
      { label: "Order", icon: <PlusIcon />, onClick: openAddOrder },
      { label: "Collection", icon: <AmountIcon />, onClick: openCollection },
    ]),
  ];

  const todayColumns = [
    { key: "sno", label: "S.No", align: "center" },
    { key: "name", label: "Name" },
    { key: "bottles", label: "Bottle", align: "center" },
    { key: "phone", label: "Contact-Number" },
    { key: "address", label: "Address" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v) => (
        <Badge tone={v === "Delivered" ? "success" : "warning"}>{v}</Badge>
      ),
    },
    actionColumn(() => [
      { label: "Delivery", icon: <TruckIcon />, onClick: openDelivery },
    ]),
  ];

  const orderColumns = [
    { key: "id", label: "Id", align: "center" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Contact-Number" },
    { key: "bottles", label: "Bottle", align: "center" },
    { key: "address", label: "Address" },
    actionColumn(() => [
      { label: "Order", icon: <PlusIcon />, onClick: openEditOrder },
      { label: "Return to Order", icon: <ReturnIcon /> },
    ]),
  ];

  const filteredTodayOrders = useMemo(
    () =>
      deliveryFilter === "all"
        ? todayOrders
        : todayOrders.filter((o) => o.status === deliveryFilter),
    [todayOrders, deliveryFilter],
  );

  const tables = {
    all: { columns: allColumns, rows: allClients, search: "Search clients" },
    today: {
      columns: todayColumns,
      rows: filteredTodayOrders,
      search: "Search deliveries",
    },
    order: { columns: orderColumns, rows: orderList, search: "Search orders" },
  };
  const table = tables[activeTab];

  const bottlesDelivered = todayOrders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + (o.bottles || 0), 0);

  const isSpecial = modal === "special";
  const isEditOrder = modal === "editOrder";

  return (
    <div className="grid gap-5">
      <Card bodyClassName="p-4">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-copy text-ink sm:grid sm:gap-0.5">
            <span className="whitespace-nowrap">
              Order Count:{" "}
              <b className="font-semibold text-navy">{orderList.length}</b>
            </span>
            <span className="whitespace-nowrap">
              Bottle Deliver Count:{" "}
              <b className="font-semibold text-navy">{bottlesDelivered}</b>
            </span>
            <span className="whitespace-nowrap">
              Special Order Count:{" "}
              <b className="font-semibold text-navy">{specialCount}</b>
            </span>
          </div>

          {activeTab === "today" && (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:grid-flow-col sm:grid-cols-none">
              <div className="min-w-0 sm:w-44">
                <SelectField
                  label=""
                  options={deliveryFilterOptions}
                  value={deliveryFilter}
                  onChange={setDeliveryFilter}
                />
              </div>
              <Button
                className="whitespace-nowrap"
                onClick={() => setModal("bulk")}
              >
                Bulk Collection
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card bodyClassName="p-4">
        <div className="mb-4">
          <SegmentedControl
            options={tabOptions}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <DataTable
          key={activeTab}
          columns={table.columns}
          rows={table.rows}
          paginated
          searchPlaceholder={table.search}
        />
      </Card>

      {/* Order (new) + Order (edit quantity) */}
      <Modal
        open={modal === "addOrder" || isEditOrder}
        title="Order"
        size="md"
        onClose={closeModal}
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveOrder}>Add</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Info label="Package Name" value={selectedRow?.packageName} />
          <div className="grid grid-cols-2 items-end gap-3">
            <TextField
              label="Date"
              type="date"
              required
              readOnly={isEditOrder}
              value={orderDate}
              onChange={handleOrderDate}
            />
            <Counter value={orderQty} onChange={setOrderQty} />
          </div>
        </div>
      </Modal>

      {/* Delivery + Special Order Delivery (same fields) */}
      <Modal
        open={modal === "delivery" || isSpecial}
        title={isSpecial ? "Special Order Delivery" : "Delivery"}
        size="xl"
        onClose={closeModal}
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="outline"
              icon={<PrinterIcon />}
              onClick={() =>
                navigate("/delivery-receipt", {
                  state: {
                    client: selectedRow,
                    delivery,
                    amounts: dv,
                  },
                })
              }
            >
              Receipt
            </Button>
            <Button onClick={handleSaveDelivery}>Add</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-flow-col justify-start gap-8">
            <Info label="Package Name" value={selectedRow?.packageName} />
            <Info label="Payment Type" value={selectedRow?.payType} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <TextField
              label="Date"
              type="date"
              required
              readOnly={!isSpecial}
              value={delivery.date}
              onChange={field(setDelivery, "date")}
            />
            {isSpecial && (
              <Counter
                value={delivery.quantity}
                onChange={(q) =>
                  setDelivery((f) => ({
                    ...f,
                    quantity: q,
                    newOrder: String(q),
                  }))
                }
              />
            )}
            <TextField
              label="Refill Delivery Bottle"
              required
              disabled={isSpecial}
              value={delivery.refill}
              onChange={field(setDelivery, "refill", digits)}
            />
            <TextField
              label="New Order"
              required
              disabled={isSpecial}
              value={delivery.newOrder}
              onChange={field(setDelivery, "newOrder", digits)}
            />
            <TextField
              label="Delivery Bottles"
              required
              readOnly
              value={String(dv.bottles)}
            />
            <TextField
              label="Empty Bottle Receive"
              required
              value={delivery.emptyReceive}
              onChange={field(setDelivery, "emptyReceive", digits)}
            />
            <TextField
              label="Balance Amount"
              required
              readOnly
              value={formatAmount(dv.balance)}
            />
            <TextField
              label="Previous Balance"
              required
              readOnly
              value={formatAmount(dv.previous)}
            />
            <TextField
              label="Total Amount"
              required
              readOnly
              value={formatAmount(dv.total)}
            />
            <TextField
              label="Receive Amount"
              required
              value={delivery.receive}
              onChange={field(setDelivery, "receive", digits)}
            />
            <TextField
              label="Discount"
              required
              value={delivery.discount}
              onChange={field(setDelivery, "discount", digits)}
            />
            <SelectField
              label="Transaction Type"
              required
              options={transTypeOptions}
              value={delivery.transType}
              onChange={field(setDelivery, "transType")}
            />
            <TextField
              label="Transaction Id"
              placeholder="0"
              value={delivery.transId}
              onChange={field(setDelivery, "transId", digits)}
            />
          </div>
        </div>
      </Modal>

      {/* Collection */}
      <Modal
        open={modal === "collection"}
        title="Collection"
        size="md"
        onClose={closeModal}
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveCollection}>Add</Button>
          </>
        }
      >
        <div className="grid gap-3">
          <Info label="Payment Type" value={selectedRow?.payType} />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Date"
              type="date"
              required
              value={collection.date}
              onChange={field(setCollection, "date")}
            />
            <TextField
              label="Receipt Id"
              required
              value={collection.receiptId}
              onChange={field(setCollection, "receiptId")}
            />
            <TextField
              label="Balance Amount"
              required
              disabled
              value={formatAmount(selectedRow?.balance || 0)}
            />
            <TextField
              label="Receive Amount"
              required
              value={collection.receive}
              onChange={field(setCollection, "receive", digits)}
            />
            <SelectField
              label="Transaction Type"
              required
              options={transTypeOptions}
              value={collection.transType}
              onChange={field(setCollection, "transType")}
            />
            <TextField
              label="Discount"
              placeholder="Enter Discount"
              required
              value={collection.discount}
              onChange={field(setCollection, "discount", digits)}
            />
            <TextField
              label="Transaction Id"
              placeholder="0"
              required
              value={collection.transId}
              onChange={field(setCollection, "transId", digits)}
            />
          </div>
        </div>
      </Modal>

      {/* Bulk Collection */}
      <Modal
        open={modal === "bulk"}
        title="Bulk Collection"
        size="xl"
        onClose={closeModal}
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={!selectedBulkCount} onClick={handleSaveBulk}>
              Add
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <SelectField
              label="Area"
              required
              options={areaOptions}
              value={bulkArea}
              onChange={setBulkArea}
            />
            <TextField
              label="Select Date"
              type="date"
              value={bulkDate}
              onChange={setBulkDate}
            />
          </div>
          <DataTable
            columns={bulkColumns}
            rows={filteredBulkRows}
            maxHeight={360}
          />
        </div>
      </Modal>
    </div>
  );
}
