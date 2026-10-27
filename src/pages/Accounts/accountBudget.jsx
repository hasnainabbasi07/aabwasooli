import { useMemo, useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import DataTable from "../../component/ui/DataTable";
import SelectField from "../../component/ui/SelectField";
import { formatAmount } from "../../utils/format";
import {
  accountBudgetMonths,
  accountBudgetYears,
  initialAccountBudgetRows,
} from "./mock/accountBudgetData";

const monthOptions = [
  { value: "", label: "Select Month" },
  ...accountBudgetMonths,
];
const yearOptions = [
  { value: "", label: "Select Year" },
  ...accountBudgetYears.map((year) => ({ value: year, label: year })),
];

export default function AccountBudget() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [shownPeriod, setShownPeriod] = useState(null);

  const reportRows = useMemo(() => {
    if (!shownPeriod) return [];
    return initialAccountBudgetRows.filter(
      (row) => row.month === Number(shownPeriod.month) && row.year === Number(shownPeriod.year),
    );
  }, [shownPeriod]);
  const total = reportRows.reduce((sum, row) => sum + row.amount, 0);

  const columns = [
    { key: "id", label: "ID" },
    { key: "account", label: "Account" },
    { key: "amount", label: "Amount", align: "right", render: (value) => formatAmount(value) },
  ];

  const showReport = (event) => {
    event.preventDefault();
    if (!month || !year) return;
    setShownPeriod({ month, year });
  };

  return (
    <Card bodyClassName="p-4">
      <form
        onSubmit={showReport}
        className="grid items-end gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: "minmax(0, 15rem) minmax(0, 10rem) auto",
          marginBottom: 20,
        }}
      >
        <SelectField
          label="Month"
          className="min-w-0"
          required
          options={monthOptions}
          value={month}
          onChange={setMonth}
        />
        <SelectField
          label="Year"
          className="min-w-0"
          required
          options={yearOptions}
          value={year}
          onChange={setYear}
        />
        <Button type="submit" disabled={!month || !year} className="justify-self-start whitespace-nowrap">
          Show
        </Button>
      </form>

      <div className="grid min-h-8 grid-cols-[1fr_auto] items-center border-t border-line text-copy font-semibold text-navy" style={{ paddingTop: 12 }}>
        <span>Total: {formatAmount(total)} PKR</span>
      </div>

      <div className="mt-3">
        <DataTable
          columns={columns}
          rows={reportRows}
          maxHeight={480}
          paginated
          searchPlaceholder="Search accounts"
        />
      </div>
    </Card>
  );
}