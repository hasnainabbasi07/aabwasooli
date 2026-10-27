import { useMemo, useState } from "react";
import Badge from "../../component/ui/Badge";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import {
  BuildingIcon,
  GaugeIcon,
  HourglassIcon,
  PhoneCallIcon,
  SendIcon,
  TrashIcon,
  WhatsAppIcon,
  XCircleIcon,
} from "../../component/ui/Icon";
import { formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import {
  initialWhatsappDraftMessages,
  whatsappCompanyInfo,
  whatsappDateOptions,
  whatsappTitleOptions,
  whatsappUserFilterOptions,
} from "./mock/whatsappDraftMessagesData";

const emptyFilters = {
  area: "all",
  title: "all",
  userType: "all",
  date: "all",
};

export default function WhatsappDraftMessages() {
  const [messages, setMessages] = useState(initialWhatsappDraftMessages);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [companyInfo, setCompanyInfo] = useState(whatsappCompanyInfo);

  // Modals state
  const [modal, setModal] = useState(null); // "detail" | "openSession" | "sendMessages" | "clearAll" | "deleteSingle" | "invalidNumbers" | null
  const [targetDraft, setTargetDraft] = useState(null);

  const areaOptions = useMemo(
    () => [
      { value: "all", label: "Select Area" },
      ...areas.map((a) => ({ value: String(a.id), label: a.name })),
    ],
    []
  );

  const setFilter = (key) => (value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtered rows matching the 4 filters
  const filteredMessages = useMemo(() => {
    return messages.filter((row) => {
      const matchArea =
        filters.area === "all" ||
        String(row.areaId) === filters.area ||
        row.area === filters.area;
      const matchTitle =
        filters.title === "all" || row.title === filters.title;
      const matchUser =
        filters.userType === "all" || row.userType === filters.userType;
      const matchDate =
        filters.date === "all" || row.date === filters.date;
      return matchArea && matchTitle && matchUser && matchDate;
    });
  }, [messages, filters]);

  const isAllSelected =
    filteredMessages.length > 0 &&
    filteredMessages.every((m) => selectedIds.includes(m.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setModal(null);
    setTargetDraft(null);
  };

  const openDeleteSingle = (row) => {
    setTargetDraft(row);
    setModal("deleteSingle");
  };

  const confirmDeleteSingle = () => {
    if (!targetDraft) return closeModal();
    setMessages((prev) => prev.filter((m) => m.id !== targetDraft.id));
    setSelectedIds((prev) => prev.filter((id) => id !== targetDraft.id));
    closeModal();
  };

  const confirmClearAll = () => {
    setMessages([]);
    setSelectedIds([]);
    closeModal();
  };

  const confirmSendMessages = () => {
    // If some rows are selected, send those; otherwise send all filtered
    const toRemove = selectedIds.length > 0 ? selectedIds : filteredMessages.map((m) => m.id);
    setMessages((prev) => prev.filter((m) => !toRemove.includes(m.id)));
    setSelectedIds([]);
    closeModal();
  };

  const connectSession = () => {
    setCompanyInfo((prev) => ({
      ...prev,
      sessionConnected: true,
      status: "Active",
    }));
    closeModal();
  };

  // Table columns matching the legacy HTML:
  // ID, Name, Message, Date, Phone, Action (+ Selection Checkbox)
  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleSelectAll}
          className="size-4 cursor-pointer accent-primary"
          aria-label="Select all"
        />
      ),
      align: "center",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelectRow(row.id)}
          className="size-4 cursor-pointer accent-primary"
          aria-label={`Select row ${row.id}`}
        />
      ),
    },
    { key: "id", label: "ID", align: "center" },
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-navy">{val || "-"}</span>
          <span className="text-tiny text-ink/50">{row.area || "—"}</span>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (val, row) => (
        <div className="max-w-md">
          {row.title && (
            <span className="mb-0.5 block text-tiny font-semibold text-primary">
              {row.title}
            </span>
          )}
          <span className="block truncate text-ink/85" title={val}>
            {val}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (val) => formatDate(val),
    },
    {
      key: "phone",
      label: "Phone",
      render: (val) => <span className="font-mono text-small">{val}</span>,
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <button
          type="button"
          onClick={() => openDeleteSingle(row)}
          className="inline-flex size-7 items-center justify-center rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
          title="Delete draft"
          aria-label="Delete draft"
        >
          <TrashIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      {/* 1. Top Action Buttons Bar matching HTML: Clear Draft, Open Session, Send Messages, Whatsapp Detail */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="danger"
            
            icon={<TrashIcon />}
            onClick={() => setModal("clearAll")}
            disabled={messages.length === 0}
          >
            Clear Draft
          </Button>

          <Button
            variant="solid"
            icon={<WhatsAppIcon size={16} />}
            onClick={() => setModal("openSession")}
          >
            {companyInfo.sessionConnected ? "Session Connected" : "Open Session"}
          </Button>

          <Button
            variant="success"
            icon={<SendIcon />}
            onClick={() => setModal("sendMessages")}
            disabled={filteredMessages.length === 0}
          >
            Send Messages {selectedIds.length > 0 ? `(${selectedIds.length})` : `(${filteredMessages.length})`}
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <Badge tone="primary">
            {selectedIds.length} of {filteredMessages.length} selected
          </Badge>
        )}
      </div>

      {/* 2. 6 Status / Metrics Cards from the visual design */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Company ID */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BuildingIcon />
          </div>
          <div className="text-tiny font-medium text-ink/60">Company ID</div>
          <div className="text-small font-bold text-navy">
            {companyInfo.companyId}
          </div>
        </div>

        {/* Company Number */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <PhoneCallIcon />
          </div>
          <div className="text-tiny font-medium text-ink/60">Company Number</div>
          <div className="text-small font-bold text-navy">
            {companyInfo.companyNumber || "--"}
          </div>
        </div>

        {/* Status */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className={`mb-2 flex size-8 items-center justify-center rounded-lg ${companyInfo.sessionConnected ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
            {companyInfo.sessionConnected ? <WhatsAppIcon size={16} /> : <XCircleIcon />}
          </div>
          <div className="text-tiny font-medium text-ink/60">Status</div>
          <div className={`text-small font-bold ${companyInfo.sessionConnected ? "text-emerald-600" : "text-rose-600"}`}>
            {companyInfo.status}
          </div>
        </div>

        {/* Version */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <WhatsAppIcon size={18} />
          </div>
          <div className="text-tiny font-medium text-ink/60">Version</div>
          <div className="truncate text-small font-bold text-navy">
            {companyInfo.version}
          </div>
        </div>

        {/* Limit */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <GaugeIcon />
          </div>
          <div className="text-tiny font-medium text-ink/60">Limit</div>
          <div className="text-small font-bold text-navy">
            {companyInfo.limit || "--"}
          </div>
        </div>

        {/* Remaining */}
        <div className="rounded-xl border border-line/60 bg-card p-3 shadow-sm transition hover:shadow-md">
          <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
            <HourglassIcon />
          </div>
          <div className="text-tiny font-medium text-ink/60">Remaining</div>
          <div className="text-small font-bold text-navy">
            {companyInfo.remaining || "--"}
          </div>
        </div>
      </div>

      {/* 3. WhatsApp Session Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/60 bg-card p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm">
            <WhatsAppIcon size={22} />
          </div>
          <div>
            <div className="text-small font-semibold text-navy">WhatsApp session</div>
            <div className="text-tiny text-ink/60">
              Check connection before sending messages
            </div>
          </div>
        </div>

        <div>
          {companyInfo.sessionConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-tiny font-semibold text-white shadow-sm">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-tiny font-semibold text-white shadow-sm">
              <span className="size-1.5 rounded-full bg-white" />
              Not Connected
            </span>
          )}
        </div>
      </div>

      {/* 4. Filter Dropdowns Row (from legacy HTML: Area, Title, User, Dates) */}
      <Card bodyClassName="p-4 sm:p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Select Area"
            options={areaOptions}
            value={filters.area}
            onChange={setFilter("area")}
          />
          <SelectField
            label="Title"
            options={whatsappTitleOptions}
            value={filters.title}
            onChange={setFilter("title")}
          />
          <SelectField
            label="User"
            options={whatsappUserFilterOptions}
            value={filters.userType}
            onChange={setFilter("userType")}
          />
          <SelectField
            label="All Dates"
            options={whatsappDateOptions}
            value={filters.date}
            onChange={setFilter("date")}
          />
        </div>

        {/* Main Data Table */}
        <DataTable
          columns={columns}
          rows={filteredMessages}
          paginated
          searchPlaceholder="Search whatsapp drafts..."
        />
      </Card>


      {/* Modal 2: Open Session Modal */}
      <Modal
        open={modal === "openSession"}
        onClose={closeModal}
        title="WhatsApp Session Connection"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={connectSession}>
              {companyInfo.sessionConnected ? "Reconnect Session" : "Connect Session"}
            </Button>
          </>
        )}
      >
        <div className="grid gap-3 text-center text-copy">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <WhatsAppIcon size={32} />
          </div>
          <div>
            <div className="font-semibold text-navy">WhatsApp Web Session</div>
            <p className="mt-1 text-tiny text-ink/70">
              Company ID: <strong>{companyInfo.companyId}</strong>. Scan QR code or validate session to begin sending automated messages.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-page p-3 text-tiny text-ink/75">
            Current Status:{" "}
            <strong className={companyInfo.sessionConnected ? "text-emerald-600" : "text-rose-600"}>
              {companyInfo.status}
            </strong>
          </div>
        </div>
      </Modal>

      {/* Modal 3: Send Messages Confirmation Modal */}
      <Modal
        open={modal === "sendMessages"}
        onClose={closeModal}
        title="Send WhatsApp Messages"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirmSendMessages}>
              Confirm & Send
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Are you sure you want to send{" "}
          <strong className="text-navy">
            {selectedIds.length > 0 ? selectedIds.length : filteredMessages.length}
          </strong>{" "}
          WhatsApp message(s) now?
        </p>
      </Modal>

      {/* Modal 4: Clear All Confirmation Modal */}
      <Modal
        open={modal === "clearAll"}
        onClose={closeModal}
        title="Clear WhatsApp Drafts"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmClearAll}>
              Clear All Drafts
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Are you sure you want to clear all{" "}
          <strong className="text-navy">{messages.length}</strong> WhatsApp draft
          messages?
        </p>
      </Modal>

      {/* Modal 5: Delete Single Draft Modal */}
      <Modal
        open={modal === "deleteSingle"}
        onClose={closeModal}
        title="Delete Draft"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteSingle}>
              Delete
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Delete WhatsApp draft for{" "}
          <strong className="text-navy">{targetDraft?.name || "this client"}</strong>?
        </p>
      </Modal>
    </div>
  );
}
