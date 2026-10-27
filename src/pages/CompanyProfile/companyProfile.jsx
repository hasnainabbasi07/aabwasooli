import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import Badge from "../../component/ui/Badge";
import DataTable from "../../component/ui/DataTable";
import TextField from "../../component/ui/TextField";
import SelectField from "../../component/ui/SelectField";
import ImageUpload from "../../component/ui/ImageUpload";
import Modal from "../../component/ui/Modal";
import { company, bottleHistory, bottleOperations, cronFeatures, cronJobs } from "./mockData";

const STATUS_TONE = { In: "success", Out: "warning", Damage: "danger" };

const historyColumns = [
  { key: "id", label: "ID", align: "center" },
  { key: "count", label: "Count", align: "center" },
  {
    key: "status",
    label: "Status",
    align: "center",
    render: (v) => <Badge tone={STATUS_TONE[v]}>{v}</Badge>,
  },
  { key: "addDate", label: "Add Date", align: "center" },
];

const cronColumns = [
  { key: "id", label: "SNo." },
  { key: "title", label: "Title" },
  { key: "time", label: "Time" },
  {
    key: "status",
    label: "Status",
    render: (v) => <Badge tone={v === "Active" ? "success" : "danger"}>{v}</Badge>,
  },
];

export default function CompanyProfile() {
  const [form, setForm] = useState(company);
  const [modal, setModal] = useState(null); // "bottle" | "cron" | "cronTable" | null

  // Add Bottles modal fields
  const [operation, setOperation] = useState(bottleOperations[0].value);
  const [bottle, setBottle] = useState("");

  // Add Cron Job modal fields
  const [feature, setFeature] = useState(cronFeatures[0].value);
  const [time, setTime] = useState("");

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setDigits = (key) => (value) => set(key)(value.replace(/\D/g, ""));
  const close = () => setModal(null);

  const totalCount = bottleHistory.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="grid gap-5">
      {/* Company details */}
      <Card bodyClassName="p-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_180px]"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <TextField className="md:col-span-2" label="ID" required readOnly value={form.id} />
            <TextField className="md:col-span-4" label="Company Name" required placeholder="Enter Company Name"
              autoComplete="off" value={form.name} onChange={set("name")} />
            <TextField className="md:col-span-6" label="Address" required placeholder="Enter Address"
              autoComplete="off" value={form.address} onChange={set("address")} />

            <TextField className="md:col-span-4" label="Phone 1" required placeholder="+92-XXX-YYYYYYY"
              inputMode="numeric" maxLength={11} autoComplete="off" value={form.phone1} onChange={setDigits("phone1")} />
            <TextField className="md:col-span-4" label="Phone 2" required placeholder="+92-XXX-YYYYYYY"
              inputMode="numeric" maxLength={11} autoComplete="off" value={form.phone2} onChange={setDigits("phone2")} />
            <TextField className="md:col-span-4" label="Email" required type="email" placeholder="example@gmail.com"
              autoComplete="off" value={form.email} onChange={set("email")} />

            <TextField className="md:col-span-4" label="Description" required placeholder="Enter Description"
              autoComplete="off" value={form.description} onChange={set("description")} />
            <div className="grid content-end md:col-span-3">
              <Button type="submit" className="justify-self-start">Submit</Button>
            </div>
          </div>

          <div className="grid content-center">
            <ImageUpload value={form.logo} onChange={set("logo")} />
          </div>
        </form>
      </Card>

      {/* Bottle history */}
      <Card bodyClassName="p-6">
        <div className="mb-6 grid grid-flow-col justify-start gap-3">
          <Button onClick={() => setModal("bottle")}>Add Bottles</Button>
          <Button onClick={() => setModal("cron")}>Add Cron Job</Button>
          <Button onClick={() => setModal("cronTable")}>Cron Table</Button>
        </div>

        <h2 className="mb-4 text-center text-heading font-bold text-navy italic">Company Bottle History</h2>
        <DataTable columns={historyColumns} rows={bottleHistory} />
        <p className="mt-3 text-copy font-semibold text-navy">
          Total Count: <span className="ml-2">{totalCount}</span>
        </p>
      </Card>

      {/* Add Bottles */}
      <Modal
        open={modal === "bottle"}
        onClose={close}
        title="Add Bottles"
        size="sm"
        footer={<Button type="submit" form="bottle-form">Add</Button>}
      >
        <form
          id="bottle-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid gap-4"
        >
          <SelectField label="Operation" options={bottleOperations} value={operation} onChange={setOperation} />
          <TextField label="Bottle" required placeholder="Enter Bottle" inputMode="numeric"
            value={bottle} onChange={(v) => setBottle(v.replace(/\D/g, ""))} />
        </form>
      </Modal>

      {/* Add Cron Job */}
      <Modal
        open={modal === "cron"}
        onClose={close}
        title="Add Cron Job"
        size="sm"
        footer={<Button type="submit" form="cron-form">Add</Button>}
      >
        <form
          id="cron-form"
          onSubmit={(e) => { e.preventDefault(); close(); }}
          className="grid gap-4"
        >
          <SelectField label="Select Feature" required options={cronFeatures} value={feature} onChange={setFeature} />
          <TextField label="Select Time" required type="time" value={time} onChange={setTime} />
        </form>
      </Modal>

      {/* Cron Table */}
      <Modal open={modal === "cronTable"} onClose={close} title="Cron Table">
        <DataTable columns={cronColumns} rows={cronJobs} />
      </Modal>
    </div>
  );
}