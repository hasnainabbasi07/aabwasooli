import { useState } from "react";
import Button from "../../component/ui/Button";
import Card from "../../component/ui/Card";
import SegmentedControl from "../../component/ui/SegmentedControl";
import SearchInput from "../../component/ui/SearchInput";
import SelectField from "../../component/ui/SelectField";
import DataTable from "../../component/ui/DataTable";
import Badge from "../../component/ui/Badge";
import LineChart from "../../component/charts/LineChart";
import StatCard from "../../component/dashboard/StatCard";
import gallon from "../../assets/dashboard/gallon.png";
import dlvMan from "../../assets/dashboard/dlv-man.png";
import { stats, periods, collection, bottles, revenue, years, deliveryOptions, deliveries } from "./mockData";

const bottleColumns = [
  { key: "icon", label: "Bottle", render: () => <img src={gallon} alt="" className="size-5" /> },
  { key: "client", label: "Client" }, { key: "count", label: "Bottle Count", render: (count) => <span className="font-semibold text-[#4e6b80]">{count}</span> },
];
const deliveryColumns = [
  { key: "icon", label: "Delivery", render: () => <img src={dlvMan} alt="" className="size-9" /> },
  { key: "client", label: "Client" },
  { key: "status", label: "Status", render: (status) => <Badge tone={/pending|not delivered/i.test(status) ? "warning" : /delivered/i.test(status) ? "success" : "info"}>{status}</Badge> },
];
export default function Dashboard() {
  const [period, setPeriod] = useState("monthly");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [deliveryFilter, setDeliveryFilter] = useState("0");
  return <div className="@container grid gap-5">
    <section className="dashboard-welcome"><div><span className="welcome-kicker">THURSDAY, OCTOBER 23</span><h2>Good morning, Admin <span>✦</span></h2><p>Here’s the latest overview of your water delivery operations.</p></div><div className="welcome-actions"><Button>Inquiry Form</Button><SegmentedControl options={periods} value={period} onChange={setPeriod} /></div></section>
    <div className="dashboard-stats grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{stats.map((s) => <StatCard key={s.title} {...s} />)}</div>
    <div className="grid grid-cols-1 gap-5 @5xl:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
      <Card title="Collection" subtitle="7 days records · received amounts" bodyClassName="pr-4 pb-5 pt-5"><LineChart data={collection} xKey="day" yKey="amount" label="Received" color="cyan" variant="bar" yFormatter={(v) => `${v} Rs`} dashedGrid /></Card>
      <Card title="Bottle records" action={<SearchInput value={search} onChange={setSearch} />}><DataTable columns={bottleColumns} rows={bottles} />
      </Card>
      <Card title="Yearly revenue" subtitle="Revenue received by month" bodyClassName="pr-4 pb-5 pt-5" action={<SelectField label="Year" required options={years} value={year} onChange={setYear} className="w-28" />}><LineChart data={revenue} xKey="month" yKey="revenue" label="Revenue received" color="aqua" variant="line" dots yFormatter={(v) => `${v} Rs`} /></Card>
      <Card title="Delivery record" subtitle="Live order status" action={<SelectField label="Status" required options={deliveryOptions} value={deliveryFilter} onChange={setDeliveryFilter} className="w-36" />}><DataTable columns={deliveryColumns} rows={deliveries} /></Card>
    </div>
  </div>;
}







