import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { AmountIcon, BottleIcon, InvoiceIcon, TruckIcon } from "../ui/Icon";

const childIcons = {
  collection: <AmountIcon />,
  delivery: <TruckIcon />,
  bottles: <BottleIcon />,
  balance: <InvoiceIcon />,
};
export default function RailItem({ item, onNavigate }) {
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const [pos, setPos] = useState(null); // null = closed

  const open = () => {
    clearTimeout(closeTimer.current);
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.right });
  };

  // Small delay so the mouse can travel from the icon into the dropdown.
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setPos(null), 120);
  };

  const close = () => {
    clearTimeout(closeTimer.current);
    setPos(null);
  };

  const handleNavigate = () => {
    close();
    onNavigate?.();
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!pos) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  const link = (
    <NavLink
      to={item.to}
      title={item.children ? undefined : item.label}
      onClick={handleNavigate}
    >
      <img src={item.icon} alt={item.label} className="size-9 object-contain" />
    </NavLink>
  );

  if (!item.children) return link;

  return (
    <>
      <div ref={triggerRef} onMouseEnter={open} onMouseLeave={scheduleClose}>
        {link}
      </div>

      {pos &&
        createPortal(
          <div
            className="fixed z-50 pl-1"
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={scheduleClose}
          >
            <ul className="w-56 rounded-card bg-white py-2 shadow-xl">
              {item.children.map((c) => (
                <li key={c.to}>
                  <NavLink
                    to={c.to}
                    onClick={handleNavigate}
                    className={({ isActive }) =>
                      `grid grid-cols-[auto_1fr] items-center gap-3 px-4 py-2 text-copy font-semibold transition-colors hover:bg-primary/5 hover:text-primary ${
                        isActive ? "text-primary" : "text-navy"
                      }`
                    }
                  >
                    <span className="text-current opacity-60">
                      {childIcons[c.icon]}
                    </span>
                    {c.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
