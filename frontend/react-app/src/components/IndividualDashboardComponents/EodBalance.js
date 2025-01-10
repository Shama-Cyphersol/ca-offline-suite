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

  // Transform the data
  const transformedData = useMemo(() => {
    const allData = [];
    
    // Process each selected month
    selectedColumns.forEach(month => {
      // For each day in the data
      eodData.forEach(row => {
        allData.push({
          Month: month,
          Day: row.Day,
          Amount: parseFloat(row[month] || 0).toFixed(2)
        });
      });
    });

    return allData;
  }, [selectedColumns]);

  return (
    <div className="rounded-lg space-y-6 m-8 mt-2">

        {eodData.length === 0 ? (
                        <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                            <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                        </div>
        ) : (
            <>
            <ToggleStrip
                columns={numericColumns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
            />
        
            {selectedColumns.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 my-6">
                Select months to display the graph and data
                </div>
            ) : (
                <>
                    <div className="w-full h-[60vh]">
                    <SingleLineChart
                    title="EOD Balance"
                        data={eodData}
                        xAxisKey="Day"
                        selectedColumns={selectedColumns}
                    />
                    </div>
        
                <div className="mt-4">
                        <DataTable data={transformedData} />
                </div>
                </>
            )}
            </>
        )}
     
    </div>
    
  );
};

export default EodBalance;