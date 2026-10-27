const names = [
  "Hayatabad Phase 1", "University Town", "Saddar", "Gulbahar", "Ring Road", "Defence Colony",
  "Tehkal", "Board Bazar", "Dalazak Road", "Charsadda Road", "Warsak Road", "Nishtarabad",
];

export const areas = names.map((name, i) => ({
  id: i + 1,
  name,
  type: String((i % 3) + 1),
  userCount: ((i * 7) % 23) + 3,
  date: `${String(i + 1).padStart(2, "0")}/Mar/2026`,
}));

export const areaTypes = [
  { value: "1", label: "Commercial" },
  { value: "2", label: "Apartment" },
  { value: "3", label: "Society" },
];