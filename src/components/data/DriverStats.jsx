export const stats = ({ totalItems }) => [
  {
    title: "Earnings",
    value: "₹ 2,340",
    subtitle: "Today",
    icon: "pi pi-wallet",
    color: "yellow",
  },
  {
    title: "Completed Rides",
    value: totalItems,
    subtitle: "Today",
    icon: "pi pi-check-circle",
    color: "green",
  },
  {
    title: "Rating",
    value: "4.8 ★",
    subtitle: "Based on 18 rides",
    icon: "pi pi-star-fill",
    color: "purple",
  },
  {
    title: "Weekly Earnings",
    value: "₹ 12,870",
    subtitle: "Past 7 days total",
    icon: "pi pi-chart-line",
    color: "orange",
  },
];
