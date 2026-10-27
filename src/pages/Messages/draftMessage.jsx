import { useMemo, useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Badge from "../../component/ui/Badge";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import Textarea from "../../component/ui/Textarea";
import { EditIcon, PlusIcon, SendIcon, TrashIcon } from "../../component/ui/Icon";
import { formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import {
  draftDateOptions,
  draftTitleOptions,
  draftUserFilterOptions,
  initialDraftMessages,
  draftTemplates as initialMessageTemplates,
  draftParameters as messageParameters,
} from "./mock/draftMessageData";

const emptyForm = {
  name: "",
  phone: "",
  title: "Payment Reminder",
  message: "",
  areaId: "1",
  userType: "Client",
};

const emptyFilters = {
  area: "all",
  title: "all",
  userType: "all",
  date: "all",
};

export default function DraftMessage() {
  const [drafts, setDrafts] = useState(initialDraftMessages);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [modal, setModal] = useState(null); // "edit" | "add" | "deleteSingle" | "deleteSelected" | "clearAll" | "sendSingle" | null
  const [targetDraft, setTargetDraft] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [parameter, setParameter] = useState("");
  const [templateId, setTemplateId] = useState("");

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

  const closeModal = () => {
    setModal(null);
    setTargetDraft(null);
    setForm(emptyForm);
    setParameter("");
    setTemplateId("");
  };

  // Filtered rows based on the 4 dropdown filters
  const filteredRows = useMemo(() => {
    return drafts.filter((row) => {
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
  }, [drafts, filters]);

  // Selection handlers
  const isAllSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selectedIds.includes(row.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRows.map((r) => r.id));
    }
  };

  const selectAll = () => {
    setSelectedIds(filteredRows.map((r) => r.id));
  };

  const unselectAll = () => {
    setSelectedIds([]);
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals openers
  const openAddDraft = () => {
    setTargetDraft(null);
    setForm(emptyForm);
    setModal("add");
  };

  const openEditDraft = (draft) => {
    setTargetDraft(draft);
    setForm({
      name: draft.name,
      phone: draft.phone,
      title: draft.title,
      message: draft.message,
      areaId: String(draft.areaId || "1"),
      userType: draft.userType || "Client",
    });
    setModal("edit");
  };

  const openSendDraft = (draft) => {
    setTargetDraft(draft);
    setModal("sendSingle");
  };

  // Form actions
  const saveDraft = (e) => {
    e.preventDefault();
    const areaObj = areas.find((a) => String(a.id) === form.areaId);
    const areaName = areaObj ? areaObj.name : "General Area";

    if (targetDraft) {
      setDrafts((rows) =>
        rows.map((row) =>
          row.id === targetDraft.id
            ? {
                ...row,
                name: form.name.trim(),
                phone: form.phone.trim(),
                title: form.title.trim(),
                message: form.message.trim(),
                areaId: form.areaId,
                area: areaName,
                userType: form.userType,
              }
            : row
        )
      );
    } else {
      const nextId =
        drafts.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const today = new Date().toISOString().split("T")[0];
      const newDraft = {
        id: nextId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        message: form.message.trim(),
        date: today,
        areaId: form.areaId,
        area: areaName,
        userType: form.userType,
      };
      setDrafts((rows) => [newDraft, ...rows]);
    }
    closeModal();
  };

  const confirmDeleteSingle = () => {
    if (!targetDraft) return closeModal();
    setDrafts((rows) => rows.filter((r) => r.id !== targetDraft.id));
    setSelectedIds((prev) => prev.filter((id) => id !== targetDraft.id));
    closeModal();
  };

  const confirmDeleteSelected = () => {
    setDrafts((rows) => rows.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    closeModal();
  };

  const confirmClearAll = () => {
    setDrafts([]);
    setSelectedIds([]);
    closeModal();
  };

  const confirmSendSingle = () => {
    if (!targetDraft) return closeModal();
    // In a live app this sends the message; here we remove from drafts or mark sent
    setDrafts((rows) => rows.filter((r) => r.id !== targetDraft.id));
    setSelectedIds((prev) => prev.filter((id) => id !== targetDraft.id));
    closeModal();
  };

  const insertParameter = () => {
    if (!parameter) return;
    const token = `{{${parameter}}}`;
    setForm((f) => ({
      ...f,
      message: f.message ? `${f.message} ${token}` : token,
    }));
    setParameter("");
  };

  const useTemplate = (id) => {
    setTemplateId(id);
    const template = initialMessageTemplates.find(
      (item) => String(item.id) === id
    );
    if (template) {
      setForm((f) => ({
        ...f,
        title: template.title,
        message: template.message,
      }));
    }
  };

  // Table columns matching legacy draft messages table
  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={toggleSelectAll}
          className="size-4 cursor-pointer accent-primary"
          aria-label="Select all drafts"
        />
      ),
      align: "center",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelectRow(row.id)}
          className="size-4 cursor-pointer accent-primary"
          aria-label={`Select draft ${row.id}`}
        />
      ),
    },
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
        <ActionMenu
          items={[
            {
              label: "Edit",
              icon: <EditIcon />,
              onClick: () => openEditDraft(row),
            },
            {
              label: "Send Now",
              icon: <SendIcon />,
              onClick: () => openSendDraft(row),
            },
            {
              label: "Delete",
              icon: <TrashIcon />,
              tone: "danger",
              onClick: () => {
                setTargetDraft(row);
                setModal("deleteSingle");
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <Card bodyClassName="p-4 sm:p-6">
        {/* Top Action Buttons Bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="danger"
              icon={<TrashIcon />}
              onClick={() => setModal("clearAll")}
              disabled={drafts.length === 0}
            >
              Clear Draft
            </Button>
            <Button
              variant="danger"
              onClick={() => setModal("deleteSelected")}
              disabled={selectedIds.length === 0}
            >
              Delete Select {selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
            <Button
              variant="outline"
              onClick={selectAll}
              disabled={filteredRows.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="soft"
              onClick={unselectAll}
              disabled={selectedIds.length === 0}
            >
              UnSelect All
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Badge tone="primary">
                {selectedIds.length} of {filteredRows.length} selected
              </Badge>
            )}
            <Button icon={<PlusIcon />} onClick={openAddDraft}>
              Add Draft
            </Button>
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
          searchPlaceholder="Search draft messages..."
        />
      </Card>

      {/* Add / Edit Draft Modal */}
      <Modal
        open={modal === "add" || modal === "edit"}
        onClose={closeModal}
        title={targetDraft ? "Edit Draft Message" : "Add Draft Message"}
        size="lg"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" form="draft-message-form">
              {targetDraft ? "Save Changes" : "Save Draft"}
            </Button>
          </>
        )}
      >
        <form
          id="draft-message-form"
          onSubmit={saveDraft}
          className="grid gap-4"
        >
          {modal === "add" && initialMessageTemplates.length > 0 && (
            <SelectField
              label="Use Template"
              options={[
                { value: "", label: "Choose a template (optional)" },
                ...initialMessageTemplates.map((t) => ({
                  value: String(t.id),
                  label: t.title,
                })),
              ]}
              value={templateId}
              onChange={useTemplate}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Recipient Name"
              required
              placeholder="e.g. Ahmed Khan"
              value={form.name}
              onChange={(value) => setForm((f) => ({ ...f, name: value }))}
            />
            <TextField
              label="Phone Number"
              required
              placeholder="e.g. 0300-1234567"
              value={form.phone}
              onChange={(value) => setForm((f) => ({ ...f, phone: value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TextField
              label="Message Title"
              required
              placeholder="e.g. Payment Reminder"
              value={form.title}
              onChange={(value) => setForm((f) => ({ ...f, title: value }))}
            />
            <SelectField
              label="Area"
              options={areas.map((a) => ({
                value: String(a.id),
                label: a.name,
              }))}
              value={form.areaId}
              onChange={(value) => setForm((f) => ({ ...f, areaId: value }))}
            />
            <SelectField
              label="User Type"
              options={[
                { value: "Client", label: "Client" },
                { value: "Operator", label: "Operator" },
                { value: "Admin", label: "Admin" },
              ]}
              value={form.userType}
              onChange={(value) => setForm((f) => ({ ...f, userType: value }))}
            />
          </div>

          <Textarea
            label={`Message (${form.message.length} characters)`}
            required
            rows={5}
            placeholder="Write your draft message here..."
            value={form.message}
            onChange={(value) => setForm((f) => ({ ...f, message: value }))}
          />

          <div
            className="grid items-end gap-2 justify-self-start"
            style={{ gridTemplateColumns: "minmax(0, 12rem) auto" }}
          >
            <SelectField
              label="Insert Parameter"
              options={messageParameters}
              value={parameter}
              onChange={setParameter}
            />
            <Button
              type="button"
              variant="outline"
              aria-label="Insert parameter"
              title="Insert parameter"
              onClick={insertParameter}
              disabled={!parameter}
              className="mb-px justify-self-start"
            >
              <PlusIcon />
            </Button>
          </div>
        </form>
      </Modal>

      {/* Send Confirmation Modal */}
      <Modal
        open={modal === "sendSingle"}
        onClose={closeModal}
        title="Send Message Now"
        size="md"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirmSendSingle}>
              Confirm & Send
            </Button>
          </>
        )}
      >
        <div className="grid gap-3 text-copy">
          <p>Are you sure you want to send this message now?</p>
          <div className="rounded-lg border border-line bg-page p-3">
            <div className="mb-1 font-semibold text-navy">
              {targetDraft?.name}{" "}
              <span className="font-mono font-normal text-ink/70">
                ({targetDraft?.phone})
              </span>
            </div>
            <div className="mb-1 text-tiny font-medium text-primary">
              {targetDraft?.title}
            </div>
            <div className="text-small text-ink/80">{targetDraft?.message}</div>
          </div>
        </div>
      </Modal>

      {/* Delete Single Draft Modal */}
      <Modal
        open={modal === "deleteSingle"}
        onClose={closeModal}
        title="Delete Draft Message"
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
          Are you sure you want to delete the draft message for{" "}
          <strong className="text-navy">{targetDraft?.name}</strong>?
        </p>
      </Modal>

      {/* Delete Selected Modal */}
      <Modal
        open={modal === "deleteSelected"}
        onClose={closeModal}
        title="Delete Selected Drafts"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteSelected}>
              Delete Selected
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Are you sure you want to delete{" "}
          <strong className="text-navy">{selectedIds.length}</strong> selected
          draft message(s)? This action cannot be undone.
        </p>
      </Modal>

      {/* Clear All Modal */}
      <Modal
        open={modal === "clearAll"}
        onClose={closeModal}
        title="Clear All Drafts"
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
          <strong className="text-navy">{drafts.length}</strong> draft messages?
          All pending drafts will be permanently removed.
        </p>
      </Modal>
    </div>
  );
}
