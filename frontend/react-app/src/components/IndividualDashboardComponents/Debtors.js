import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import DebtorsData from "../../data/Debtors.json";

const Debtors = () => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg m-8 mt-2 flex flex-col gap-6">
      <div className="w-full h-[60vh]">
        <BarLineChart data={DebtorsData} title="Debtors" />
      </div>
      <div className="w-full">
        <DataTable data={DebtorsData} />
      </div>
    </div>
  );
};

export default Debtors;