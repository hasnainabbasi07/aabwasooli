import { useMemo, useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import SelectField from "../../component/ui/SelectField";
import Textarea from "../../component/ui/Textarea";
import TextField from "../../component/ui/TextField";
import { EditIcon, PlusIcon, TrashIcon } from "../../component/ui/Icon";
import { digits, formatAmount } from "../../utils/format";
import {
  accountTypeOptions,
  initialAccountHeads,
  initialAccountSubHeads,
} from "./mock/accountHeadData";

const emptyHeadForm = { masterAccount: "", description: "", accountType: "Expenses Account" };
const emptySubHeadForm = { headId: "", name: "", description: "", budget: "" };

export default function AccountHead() {
  const [heads, setHeads] = useState(initialAccountHeads);
  const [subHeads, setSubHeads] = useState(initialAccountSubHeads);
  const [modal, setModal] = useState(null);
  const [editingHead, setEditingHead] = useState(null);
  const [editingSubHead, setEditingSubHead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [headForm, setHeadForm] = useState(emptyHeadForm);
  const [subHeadForm, setSubHeadForm] = useState(emptySubHeadForm);

  const headOptions = useMemo(
    () => heads.map((head) => ({ value: String(head.id), label: head.masterAccount })),
    [heads],
  );
  const headNameById = useMemo(
    () => new Map(heads.map((head) => [head.id, head.masterAccount])),
    [heads],
  );

  const closeModal = () => {
    setModal(null);
    setEditingHead(null);
    setEditingSubHead(null);
    setDeleteTarget(null);
  };

  const openAddHead = () => {
    setEditingHead(null);
    setHeadForm(emptyHeadForm);
    setModal("head");
  };

  const openEditHead = (head) => {
    setEditingHead(head);
    setHeadForm({
      masterAccount: head.masterAccount,
      description: head.description,
      accountType: head.accountType,
    });
    setModal("head");
  };

  const openAddSubHead = () => {
    setEditingSubHead(null);
    setSubHeadForm({ ...emptySubHeadForm, headId: headOptions[0]?.value ?? "" });
    setModal("subHead");
  };

  const openEditSubHead = (subHead) => {
    setEditingSubHead(subHead);
    setSubHeadForm({
      headId: String(subHead.headId),
      name: subHead.name,
      description: subHead.description,
      budget: String(subHead.budget),
    });
    setModal("subHead");
  };

  const saveHead = (event) => {
    event.preventDefault();
    const masterAccount = headForm.masterAccount.trim();
    if (!masterAccount) return;

    if (editingHead) {
      setHeads((rows) => rows.map((row) => (
        row.id === editingHead.id ? { ...row, ...headForm, masterAccount } : row
      )));
    } else {
      const id = heads.reduce((max, head) => Math.max(max, head.id), 0) + 1;
      setHeads((rows) => [...rows, { id, ...headForm, masterAccount }]);
    }
    closeModal();
  };

  const saveSubHead = (event) => {
    event.preventDefault();
    const name = subHeadForm.name.trim();
    const headId = Number(subHeadForm.headId);
    if (!name || !headId) return;

    const subHead = {
      headId,
      name,
      description: subHeadForm.description.trim(),
      budget: Number(subHeadForm.budget || 0),
    };
    if (editingSubHead) {
      setSubHeads((rows) => rows.map((row) => (
        row.id === editingSubHead.id ? { ...row, ...subHead } : row
      )));
    } else {
      const id = subHeads.reduce((max, row) => Math.max(max, row.id), 100) + 1;
      setSubHeads((rows) => [...rows, { id, ...subHead }]);
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return closeModal();
    if (deleteTarget.kind === "head") {
      setHeads((rows) => rows.filter((head) => head.id !== deleteTarget.row.id));
      setSubHeads((rows) => rows.filter((subHead) => subHead.headId !== deleteTarget.row.id));
    } else {
      setSubHeads((rows) => rows.filter((subHead) => subHead.id !== deleteTarget.row.id));
    }
    closeModal();
  };

  const headColumns = [
    { key: "id", label: "ID", align: "center" },
    { key: "masterAccount", label: "Master Account" },
    { key: "description", label: "Description" },
    { key: "accountType", label: "Account Type" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEditHead(row) },
            {
              label: "Delete",
              icon: <TrashIcon />,
              tone: "danger",
              onClick: () => {
                setDeleteTarget({ kind: "head", row });
                setModal("delete");
              },
            },
          ]}
        />
      ),
    },
  ];

  const subHeadColumns = [
    { key: "id", label: "ID", align: "center" },
    { key: "headId", label: "Account Head", render: (value) => headNameById.get(value) ?? "Unknown" },
    { key: "name", label: "Account Sub Head" },
    { key: "description", label: "Description" },
    { key: "budget", label: "Budget Amount", align: "right", render: (value) => formatAmount(value) },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[
            { label: "Edit", icon: <EditIcon />, onClick: () => openEditSubHead(row) },
            {
              label: "Delete",
              icon: <TrashIcon />,
              tone: "danger",
              onClick: () => {
                setDeleteTarget({ kind: "subHead", row });
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
      <Card
        title="Account Heads"
        subtitle="Manage master accounts and account types"
        action={(
          <Button icon={<PlusIcon />} onClick={openAddHead}>
            Add Account Head
          </Button>
        )}
        bodyClassName="p-4"
      >
        <DataTable
          columns={headColumns}
          rows={heads}
          paginated
          maxHeight={360}
          searchPlaceholder="Search account heads"
        />
      </Card>

      <Card
        title="Account Sub Heads"
        subtitle="Link sub accounts to a master account and set budgets"
        action={(
          <Button icon={<PlusIcon />} onClick={openAddSubHead} disabled={!heads.length}>
            Add Account Sub Head
          </Button>
        )}
        bodyClassName="p-4"
      >
        <DataTable
          columns={subHeadColumns}
          rows={subHeads}
          paginated
          maxHeight={360}
          searchPlaceholder="Search account sub heads"
        />
      </Card>

      <Modal
        open={modal === "head"}
        onClose={closeModal}
        title={editingHead ? "Edit Account Head" : "Add Account Head"}
        size="md"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="account-head-form">{editingHead ? "Save Changes" : "Add"}</Button>
          </>
        )}
      >
        <form id="account-head-form" onSubmit={saveHead} className="grid gap-3">
          <TextField
            label="Master Account"
            required
            placeholder="Enter master account"
            value={headForm.masterAccount}
            onChange={(value) => setHeadForm((form) => ({ ...form, masterAccount: value }))}
          />
          <SelectField
            label="Account Type"
            options={accountTypeOptions}
            value={headForm.accountType}
            onChange={(value) => setHeadForm((form) => ({ ...form, accountType: value }))}
          />
          <Textarea
            label="Description"
            placeholder="Add a description"
            value={headForm.description}
            onChange={(value) => setHeadForm((form) => ({ ...form, description: value }))}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "subHead"}
        onClose={closeModal}
        title={editingSubHead ? "Edit Account Sub Head" : "Add Account Sub Head"}
        size="md"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="account-sub-head-form">{editingSubHead ? "Save Changes" : "Add"}</Button>
          </>
        )}
      >
        <form id="account-sub-head-form" onSubmit={saveSubHead} className="grid gap-3">
          <SelectField
            label="Account Head"
            required
            options={headOptions}
            value={subHeadForm.headId}
            onChange={(value) => setSubHeadForm((form) => ({ ...form, headId: value }))}
          />
          <TextField
            label="Account Sub Head"
            required
            placeholder="Enter account sub head"
            value={subHeadForm.name}
            onChange={(value) => setSubHeadForm((form) => ({ ...form, name: value }))}
          />
          <TextField
            label="Budget Amount"
            inputMode="numeric"
            placeholder="0"
            value={subHeadForm.budget}
            onChange={(value) => setSubHeadForm((form) => ({ ...form, budget: digits(value) }))}
          />
          <Textarea
            label="Description"
            placeholder="Add a description"
            value={subHeadForm.description}
            onChange={(value) => setSubHeadForm((form) => ({ ...form, description: value }))}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "delete"}
        onClose={closeModal}
        title="Delete Account"
        size="sm"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        )}
      >
        <p className="text-copy">
          Delete {deleteTarget?.kind === "head" ? "account head" : "account sub head"} "{deleteTarget?.row.masterAccount ?? deleteTarget?.row.name}"?
          {deleteTarget?.kind === "head" && " Its linked sub heads will also be deleted."}
        </p>
      </Modal>
    </div>
  );
}