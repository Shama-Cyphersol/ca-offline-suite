import React, { useState, useMemo } from "react";
import SingleLineChart from "../charts/LineChart";
import DataTable from "./TableData";
import ToggleStrip from "./ToggleStrip";
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

  const transformedData = eodData.flatMap((row) => {
    return selectedColumns
      .map((month) => ({
        Month: month,
        Day: row.Day,
        Amount: row[month] === 0 ? "0.00" : row[month].toFixed(2),
      }))
      .filter((item) => parseFloat(item.Amount) > 0);
  });

  // Calculate max value from data
  const maxValue = Math.max(
    ...eodData.flatMap((row) =>
      Object.entries(row)
        .filter(([key]) => key !== "Day")
        .map(([, value]) => value)
    )
  );

  // Round up to nearest 100000
  const yAxisMax = Math.ceil(maxValue / 100000) * 100000;

  const chartConfig = {
    yAxis: {
      type: "number",
      domain: [0, yAxisMax / 100000],
      allowDataOverflow: false,
      tickCount: 8,
      scale: "linear",
    },
    xAxis: {
      type: "number",
      domain: [1, 31],
    },
  };

  return (
    <div className="bg-white rounded-lg space-y-6 m-8 mt-2 dark:bg-slate-950">
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
            config={chartConfig}
          />
        </div>
        <div className="mt-10">
          <DataTable data={transformedData} title="EOD Balance" />
        </div>
      </div>
    </div>
  );
};

export default EodBalance;
