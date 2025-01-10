import React from "react";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import DebtorData from "../../data/Debtors.json";

const Debtors = () => {
  return (
    <div className="rounded-lg m-8 mt-2 space-y-6">
      {DebtorData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                    <>
                    <div className="w-full h-[60vh]">
                        <BarLineChart data={DebtorData} title="Debtors" />
                    </div>
                    <div className="w-full">
                        <DataTable data={DebtorData} />
                    </div>
                  </>
                )}
    </div>
  );
};

export default Debtors;