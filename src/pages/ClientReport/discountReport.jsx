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
import {
  discountRecords,
  discountUserOptions,
} from "./mock/discountReportData";

const columns = [
  { key: "clientId", label: "ID" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
  { key: "date", label: "Month/Year", render: (value) => formatDate(value) },
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
        "0"
      ),
  },
];

const buildStats = (rows, totalAmount, totalDiscount) => [
  {
    icon: "discountCount",
    tone: "blue",
    title: "No. of Discounts",
    value: rows.length,
    items: [
      `Discounted receipts: ${rows.filter((r) => r.discount > 0).length}`,
    ],
  },
  {
    icon: "discountAmount",
    tone: "green",
    title: "Total Amount",
    value: `${formatAmount(totalAmount)} PKR`,
    items: [
      `Average per receipt: ${rows.length ? formatAmount(Math.round(totalAmount / rows.length)) : 0} PKR`,
    ],
  },
  {
    icon: "discountTotal",
    tone: "violet",
    title: "Total Discount",
    value: `${formatAmount(totalDiscount)} PKR`,
    items: [
      `Highest discount: ${formatAmount(Math.max(0, ...rows.map((r) => r.discount)))} PKR`,
    ],
  },
];

export default function DiscountReport() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    userId: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return discountRecords
      .filter(
        (r) => r.date >= shownReport.fromDate && r.date <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.userId === "all" ||
          String(r.clientId) === shownReport.userId,
      );
  }, [shownReport]);

  const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
  const totalDiscount = rows.reduce((sum, row) => sum + row.discount, 0);

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
    link.download = "discount-report.csv";
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
            label="Users"
            required
            options={discountUserOptions}
            value={filters.userId}
            onChange={(value) => updateFilter("userId", value)}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {buildStats(rows, totalAmount, totalDiscount).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Discount Collection History
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
          searchPlaceholder="Search discounts"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto_auto_auto] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>No. of Discounts: {rows.length}</span>
          <span>Amount: {formatAmount(totalAmount)} PKR</span>
          <span>Discount: {formatAmount(totalDiscount)} PKR</span>
        </div>
      </Card>
    </div>
  );
}

