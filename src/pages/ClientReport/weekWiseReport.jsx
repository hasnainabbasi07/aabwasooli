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
import {
  deliveryTypeOptions,
  monthOptions,
  reportTypeOptions,
  weekWiseRecords,
  yearOptions,
} from "./mock/weekWiseReportData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];

const today = new Date();

const TITLES = {
  day: "Day",
  weekly: "Weekly",
  month: "Monthly",
  selection: "Selection",
};

const toIso = (year, month, day) =>
  new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
const daysInMonth = (year, month) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

// Turns the filters into a { from, to } date range. Weekly = Sunday to Saturday of the chosen day.
const getRange = ({ reportType, month, day, year, fromDate, toDate }) => {
  const y = Number(year);
  const m = Number(month);
  const d = Math.min(Number(day), daysInMonth(y, m));
  if (reportType === "selection") return { from: fromDate, to: toDate };
  if (reportType === "month")
    return { from: toIso(y, m, 1), to: toIso(y, m, daysInMonth(y, m)) };
  if (reportType === "weekly") {
    const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    return { from: toIso(y, m, d - weekday), to: toIso(y, m, d - weekday + 6) };
  }
  return { from: toIso(y, m, d), to: toIso(y, m, d) };
};

const columns = [
  { key: "clientId", label: "Client ID" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  { key: "cell", label: "Cell" },
  { key: "addDate", label: "Add Date", render: (value) => formatDate(value) },
  {
    key: "previous",
    label: "Previous Balance",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    key: "balance",
    label: "Balance",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-danger">{formatAmount(value)}</span>
    ),
  },
  {
    key: "empty",
    label: "Empty Bottles",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    key: "delivery",
    label: "Delivery",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-link">{formatAmount(value)}</span>
    ),
  },
  {
    key: "sale",
    label: "Sale",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
  {
    key: "received",
    label: "Received",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-success">{formatAmount(value)}</span>
    ),
  },
];

const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

const buildStats = (rows) => [
  {
    icon: "weekClients",
    tone: "blue",
    title: "Total Clients",
    value: rows.length,
    items: [`Empty bottles: ${formatAmount(sum(rows, "empty"))}`],
  },
  {
    icon: "weekDelivery",
    tone: "cyan",
    title: "Total Delivery",
    value: formatAmount(sum(rows, "delivery")),
    items: [`Previous balance: ${formatAmount(sum(rows, "previous"))}`],
  },
  {
    icon: "weekSale",
    tone: "violet",
    title: "Total Sale",
    value: `${formatAmount(sum(rows, "sale"))} PKR`,
    items: [`Balance: ${formatAmount(sum(rows, "balance"))} PKR`],
  },
  {
    icon: "weekReceived",
    tone: "green",
    title: "Total Received",
    value: `${formatAmount(sum(rows, "received"))} PKR`,
    items: [
      `Average per client: ${rows.length ? formatAmount(Math.round(sum(rows, "received") / rows.length)) : 0} PKR`,
    ],
  },
];

