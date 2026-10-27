import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import StatCard from "../../component/dashboard/StatCard";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatAmount, formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import { employees } from "../Master/mock/employeeData";
import {
  clientStatusOptions,
  collectionRecords,
  collectionReportTypes,
  newClientRecords,
} from "./mock/clientCollectionData";

const allOption = { value: "all", label: "All" };
const areaOptions = [
  allOption,
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];
const operatorOptions = [
  allOption,
  ...employees.map((e) => ({ value: String(e.id), label: e.name })),
];
const areaById = new Map(areas.map((a) => [a.id, a.name]));

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const inRange = (date, { fromDate, toDate }) =>
  date >= fromDate && date <= toDate;
const matches = (filter, id) => filter === "all" || String(id) === filter;

const buildStats = ({
  users = 0,
  discount = 0,
  received = 0,
  receipts = 0,
  discounted = 0,
}) => [
  {
    icon: "clients",
    tone: "blue",
    title: "Total Number of Users",
    value: users,
    items: [`Receipts: ${receipts}`],
  },
  {
    icon: "discount",
    tone: "violet",
    title: "Total Discount",
    value: formatAmount(discount),
    items: [`Discounted receipts: ${discounted}`],
  },
  {
    icon: "received",
    tone: "green",
    title: "Total Received",
    value: `${formatAmount(received)} PKR`,
    items: [
      `Average per receipt: ${receipts ? formatAmount(Math.round(received / receipts)) : 0} PKR`,
    ],
  },
];

function NameCell({ name }) {
  return (
    <span className="grid grid-flow-col items-center justify-start gap-2">
      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-tiny font-semibold text-link">
        {initials(name)}
      </span>
      {name}
    </span>
  );
}

const collectionColumns = [
  {
    key: "bill",
    label: "Bill",
    render: (value) => (
      <span className="rounded-pill bg-soft px-2 py-0.5 font-semibold text-link">
        #{value}
      </span>
    ),
  },
  { key: "clientId", label: "Id" },
  {
    key: "client",
    label: "Name",
    render: (value) => <NameCell name={value} />,
  },
  {
    key: "discount",
    label: "Discount",
    align: "right",
    render: (value) =>
      value ? (
        <span className="font-semibold text-warning">
          {formatAmount(value)}
        </span>
      ) : (
        "—"
      ),
  },
  {
    key: "received",
    label: "Received",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
  {
    key: "date",
    label: "Receiving Date",
    render: (value) => formatDate(value),
  },
];

const newClientColumns = [
  { key: "id", label: "Id" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "phone", label: "Phone" },
  { key: "area", label: "Sublocality" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`rounded-pill px-2 py-0.5 font-semibold ${value === "active" ? "bg-success/15 text-success" : "bg-danger/10 text-danger"}`}
      >
        {value === "active" ? "Active" : "Not Active"}
      </span>
    ),
  },
  {
    key: "joinDate",
    label: "Joining Date",
    render: (value) => formatDate(value),
  },
];

export default function ClientCollection() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    areaId: "all",
    operatorId: "all",
    reportType: "collection",
    status: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const report = useMemo(() => {
    if (!shownReport)
      return {
        rows: [],
        columns: [],
        stats: buildStats({}),
        title: "Collection History",
      };

    if (shownReport.reportType === "new-clients") {
      const rows = newClientRecords
        .filter(
          (r) =>
            inRange(r.joinDate, shownReport) &&
            matches(shownReport.areaId, r.areaId) &&
            (shownReport.status === "all" || r.status === shownReport.status),
        )
        .map((r) => ({ ...r, area: areaById.get(r.areaId) ?? "-" }));
      return {
        rows,
        columns: newClientColumns,
        stats: buildStats({ users: rows.length }),
        title: "New Client List",
      };
    }

    const rows = collectionRecords
      .filter(
        (r) =>
          inRange(r.date, shownReport) &&
          matches(shownReport.areaId, r.areaId) &&
          matches(shownReport.operatorId, r.operatorId),
      )
      .map((r) => ({ ...r, id: r.bill }));
    return {
      rows,
      columns: collectionColumns,
      stats: buildStats({
        users: new Set(rows.map((r) => r.clientId)).size,
        discount: rows.reduce((sum, r) => sum + r.discount, 0),
        received: rows.reduce((sum, r) => sum + r.received, 0),
        receipts: rows.length,
        discounted: rows.filter((r) => r.discount > 0).length,
      }),
      title: "Collection History",
    };
  }, [shownReport]);

  const showReport = (event) => {
    event.preventDefault();
    if (
      !filters.fromDate ||
      !filters.toDate ||
      filters.fromDate > filters.toDate
    )
      return;
    setShownReport({ ...filters });
  };

  const exportCsv = () => {
    if (!report.rows.length) return;
    const headings = report.columns.map((column) => column.label);
    const values = report.rows.map((row) =>
      report.columns.map(({ key }) => row[key] ?? ""),
    );
    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const content = [headings, ...values]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = report.columns.length
    ? report.columns
    : [{ key: "empty", label: "Report details" }];

  return (
    <div className="report-page grid gap-5">
      <Card bodyClassName="p-4">
        <form
          onSubmit={showReport}
          className="report-filters grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <TextField
            label="From Date"
            type="date"
            required
            value={filters.fromDate}
            onChange={(value) => updateFilter("fromDate", value)}
          />
          <TextField
            label="To Date"
            type="date"
            required
            value={filters.toDate}
            onChange={(value) => updateFilter("toDate", value)}
          />
          <SelectField
            label="Sublocality"
            required
            options={areaOptions}
            value={filters.areaId}
            onChange={(value) => updateFilter("areaId", value)}
          />
          <SelectField
            label="Operator"
            required
            options={operatorOptions}
            value={filters.operatorId}
            onChange={(value) => updateFilter("operatorId", value)}
          />
          <SelectField
            label="Report Type"
            required
            options={collectionReportTypes}
            value={filters.reportType}
            onChange={(value) => updateFilter("reportType", value)}
          />
          {filters.reportType === "new-clients" && (
            <SelectField
              label="Status"
              required
              options={clientStatusOptions}
              value={filters.status}
              onChange={(value) => updateFilter("status", value)}
            />
          )}
          <Button
            type="submit"
            disabled={!filters.fromDate || !filters.toDate}
            className="justify-self-start"
          >
            Show
          </Button>
        </form>
        {filters.fromDate &&
          filters.toDate &&
          filters.fromDate > filters.toDate && (
            <p className="mt-3 text-small text-danger">
              From Date must be before or equal to To Date.
            </p>
          )}
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {report.stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            {report.title}
          </h2>
          <Button
            variant="soft"
            icon={<DownloadIcon />}
            onClick={exportCsv}
            disabled={!report.rows.length}
          >
            Web Excel
          </Button>
          <Button
            variant="outline"
            icon={<PrinterIcon />}
            onClick={() => window.print()}
            disabled={!report.rows.length}
          >
            Print
          </Button>
        </div>
        {shownReport && (
          <p className="mb-3 text-small text-muted">
            {formatDate(shownReport.fromDate)} -{" "}
            {formatDate(shownReport.toDate)}
          </p>
        )}
        <DataTable
          columns={columns}
          rows={report.rows}
          maxHeight={480}
          paginated
          searchPlaceholder="Search report"
        />
      </Card>
    </div>
  );
}

