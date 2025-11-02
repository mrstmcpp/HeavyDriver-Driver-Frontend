import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import ReusableBarChart from "../reusables/BarChart";
import DateRangeSelector from "../reusables/DateRangeSelector";
import { calculateDateRange } from "../../utils/DateRangeUtil";


const Earnings = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [rangeOption, setRangeOption] = useState("30d");

  const fetchData = async (option) => {
    setLoading(true);
    try {
      const { from, to } = calculateDateRange(option);

      const res = await axios.get(
        `${import.meta.env.VITE_BOOKING_BACKEND_URL}/fare/analytics`,
        {
          params: { fromDate: from, toDate: to },
          withCredentials: true,
        }
      );

      setSummary(res.data);
      setChartData(res.data.dailyEarnings || []);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-yellow-400 font-bold">My Earnings</h1>
        <DateRangeSelector value={rangeOption} onChange={setRangeOption} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} width="100%" height="120px" />
          ))
        ) : (
          <>
            <Card className="!text-yellow-400" title="Total Earnings" subTitle={`₹${summary.totalEarnings?.toFixed(2) || 0}`} />
            <Card className="!text-yellow-400" title="This Month" subTitle={`₹${summary.thisMonthEarnings?.toFixed(2) || 0}`} />
            <Card className="!text-yellow-400" title="Pending" subTitle={`₹${summary.pendingEarnings?.toFixed(2) || 0}`} />
            <Card className="!text-yellow-400" title="Withdrawn" subTitle={`₹${summary.withdrawnEarnings?.toFixed(2) || 0}`} />
          </>
        )}
      </div>

      {/* Chart Section */}
      <Card className="mb-6">
        <h2 className="text-xl text-yellow-400 font-semibold mb-4">Earnings Overview</h2>
        <ReusableBarChart
          labels={chartData.map((item) => item.date)}
          values={chartData.map((item) => item.totalFare || item.earnings)}
          labelName="Earnings (₹)"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Earnings;
