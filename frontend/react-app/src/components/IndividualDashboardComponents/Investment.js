import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import investementData from "../../data/investment.json";

const Investment = () => {
  const transformedData = investementData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    description: item.Description,
    debit: item.Debit,
    month: item.Month,
    category: item.Category,
    balance: item.Balance,
  }));

  return (
    <div className="rounded-lg m-8 mt-2 space-y-6">
      {transformedData.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
          <p className="text-gray-800 text-center mt-3 font-medium text-lg">
            No Data Available
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-[60vh]">
            <BarLineChart
              data={transformedData}
              title="Investment"
              xAxisKey={"date"}
              yAxisKey={"debit"}
            />
          </div>

          <div>
            <DataTable data={transformedData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Investment;
