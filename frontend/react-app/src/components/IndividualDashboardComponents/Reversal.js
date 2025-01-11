import React from "react";
import DataTable from "./TableData";
import refundData from "../../data/refund.json";
import SingleBarChart from "../charts/BarChart";

const Reversal = () => {
  // Process data to get daily balance
  const processData = () => {
    const dailyData = refundData.reduce((acc, transaction) => {
      const date = transaction["Value Date"];
      if (!acc[date]) {
        acc[date] = {
          valueDate: date,
          credit: transaction.Credit,
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
    <div className="rounded-lg m-8 mt-2 space-y-6">
        {refundData.length === 0 ? (
                        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                            <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                        </div>
        ) : (
            <>
                <div className="w-full h-[60vh]">
                <SingleBarChart
                    title="Reversal/Refund"
                    data={processedData}
                    xAxisKey="valueDate"
                    selectedColumns={["credit"]}
                />
                </div>
                <div>
                    <DataTable data={refundData} />
                </div>
            </>
        )}

    </div>
  );
};

export default Reversal;