import { useState } from "react";
import ActionMenu from "../../component/ui/ActionMenu";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import TextField from "../../component/ui/TextField";
import { EditIcon, PlusIcon } from "../../component/ui/Icon";
import { digits } from "../../utils/format";
import { initialVendors } from "./mock/vendorData";

const emptyVendor = {
  vendor: "",
  company: "",
  address: "",
  cell1: "",
  cell2: "",
};

export default function VendorDetails() {
  const [vendors, setVendors] = useState(initialVendors);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [form, setForm] = useState(emptyVendor);

  const closeModal = () => {
    setModalOpen(false);
    setEditingVendor(null);
  };

  const openAdd = () => {
    setEditingVendor(null);
    setForm(emptyVendor);
    setModalOpen(true);
  };

  const openEdit = (vendor) => {
    setEditingVendor(vendor);
    setForm({
      vendor: vendor.vendor,
      company: vendor.company,
      address: vendor.address,
      cell1: vendor.cell1,
      cell2: vendor.cell2,
    });
    setModalOpen(true);
  };

  const saveVendor = (event) => {
    event.preventDefault();
    const vendorDetails = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    if (editingVendor) {
      setVendors((rows) => rows.map((row) => (
        row.id === editingVendor.id ? { ...row, ...vendorDetails } : row
      )));
    } else {
      const id = vendors.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      setVendors((rows) => [...rows, { id, ...vendorDetails }]);
    }
    closeModal();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "vendor", label: "Vendor" },
    { key: "company", label: "Company" },
    { key: "address", label: "Address" },
    { key: "cell1", label: "Cell 1" },
    { key: "cell2", label: "Cell 2", render: (value) => value || "—" },
    {
      key: "action",
      label: "Action",
      align: "center",
      render: (_, row) => (
        <ActionMenu
          items={[{ label: "Edit", icon: <EditIcon />, onClick: () => openEdit(row) }]}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-5">
      <Card
        title="Vendor Details"
        subtitle="Manage vendor contact information"
        action={<Button icon={<PlusIcon />} onClick={openAdd}>Add Vendor</Button>}
        bodyClassName="p-4"
      >
        <DataTable
          columns={columns}
          rows={vendors}
          maxHeight={480}
          paginated
          searchPlaceholder="Search vendors"
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        size="lg"
        footer={(
          <>
            <Button variant="soft" onClick={closeModal}>Cancel</Button>
            <Button type="submit" form="vendor-form">{editingVendor ? "Save Changes" : "Add"}</Button>
          </>
        )}
      >
        <form id="vendor-form" onSubmit={saveVendor} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <TextField
            label="Vendor"
            required
            autoComplete="organization-title"
            placeholder="Vendor name"
            value={form.vendor}
            onChange={(value) => setForm((current) => ({ ...current, vendor: value }))}
          />
          <TextField
            label="Company"
            required
            autoComplete="organization"
            placeholder="Company name"
            value={form.company}
            onChange={(value) => setForm((current) => ({ ...current, company: value }))}
          />
          <TextField
            label="Address"
            required
            autoComplete="street-address"
            placeholder="Vendor address"
            value={form.address}
            onChange={(value) => setForm((current) => ({ ...current, address: value }))}
          />
          <TextField
            label="Contact 1"
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="03XXXXXXXXX"
            maxLength={11}
            value={form.cell1}
            onChange={(value) => setForm((current) => ({ ...current, cell1: digits(value).slice(0, 11) }))}
          />
          <TextField
            label="Contact 2"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Optional"
            maxLength={11}
            value={form.cell2}
            onChange={(value) => setForm((current) => ({ ...current, cell2: digits(value).slice(0, 11) }))}
          />
        </form>
      </Modal>

    </div>
  );
}