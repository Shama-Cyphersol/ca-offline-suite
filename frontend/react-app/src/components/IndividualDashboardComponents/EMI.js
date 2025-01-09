import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import EmiData from "../../data/emi.json";


const EMI = () => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg m-8 mt-2 space-y-6">
      <div className="w-full h-[60vh]">
      <BarLineChart data={EmiData} title="Probable EMI" />
      </div>
      <div>
        <DataTable data={EmiData} />
      </div>
    </div>
  );
};

export default EMI;
