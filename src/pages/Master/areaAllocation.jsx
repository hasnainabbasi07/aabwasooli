import { useState } from "react";
import Card from "../../component/ui/Card";
import Button from "../../component/ui/Button";
import SelectField from "../../component/ui/SelectField";
import DataTable from "../../component/ui/DataTable";
import Modal from "../../component/ui/Modal";
import TransferList from "../../component/ui/TransferList";
import { operators, areaItems, allocations, allocatedSummary } from "./mock/areaAllocationData";

const summaryColumns = [
  { key: "id", label: "ID" },
  { key: "area", label: "Area" },
  { key: "users", label: "Users" },
  { key: "active", label: "Active" },
  { key: "notActive", label: "Not Active" },
];

// Splits all areas into [not allocated] and [allocated] for one operator
const split = (operatorId) => {
  const ids = allocations[operatorId] ?? [];
  return {
    left: areaItems.filter((a) => !ids.includes(a.id)),
    right: areaItems.filter((a) => ids.includes(a.id)),
  };
};

export default function AreaAllocation() {
  const [operator, setOperator] = useState(operators[0].value);
  const [lists, setLists] = useState(() => split(operators[0].value));
  const [showModal, setShowModal] = useState(false);

  const changeOperator = (value) => {
    setOperator(value);
    setLists(split(value));
  };

  const cancel = () => setLists(split(operator));

  return (
    <div className="grid gap-4">
      <Card bodyClassName="p-4">
        <div className="grid gap-4">
          {/* Operator + actions */}
          <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3 sm:grid-cols-[16rem_auto_auto] sm:justify-start">
            <SelectField label="Operators" required options={operators} value={operator} onChange={changeOperator} />
            <Button variant="danger">Delete</Button>
            <Button onClick={() => setShowModal(true)}>Show</Button>
          </div>

          {/* Areas transfer */}
          <TransferList
            leftTitle="Areas"
            rightTitle="Allocated Areas"
            left={lists.left}
            right={lists.right}
            onChange={(left, right) => setLists({ left, right })}
          />

          {/* Footer */}
          <div className="grid grid-flow-col justify-end gap-2">
            <Button variant="soft" onClick={cancel}>Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </Card>

      {/* Allocated Connections */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Allocated Connections" size="lg">
        <DataTable columns={summaryColumns} rows={allocatedSummary} maxHeight={320} />
      </Modal>
    </div>
  );
}