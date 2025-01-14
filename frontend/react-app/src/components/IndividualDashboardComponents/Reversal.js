import React from "react";
import DataTable from "./TableData";
import refundData from "../../data/refund.json";
import SingleBarChart from "../charts/BarChart";

const Reversal = () => {
  // Transform data to exclude balance
  const transformedData = refundData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    credit: item.Credit,
    description: item.Description,
    category: item.Category,
  }));

  return (
    <div className="rounded-lg m-8 mt-2 space-y-6">
      {refundData.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
          <p className="text-gray-800 text-center mt-3 font-medium text-lg">
            No Data Available
          </p>
        </div>
      ) : (
        <>
          <div className="w-full h-[60vh]">
            <SingleBarChart
              title="Reversal/Refund"
              data={transformedData}
              xAxisKey="date"
              selectedColumns={["credit"]}
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

export default Reversal;
