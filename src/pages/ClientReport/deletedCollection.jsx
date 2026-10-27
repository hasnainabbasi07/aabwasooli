import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import NameCell from "../../component/ui/NameCell";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import StatCard from "../../component/dashboard/StatCard";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatAmount, formatDate } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import { employees } from "../Master/mock/employeeData";
import {
  deletedRecords,
  deletedReportTypeOptions,
} from "./mock/deletedCollectionData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];
const operatorById = new Map(employees.map((e) => [e.id, e.name]));

const baseColumns = [
  { key: "id", label: "Id" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "monthYear", label: "Month/Year" },
  { key: "time", label: "Time" },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-danger">{formatAmount(value)}</span>
    ),
  },
];

// "Deleted By" report shows who deleted the collection as well
const deletedByColumn = { key: "deletedBy", label: "Deleted By" };

const buildStats = (rows, total) => [
  {
    icon: "deletedUsers",
    tone: "blue",
    title: "No. of Deleted Users",
    value: new Set(rows.map((r) => r.id)).size,
    items: [`Deleted collections: ${rows.length}`],
  },
  {
    icon: "deletedAmount",
    tone: "violet",
    title: "Total Amount",
    value: `${formatAmount(total)} PKR`,
    items: [
      `Highest deleted: ${formatAmount(Math.max(0, ...rows.map((r) => r.amount)))} PKR`,
    ],
  },
];

export default function DeletedCollection() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    reportType: "deleted",
    areaId: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return deletedRecords
      .filter(
        (r) =>
          r.deletedDate >= shownReport.fromDate &&
          r.deletedDate <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      )
      .map((r) => ({ ...r, deletedBy: operatorById.get(r.operatorId) ?? "" }));
  }, [shownReport]);

  const columns =
    shownReport?.reportType === "deleted-by"
      ? [...baseColumns, deletedByColumn]
      : baseColumns;
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const canShow =
    filters.fromDate && filters.toDate && filters.reportType !== "0";

  const showReport = (event) => {
    event.preventDefault();
    if (!canShow || filters.fromDate > filters.toDate) return;
    setShownReport({ ...filters });
  };

  const exportCsv = () => {
    if (!rows.length) return;
    const headings = columns.map((column) => column.label);
    const values = rows.map((row) => columns.map(({ key }) => row[key] ?? ""));
    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const content = [headings, ...values]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "deleted-collection.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

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
            label="Report Type"
            required
            options={deletedReportTypeOptions}
            value={filters.reportType}
            onChange={(value) => updateFilter("reportType", value)}
          />
          <SelectField
            label="Sub Locality"
            required
            options={areaOptions}
            value={filters.areaId}
            onChange={(value) => updateFilter("areaId", value)}
          />
          <Button
            type="submit"
            disabled={!canShow}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {buildStats(rows, total).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Delete Collection History
          </h2>
          <Button
            variant="soft"
            icon={<DownloadIcon />}
            onClick={exportCsv}
            disabled={!rows.length}
          >
            Web Excel
          </Button>
          <Button
            variant="outline"
            icon={<PrinterIcon />}
            onClick={() => window.print()}
            disabled={!rows.length}
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
          rows={rows}
          maxHeight={480}
          paginated
          searchPlaceholder="Search deleted collections"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto_auto] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>
            No. of Deleted Users: {new Set(rows.map((r) => r.id)).size}
          </span>
          <span>Total Amount: {formatAmount(total)} PKR</span>
        </div>
      </Card>
    </div>
  );
}

