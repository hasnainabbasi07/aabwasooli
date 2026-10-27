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
import { bottleRecords } from "./mock/bottleData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  {
    key: "deposit",
    label: "Deposit Bot",
    align: "right",
    render: (value) => formatAmount(value),
  },
  {
    key: "refilled",
    label: "Refilled Bot",
    align: "right",
    render: (value) => (
      <span
        className={`font-semibold ${value < 0 ? "text-danger" : "text-link"}`}
      >
        {formatAmount(value)}
      </span>
    ),
  },
  {
    key: "company",
    label: "Company Bot",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-navy">{formatAmount(value)}</span>
    ),
  },
];

const buildStats = (rows, totalRefilled, totalCompany) => [
  {
    icon: "bottleUsers",
    tone: "blue",
    title: "No. of Clients",
    value: rows.length,
    items: [
      `Deposit bottles: ${formatAmount(rows.reduce((sum, r) => sum + r.deposit, 0))}`,
    ],
  },
  {
    icon: "clientBottle",
    tone: "violet",
    title: "Clients Deposit Bottle",
    value: formatAmount(totalRefilled),
    items: [
      `Clients with refills: ${rows.filter((r) => r.refilled > 0).length}`,
    ],
  },
  {
    icon: "companyBottle",
    tone: "green",
    title: "Company Bottle",
    value: formatAmount(totalCompany),
    items: [
      `Clients holding company bottles: ${rows.filter((r) => r.company > 0).length}`,
    ],
  },
];

export default function Bottle() {
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
    return bottleRecords
      .filter(
        (r) => r.date >= shownReport.fromDate && r.date <= shownReport.toDate,
      )
      .filter(
        (r) =>
          shownReport.areaId === "all" ||
          String(r.areaId) === shownReport.areaId,
      );
  }, [shownReport]);

  const totalRefilled = rows.reduce((sum, row) => sum + row.refilled, 0);
  const totalCompany = rows.reduce((sum, row) => sum + row.company, 0);

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
    link.download = "bottles.csv";
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
        {buildStats(rows, totalRefilled, totalCompany).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Bottles History
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
          searchPlaceholder="Search bottles"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto_auto] gap-6 border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>Total Bottles (Refilled): {formatAmount(totalRefilled)}</span>
          <span>Total Bottles (Company): {formatAmount(totalCompany)}</span>
        </div>
      </Card>
    </div>
  );
}

