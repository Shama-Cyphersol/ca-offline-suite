import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";

const chartData = [
  { month: "January", balance: 150, debit: 100 },
  { month: "February", balance: 280, debit: 180 },
  { month: "March", balance: 320, debit: 220 },
  { month: "April", balance: 180, debit: 150 },
  { month: "May", balance: 250, debit: 160 },
  { month: "June", balance: 290, debit: 200 },
  { month: "July", balance: 180, debit: 120 },
  { month: "August", balance: 220, debit: 170 },
  { month: "September", balance: 350, debit: 240 },
  { month: "October", balance: 270, debit: 190 },
  { month: "November", balance: 310, debit: 230 },
  { month: "December", balance: 400, debit: 260 },
  
];

const Investment = () => {
  return (
    <div className="rounded-lg m-8 mt-2 space-y-6">
                {chartData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                
                <>
                <div className="w-full h-[60vh]">
                  <BarLineChart
                  data={chartData}
                  title="Investment"
                  xAxis={{ key: "month" }}
                  yAxis={[
                    { key: "debit", type: "bar", color: "hsl(var(--chart-5))" },
                    { key: "balance", type: "line", color: "hsl(var(--chart-3))" },
                  ]}
                    />
                </div>
                
                <div>
                    <DataTable data={chartData} />
                </div>
                </>
                )}
      
    </div>
  );
};

export default Investment;
