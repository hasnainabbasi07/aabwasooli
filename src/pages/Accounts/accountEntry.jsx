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
import { digits, formatAmount, formatDate } from "../../utils/format";
import { initialAccountHeads, initialAccountSubHeads } from "./mock/accountHeadData";
import {
    accountEntryOperators,
    accountEntryTaxTypes,
    initialAccountEntries,
} from "./mock/accountEntryData";
import { transactionTypes } from "../Master/mock/transactionTypeData";

const today = new Date().toISOString().slice(0, 10);
const allOption = { value: "all", label: "All" };
const emptyForm = {
    headId: "",
    subHeadId: "",
    date: today,
    amount: "",
    tax: "0",
    taxType: "None",
    transactionTypeId: String(transactionTypes[0]?.id ?? ""),
    transactionId: "",
    description: "",
};

export default function AccountEntry() {
    const [entries, setEntries] = useState(initialAccountEntries);
    const [filters, setFilters] = useState({
        headId: "all",
        subHeadId: "all",
        operator: "all",
        startDate: "",
        endDate: "",
    });
    const [modal, setModal] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deleteEntry, setDeleteEntry] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const headOptions = useMemo(
        () => initialAccountHeads.map((head) => ({ value: String(head.id), label: head.masterAccount })),
        [],
    );
    const transactionOptions = useMemo(
        () => transactionTypes.map((type) => ({ value: String(type.id), label: type.name })),
        [],
    );
    const operatorOptions = useMemo(
        () => accountEntryOperators.map((operator) => ({ value: operator, label: operator })),
        [],
    );

    const headNameById = useMemo(
        () => new Map(initialAccountHeads.map((head) => [head.id, head.masterAccount])),
        [],
    );
    const subHeadById = useMemo(
        () => new Map(initialAccountSubHeads.map((subHead) => [subHead.id, subHead])),
        [],
    );
    const filterSubHeadOptions = useMemo(() => {
        const headId = Number(filters.headId);
        return [
            allOption,
            ...initialAccountSubHeads
                .filter((subHead) => filters.headId === "all" || subHead.headId === headId)
                .map((subHead) => ({ value: String(subHead.id), label: subHead.name })),
        ];
    }, [filters.headId]);

    const formSubHeadOptions = useMemo(
        () => initialAccountSubHeads
            .filter((subHead) => Number(form.headId) === subHead.headId)
            .map((subHead) => ({ value: String(subHead.id), label: subHead.name })),
        [form.headId],
    );

    const filteredEntries = useMemo(() => entries.filter((entry) => {
        const subHead = subHeadById.get(entry.subHeadId);
        const matchesHead = filters.headId === "all" || String(entry.headId) === filters.headId;
        const matchesSubHead = filters.subHeadId === "all" || String(entry.subHeadId) === filters.subHeadId;
        const matchesOperator = filters.operator === "all"
            || entry.addedBy === filters.operator
            || entry.editedBy === filters.operator;
        const matchesStart = !filters.startDate || entry.date >= filters.startDate;
        const matchesEnd = !filters.endDate || entry.date <= filters.endDate;
        return Boolean(subHead) && matchesHead && matchesSubHead && matchesOperator && matchesStart && matchesEnd;
    }), [entries, filters, subHeadById]);

    const closeModal = () => {
        setModal(null);
        setEditingEntry(null);
        setDeleteEntry(null);
    };

    const openAdd = () => {
        const defaultHeadId = String(initialAccountHeads[0]?.id ?? "");
        const defaultSubHead = initialAccountSubHeads.find((subHead) => String(subHead.headId) === defaultHeadId);
        setEditingEntry(null);
        setForm({ ...emptyForm, headId: defaultHeadId, subHeadId: String(defaultSubHead?.id ?? "") });
        setModal("entry");
    };

    const openEdit = (entry) => {
        setEditingEntry(entry);
        setForm({
            headId: String(entry.headId),
            subHeadId: String(entry.subHeadId),
            date: entry.date,
            amount: String(entry.amount),
            tax: String(entry.tax),
            taxType: entry.taxType,
            transactionTypeId: String(entry.transactionTypeId),
            transactionId: entry.transactionId,
            description: entry.description,
        });
        setModal("entry");
    };

    const updateFilter = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value,
            ...(key === "headId" ? { subHeadId: "all" } : {}),
        }));
    };

    const updateFormHead = (headId) => {
        const firstSubHead = initialAccountSubHeads.find((subHead) => String(subHead.headId) === headId);
        setForm((current) => ({ ...current, headId, subHeadId: String(firstSubHead?.id ?? "") }));
    };

    const saveEntry = (event) => {
        event.preventDefault();
        const entryValues = {
            headId: Number(form.headId),
            subHeadId: Number(form.subHeadId),
            date: form.date,
            amount: Number(form.amount || 0),
            tax: Number(form.tax || 0),
            taxType: form.taxType,
            transactionTypeId: Number(form.transactionTypeId),
            transactionId: form.transactionId.trim(),
            description: form.description.trim(),
        };

        if (editingEntry) {
            setEntries((rows) => rows.map((row) => (
                row.id === editingEntry.id
                    ? { ...row, ...entryValues, comments: entryValues.description || "—", editedBy: "Admin" }
                    : row
            )));
        } else {
            const id = entries.reduce((max, row) => Math.max(max, row.id), 500) + 1;
            setEntries((rows) => [...rows, {
                id,
                ...entryValues,
                comments: entryValues.description || "—",
                addedBy: "Admin",
                editedBy: "—",
            }]);
        }
        closeModal();
    };

    const confirmDelete = () => {
        if (!deleteEntry) return closeModal();
        setEntries((rows) => rows.filter((row) => row.id !== deleteEntry.id));
        closeModal();
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "headId", label: "Head", render: (value) => headNameById.get(value) ?? "—" },
        { key: "subHeadId", label: "Sub Head", render: (value) => subHeadById.get(value)?.name ?? "—" },
        { key: "comments", label: "Comments" },
        { key: "date", label: "Date", render: (value) => formatDate(value) },
        { key: "amount", label: "Amount", align: "right", render: (value) => formatAmount(value) },
        { key: "addedBy", label: "Add By" },
        { key: "editedBy", label: "Edit By" },
        {
            key: "action",
            label: "Action",
            align: "center",
            render: (_, row) => (
                <ActionMenu
                    items={[
                        { label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) },
                        {
                            label: "Delete",
                            icon: <TrashIcon />,
                            tone: "danger",
                            onClick: () => {
                                setDeleteEntry(row);
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
                <div className="mb-4 flex justify-end">
                    <Button icon={<PlusIcon />} onClick={openAdd}>Add</Button>
                </div>
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <SelectField
                        label="Account Head"
                        options={[allOption, ...headOptions]}
                        value={filters.headId}
                        onChange={(value) => updateFilter("headId", value)}
                    />
                    <SelectField
                        label="Account Sub Head"
                        options={filterSubHeadOptions}
                        value={filters.subHeadId}
                        onChange={(value) => updateFilter("subHeadId", value)}
                    />
                    <SelectField
                        label="Operator"
                        options={[allOption, ...operatorOptions]}
                        value={filters.operator}
                        onChange={(value) => updateFilter("operator", value)}
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={filters.startDate}
                        onChange={(value) => updateFilter("startDate", value)}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={filters.endDate}
                        onChange={(value) => updateFilter("endDate", value)}
                    />
                </div>
                <DataTable columns={columns} rows={filteredEntries} maxHeight={440} paginated />
            </Card>

            <Modal
                open={modal === "entry"}
                onClose={closeModal}
                title={editingEntry ? "Edit Account Detail" : "Account Detail"}
                size="xl"
                footer={(
                    <>
                        <Button variant="soft" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" form="account-entry-form">{editingEntry ? "Save Changes" : "Add"}</Button>
                    </>
                )}
            >
                <form id="account-entry-form" onSubmit={saveEntry} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <SelectField
                        label="Account Head"
                        required
                        options={headOptions}
                        value={form.headId}
                        onChange={updateFormHead}
                    />
                    <SelectField
                        label="Account Sub Head"
                        required
                        options={formSubHeadOptions}
                        value={form.subHeadId}
                        onChange={(value) => setForm((current) => ({ ...current, subHeadId: value }))}
                    />
                    <TextField
                        label="Date"
                        type="date"
                        required
                        value={form.date}
                        onChange={(value) => setForm((current) => ({ ...current, date: value }))}
                    />
                    <TextField
                        label="Amount"
                        required
                        inputMode="numeric"
                        value={form.amount}
                        onChange={(value) => setForm((current) => ({ ...current, amount: digits(value) }))}
                    />
                    <TextField
                        label="Tax"
                        inputMode="numeric"
                        value={form.tax}
                        onChange={(value) => setForm((current) => ({ ...current, tax: digits(value) }))}
                    />
                    <SelectField
                        label="Tax Type"
                        options={accountEntryTaxTypes}
                        value={form.taxType}
                        onChange={(value) => setForm((current) => ({ ...current, taxType: value }))}
                    />
                    <SelectField
                        label="Transaction Type"
                        options={transactionOptions}
                        value={form.transactionTypeId}
                        onChange={(value) => setForm((current) => ({ ...current, transactionTypeId: value }))}
                    />
                    <TextField
                        label="Transaction ID"
                        inputMode="numeric"
                        value={form.transactionId}
                        onChange={(value) => setForm((current) => ({ ...current, transactionId: digits(value) }))}
                    />
                    <Textarea
                        label="Description"
                        className="sm:col-span-2 lg:col-span-3"
                        rows={3}
                        value={form.description}
                        onChange={(value) => setForm((current) => ({ ...current, description: value }))}
                    />
                </form>
            </Modal>

            <Modal
                open={modal === "delete"}
                onClose={closeModal}
                title="Delete Account Entry"
                size="sm"
                footer={(
                    <>
                        <Button variant="soft" onClick={closeModal}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                    </>
                )}
            >
                <p className="text-copy">
                    Delete account entry #{deleteEntry?.id} for {formatAmount(deleteEntry?.amount ?? 0)}?
                </p>
            </Modal>
        </div>
    );
}
