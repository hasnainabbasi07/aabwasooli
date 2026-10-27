import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import NameCell from "../../component/ui/NameCell";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import StatCard from "../../component/dashboard/StatCard";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatDate } from "../../utils/format";
import { logRecords, logTitleOptions } from "./mock/logsData";

const inRange = (date, { fromDate, toDate }) =>
  date >= fromDate && date <= toDate;
const titleLabel = (value) =>
  logTitleOptions.find((o) => o.value === value)?.label ?? "";

const columns = [
  { key: "sno", label: "S.No" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "date", label: "Date", render: (value) => formatDate(value) },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <span
        className={`rounded-pill px-2 py-0.5 font-semibold ${
          value === "success"
            ? "bg-success/15 text-success"
            : "bg-danger/10 text-danger"
        }`}
      >
        {value === "success" ? "Success" : "Failed"}
      </span>
    ),
  },
];

const buildStats = (rows) => [
  {
    icon: "orders",
    tone: "blue",
    title: "No. of Logs",
    value: rows.length,
    items: [`Successful: ${rows.filter((r) => r.status === "success").length}`],
  },
  {
    icon: "defaulters",
    tone: "violet",
    title: "Failed Logs",
    value: rows.filter((r) => r.status === "failed").length,
    items: [`Unique users: ${new Set(rows.map((r) => r.name)).size}`],
  },
];

export default function LogsReport() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    title: logTitleOptions[0].value,
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return logRecords
      .filter(
        (r) => inRange(r.date, shownReport) && r.title === shownReport.title,
      )
      .map((r, i) => ({ ...r, sno: i + 1 }));
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
    link.download = "logs-report.csv";
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
            label="Title"
            required
            options={logTitleOptions}
            value={filters.title}
            onChange={(value) => updateFilter("title", value)}
          />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {buildStats(rows).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            {shownReport
              ? `${titleLabel(shownReport.title)} Logs`
              : "Logs History"}
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
          searchPlaceholder="Search logs"
        />
      </Card>
    </div>
  );
}

