import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import SelectField from "../../component/ui/SelectField";
import TextField from "../../component/ui/TextField";
import { DownloadIcon, PrinterIcon } from "../../component/ui/Icon";
import { formatAmount, formatDate } from "../../utils/format";
import {
  initialAccountHeads,
  initialAccountSubHeads,
} from "../Accounts/mock/accountHeadData";
import { initialAccountEntries } from "../Accounts/mock/accountEntryData";
import { transactionTypes } from "../Master/mock/transactionTypeData";
import {
  balanceSheetReportTypes,
  reportTypeTitles,
} from "./mock/balanceSheetData";
import StatCard from "../../component/dashboard/StatCard";
const allOption = { value: "all", label: "All accounts" };
const reportTypeOptions = [
  { value: "", label: "Select Report" },
  ...balanceSheetReportTypes,
];

const groupBy = (rows, getKey) => {
  const groups = new Map();
  rows.forEach((row) => {
    const key = getKey(row);
    const group = groups.get(key) ?? { ...row, amount: 0, count: 0 };
    group.amount += Number(row.amount || 0) + Number(row.tax || 0);
    group.count += 1;
    groups.set(key, group);
  });
  return [...groups.values()];
};

const buildStats = (rows, total, reportType) => {
  const average = rows.length
    ? formatAmount(Math.round(total / rows.length))
    : 0;
  const records = {
    icon: "orders",
    tone: "blue",
    title: "No. of Records",
    value: rows.length,
    items: [`Average per record: ${average} PKR`],
  };

  if (reportType === "balance-sheet") {
    const debit = rows.reduce((sum, row) => sum + row.debit, 0);
    const credit = rows.reduce((sum, row) => sum + row.credit, 0);
    return [
      records,
      {
        icon: "receivable",
        tone: "violet",
        title: "Total Debit",
        value: `${formatAmount(debit)} PKR`,
        items: [`Debit entries: ${rows.filter((row) => row.debit > 0).length}`],
      },
      {
        icon: "received",
        tone: "green",
        title: "Total Credit",
        value: `${formatAmount(credit)} PKR`,
        items: [
          `Credit entries: ${rows.filter((row) => row.credit > 0).length}`,
        ],
      },
    ];
  }

  return [
    records,
    {
      icon: "received",
      tone: "green",
      title: "Total Amount",
      value: `${formatAmount(total)} PKR`,
      items: [reportTypeTitles[reportType] ?? "Account Report"],
    },
  ];
};