export default function WeekWiseReport() {
  const [filters, setFilters] = useState({
    reportType: "weekly",
    month: String(today.getMonth() + 1),
    day: String(today.getDate()),
    year: String(today.getFullYear()),
    fromDate: "",
    toDate: "",
    areaId: "all",
    type: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const monthDays = daysInMonth(Number(filters.year), Number(filters.month));
  const dayOptions = Array.from({ length: monthDays }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  const dayValue = String(Math.min(Number(filters.day), monthDays));

  const { reportType } = filters;
  const showMonth = reportType !== "selection";
  const showDay = reportType === "day" || reportType === "weekly";
  const showYear = reportType !== "selection";
  const showRange = reportType === "selection";
  const invalidRange =
    showRange &&
    filters.fromDate &&
    filters.toDate &&
    filters.fromDate > filters.toDate;

  const range = shownReport ? getRange(shownReport) : null;

  const rows = useMemo(() => {
    if (!shownReport) return [];
    const { from, to } = getRange(shownReport);
    return weekWiseRecords
      .filter((r) => r.addDate >= from && r.addDate <= to)
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      )
      .filter((r) => shownReport.type === "all" || r.type === shownReport.type);
  }, [shownReport]);

  const showReport = (event) => {
    event.preventDefault();
    if (showRange && (!filters.fromDate || !filters.toDate || invalidRange))
      return;
    setShownReport({ ...filters, day: dayValue });
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
    link.download = "week-wise-delivery.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-page grid min-w-0 max-w-full gap-5">
      <Card bodyClassName="p-4">
        <form
          onSubmit={showReport}
          className="report-filters grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <SelectField
            label="Report Type"
            required
            options={reportTypeOptions}
            value={filters.reportType}
            onChange={(value) => updateFilter("reportType", value)}
          />
          {showMonth && (
            <SelectField
              label="Month"
              required
              options={monthOptions}
              value={filters.month}
              onChange={(value) => updateFilter("month", value)}
            />
          )}
          {showDay && (
            <SelectField
              label="Day"
              required
              options={dayOptions}
              value={dayValue}
              onChange={(value) => updateFilter("day", value)}
            />
          )}
          {showRange && (
            <>
              <TextField
                label="From"
                type="date"
                required
                value={filters.fromDate}
                onChange={(value) => updateFilter("fromDate", value)}
              />
              <TextField
                label="To"
                type="date"
                required
                value={filters.toDate}
                onChange={(value) => updateFilter("toDate", value)}
              />
            </>
          )}
          <SelectField
            label="Select Area"
            required
            options={areaOptions}
            value={filters.areaId}
            onChange={(value) => updateFilter("areaId", value)}
          />
          {showYear && (
            <SelectField
              label="Year"
              required
              options={yearOptions}
              value={filters.year}
              onChange={(value) => updateFilter("year", value)}
            />
          )}
          <SelectField
            label="Type"
            required
            options={deliveryTypeOptions}
            value={filters.type}
            onChange={(value) => updateFilter("type", value)}
          />
          <Button
            type="submit"
            disabled={showRange && (!filters.fromDate || !filters.toDate)}
            className="justify-self-start"
          >
            Show
          </Button>
        </form>
        {invalidRange && (
          <p className="mt-3 text-small text-danger">
            From date must be before or equal to To date.
          </p>
        )}
      </Card>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {buildStats(rows).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="min-w-0 p-4">
        <div className="mb-4 grid min-w-0 grid-cols-2 items-center gap-2 border-b border-line pb-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-3">
          <h2 className="col-span-2 min-w-0 break-words text-center text-subhead font-semibold text-navy sm:col-span-1 sm:text-left">
            {range
              ? `${TITLES[shownReport.reportType]} Report ${formatDate(range.from)} TO ${formatDate(range.to)}`
              : "Week Wise Delivery"}
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

        <div className="w-full min-w-0 max-w-full overflow-x-auto">
          <DataTable
            columns={columns}
            rows={rows}
            maxHeight={480}
            paginated
            searchPlaceholder="Search clients"
          />
        </div>

        <div className="report-totals mt-4 grid min-w-0 grid-cols-1 gap-2 border-t border-line pt-3 text-copy font-semibold text-navy sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_repeat(6,auto)] xl:gap-6">
          <span>Totals</span>
          <span>Previous Balance: {formatAmount(sum(rows, "previous"))}</span>
          <span>Balance: {formatAmount(sum(rows, "balance"))}</span>
          <span>Empty Bottles: {formatAmount(sum(rows, "empty"))}</span>
          <span>Delivery: {formatAmount(sum(rows, "delivery"))}</span>
          <span>Sale: {formatAmount(sum(rows, "sale"))}</span>
          <span>Received: {formatAmount(sum(rows, "received"))}</span>
        </div>
      </Card>
    </div>
  );
}


