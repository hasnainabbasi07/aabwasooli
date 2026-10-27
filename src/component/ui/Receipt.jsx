import { PrinterIcon } from "./Icon";

export default function Receipt({ data }) {
  if (!data) return null;

  return (
    <div className="grid min-h-screen justify-items-start content-start gap-2 bg-page p-4 text-ink print:min-h-0 print:bg-white print:p-0">
      <article className="w-[52mm] bg-white px-2.5 py-2 font-sans text-[9px] leading-[1.15] text-black shadow-card print:w-[52mm] print:px-2 print:py-1.5 print:shadow-none">
        <header className="grid justify-items-center text-center">
          {data.logo && (
            <img
              src={data.logo}
              alt={data.companyName || "Company logo"}
              className="mb-1 h-9 w-9 object-contain"
            />
          )}
          {data.companyName && (
            <h1 className="text-[11px] font-bold tracking-wide">
              {data.companyName}
            </h1>
          )}
          {data.address && <p className="mt-0.5">{data.address}</p>}
          {data.phone && <p>{data.phone}</p>}
          {data.title && (
            <h2 className="mt-1 text-[10px] font-semibold">{data.title}</h2>
          )}
        </header>

        {data.details?.length > 0 && (
          <section className="mt-2 grid gap-0.5 border-t border-dashed border-black pt-1.5">
            {data.details.map((detail) => (
              <p key={detail.label} className="flex justify-between gap-2">
                <span>{detail.label}:</span>
                <span className="text-right">{detail.value ?? "—"}</span>
              </p>
            ))}
          </section>
        )}

        {data.items?.length > 0 && (
          <section className="mt-1.5 border-y border-dashed border-black py-1.5">
            {data.itemHeaders && (
              <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-2 font-semibold">
                <span>{data.itemHeaders.name || "Item"}</span>
                {data.itemHeaders.quantity && <span>{data.itemHeaders.quantity}</span>}
                {data.itemHeaders.amount && <span>{data.itemHeaders.amount}</span>}
              </div>
            )}
            {data.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="grid grid-cols-[1fr_auto_auto] gap-2"
              >
                <span className="break-words">{item.name}</span>
                {item.quantity != null && <span>{item.quantity}</span>}
                {item.amount != null && <span>{item.amount}</span>}
              </div>
            ))}
          </section>
        )}

        {data.totals?.length > 0 && (
          <section className="mt-1.5 grid gap-0.5">
            {data.totals.map((total) => (
              <p
                key={total.label}
                className={`flex justify-between gap-2 ${
                  total.emphasis
                    ? "mt-0.5 border-t border-dashed border-black pt-1 font-bold"
                    : ""
                }`}
              >
                <span>{total.label}:</span>
                <span>{total.value ?? "—"}</span>
              </p>
            ))}
          </section>
        )}

        {(data.footerTitle || data.footerMessage) && (
          <footer className="mt-2 border-y border-dashed border-black py-1.5 text-center">
            {data.footerTitle && (
              <p className="text-[11px] font-bold tracking-wider">
                {data.footerTitle}
              </p>
            )}
            {data.footerMessage && <p className="mt-1">{data.footerMessage}</p>}
          </footer>
        )}
      </article>

      <button
        type="button"
        onClick={() => window.print()}
        className="grid grid-flow-col items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-small font-semibold text-white shadow-primary print:hidden"
      >
        <PrinterIcon />
        Print
      </button>
    </div>
  );
}
