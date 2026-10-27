import { useMemo, useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Badge from "../../component/ui/Badge";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import { EyeIcon, ResendIcon, TrashIcon } from "../../component/ui/Icon";
import { formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import {
  sentDateOptions as draftDateOptions,
  sentTitleOptions as draftTitleOptions,
  sentUserFilterOptions as draftUserFilterOptions,
  initialSentMessages,
} from "./mock/sentMessagesData";

const emptyFilters = {
  area: "all",
  title: "all",
  userType: "all",
  date: "all",
};

export default function SentMessages() {
  const [messages, setMessages] = useState(initialSentMessages);
  const [filters, setFilters] = useState(emptyFilters);
  const [modal, setModal] = useState(null); // "view" | "resend" | "delete" | null
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const resetFilters = () => {
    setFilters(emptyFilters);
  };

  const isFiltered =
    filters.area !== "all" ||
    filters.title !== "all" ||
    filters.userType !== "all" ||
    filters.date !== "all";

  // Filter rows based on the 4 dropdowns
  const filteredRows = useMemo(() => {
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

  const closeModal = () => {
    setModal(null);
    setSelectedMessage(null);
  };

  const openViewModal = (row) => {
    setSelectedMessage(row);
    setModal("view");
  };

  const openResendModal = (row) => {
    setSelectedMessage(row);
    setModal("resend");
  };

  const openDeleteModal = (row) => {
    setSelectedMessage(row);
    setModal("delete");
  };

  const confirmResend = () => {
    if (!selectedMessage) return closeModal();
    // Simulate resending
    const nowTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, time: nowTime, status: "Delivered" }
          : m
      )
    );
    closeModal();
  };

  const confirmDelete = () => {
    if (!selectedMessage) return closeModal();
    setMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id));
    closeModal();
  };

  // Table columns matching legacy page
  const columns = [
    { key: "id", label: "ID", align: "center" },
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-navy">{val}</span>
          <span className="text-tiny text-ink/50">{row.area || "—"}</span>
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (val, row) => (
        <div className="max-w-md">
          <span className="mb-0.5 block text-tiny font-semibold text-primary">
            {row.title}
          </span>
          <span className="block truncate text-ink/85" title={val}>
            {val}
          </span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (val, row) => (
        <div className="flex flex-col">
          <span>{formatDate(val)}</span>
          {row.time && (
            <span className="text-tiny text-ink/50">{row.time}</span>
          )}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (val) => <span className="font-mono text-small">{val}</span>,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (val) => (
        <Badge tone={val === "Delivered" ? "success" : "primary"}>
          {val || "Sent"}
        </Badge>
      ),
    },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            {
              label: "View Details",
              icon: <EyeIcon />,
              onClick: () => openViewModal(row),
            },
            {
              label: "Resend",
              icon: <ResendIcon />,
              onClick: () => openResendModal(row),
            },
            {
              label: "Delete",
              icon: <TrashIcon />,
              tone: "danger",
              onClick: () => openDeleteModal(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <Card bodyClassName="p-4 sm:p-6">
        {/* Top Summary / Status Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge tone="primary">
              Total Sent: {filteredRows.length}
            </Badge>
            {isFiltered && (
              <Button variant="soft" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* 4 Filter Dropdowns matching the legacy page */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Select Area"
            options={areaOptions}
            value={filters.area}
            onChange={setFilter("area")}
          />
          <SelectField
            label="Title"
            options={draftTitleOptions}
            value={filters.title}
            onChange={setFilter("title")}
          />
          <SelectField
            label="User"
            options={draftUserFilterOptions}
            value={filters.userType}
            onChange={setFilter("userType")}
          />
          <SelectField
            label="All Dates"
            options={draftDateOptions}
            value={filters.date}
            onChange={setFilter("date")}
          />
        </div>

        {/* Main Data Table */}
        <DataTable
          columns={columns}
          rows={filteredRows}
          paginated
          searchPlaceholder="Search sent messages..."
        />
      </Card>

      {/* View Message Details Modal */}
      <Modal
        open={modal === "view"}
        onClose={closeModal}
        title="Sent Message Details"
        size="md"
        footer={(
          <Button variant="soft" onClick={closeModal}>
            Close
          </Button>
        )}
      >
        {selectedMessage && (
          <div className="grid gap-4 text-copy">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-page p-3 text-small">
              <div>
                <span className="block text-tiny text-ink/50">Recipient</span>
                <span className="font-semibold text-navy">
                  {selectedMessage.name}
                </span>
              </div>
              <div>
                <span className="block text-tiny text-ink/50">Contact</span>
                <span className="font-mono font-medium text-navy">
                  {selectedMessage.phone}
                </span>
              </div>
              <div>
                <span className="block text-tiny text-ink/50">Area</span>
                <span className="text-ink/80">{selectedMessage.area || "—"}</span>
              </div>
              <div>
                <span className="block text-tiny text-ink/50">Date & Time</span>
                <span className="text-ink/80">
                  {formatDate(selectedMessage.date)}{" "}
                  {selectedMessage.time && `at ${selectedMessage.time}`}
                </span>
              </div>
              <div>
                <span className="block text-tiny text-ink/50">Title / Type</span>
                <span className="font-medium text-primary">
                  {selectedMessage.title}
                </span>
              </div>
              <div>
                <span className="block text-tiny text-ink/50">Status</span>
                <Badge tone="success">
                  {selectedMessage.status || "Delivered"}
                </Badge>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-tiny font-semibold text-navy uppercase tracking-wider">
                Message Body:
              </label>
              <div className="rounded-lg border border-line bg-card p-4 text-small text-ink/90 leading-relaxed shadow-sm">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Resend Confirmation Modal */}
      <Modal
        open={modal === "resend"}
        onClose={closeModal}
        title="Resend Message"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirmResend}>
              Confirm Resend
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Resend <strong>"{selectedMessage?.title}"</strong> message to{" "}
          <strong className="text-navy">{selectedMessage?.name}</strong> (
          <span className="font-mono">{selectedMessage?.phone}</span>)?
        </p>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Delete Sent Message"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Are you sure you want to delete this sent message record for{" "}
          <strong className="text-navy">{selectedMessage?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}
