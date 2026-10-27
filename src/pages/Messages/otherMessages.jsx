import { useMemo, useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import { CheckCircleIcon, EyeIcon, SendIcon } from "../../component/ui/Icon";
import { areas } from "../Master/mock/areaData";
import { clients } from "../ClientProfile/mock/clientData";
import { initialOtherMessages as initialMessages } from "./mock/otherMessagesData";

function resolveMessage(templateText, client) {
  if (!templateText) return "";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return templateText
    .replace(/\{\{Name\}\}/g, client.name || "Client")
    .replace(/\{\{Balance\}\}/g, `Rs. ${Number(client.balance || 0).toLocaleString()}`)
    .replace(/\{\{Date\}\}/g, today)
    .replace(/\{\{Company Name\}\}/g, "Wasooli Aab")
    .replace(/\{\{Amount\}\}/g, `Rs. ${Number(client.amount || 0).toLocaleString()}`)
    .replace(/\{\{Account Type\}\}/g, client.payType || "Monthly")
    .replace(/\{\{Admin\}\}/g, "Admin Office")
    .replace(/\{\{Operator\}\}/g, "Delivery Agent");
}

export default function OtherMessages() {
  const [selectedTitleId, setSelectedTitleId] = useState(
    initialMessages[0] ? String(initialMessages[0].id) : "1"
  );
  const [selectedArea, setSelectedArea] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    titleId: initialMessages[0] ? String(initialMessages[0].id) : "1",
    area: "all",
  });
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const [modal, setModal] = useState(null); // "previewSingle" | "sendAll" | "sendSingle" | "success" | null
  const [targetClient, setTargetClient] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const titleOptions = useMemo(
    () =>
      initialMessages.map((m) => ({
        value: String(m.id),
        label: m.title,
      })),
    []
  );

  const areaOptions = useMemo(
    () => [
      { value: "all", label: "Select Area" },
      ...areas.map((a) => ({ value: String(a.id), label: a.name })),
    ],
    []
  );

  // Active message template
  const currentTemplate = useMemo(() => {
    return (
      initialMessages.find((m) => String(m.id) === appliedFilters.titleId) ||
      initialMessages[0]
    );
  }, [appliedFilters.titleId]);

  // When clicking "Preview", apply chosen title & area and load data into the table
  const handlePreview = () => {
    setAppliedFilters({
      titleId: selectedTitleId,
      area: selectedArea,
    });
    setHasPreviewed(true);
  };

  // Filter clients based on applied filters
  const filteredClients = useMemo(() => {
    if (!hasPreviewed) return [];
    return clients.filter((c) => {
      const matchArea =
        appliedFilters.area === "all" ||
        String(c.areaId) === appliedFilters.area;
      return matchArea;
    });
  }, [appliedFilters.area, hasPreviewed]);

  const closeModal = () => {
    setModal(null);
    setTargetClient(null);
  };

  const openPreviewSingle = (client) => {
    setTargetClient(client);
    setModal("previewSingle");
  };

  const openSendSingle = (client) => {
    setTargetClient(client);
    setModal("sendSingle");
  };

  const confirmSendSingle = () => {
    if (!targetClient) return closeModal();
    const sentToName = targetClient.name;
    closeModal();
    setSuccessMessage(`Message successfully sent to ${sentToName}'s OutBox!`);
    setModal("success");
  };

  const confirmSendAll = () => {
    const count = filteredClients.length;
    closeModal();
    setSuccessMessage(
      `Successfully queued ${count} message(s) to OutBox for "${currentTemplate?.title}"!`
    );
    setModal("success");
  };

  const columns = [
    { key: "id", label: "ID", align: "center" },
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div>
          <span className="font-semibold text-navy">{val}</span>
          {row.status && (
            <span
              className={`ml-2 inline-block rounded-full px-1.5 py-0.5 text-tiny font-medium ${
                row.status === "Active"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {row.status}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (val, row) => {
        const areaName = areas.find((a) => a.id === row.areaId)?.name;
        return (
          <div className="flex flex-col">
            <span className="text-ink/90">{val || "—"}</span>
            {areaName && (
              <span className="text-tiny text-ink/50">{areaName}</span>
            )}
          </div>
        );
      },
    },
    {
      key: "phone1",
      label: "Cell",
      render: (val) => <span className="font-mono text-small">{val || "—"}</span>,
    },
    {
      key: "phone2",
      label: "Phone",
      render: (val) => (
        <span className="font-mono text-small text-ink/70">
          {val && val !== "0" ? val : "—"}
        </span>
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
              label: "Preview Message",
              icon: <EyeIcon />,
              onClick: () => openPreviewSingle(row),
            },
            {
              label: "Send to Outbox",
              icon: <SendIcon />,
              onClick: () => openSendSingle(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <Card bodyClassName="p-4 sm:p-6">
        {/* Top Filter and Action Controls */}
        <div className="mb-6 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SelectField
              label="Title"
              options={titleOptions}
              value={selectedTitleId}
              onChange={setSelectedTitleId}
            />
          </div>

          <div className="lg:col-span-4">
            <SelectField
              label="Select Area"
              options={areaOptions}
              value={selectedArea}
              onChange={setSelectedArea}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
            <Button
              variant="outline"
              icon={<EyeIcon />}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              variant="solid"
              icon={<SendIcon />}
              onClick={() => setModal("sendAll")}
              disabled={!hasPreviewed || filteredClients.length === 0}
            >
              Send To All OutBox {hasPreviewed ? `(${filteredClients.length})` : ""}
            </Button>
          </div>
        </div>

        {/* Recipients Table */}
        <DataTable
          columns={columns}
          rows={filteredClients}
          paginated
          searchPlaceholder="Search recipients by name, phone or address..."
        />
      </Card>

      {/* Preview Single Message Modal */}
      <Modal
        open={modal === "previewSingle"}
        onClose={closeModal}
        title="Personalized Message Preview"
        size="md"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Close
            </Button>
            <Button
              variant="solid"
              icon={<SendIcon />}
              onClick={() => {
                closeModal();
                setModal("sendSingle");
              }}
            >
              Send to Outbox
            </Button>
          </>
        )}
      >
        {targetClient && (
          <div className="grid gap-3 text-copy">
            <div className="flex items-center justify-between rounded-lg border border-line bg-page p-3">
              <div>
                <div className="font-semibold text-navy">
                  {targetClient.name}
                </div>
                <div className="text-tiny text-ink/60">
                  {targetClient.address}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-small text-primary font-medium">
                  {targetClient.phone1}
                </div>
                <div className="text-tiny text-ink/50">
                  Balance: Rs. {Number(targetClient.balance || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-tiny font-semibold text-navy uppercase tracking-wider">
                Generated Message Content:
              </label>
              <div className="rounded-lg border border-line bg-card p-4 text-small text-ink/90 leading-relaxed shadow-sm">
                {resolveMessage(currentTemplate?.message, targetClient)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Single Message Confirmation Modal */}
      <Modal
        open={modal === "sendSingle"}
        onClose={closeModal}
        title="Send Message to Outbox"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirmSendSingle}>
              Confirm Send
            </Button>
          </>
        )}
      >
        <p className="text-copy">
          Send <strong>"{currentTemplate?.title}"</strong> message to{" "}
          <strong className="text-navy">{targetClient?.name}</strong> (
          <span className="font-mono">{targetClient?.phone1}</span>)?
        </p>
      </Modal>

      {/* Send All to Outbox Modal */}
      <Modal
        open={modal === "sendAll"}
        onClose={closeModal}
        title="Send To All OutBox"
        size="md"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="solid" onClick={confirmSendAll}>
              Send All Now
            </Button>
          </>
        )}
      >
        <div className="grid gap-3 text-copy">
          <p>
            Are you sure you want to queue this message for all{" "}
            <strong className="text-navy">{filteredClients.length}</strong>{" "}
            recipients in{" "}
            <strong className="text-navy">
              {appliedFilters.area === "all"
                ? "All Areas"
                : areas.find((a) => String(a.id) === appliedFilters.area)?.name}
            </strong>
            ?
          </p>

          <div className="rounded-lg border border-line bg-page p-3">
            <div className="text-tiny font-semibold text-primary uppercase">
              Message Template: {currentTemplate?.title}
            </div>
            <div className="mt-1 text-small italic text-ink/80">
              "{currentTemplate?.message}"
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Notification Modal */}
      <Modal
        open={modal === "success"}
        onClose={closeModal}
        title="OutBox Notification"
        size="sm"
        footer={(
          <Button variant="solid" onClick={closeModal}>
            OK
          </Button>
        )}
      >
        <div className="flex items-start gap-3 text-copy">
          <CheckCircleIcon />
          <div>
            <p className="font-semibold text-navy">Success!</p>
            <p className="mt-1 text-small text-ink/80">{successMessage}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
