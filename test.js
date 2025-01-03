import React, { useState, useMemo } from "react";
import summaryData from "../../data/summary.json";
import PieCharts from "../charts/PieCharts";
import TableData from "./TableData";

const Summary = () => {
  const { income, importantExpenses, otherExpenses } = summaryData;
  const [selectedMonths, setSelectedMonths] = useState([]);

  // Extract unique months from the data
  const months = useMemo(() => {
    const allMonths = new Set();
    [income, importantExpenses, otherExpenses].forEach((category) => {
      category.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (
            key !== "total" &&
            key !== "income" &&
            key !== "importantExpenses" &&
            key !== "otherExpenses"
          ) {
            allMonths.add(key);
          }
        });
      });
    });
    return Array.from(allMonths).sort();
  }, [income, importantExpenses, otherExpenses]);

  // Handle month selection
  const handleMonthChange = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedMonths(
      selectedMonths.length === months.length ? [] : [...months]
    );
  };

  // Transform data for selected months
  const transformData = (data, valueKey, nameKey, excludeName) => {
    if (selectedMonths.length === 0) {
      return data
        .filter((item) => item[nameKey] !== excludeName)
        .map((item) => ({
          name: item[nameKey],
          value: parseFloat(item[valueKey] || 0),
        }))
        .filter((item) => item.value > 0);
    }

    return data
      .filter((item) => item[nameKey] !== excludeName)
      .map((item) => ({
        name: item[nameKey],
        value: selectedMonths.reduce(
          (sum, month) => sum + parseFloat(item[month] || 0),
          0
        ),
      }))
      .filter((item) => item.value > 0);
  };

  const incomeData = transformData(income, "total", "income", "Total Credit");
  const importantExpensesData = transformData(
    importantExpenses,
    "total",
    "importantExpenses",
    "Total"
  );
  const otherExpensesData = transformData(
    otherExpenses,
    "total",
    "otherExpenses",
    "Total Debit"
  );

  return (
    <div className="dashboard p-4">
      {/* Month Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedMonths.length === months.length}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <label htmlFor="selectAll" className="font-medium">
            Select All Months
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {months.map((month) => (
            <div key={month} className="flex items-center">
              <input
                type="checkbox"
                id={month}
                checked={selectedMonths.includes(month)}
                onChange={() => handleMonthChange(month)}
                className="mr-2"
              />
              <label htmlFor={month}>{month}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <PieCharts
            data={incomeData}
            title="Income Breakdown"
            valueKey="value"
            nameKey="name"
          />
          <TableData data={incomeData} />
        </div>

        <div>
          <PieCharts
            data={importantExpensesData}
            title="Important Expenses Breakdown"
            valueKey="value"
            nameKey="name"
          />
        </div>

        <div>
          <PieCharts
            data={otherExpensesData}
            title="Other Expenses Breakdown"
            valueKey="value"
            nameKey="name"
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
