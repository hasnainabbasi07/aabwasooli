import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../component/ui/ActionMenu";
import Badge from "../../component/ui/Badge";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import Textarea from "../../component/ui/Textarea";
import TextField from "../../component/ui/TextField";
import {
  AmountIcon,
  HistoryIcon,
  InvoiceIcon,
  TrashIcon,
  UserOffIcon,
} from "../../component/ui/Icon";
import { digits, formatAmount } from "../../utils/format";
import { company as companyProfile } from "../CompanyProfile/mockData";
import {
  initialClients,
  initialCollections,
  initialHistory,
  transactionTypes,
} from "./mock/collectionData";

const today = new Date().toISOString().slice(0, 10);
const transactionOptions = transactionTypes.map((type) => ({
  value: String(type.id),
  label: type.name,
}));

const statusBadge = (status) => (
  <Badge
    tone={
      status === "Paid"
        ? "success"
        : status === "Partial"
          ? "warning"
          : "danger"
    }
  >
    {status}
  </Badge>
);

const makeReceiveForm = (balance, receiptId) => ({
  date: today,
  receiptId,
  balance,
  receiveAmount: String(balance),
  discount: "0",
  emptyBottles: "0",
  transType: transactionOptions[0]?.value ?? "1",
  transId: "",
});

export default function CollectionDetails() {
  const navigate = useNavigate();
  const [people, setPeople] = useState(initialClients);
  const [collections, setCollections] = useState(initialCollections);
  const [history, setHistory] = useState(initialHistory);
  const [clientId, setClientId] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [amountForm, setAmountForm] = useState({
    id: "",
    name: "",
    amount: "",
    comment: "",
  });
  const [receiveForm, setReceiveForm] = useState(makeReceiveForm(0, ""));
  const [advanceAmountToRemove, setAdvanceAmountToRemove] = useState("");

  const clientOptions = useMemo(
    () => people.filter((person) => {
      const query = clientSearch.trim().toLowerCase();
      return !query || String(person.id).toLowerCase().includes(query) || person.name.toLowerCase().includes(query);
    }),
    [people, clientSearch],
  );
  const selectedClient =
    people.find((person) => String(person.id) === clientId) ?? null;
  const visibleCollections = clientId
    ? collections.filter((row) => String(row.clientId) === clientId)
    : [];
  const visibleHistory = clientId
    ? history.filter((row) => String(row.clientId) === clientId)
    : [];
  const totalBalance = visibleCollections.reduce(
    (sum, row) => sum + Number(row.balance || 0),
    0,
  );
  const clientAdvance = selectedClient?.advanceAmount ?? 0;
  const amountTarget = selectedClient
    ? (visibleCollections.find((row) => row.status === "Unpaid") ??
      visibleCollections[0])
    : null;

  const closeModal = () => {
    setModal(null);
    setSelectedRow(null);
    setSelectedReceipt(null);
  };

  const openAddAmount = (row) => {
    if (!row) return;
    setSelectedRow(row);
    setAmountForm({
      id: String(row.clientId),
      name: row.name,
      amount: "",
      comment: "",
    });
    setModal("amount");
  };

  const openReceiving = () => {
    const receiptId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    setReceiveForm(makeReceiveForm(totalBalance, receiptId));
    setModal("receive");
  };

  const openReceipt = (record, row = null) => {
    setSelectedRow(row);
    setSelectedReceipt(record);
    setModal("receipt");
  };

  const openCollectionSummary = () => {
    if (!selectedClient) return;
    const clientCollections = visibleCollections.filter(
      (row) => String(row.clientId) === String(selectedClient.id),
    );
    const clientHistory = visibleHistory.filter(
      (row) => String(row.clientId) === String(selectedClient.id),
    );
    const summary = {
      customer: { id: selectedClient.id, name: selectedClient.name },
      rows: clientHistory.map((row) => {
        const relatedCollection = clientCollections.find(
          (entry) => entry.monthYear === row.monthYear,
        );
        return {
          id: row.id,
          balance: Number(relatedCollection?.balance ?? 0),
          received: Number(row.received ?? 0),
          date: row.date ?? row.monthYear,
        };
      }),
    };
    try { window.sessionStorage.setItem("wasooli-aab-current-summary", JSON.stringify(summary)); } catch { /* Route state remains available for this navigation. */ }
    navigate("/collection-summary", { state: { summary } });
  };
  const openCollectionInvoice = (version) => {
    // Invoices are always scoped to the explicitly selected client.
    if (!selectedClient) return;
    const customerCollections = visibleCollections.filter(
      (row) => String(row.clientId) === String(selectedClient.id),
    );
    const customerHistory = visibleHistory.filter(
      (row) => String(row.clientId) === String(selectedClient.id),
    );
    const received = customerHistory.reduce((sum, entry) => sum + Number(entry.received || 0), 0);
    const discount = customerHistory.reduce((sum, entry) => sum + Number(entry.discount || 0), 0);
    const netAmount = customerCollections.reduce((sum, row) => sum + Number(row.balance || 0), 0);
    const invoice = {
      version,
      company: companyProfile,
      issuedOn: new Date().toISOString().slice(0, 10),
      customer: {
        name: selectedClient.name,
        address: selectedClient.address,
        phone1: selectedClient.phone1 ?? selectedClient.cell,
        phone2: selectedClient.phone2,
      },
      clientCount: 1,
      collectionId: customerCollections[0]?.id ?? null,
      bottleCount: customerCollections.reduce((sum, row) => sum + Number(row.bottles || 0), 0),
      rows: customerCollections.slice(0, 3).map((row) => ({ ...row })),
      received,
      discount,
      actualAmount: netAmount + received + discount,
      netAmount,
    };
    try { window.sessionStorage.setItem("wasooli-aab-current-invoice", JSON.stringify(invoice)); } catch { /* Route state remains available for this navigation. */ }
    navigate("/collection-invoice", { state: { invoice } });
  };
  const saveAmount = (event) => {
    event.preventDefault();
    const extra = Number(amountForm.amount || 0);
    if (!selectedRow || extra <= 0) return;
    setCollections((rows) =>
      rows.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              balance: Number(row.balance || 0) + extra,
              status: "Unpaid",
            }
          : row,
      ),
    );
    closeModal();
  };

  const saveReceiving = (event) => {
    event.preventDefault();
    let receivedLeft = Number(receiveForm.receiveAmount || 0);
    let discountLeft = Number(receiveForm.discount || 0);
    if (receivedLeft + discountLeft <= 0) return closeModal();

    const updatedRows = [];
    const newHistory = [];
    for (const row of visibleCollections) {
      const balance = Number(row.balance || 0);
      if (balance <= 0 || (receivedLeft <= 0 && discountLeft <= 0)) continue;

      const discount = Math.min(balance, discountLeft);
      discountLeft -= discount;
      const received = Math.min(balance - discount, receivedLeft);
      receivedLeft -= received;
      const nextBalance = balance - discount - received;
      const nextStatus = nextBalance === 0 ? "Paid" : "Partial";
      updatedRows.push({ ...row, balance: nextBalance, status: nextStatus });
      newHistory.push({
        id: 0,
        clientId: row.clientId,
        name: row.name,
        address: row.address,
        bottleCount: Number(receiveForm.emptyBottles || 0),
        monthYear: row.monthYear,
        receiptId: receiveForm.receiptId,
        date: receiveForm.date,
        discount,
        received,
        status: nextStatus,
      });
    }

    if (updatedRows.length) {
      const updatedById = new Map(updatedRows.map((row) => [row.id, row]));
      setCollections((rows) =>
        rows.map((row) => updatedById.get(row.id) ?? row),
      );
      setHistory((rows) => {
        let nextId = rows.reduce(
          (max, row) => Math.max(max, Number(row.id) || 0),
          8000,
        );
        return [
          ...newHistory.map((entry) => ({ ...entry, id: ++nextId })),
          ...rows,
        ];
      });
    }
    closeModal();
  };

  const removeAdvance = (event) => {
    event.preventDefault();
    if (!selectedClient) return closeModal();
    const take = Math.min(Number(advanceAmountToRemove || 0), clientAdvance);
    setPeople((rows) =>
      rows.map((person) =>
        person.id === selectedClient.id
          ? {
              ...person,
              advanceAmount: Math.max(0, person.advanceAmount - take),
            }
          : person,
      ),
    );
    closeModal();
  };

  const markUnpaid = (row) => {
    setCollections((rows) =>
      rows.map((item) =>
        item.id === row.id ? { ...item, status: "Unpaid" } : item,
      ),
    );
  };

  const markHistoryUnpaid = (entry) => {
    setHistory((rows) =>
      rows.map((row) =>
        row.id === entry.id ? { ...row, status: "Unpaid" } : row,
      ),
    );
    setCollections((rows) =>
      rows.map((row) =>
        row.clientId === entry.clientId && row.monthYear === entry.monthYear
          ? { ...row, status: "Unpaid" }
          : row,
      ),
    );
  };

  const deleteCollection = () => {
    if (!selectedRow) return closeModal();
    setCollections((rows) => rows.filter((row) => row.id !== selectedRow.id));
    closeModal();
  };

  const receiptForCollection = (row) =>
    history.find(
      (entry) =>
        entry.clientId === row.clientId &&
        entry.monthYear === row.monthYear &&
        entry.status === "Paid",
    ) ?? null;

  const collectionColumns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "monthYear", label: "Month/Year" },
    {
      key: "balance",
      label: "Balance",
      align: "right",
      render: (value) => formatAmount(value),
    },
    { key: "status", label: "Status", render: statusBadge },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => {
        if (row.status === "Unpaid") {
          return (
            <ActionMenu
              items={[
                {
                  label: "Delete",
                  icon: <TrashIcon />,
                  tone: "danger",
                  onClick: () => {
                    setSelectedRow(row);
                    setModal("delete");
                  },
                },
              ]}
            />
          );
        }
        return (
          <ActionMenu
            items={[
              {
                label: "Receipt",
                icon: <HistoryIcon />,
                onClick: () => openReceipt(receiptForCollection(row), row),
              },
              ...(row.status === "Paid"
                ? [
                    {
                      label: "Unpaid",
                      icon: <UserOffIcon />,
                      onClick: () => markUnpaid(row),
                    },
                  ]
                : []),
            ]}
          />
        );
      },
    },
  ];

  const historyColumns = [
    { key: "id", label: "Bill ID" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "bottleCount", label: "Bottle Count", align: "center" },
    { key: "monthYear", label: "Month/Year" },
    {
      key: "discount",
      label: "Discount",
      align: "right",
      render: (value) => formatAmount(value),
    },
    {
      key: "received",
      label: "Received",
      align: "right",
      render: (value) => formatAmount(value),
    },
    { key: "status", label: "Status", render: statusBadge },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            {
              label: "Receipt",
              icon: <HistoryIcon />,
              onClick: () => openReceipt(row),
            },
            {
              label: "Unpaid",
              icon: <UserOffIcon />,
              onClick: () => markHistoryUnpaid(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="collection-page grid gap-5">
      <Card className="collection-actions-card" bodyClassName="collection-primary p-4 sm:p-5">
        <div className="collection-toolbar mb-4 grid items-end gap-3 sm:grid-cols-[1fr_16rem]">
          <div>
            <h3 className="collection-section-title text-subhead font-semibold text-navy">
              User Collections
            </h3>
            <p className="mt-0.5 text-small text-muted">
              {selectedClient ? selectedClient.name : "Search for a client to view their records"}
            </p>
          </div>
          <div className={`collection-client-picker relative ${clientPickerOpen ? "z-30" : ""}`}>
            <label className="block">
              <span className="mb-1 block text-small font-semibold text-navy">Search client</span>
              <input
                type="search"
                role="combobox"
                aria-expanded={clientPickerOpen}
                aria-controls="collection-client-options"
                aria-autocomplete="list"
                autoComplete="off"
                placeholder="Type a client name or ID"
                value={clientPickerOpen ? clientSearch : selectedClient ? `${selectedClient.id} — ${selectedClient.name}` : clientSearch}
                onFocus={() => { setClientSearch(""); setClientPickerOpen(true); }}
                onChange={(event) => { setClientSearch(event.target.value); setClientId(""); setClientPickerOpen(true); }}
                onKeyDown={(event) => { if (event.key === "Escape") setClientPickerOpen(false); }}
                className="w-full rounded-lg border border-line bg-card px-3 py-1.5 text-copy text-ink outline-none transition placeholder:text-menu/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
            {clientPickerOpen && (
              <>
                <button type="button" aria-label="Close client search" className="fixed inset-0 z-10 cursor-default" onClick={() => setClientPickerOpen(false)} />
                <div id="collection-client-options" role="listbox" className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line bg-white p-1 shadow-card">
                  {clientOptions.length ? clientOptions.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      role="option"
                      aria-selected={String(person.id) === clientId}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => { setClientId(String(person.id)); setClientSearch(""); setClientPickerOpen(false); }}
                      className="block w-full rounded-md px-3 py-2 text-left text-copy text-ink hover:bg-primary/10 hover:text-primary"
                    >{person.id} — {person.name}</button>
                  )) : <p className="px-3 py-2 text-small text-muted">No matching client found</p>}
                </div>
              </>
            )}
          </div>
        </div>

        <DataTable
          columns={collectionColumns}
          rows={visibleCollections}
          maxHeight={360}
          paginated
          emptyMessage={selectedClient ? "No collection records found for this client." : "Search and select a client to view collection records."}
        />

        <div className="collection-actions mt-4 flex flex-wrap items-center justify-end gap-2">
          {clientAdvance > 0 && (
            <Button
              onClick={() => {
                setAdvanceAmountToRemove("");
                setModal("advance");
              }}
            >
              Remove Advance Amount
            </Button>
          )}
          <Button variant="collection" disabled={!selectedClient || visibleCollections.length === 0} onClick={openReceiving}>Receiving</Button>
          <Button
            variant="outline"
            aria-label={`Net amount ${formatAmount(totalBalance)}`}
          >
            Net Amount: {formatAmount(totalBalance)}
          </Button>
          <Button
            variant="outline"
            icon={<AmountIcon />}
            disabled={!amountTarget}
            onClick={() => openAddAmount(amountTarget)}
          >
            Add Amount
          </Button>
          <div className="relative z-20">
            <Button
              variant="soft"
              aria-haspopup="menu"
              aria-expanded={infoOpen}
              onClick={() => setInfoOpen((open) => !open)}
            >
              Info
              <svg
                className={`size-3 transition-transform ${infoOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m5.5 7.5 4.5 4 4.5-4" />
              </svg>
            </Button>
            {infoOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close Info menu"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setInfoOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full z-20 mt-1 min-w-36 rounded-md border border-line bg-white p-1 shadow-card"
                >
                  {[
                    {
                      label: "Summary",
                      icon: <AmountIcon />,
                      disabled: !selectedClient,
                      title: selectedClient ? "" : "Select one client to view a summary",
                      action: openCollectionSummary,
                    },
                    {
                      label: "Invoice",
                      icon: <InvoiceIcon />,
                      disabled: !selectedClient,
                      title: selectedClient ? "" : "Select one client to create an invoice",
                      action: () => openCollectionInvoice("Invoice"),
                    },
                    {
                      label: "Invoice 2",
                      icon: <InvoiceIcon />,
                      disabled: !selectedClient,
                      title: selectedClient ? "" : "Select one client to create an invoice",
                      action: () => openCollectionInvoice("Invoice 2"),
                    },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      role="menuitem"
                      disabled={option.disabled}
                      title={option.title}
                      className="grid w-full grid-cols-[auto_1fr] items-center gap-2 rounded px-3 py-2 text-left text-copy text-ink transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => {
                        setInfoOpen(false);
                        option.action();
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card title="Users Collection History" className="collection-history-card" bodyClassName="collection-history-body p-4 sm:p-5">
        <DataTable
          columns={historyColumns}
          rows={visibleHistory}
          maxHeight={360}
          paginated
          emptyMessage={selectedClient ? "No collection history found for this client." : "Search and select a client to view collection history."}
        />
      </Card>

      <Modal
        open={modal === "amount"}
        onClose={closeModal}
        title="Add New Amount"
        size="lg"
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="add-amount-form">
              Add
            </Button>
          </>
        }
      >
        <form
          id="add-amount-form"
          onSubmit={saveAmount}
          className="grid grid-cols-1 gap-3 sm:grid-cols-4"
        >
          <TextField label="ID" readOnly value={amountForm.id} />
          <TextField
            label="Name"
            readOnly
            value={amountForm.name}
            className="sm:col-span-2"
          />
          <TextField
            label="Amount"
            required
            inputMode="numeric"
            autoComplete="off"
            value={amountForm.amount}
            onChange={(value) =>
              setAmountForm((form) => ({ ...form, amount: digits(value) }))
            }
          />
          <Textarea
            label="Comment"
            required
            className="sm:col-span-4"
            value={amountForm.comment}
            onChange={(value) =>
              setAmountForm((form) => ({ ...form, comment: value }))
            }
          />
        </form>
      </Modal>

      <Modal
        open={modal === "receive"}
        onClose={closeModal}
        title="Collection"
        size="lg"
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="receive-form">
              Add
            </Button>
          </>
        }
      >
        <form id="receive-form" onSubmit={saveReceiving} className="grid gap-3">
          <div className="grid gap-2 rounded-lg bg-soft p-3 text-copy sm:grid-cols-2">
            <p>
              <span className="font-semibold text-navy">Payment Type: </span>
              {selectedClient?.payType ?? "Multiple / All clients"}
            </p>
            <p>
              <span className="font-semibold text-navy">Advance Amount: </span>
              {formatAmount(clientAdvance)}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Date"
              type="date"
              required
              value={receiveForm.date}
              onChange={(value) =>
                setReceiveForm((form) => ({ ...form, date: value }))
              }
            />
            <TextField
              label="Receipt ID"
              readOnly
              value={receiveForm.receiptId}
            />
            <TextField
              label="Balance Amount"
              readOnly
              value={formatAmount(receiveForm.balance)}
            />
            <TextField
              label="Receive Amount"
              required
              inputMode="numeric"
              value={receiveForm.receiveAmount}
              onChange={(value) =>
                setReceiveForm((form) => ({
                  ...form,
                  receiveAmount: digits(value),
                }))
              }
            />
            <TextField
              label="Discount"
              inputMode="numeric"
              value={receiveForm.discount}
              onChange={(value) =>
                setReceiveForm((form) => ({ ...form, discount: digits(value) }))
              }
            />
            <TextField
              label="Empty Bottle Received"
              inputMode="numeric"
              value={receiveForm.emptyBottles}
              onChange={(value) =>
                setReceiveForm((form) => ({
                  ...form,
                  emptyBottles: digits(value),
                }))
              }
            />
            <SelectField
              label="Transaction Type"
              options={transactionOptions}
              value={receiveForm.transType}
              onChange={(value) =>
                setReceiveForm((form) => ({ ...form, transType: value }))
              }
            />
            <TextField
              label="Transaction ID"
              inputMode="numeric"
              value={receiveForm.transId}
              onChange={(value) =>
                setReceiveForm((form) => ({ ...form, transId: digits(value) }))
              }
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={modal === "advance"}
        onClose={closeModal}
        title="Advance Amount Remove"
        size="md"
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="advance-form">
              Remove
            </Button>
          </>
        }
      >
        <form id="advance-form" onSubmit={removeAdvance}>
          <p className="mb-3 text-small text-muted">
            Available advance: {formatAmount(clientAdvance)}
          </p>
          <TextField
            label="Amount"
            required
            inputMode="numeric"
            value={advanceAmountToRemove}
            onChange={(value) => setAdvanceAmountToRemove(digits(value))}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Delete Collection"
        size="sm"
        footer={
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteCollection}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-copy">
          Delete the unpaid collection for {selectedRow?.name} (
          {selectedRow?.monthYear})?
        </p>
      </Modal>

      <Modal
        open={modal === "receipt"}
        onClose={closeModal}
        title="Collection Receipt"
        size="md"
        footer={<Button onClick={closeModal}>Close</Button>}
      >
        <div className="grid gap-2 text-copy">
          <p>
            <span className="font-semibold text-navy">Receipt ID: </span>
            {selectedReceipt?.receiptId ?? "—"}
          </p>
          <p>
            <span className="font-semibold text-navy">Date: </span>
            {selectedReceipt?.date ?? "—"}
          </p>
          <p>
            <span className="font-semibold text-navy">Client: </span>
            {selectedReceipt?.name ?? selectedRow?.name ?? "—"}
          </p>
          <p>
            <span className="font-semibold text-navy">Month/Year: </span>
            {selectedReceipt?.monthYear ?? selectedRow?.monthYear ?? "—"}
          </p>
          <p>
            <span className="font-semibold text-navy">Amount Received: </span>
            {formatAmount(selectedReceipt?.received ?? 0)}
          </p>
          <p>
            <span className="font-semibold text-navy">Discount: </span>
            {formatAmount(selectedReceipt?.discount ?? 0)}
          </p>
          <p>
            <span className="font-semibold text-navy">Bottle Count: </span>
            {selectedReceipt?.bottleCount ?? 0}
          </p>
          <p>
            <span className="font-semibold text-navy">Status: </span>
            {selectedReceipt?.status ?? selectedRow?.status ?? "—"}
          </p>
        </div>
      </Modal>

      <Modal
        open={modal === "summary"}
        onClose={closeModal}
        title="Collection Summary"
        size="md"
        footer={<Button onClick={closeModal}>Close</Button>}
      >
        <div className="grid gap-2 text-copy">
          <p>
            <span className="font-semibold text-navy">Client: </span>
            {selectedClient?.name ?? "No client selected"}
          </p>
          <p>
            <span className="font-semibold text-navy">Collection rows: </span>
            {visibleCollections.length}
          </p>
          <p>
            <span className="font-semibold text-navy">Unpaid rows: </span>
            {visibleCollections.filter((row) => row.status === "Unpaid").length}
          </p>
          <p>
            <span className="font-semibold text-navy">Net amount: </span>
            {formatAmount(totalBalance)}
          </p>
          <p>
            <span className="font-semibold text-navy">Advance amount: </span>
            {formatAmount(clientAdvance)}
          </p>
          <p>
            <span className="font-semibold text-navy">History rows: </span>
            {visibleHistory.length}
          </p>
        </div>
      </Modal>

    </div>
  );
}



