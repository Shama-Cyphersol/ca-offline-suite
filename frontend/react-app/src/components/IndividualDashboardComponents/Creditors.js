import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import CreditorData from "../../data/Creditors.json";


const Creditors = () => {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg m-8 mt-2 space-y-6">
      <div className="w-full h-[60vh]">
      <BarLineChart data={CreditorData} title="Creditors" />
      </div>
      <div className="w-full">
        <DataTable data={CreditorData} />
      </div>
    </div>
  );
};

export default Creditors;
