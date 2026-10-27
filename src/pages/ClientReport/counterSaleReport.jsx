import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import StatCard from "../../component/dashboard/StatCard";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatAmount, formatDate } from "../../utils/format";
import { employees } from "../Master/mock/employeeData";
import { counterSaleRecords } from "./mock/counterSaleReportData";

const operatorOptions = [
  { value: "all", label: "All" },
  ...employees.map((e) => ({ value: String(e.id), label: e.name })),
];
const operatorById = new Map(employees.map((e) => [e.id, e.name]));

const columns = [
  { key: "id", label: "ID" },
  { key: "packageName", label: "Package Name" },
  {
    key: "quantity",
    label: "Quantity",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    key: "paid",
    label: "Paid Amt",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-success">{formatAmount(value)}</span>
    ),
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
    key: "total",
    label: "Total Amt",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
  { key: "date", label: "Date", render: (value) => formatDate(value) },
  { key: "receivedBy", label: "Received By" },
];

const summaryColumns = [
  { key: "sno", label: "S.No" },
  { key: "packageName", label: "Package Name" },
  {
    key: "total",
    label: "Package Total Sale",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
];

const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

const buildStats = (rows) => [
  {
    icon: "saleCount",
    tone: "blue",
    title: "Total Sales",
    value: rows.length,
    items: [`Quantity sold: ${formatAmount(sum(rows, "quantity"))}`],
  },
  {
    icon: "salePaid",
    tone: "green",
    title: "Paid Amount",
    value: `${formatAmount(sum(rows, "paid"))} PKR`,
    items: [`Discount given: ${formatAmount(sum(rows, "discount"))} PKR`],
  },
  {
    icon: "saleTotal",
    tone: "violet",
    title: "Total Amount",
    value: `${formatAmount(sum(rows, "total"))} PKR`,
    items: [
      `Average per sale: ${rows.length ? formatAmount(Math.round(sum(rows, "total") / rows.length)) : 0} PKR`,
    ],
  },
];

export default function CounterSaleReport() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    operatorId: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return counterSaleRecords
      .filter(
        (r) => r.date >= shownReport.fromDate && r.date <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.operatorId === "all" ||
          String(r.operatorId) === shownReport.operatorId,
      )
      .map((r) => ({ ...r, receivedBy: operatorById.get(r.operatorId) ?? "" }));
  }, [shownReport]);

  // Package-wise total sale
  const packageRows = useMemo(() => {
    const totals = new Map();
    rows.forEach((r) =>
      totals.set(r.packageName, (totals.get(r.packageName) ?? 0) + r.total),
    );
    return [...totals].map(([packageName, total], i) => ({
      id: i + 1,
      sno: i + 1,
      packageName,
      total,
    }));
  }, [rows]);

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
    link.download = "counter-sale-report.csv";
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
            label="Sale By"
            required
            options={operatorOptions}
            value={filters.operatorId}
            onChange={(value) => updateFilter("operatorId", value)}
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {buildStats(rows).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Counter Sale Report
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
          searchPlaceholder="Search sales"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_repeat(4,auto)] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>Quantity: {formatAmount(sum(rows, "quantity"))}</span>
          <span>Paid Amt: {formatAmount(sum(rows, "paid"))}</span>
          <span>Discount: {formatAmount(sum(rows, "discount"))}</span>
          <span>Total Amt: {formatAmount(sum(rows, "total"))}</span>
        </div>
      </Card>

      <Card title="Package Wise Sale" bodyClassName="p-4">
        <DataTable columns={summaryColumns} rows={packageRows} />
      </Card>
    </div>
  );
}

