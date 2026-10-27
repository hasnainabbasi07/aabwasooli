import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from "./Icon";

// Two-panel list. Click items to select them, then use the arrow buttons to move them.
// left / right: [{ id, label }]   onChange(newLeft, newRight)
function Panel({ title, items, selected, onToggle, height }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="grid grid-cols-[1fr_auto] items-center border-b border-line px-3 py-2">
        <h4 className="text-copy font-medium text-navy">{title}</h4>
        <span className="text-tiny text-menu">{items.length}</span>
      </div>
      <ul className={`${height} overflow-y-auto p-1`}>
        {items.length === 0 && <li className="px-3 py-6 text-center text-small text-menu">No items</li>}
        {items.map((it) => {
          const on = selected.includes(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(it.id)}
                className={`w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-small transition ${
                  on ? "bg-primary/10 font-medium text-primary" : "text-ink/80 hover:bg-primary/5"
                }`}
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function TransferList({ leftTitle, rightTitle, left, right, onChange, height = "h-52" }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const leftSel = left.filter((i) => selected.includes(i.id));
  const rightSel = right.filter((i) => selected.includes(i.id));

  const moveRight = (moving) => {
    if (!moving.length) return;
    onChange(left.filter((i) => !moving.includes(i)), [...right, ...moving]);
    setSelected((s) => s.filter((id) => !moving.some((m) => m.id === id)));
  };

  const moveLeft = (moving) => {
    if (!moving.length) return;
    onChange([...left, ...moving], right.filter((i) => !moving.includes(i)));
    setSelected((s) => s.filter((id) => !moving.some((m) => m.id === id)));
  };

  const buttons = [
    { label: "Move all to right", icon: <DoubleChevronRightIcon />, disabled: !left.length, onClick: () => moveRight(left) },
    { label: "Move selected to right", icon: <ChevronRightIcon />, disabled: !leftSel.length, onClick: () => moveRight(leftSel) },
    { label: "Move selected to left", icon: <ChevronLeftIcon />, disabled: !rightSel.length, onClick: () => moveLeft(rightSel) },
    { label: "Move all to left", icon: <DoubleChevronLeftIcon />, disabled: !right.length, onClick: () => moveLeft(right) },
  ];

  return (
    <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
      <Panel title={leftTitle} items={left} selected={selected} onToggle={toggle} height={height} />

      <div className="grid grid-flow-col justify-center gap-2 md:grid-flow-row">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            title={b.label}
            disabled={b.disabled}
            onClick={b.onClick}
            className="grid size-8 cursor-pointer place-items-center rounded-md bg-primary/10 text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {b.icon}
          </button>
        ))}
      </div>

      <Panel title={rightTitle} items={right} selected={selected} onToggle={toggle} height={height} />
    </div>
  );
}