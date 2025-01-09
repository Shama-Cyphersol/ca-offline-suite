import React from "react";
import SingleLineChart from "../charts/LineChart";
import DataTable from "./TableData";
import refundData from "../../data/refund.json";

const Reversal = () => {
  // Process data to get daily balance
  const processData = () => {
    const dailyData = refundData.reduce((acc, transaction) => {
      const date = transaction["Value Date"];
      if (!acc[date]) {
        acc[date] = {
          valueDate: date,
          balance: transaction.Balance,
        };
      }
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(dailyData).sort(
      (a, b) => new Date(a.valueDate) - new Date(b.valueDate)
    );
  };

  const processedData = processData();

  return (
    <div className="bg-white rounded-lg space-y-6 m-8">
      <SingleLineChart
        title="Balance Trend"
        data={processedData}
        xAxisKey="valueDate"
        selectedColumns={["balance"]}
      />

      <div>
        <DataTable data={refundData} />
      </div>
    </div>
  );
};

export default Reversal;