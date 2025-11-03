export const stats = ({ totalItems , todayEarnings, weekEarnings }) => [
  {
    title: "Earnings",
    value: "₹ " + todayEarnings,
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
    value: "₹ " + weekEarnings,
    subtitle: "Past 7 days total",
    icon: "pi pi-chart-line",
    color: "orange",
  },
];
