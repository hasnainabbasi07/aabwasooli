const base = [
  ["19 Litre Bottle", 19, 120, 150, 100],
  ["6 Litre Bottle", 6, 60, 80, 50],
  ["1.5 Litre Bottle", 1.5, 40, 50, 30],
  ["0.5 Litre Bottle", 0.5, 25, 30, 18],
];

export const packages = Array.from({ length: 12 }, (_, i) => {
  const [name, count, counterPrice, deliveryPrice, actualPrice] = base[i % base.length];
  return {
    id: i + 1,
    name: i < base.length ? name : `${name} (Pack ${Math.floor(i / base.length) + 1})`,
    type: "Litre",
    count,
    counterPrice,
    deliveryPrice,
    actualPrice,
  };
});

export const packageTypes = [
  { value: "0", label: "Select Type" },
  { value: "1", label: "Litre" },
];

export const adjustTypes = [
  { value: "1", label: "Increment" },
  { value: "2", label: "Decrement" },
];