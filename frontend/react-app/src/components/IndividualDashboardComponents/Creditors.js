import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import CreditorData from "../../data/Creditors.json";

// const chartData = [
//   { month: "January", balance: 120, debit: 80 },
//   { month: "February", balance: 305, debit: 200 },
//   { month: "March", balance: 237, debit: 120 },
//   { month: "April", balance: 73, debit: 190 },
//   { month: "May", balance: 209, debit: 130 },
//   { month: "June", balance: 214, debit: 140 },
//   { month: "July", balance: 110, debit: 80 },
//   { month: "August", balance: 175, debit: 200 },
//   { month: "September", balance: 237, debit: 120 },
//   { month: "October", balance: 73, debit: 190 },
//   { month: "November", balance: 209, debit: 130 },
//   { month: "December", balance: 100, debit: 140 },
// ];

const Creditors = () => {
  return (
    <div className="bg-white rounded-lg m-8 space-y-6">
      <BarLineChart data={CreditorData} title="Creditors" />
      <div>
        <DataTable data={CreditorData} />
      </div>
    </div>
  );
};

export default Creditors;
