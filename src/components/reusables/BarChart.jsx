import React, { useEffect, useMemo, useState } from "react";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";

const ReusableBarChart = ({ labels = [], values = [], labelName = "Data", loading }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // memo key to force remount when labels/values change (fixes stale canvas sizing)
  const mountKey = useMemo(() => `${labels.length}-${values.length}-${labelName}`, [labels, values, labelName]);

  useEffect(() => {
    // Only build data/options even if arrays empty — prevents flash and keeps options applied early.
    setChartData({
      labels,
      datasets: [
        {
          label: labelName,
          data: values,
          backgroundColor: "rgba(245,197,24,0.6)",
          borderColor: "#f5c518",
          borderWidth: 2,
          borderRadius: 6,
          barThickness: "flex",
        },
      ],
    });

    setChartOptions({
      responsive: true,
      // IMPORTANT: ensure this is false so chart fills parent height
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: getTextColor(),
            font: { size: 14 },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: getTextColor(), font: { size: 12 } },
          grid: { color: getGridColor() },
        },
        y: {
          beginAtZero: true,
          ticks: { color: getTextColor(), font: { size: 12 } },
          grid: { color: getGridColor() },
        },
      },
    });
  // keep getTextColor/getGridColor stable by not re-defining them in deps
  }, [labels, values, labelName]);

  // dynamic color helpers
  const getTextColor = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "#facc15" : "#111");
  const getGridColor = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "rgba(255,255,255,0.08)" : "#ddd");

  // Use same height for skeleton so layout doesn't shift
  if (loading) return <Skeleton width="100%" height="60vh" />;

  // Ensure parent container has an explicit height and chart canvas fills it
  return (
    // tailwind classes require Tailwind; otherwise use style={{ height:'60vh', minHeight:'400px' }}
    <div className="h-[60vh] min-h-[400px] w-full">
      <Chart
        key={mountKey}                // force fresh mount when data changes (helps with sizing)
        type="bar"
        data={chartData}
        options={chartOptions}
        style={{ height: "100%", width: "100%" }} // ensures the canvas fills parent div
      />
    </div>
  );
};

export default ReusableBarChart;
