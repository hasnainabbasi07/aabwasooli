import { areas } from "./areaData";
import { employees } from "./employeeData";

// Only active employees can be allocated areas
export const operators = employees
  .filter((e) => e.status === "Active")
  .map((e) => ({ value: String(e.id), label: e.name }));

export const areaItems = areas.map((a) => ({ id: a.id, label: a.name }));

// operator id -> allocated area ids
export const allocations = {
  1: [1, 2],
  2: [3],
  3: [4, 5],
  5: [6],
  6: [7, 8],
  7: [9],
};

// "Allocated Connections" modal rows
export const allocatedSummary = areas.slice(0, 8).map((a) => {
  const active = Math.round(a.userCount * 0.8);
  return { id: a.id, area: a.name, users: a.userCount, active, notActive: a.userCount - active };
});