import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import NameCell from "../../component/ui/NameCell";
import SelectField from "../../component/ui/SelectField";
import StatCard from "../../component/dashboard/StatCard";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatAmount } from "../../utils/format";
import { areas } from "../Master/mock/areaData";
import { advanceRecords } from "./mock/advanceCollectionData";

const areaOptions = [
  { value: "all", label: "All" },
  ...areas.map((a) => ({ value: String(a.id), label: a.name })),
];

const columns = [
  { key: "id", label: "Id" },
  { key: "name", label: "Name", render: (value) => <NameCell name={value} /> },
  { key: "address", label: "Address", render: (value) => value || "-----" },
  {
    key: "balance",
    label: "Balance",
    align: "right",
    render: (value) => (
      <span className="font-semibold text-success">{formatAmount(value)}</span>
    ),
  },
];

const buildStats = (rows, total) => [
  {
    icon: "clients",
    tone: "blue",
    title: "No. of Users",
    value: rows.length,
    items: [
      `Highest advance: ${formatAmount(Math.max(0, ...rows.map((r) => r.balance)))} PKR`,
    ],
  },
  {
    icon: "advance",
    tone: "green",
    title: "Total Advance Amount",
    value: `${formatAmount(total)} PKR`,
    items: [
      `Average per user: ${rows.length ? formatAmount(Math.round(total / rows.length)) : 0} PKR`,
    ],
  },
];

export default function AdvanceCollection() {
  const [areaId, setAreaId] = useState("all");
  const [shownReport, setShownReport] = useState(null);

  const rows = useMemo(() => {
    if (!shownReport) return [];
    return advanceRecords.filter(
      (r) =>
        shownReport.areaId === "all" || String(r.areaId) === shownReport.areaId,
    );
  }, [shownReport]);

  const total = rows.reduce((sum, row) => sum + row.balance, 0);

  const showReport = (event) => {
    event.preventDefault();
    setShownReport({ areaId });
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
    link.download = "advance-collection.csv";
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
          <SelectField
            label="Sublocality"
            required
            options={areaOptions}
            value={areaId}
            onChange={setAreaId}
          />
          <Button type="submit" className="justify-self-start">
            Show
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {buildStats(rows, total).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card bodyClassName="p-4">
        <div className="report-toolbar mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            Advance Amount History
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
        <DataTable
          columns={columns}
          rows={rows}
          maxHeight={480}
          paginated
          searchPlaceholder="Search advance"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto] border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total Advance Amount</span>
          <span>{formatAmount(total)} PKR</span>
        </div>
      </Card>
    </div>
  );
}

