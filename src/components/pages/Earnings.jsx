import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "primereact/skeleton";
import ReusableBarChart from "../reusables/BarChart";
import DateRangeSelector from "../reusables/DateRangeSelector";
import { calculateDateRange } from "../../utils/DateRangeUtil";
import InfoCard from "../reusables/InfoCard"; // ✅ your custom InfoCard

const Earnings = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [rangeOption, setRangeOption] = useState("30d");

  const fetchData = async (option) => {
    setLoading(true);
    try {
      const { from, to } = calculateDateRange(option);

      const totalEarningsResponse = await axios.get(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/fare/analytics`,
        {
          params: { fromDate: from, toDate: to },
          withCredentials: true,
        }
      );

      const dailyEarningsResponse = await axios.get(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/fare/analytics/daily`,
        {
          params: { fromDate: from, toDate: to },
          withCredentials: true,
        }
      );

      setSummary(totalEarningsResponse.data);
      setChartData(dailyEarningsResponse.data || []);
      // console.log(dailyEarningsResponse.data);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(rangeOption);
  }, [rangeOption]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-[#0A0F1C] transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">My Earnings</h1>
        <DateRangeSelector value={rangeOption} onChange={setRangeOption} />
      </div>

      {/* ░░ SUMMARY CARDS ░░ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? [...Array(4)].map((_, i) => (
              <Skeleton key={i} width="100%" height="100px" borderRadius="1rem" />
            ))
          : (
            <>
              <InfoCard
                label="Total Earnings"
                value={`₹${summary.totalEarnings?.toFixed(2) || 0}`}
                icon="pi pi-wallet"
                red
              />
              <InfoCard
                label="This Month"
                value={`₹${summary.thisMonthEarnings?.toFixed(2) || 0}`}
                icon="pi pi-calendar"
                red
              />
              <InfoCard
                label="Pending"
                value={`₹${summary.pendingEarnings?.toFixed(2) || 0}`}
                icon="pi pi-clock"
                green
              />
              <InfoCard
                label="Withdrawn"
                value={`₹${summary.withdrawnEarnings?.toFixed(2) || 0}`}
                icon="pi pi-check-circle"
                red
              />
            </>
          )}
      </div>

      {/* ░░ CHART SECTION ░░ */}
      <div className="p-6 rounded-2xl bg-gray-800/60 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Earnings Overview
        </h2>
        <ReusableBarChart
          labels={chartData.map((item) => item.date)}
          values={chartData.map((item) => item.totalFare || item.earnings)}
          labelName="Earnings (₹)"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Earnings;
