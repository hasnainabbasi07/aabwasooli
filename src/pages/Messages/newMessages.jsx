import { useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import Textarea from "../../component/ui/Textarea";
import { EditIcon, PlusIcon, TrashIcon } from "../../component/ui/Icon";
import { initialMessages, initialMessageTemplates, messageParameters } from "./mock/newMessagesData";

const emptyMessage = { title: "", message: "" };

export default function NewMessages() {
  const [messages, setMessages] = useState(initialMessages);
  const [templates, setTemplates] = useState(initialMessageTemplates);
  const [modal, setModal] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [messageForm, setMessageForm] = useState(emptyMessage);
  const [templateForm, setTemplateForm] = useState(emptyMessage);
  const [parameter, setParameter] = useState("");
  const [templateId, setTemplateId] = useState("");

  const closeModal = () => {
    setModal(null);
    setEditingMessage(null);
    setDeleteMessage(null);
    setParameter("");
    setTemplateId("");
  };

  const openAddMessage = () => {
    setEditingMessage(null);
    setMessageForm(emptyMessage);
    setModal("message");
  };

  const openEditMessage = (row) => {
    setEditingMessage(row);
    setMessageForm({ title: row.title, message: row.message });
    setModal("message");
  };

  const openAddTemplate = () => {
    setTemplateForm(emptyMessage);
    setModal("template");
  };

  const saveMessage = (event) => {
    event.preventDefault();
    const savedMessage = {
      title: messageForm.title.trim(),
      message: messageForm.message.trim(),
    };
    if (!savedMessage.title || !savedMessage.message) return;

    if (editingMessage) {
      setMessages((rows) => rows.map((row) => (
        row.id === editingMessage.id ? { ...row, ...savedMessage } : row
      )));
    } else {
      const id = messages.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setMessages((rows) => [...rows, { id, ...savedMessage }]);
    }
    closeModal();
  };

  const saveTemplate = (event) => {
    event.preventDefault();
    const savedTemplate = {
      title: templateForm.title.trim(),
      message: templateForm.message.trim(),
    };
    if (!savedTemplate.title || !savedTemplate.message) return;
    const id = templates.reduce((max, row) => Math.max(max, row.id), 0) + 1;
    setTemplates((rows) => [...rows, { id, ...savedTemplate }]);
    closeModal();
  };

  const useTemplate = (id) => {
    setTemplateId(id);
    const template = templates.find((item) => String(item.id) === id);
    if (template) {
      setMessageForm((form) => ({ ...form, title: template.title, message: template.message }));
    }
  };

  const insertParameter = () => {
    if (!parameter) return;
    const token = `{{${parameter}}}`;
    setMessageForm((form) => ({
      ...form,
      message: form.message ? `${form.message} ${token}` : token,
    }));
    setParameter("");
  };

  const confirmDelete = () => {
    if (!deleteMessage) return closeModal();
    setMessages((rows) => rows.filter((row) => row.id !== deleteMessage.id));
    closeModal();
  };

  const columns = [
    { key: "id", label: "ID", align: "center" },
    { key: "title", label: "Title" },
    {
      key: "message",
      label: "Message",
      render: (value) => <span className="block max-w-2xl truncate" title={value}>{value}</span>,
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
              onClick: () => openEditMessage(row),
            },
            {
              label: "Delete",
              icon: <TrashIcon />,
              tone: "danger",
              onClick: () => {
                setDeleteMessage(row);
                setModal("delete");
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <Card bodyClassName="p-4">
        <div className="mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <span />
          <Button icon={<PlusIcon />} onClick={openAddMessage}>Add Message</Button>
          <Button variant="outline" icon={<PlusIcon />} onClick={openAddTemplate}>Add Template</Button>
        </div>
        <DataTable columns={columns} rows={messages} paginated searchPlaceholder="Search messages" />
      </Card>

      <Modal
        open={modal === "message"}
        onClose={closeModal}
        title={editingMessage ? "Edit Message" : "Add Message"}
        size="lg"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="message-form">{editingMessage ? "Save Changes" : "Submit"}</Button>
          </>
        )}
      >
        <form id="message-form" onSubmit={saveMessage} className="grid gap-4">
          {templates.length > 0 && (
            <SelectField
              label="Use Template"
              options={[
                { value: "", label: "Start with a template (optional)" },
                ...templates.map((item) => ({ value: String(item.id), label: item.title })),
              ]}
              value={templateId}
              onChange={useTemplate}
            />
          )}
          <TextField
            label="Message Title"
            required
            placeholder="Title"
            value={messageForm.title}
            onChange={(value) => setMessageForm((form) => ({ ...form, title: value }))}
          />
          <Textarea
            label={`Message (${messageForm.message.length} characters)`}
            required
            rows={5}
            placeholder="Write your message"
            value={messageForm.message}
            onChange={(value) => setMessageForm((form) => ({ ...form, message: value }))}
          />
          <div
            className="grid items-end gap-2 justify-self-start"
            style={{ gridTemplateColumns: "minmax(0, 10rem) auto" }}
          >
            <SelectField
              label="Parameters"
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

      <Modal
        open={modal === "template"}
        onClose={closeModal}
        title="Add Template"
        size="lg"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="template-form">Save Template</Button>
          </>
        )}
      >
        <form id="template-form" onSubmit={saveTemplate} className="grid gap-4">
          <TextField
            label="Template Title"
            required
            placeholder="Title"
            value={templateForm.title}
            onChange={(value) => setTemplateForm((form) => ({ ...form, title: value }))}
          />
          <Textarea
            label={`Message (${templateForm.message.length} characters)`}
            required
            rows={5}
            placeholder="Write a reusable message template"
            value={templateForm.message}
            onChange={(value) => setTemplateForm((form) => ({ ...form, message: value }))}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Delete Message"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        )}
      >
        <p className="text-copy">Delete message "{deleteMessage?.title}"?</p>
      </Modal>
    </div>
  );
}