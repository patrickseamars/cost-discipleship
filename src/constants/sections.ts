// Section configuration constants
export const SECTIONS = [
  { key: "relationship", name: "Relationship", totalDays: 6 },
  { key: "rhythm", name: "Rhythm", totalDays: 6 },
  { key: "reconciliation", name: "Reconciliation", totalDays: 6 },
  { key: "radiance", name: "Radiance", totalDays: 6 },
  { key: "response", name: "Response", totalDays: 6 },
  { key: "resistance", name: "Resistance", totalDays: 6 },
  { key: "resources", name: "Resources", totalDays: 6 },
  { key: "refuel", name: "Refuel", totalDays: 6 },
  { key: "replication", name: "Replication", totalDays: 6 },
] as const;

export const TOTAL_DAYS_PER_SECTION = 6;
export const TOTAL_SECTIONS = SECTIONS.length;
export const TOTAL_DAYS = TOTAL_SECTIONS * TOTAL_DAYS_PER_SECTION;