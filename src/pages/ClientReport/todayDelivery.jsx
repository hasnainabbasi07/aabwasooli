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
import { deliveryRecords, deliveryTypeOptions } from "./mock/todayDeliveryData";

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
const operatorById = new Map(employees.map((e) => [e.id, e.name]));

const amountCell = (value) => formatAmount(value);

const columns = [
  { key: "pkgId", label: "Pkg Id" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "amount", label: "Amount", align: "right", render: amountCell },
  { key: "quantity", label: "Quantity", align: "right", render: amountCell },
  {
    key: "deposited",
    label: "Deposited Bottle",
    align: "right",
    render: amountCell,
  },
  {
    key: "previous",
    label: "Previous Bal",
    align: "right",
    render: amountCell,
  },
  {
    key: "balance",
    label: "Balance",
    align: "right",
    render: (value) => (
      <span
        className={`font-semibold ${value ? "text-danger" : "text-success"}`}
      >
        {formatAmount(value)}
      </span>
    ),
  },
  {
    key: "rcv",
    label: "Rcv",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-success">{formatAmount(value)}</span>
    ),
  },
  { key: "area", label: "Area" },
  { key: "addBy", label: "Add By" },
  { key: "date", label: "Delivery Date", render: (value) => formatDate(value) },
];

const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

const buildStats = (rows) => [
  {
    icon: "todayDelivery",
    tone: "blue",
    title: "Total Deliveries",
    value: rows.length,
    items: [`Bottles delivered: ${formatAmount(sum(rows, "quantity"))}`],
  },
  {
    icon: "balance",
    tone: "violet",
    title: "Total Balance",
    value: `${formatAmount(sum(rows, "balance"))} PKR`,
    items: [`Previous balance: ${formatAmount(sum(rows, "previous"))} PKR`],
  },
  {
    icon: "collection",
    tone: "green",
    title: "Total Collection",
    value: `${formatAmount(sum(rows, "rcv"))} PKR`,
    items: [`Total amount: ${formatAmount(sum(rows, "amount"))} PKR`],
  },
];

export default function TodayDelivery() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    areaId: "all",
    operatorId: "all",
    type: "delivery",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return deliveryRecords
      .filter(
        (r) => r.date >= shownReport.fromDate && r.date <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      )
      .filter(
        (r) =>
          shownReport.operatorId === "all" ||
          String(r.operatorId) === shownReport.operatorId,
      )
      .filter((r) => r.type === shownReport.type)
      .map((r) => ({
        ...r,
        area: areaById.get(r.areaId) ?? "",
        addBy: operatorById.get(r.operatorId) ?? "",
      }));
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
    link.download = "today-delivery.csv";
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
            label="Sub Locality"
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
            label="All Delivery/Order"
            required
            options={deliveryTypeOptions}
            value={filters.type}
            onChange={(value) => updateFilter("type", value)}
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
            Today Delivery Report
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
          searchPlaceholder="Search deliveries"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_repeat(4,auto)] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Totals</span>
          <span>Amount: {formatAmount(sum(rows, "amount"))}</span>
          <span>Quantity: {formatAmount(sum(rows, "quantity"))}</span>
          <span>Deposited Bottle: {formatAmount(sum(rows, "deposited"))}</span>
          <span>Previous Bal: {formatAmount(sum(rows, "previous"))}</span>
        </div>
      </Card>
    </div>
  );
}

