import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import DebtorsData from "../../data/Debtors.json";

// const chartData = [
//   { month: "January", balance: 150, credit: 85 },
//   { month: "February", balance: 280, credit: 160 },
//   { month: "March", balance: 320, credit: 210 },
//   { month: "April", balance: 175, credit: 120 },
//   { month: "May", balance: 230, credit: 145 },
//   { month: "June", balance: 290, credit: 180 },
//   { month: "July", balance: 195, credit: 130 },
//   { month: "August", balance: 260, credit: 170 },
//   { month: "September", balance: 340, credit: 220 },
//   { month: "October", balance: 185, credit: 125 },
//   { month: "November", balance: 245, credit: 155 },
//   { month: "December", balance: 310, credit: 190 },
// ];

const Debtors = () => {
  return (
    <div className="bg-white rounded-lg m-8 space-y-6">
      <BarLineChart data={DebtorsData} title="Debtors" />
      <div>
        <DataTable data={DebtorsData} />
      </div>
    </div>
  );
};

export default Debtors;
