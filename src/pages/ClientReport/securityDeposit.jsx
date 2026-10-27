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
import { securityDepositRecords } from "./mock/securityDepositData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];
const areaById = new Map(areas.map((a) => [a.id, a.name]));

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  {
    key: "deposit",
    label: "Security Deposit",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
  {
    key: "bottleDeposit",
    label: "Bottle Deposit",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-link">{formatAmount(value)}</span>
    ),
  },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  { key: "area", label: "Sub Locality" },
  {
    key: "joinDate",
    label: "Joining Date",
    render: (value) => formatDate(value),
  },
];

const buildStats = (rows, totalDeposit, totalBottleDeposit) => [
  {
    icon: "depositUsers",
    tone: "blue",
    title: "No. of Users",
    value: rows.length,
    items: [
      `Highest deposit: ${formatAmount(Math.max(0, ...rows.map((r) => r.deposit)))} PKR`,
    ],
  },
  {
    icon: "securityDeposit",
    tone: "green",
    title: "Total Security Deposit",
    value: `${formatAmount(totalDeposit)} PKR`,
    items: [
      `Average per user: ${rows.length ? formatAmount(Math.round(totalDeposit / rows.length)) : 0} PKR`,
    ],
  },
  {
    icon: "bottleDeposit",
    tone: "violet",
    title: "Total Bottle Deposit",
    value: `${formatAmount(totalBottleDeposit)} PKR`,
    items: [
      `Average per user: ${rows.length ? formatAmount(Math.round(totalBottleDeposit / rows.length)) : 0} PKR`,
    ],
  },
];

export default function SecurityDeposit() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    areaId: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return securityDepositRecords
      .filter(
        (r) =>
          r.joinDate >= shownReport.fromDate &&
          r.joinDate <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      )
      .map((r) => ({ ...r, area: areaById.get(r.areaId) ?? "" }));
  }, [shownReport]);

  const totalDeposit = rows.reduce((sum, row) => sum + row.deposit, 0);
  const totalBottleDeposit = rows.reduce(
    (sum, row) => sum + row.bottleDeposit,
    0,
  );

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
    link.download = "security-deposit.csv";
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {buildStats(rows, totalDeposit, totalBottleDeposit).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Users Security Deposit
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
          searchPlaceholder="Search users"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto_auto] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>Security Deposit: {formatAmount(totalDeposit)} PKR</span>
          <span>Bottle Deposit: {formatAmount(totalBottleDeposit)} PKR</span>
        </div>
      </Card>
    </div>
  );
}

