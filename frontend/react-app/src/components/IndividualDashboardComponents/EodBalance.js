import React, { useState } from "react";
import SingleLineChart from "../charts/LineChart";
import DataTable from "./TableData";
import { Checkbox } from "../ui/checkbox";
import eodData from "../../data/eod.json";
import { Card } from "../ui/card";

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
  const [selectAll, setSelectAll] = useState(true);

  const handleColumnSelect = (column) => {
    setSelectedColumns((prev) => {
      const newSelection = prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column];

      setSelectAll(newSelection.length === numericColumns.length);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedColumns(selectAll ? [] : numericColumns);
  };

  return (
    <div className="bg-white rounded-lg space-y-6 m-8 mt-2 dark:bg-slate-950">
      <Card>
        <div className="mb-4 flex flex-wrap gap-4 items-center p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none whitespace-nowrap"
            >
              Select All
            </label>
          </div>
          {numericColumns.map((column) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={selectedColumns.includes(column)}
                onCheckedChange={() => handleColumnSelect(column)}
              />
              <label
                htmlFor={column}
                className="text-sm font-medium leading-none whitespace-nowrap"
              >
                {column}
              </label>
            </div>
          ))}
        </div>
      </Card>
      <SingleLineChart
        title="EOD Balance"
        data={eodData}
        xAxisKey="Day"
        selectedColumns={selectedColumns}
      />
      <div className="mt-4">
        <DataTable data={eodData} />
      </div>
    </div>
  );
};

export default EodBalance;
