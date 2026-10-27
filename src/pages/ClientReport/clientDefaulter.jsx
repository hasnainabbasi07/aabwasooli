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
import { defaulterRecords } from "./mock/clientDefaulterData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  {
    key: "bottles",
    label: "Bottles",
    align: "right",
    render: (value) => <span className="font-semibold text-link">{value}</span>,
  },
  {
    key: "previous",
    label: "Previous",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    key: "total",
    label: "Total",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-danger">{formatAmount(value)}</span>
    ),
  },
];

const buildStats = (rows, receivable) => [
  {
    icon: "defaulters",
    tone: "blue",
    title: "No. of Defaulters",
    value: rows.length,
    items: [
      `Bottles with defaulters: ${rows.reduce((sum, r) => sum + r.bottles, 0)}`,
    ],
  },
  {
    icon: "receivable",
    tone: "violet",
    title: "Receivable",
    value: `${formatAmount(receivable)} PKR`,
    items: [
      `Highest balance: ${formatAmount(Math.max(0, ...rows.map((r) => r.total)))} PKR`,
    ],
  },
];

export default function ClientDefaulter() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    areaId: "all",
  });
  const [shownReport, setShownReport] = useState(null);
  const [outboxSent, setOutboxSent] = useState(false);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return defaulterRecords
      .filter(
        (r) => r.date >= shownReport.fromDate && r.date <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      );
  }, [shownReport]);

  const receivable = rows.reduce((sum, row) => sum + row.total, 0);

  const showReport = (event) => {
    event.preventDefault();
    if (
      !filters.fromDate ||
      !filters.toDate ||
      filters.fromDate > filters.toDate
    )
      return;
    setShownReport({ ...filters });
    setOutboxSent(false);
  };

  // TODO: replace with the real "send to outbox" API call
  const sendToOutbox = () => setOutboxSent(true);

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
    link.download = "client-defaulters.csv";
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
            label="Sublocality"
            required
            options={areaOptions}
            value={filters.areaId}
            onChange={(value) => updateFilter("areaId", value)}
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {buildStats(rows, receivable).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="mb-4 grid grid-cols-2 items-center gap-2 border-b border-line pb-3 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-3">
          <Button
            variant="outline"
            onClick={sendToOutbox}
            disabled={!rows.length || outboxSent}
          >
            {outboxSent ? "Sent To Outbox" : "Send Messages To Outbox"}
          </Button>

          <h2 className="col-span-2 row-start-2 text-center text-subhead font-semibold text-navy sm:col-span-1 sm:row-start-auto">
            Defaulters History
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
          searchPlaceholder="Search defaulters"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto] border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total Receivable</span>
          <span>{formatAmount(receivable)} PKR</span>
        </div>
      </Card>
    </div>
  );
}

