// Small helpers shared across pages.
export const digits = (v) => v.replace(/\D/g, "");

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/ /g, "/");

export const formatAmount = (n) => Number(n).toLocaleString("en-US");
