import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisIcon } from "./Icon";

// items: [{ label, icon, onClick, tone?: "danger" }]
export default function ActionMenu({ items, label = "Actions" }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState(null);
  const close = () => setPos(null);

  const toggle = () => {
    if (pos) return close();
    const r = btnRef.current.getBoundingClientRect();
    const h = items.length * 32 + 8;
    const top = r.bottom + 4 + h > window.innerHeight ? r.top - h - 4 : r.bottom + 4;
    setPos({ top, right: window.innerWidth - r.right });
  };

  useEffect(() => {
    if (!pos) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [pos]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        onClick={toggle}
        className="grid size-7 cursor-pointer place-items-center rounded-md text-menu transition hover:bg-primary/10 hover:text-primary"
      >
        <EllipsisIcon />
      </button>

      {pos &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={close} />
            <ul
              role="menu"
              style={{ top: pos.top, right: pos.right }}
              className="action-menu-popup fixed z-50 grid min-w-36 gap-0.5 rounded-lg border border-line bg-white p-1 shadow-card"
            >
              {items.map((it) => (
                <li key={it.label}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { close(); it.onClick?.(); }}
                    className={`action-menu-item grid w-full cursor-pointer grid-cols-[auto_1fr] items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-copy transition ${
                      it.tone === "danger"
                        ? "text-danger hover:bg-danger/10"
                        : "text-ink hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {it.icon}
                    {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </>,
          document.body
        )}
    </>
  );
}
