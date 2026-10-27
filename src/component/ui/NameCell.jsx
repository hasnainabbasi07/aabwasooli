const initials = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default function NameCell({ name }) {
  return (
    <span className="grid grid-flow-col items-center justify-start gap-2">
      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-tiny font-semibold text-link">
        {initials(name)}
      </span>
      {name}
    </span>
  );
}