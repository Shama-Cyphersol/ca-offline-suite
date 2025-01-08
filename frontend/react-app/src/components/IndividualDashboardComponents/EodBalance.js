import React, { useState } from "react";
import SingleLineChart from "../charts/LineChart";
import DataTable from "./TableData";
import ToggleStrip from "./ToggleStrip"; // Adjust the import path
import eodData from "../../data/eod.json";

const EodBalance = () => {
  const columns = Object.keys(eodData[0] || {});
  const numericColumns = columns.filter(
    (column) =>
      column !== "Day" &&
      eodData.some((row) => {
        const value = String(row[column]);
        return !isNaN(parseFloat(value)) && !value.includes("-");
      })
  );

  const [selectedColumns, setSelectedColumns] = useState(numericColumns);

  return (
    <div className="bg-white rounded-lg space-y-6 m-8 mt-2 dark:bg-slate-950 ">
      <ToggleStrip
        columns={numericColumns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <div className="flex flex-col gap-1">
        <div className="h-[50vh] mb-10">
          <SingleLineChart
            title="EOD Balance"
            data={eodData}
            xAxisKey="Day"
            selectedColumns={selectedColumns}
            bottom={300}
            height={"h-[45vh]"}
          />
        </div>
        <div className="mt-10">
          <DataTable data={eodData} />
        </div>
      </div>
    </div>
  );
};

export default EodBalance;
