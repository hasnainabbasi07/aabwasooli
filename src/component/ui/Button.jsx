const variants = {
  solid:
    "bg-primary text-white shadow-sm shadow-primary/40 " +
    "hover:bg-primary/90 hover:shadow-md hover:shadow-primary/40 active:scale-[0.98]",
  outline: "border border-primary text-primary hover:bg-primary/10",
  soft: "bg-page text-ink hover:bg-line/60",
  danger: "border border-danger bg-danger/5 text-danger hover:bg-danger/10",
  success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  collection: "bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-sm hover:from-emerald-800 hover:to-teal-700",
};
export default function Button({ variant = "solid", icon, className = "", children, ...props }) {
  return (
    <button
      type="button"
     className={`inline-grid cursor-pointer grid-flow-col items-center justify-center gap-1 rounded-md px-3 py-1 text-small font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40 ${variants[variant]} ${className}`}{...props}
    >
      {icon}
      {children}
    </button>
  );
}