export default function BalanceSheetReport() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    reportType: "balance-sheet",
    headId: "all",
    subHeadId: "all",
  });
  const [shownReport, setShownReport] = useState(null);

  const headOptions = useMemo(
    () =>
      initialAccountHeads.map((head) => ({
        value: String(head.id),
        label: head.masterAccount,
      })),
    [],
  );
  const subHeadOptions = useMemo(
    () =>
      initialAccountSubHeads
        .filter(
          (subHead) =>
            filters.headId === "all" ||
            String(subHead.headId) === filters.headId,
        )
        .map((subHead) => ({ value: String(subHead.id), label: subHead.name })),
    [filters.headId],
  );
  const headById = useMemo(
    () => new Map(initialAccountHeads.map((head) => [head.id, head])),
    [],
  );
  const subHeadById = useMemo(
    () =>
      new Map(initialAccountSubHeads.map((subHead) => [subHead.id, subHead])),
    [],
  );
  const transactionTypeById = useMemo(
    () => new Map(transactionTypes.map((type) => [type.id, type.name])),
    [],
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "headId" ? { subHeadId: "all" } : {}),
    }));
  };

  const report = useMemo(() => {
    if (!shownReport) return { rows: [], columns: [], total: 0 };

    const { fromDate, toDate, reportType, headId, subHeadId } = shownReport;
    let source = initialAccountEntries.filter(
      (entry) => entry.date >= fromDate && entry.date <= toDate,
    );
    if (headId !== "all")
      source = source.filter((entry) => String(entry.headId) === headId);
    if (subHeadId !== "all")
      source = source.filter((entry) => String(entry.subHeadId) === subHeadId);

    if (
      reportType === "expense" ||
      reportType === "head-expense" ||
      reportType === "transaction-expense"
    ) {
      source = source.filter(
        (entry) =>
          headById.get(entry.headId)?.accountType === "Expenses Account",
      );
    }

    if (reportType === "head-expense") {
      const rows = groupBy(source, (entry) => entry.headId).map((entry) => ({
        id: entry.headId,
        head: headById.get(entry.headId)?.masterAccount ?? "Unknown",
        transactions: entry.count,
        amount: entry.amount,
      }));
      return {
        rows,
        columns: [
          { key: "id", label: "ID" },
          { key: "head", label: "Account Head" },
          { key: "transactions", label: "Transactions", align: "right" },
          {
            key: "amount",
            label: "Amount",
            align: "right",
            render: (value) => formatAmount(value),
          },
        ],
        total: rows.reduce((sum, row) => sum + row.amount, 0),
      };
    }

    if (reportType === "account-summary") {
      const rows = groupBy(source, (entry) => entry.subHeadId).map((entry) => ({
        id: entry.subHeadId,
        head: headById.get(entry.headId)?.masterAccount ?? "Unknown",
        account: subHeadById.get(entry.subHeadId)?.name ?? "Unknown",
        transactions: entry.count,
        amount: entry.amount,
      }));
      return {
        rows,
        columns: [
          { key: "id", label: "ID" },
          { key: "head", label: "Account Head" },
          { key: "account", label: "Account" },
          { key: "transactions", label: "Transactions", align: "right" },
          {
            key: "amount",
            label: "Amount",
            align: "right",
            render: (value) => formatAmount(value),
          },
        ],
        total: rows.reduce((sum, row) => sum + row.amount, 0),
      };
    }

    if (reportType === "transaction-expense") {
      const rows = groupBy(source, (entry) => entry.transactionTypeId).map(
        (entry) => ({
          id: entry.transactionTypeId,
          transaction:
            transactionTypeById.get(entry.transactionTypeId) ?? "Other",
          transactions: entry.count,
          amount: entry.amount,
        }),
      );
      return {
        rows,
        columns: [
          { key: "id", label: "ID" },
          { key: "transaction", label: "Transaction Type" },
          { key: "transactions", label: "Entries", align: "right" },
          {
            key: "amount",
            label: "Amount",
            align: "right",
            render: (value) => formatAmount(value),
          },
        ],
        total: rows.reduce((sum, row) => sum + row.amount, 0),
      };
    }

    const rows = source.map((entry) => {
      const head = headById.get(entry.headId);
      const amount = Number(entry.amount || 0) + Number(entry.tax || 0);
      const isExpense = head?.accountType === "Expenses Account";
      return {
        id: entry.id,
        head: head?.masterAccount ?? "Unknown",
        account: subHeadById.get(entry.subHeadId)?.name ?? "Unknown",
        comments: entry.comments,
        date: formatDate(entry.date),
        debit: isExpense ? amount : 0,
        credit: isExpense ? 0 : amount,
        amount,
      };
    });

    if (reportType === "balance-sheet") {
      return {
        rows,
        columns: [
          { key: "id", label: "ID" },
          { key: "head", label: "Head" },
          { key: "account", label: "Account" },
          {
            key: "debit",
            label: "Debit",
            align: "right",
            render: (value) => formatAmount(value),
          },
          {
            key: "credit",
            label: "Credit",
            align: "right",
            render: (value) => formatAmount(value),
          },
        ],
        total: rows.reduce((sum, row) => sum + row.debit + row.credit, 0),
      };
    }

    return {
      rows: rows.map(({ id, head, account, comments, date, amount }) => ({
        id,
        head,
        account,
        comments,
        date,
        amount,
      })),
      columns: [
        { key: "id", label: "ID" },
        { key: "head", label: "Head" },
        { key: "account", label: "Sub Head" },
        { key: "comments", label: "Comments" },
        { key: "date", label: "Date" },
        {
          key: "amount",
          label: "Amount",
          align: "right",
          render: (value) => formatAmount(value),
        },
      ],
      total: rows.reduce((sum, row) => sum + row.amount, 0),
    };
  }, [headById, shownReport, subHeadById, transactionTypeById]);

  const showReport = (event) => {
    event.preventDefault();
    if (
      !filters.fromDate ||
      !filters.toDate ||
      !filters.reportType ||
      filters.fromDate > filters.toDate
    )
      return;
    setShownReport({ ...filters });
  };

  const exportCsv = () => {
    if (!report.rows.length) return;
    const headings = report.columns.map((column) => column.label);
    const values = report.rows.map((row) =>
      report.columns.map(({ key }) => row[key] ?? ""),
    );
    const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const content = [headings, ...values]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(reportTypeTitles[shownReport.reportType] ?? "account-report").toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const showAccountFilters =
    shownReport?.reportType === "head-expense" ||
    shownReport?.reportType === "account-summary" ||
    filters.reportType === "head-expense" ||
    filters.reportType === "account-summary";
  const columns = report.columns.length
    ? report.columns
    : [{ key: "empty", label: "Report details" }];

  return (
    <div className="report-page grid gap-5">
      <Card bodyClassName="p-4">
        <form
          onSubmit={showReport}
          className={`grid grid-cols-1 items-end gap-3 sm:grid-cols-2 ${
            showAccountFilters
              ? "xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]"
              : "xl:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
          }`}
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
            options={reportTypeOptions}
            value={filters.reportType}
            onChange={(value) => updateFilter("reportType", value)}
          />
          {showAccountFilters && (
            <>
              <SelectField
                label="Account Head"
                options={[allOption, ...headOptions]}
                value={filters.headId}
                onChange={(value) => updateFilter("headId", value)}
              />
              <SelectField
                label="Account Sub Head"
                options={[allOption, ...subHeadOptions]}
                value={filters.subHeadId}
                onChange={(value) => updateFilter("subHeadId", value)}
              />
            </>
          )}
          <Button
            type="submit"
            disabled={
              !filters.fromDate || !filters.toDate || !filters.reportType
            }
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
        {buildStats(report.rows, report.total, shownReport?.reportType).map(
          (stat) => (
            <StatCard key={stat.title} {...stat} />
          ),
        )}
      </div>

      <Card bodyClassName="p-4">
        <div className="mb-4 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line pb-3">
          <h2 className="text-subhead font-semibold text-navy">
            {shownReport
              ? reportTypeTitles[shownReport.reportType]
              : "Balance Sheet"}
          </h2>
          <Button
            variant="soft"
            icon={<DownloadIcon />}
            onClick={exportCsv}
            disabled={!report.rows.length}
          >
            Web Excel
          </Button>
          <Button
            variant="outline"
            icon={<PrinterIcon />}
            onClick={() => window.print()}
            disabled={!report.rows.length}
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
          rows={report.rows}
          maxHeight={480}
          paginated
          searchPlaceholder="Search report"
        />
        <div className="report-totals mt-4 grid grid-cols-[1fr_auto] border-t border-line pt-3 text-copy font-semibold text-navy">
          <span>Total</span>
          <span>{formatAmount(report.total)} PKR</span>
        </div>
      </Card>
    </div>
  );
}


