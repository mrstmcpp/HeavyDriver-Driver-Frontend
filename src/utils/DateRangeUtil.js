
/**
 * Given a range option like "7d", "30d", "month", or "year",
 * returns { from: YYYY-MM-DD, to: YYYY-MM-DD }.
 */
export const calculateDateRange = (option = "30d") => {
  const toDate = new Date();
  const fromDate = new Date();

  switch (option) {
    case "7d":
      fromDate.setDate(toDate.getDate() - 7);
      break;
    case "30d":
      fromDate.setDate(toDate.getDate() - 30);
      break;
    case "month":
      fromDate.setDate(1);
      break;
    case "year":
      fromDate.setMonth(0, 1);
      break;
    default:
      fromDate.setDate(toDate.getDate() - 30);
  }

  return {
    from: fromDate.toISOString().split("T")[0],
    to: toDate.toISOString().split("T")[0],
  };
};

/**
 * Predefined options for dropdowns.
 */
export const rangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];
