import React, { useState } from "react";
import SingleLineChart from "../charts/LineChart";
import SingleBarChart from "../charts/BarChart";
import PieCharts from "../charts/PieCharts";
import DataTable from "./TableData";
import { Checkbox } from "../ui/checkbox";
import transactionData from "../../data/Transaction.json";
import { Card } from "../ui/card";

const Transactions = () => {
  // Group data by months for initial selection
  const monthsData = transactionData.reduce((acc, transaction) => {
    const date = new Date(transaction["Value Date"]);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(transaction);
    return acc;
  }, {});

  // Process daily data
  const processDailyData = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = transaction["Value Date"];
      if (!acc[date]) {
        acc[date] = {
          date,
          credit: transaction.Credit || 0,
          debit: transaction.Debit || 0,
          balance: transaction.Balance,
          category: transaction.Category,
        };
      }
      acc[date].credit += transaction.credit || 0;
      acc[date].debit += transaction.debit || 0;
      return acc;
    }, {});
  };

  // Process category-wise debit data
  const processCategoryData = (transactions) => {
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.Category;
      if (!acc[category]) {
        acc[category] = {
          Category: category,
          Debit: 0,
        };
      }
      acc[category].Debit += transaction.Debit || 0;
      return acc;
    }, {});

    return Object.values(categoryTotals);
  };

  const availableMonths = Object.keys(monthsData).sort();
  const [selectedMonths, setSelectedMonths] = useState(availableMonths);
  const [selectAllMonths, setSelectAllMonths] = useState(true);

  const filteredData = selectedMonths
    .flatMap((month) => {
      const dailyData = processDailyData(monthsData[month]);
      return Object.values(dailyData);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const categoryData = processCategoryData(
    selectedMonths.flatMap((month) => monthsData[month])
  );

  const handleMonthSelect = (month) => {
    setSelectedMonths((prev) => {
      const newSelection = prev.includes(month)
        ? prev.filter((m) => m !== month)
        : [...prev, month];
      setSelectAllMonths(newSelection.length === availableMonths.length);
      return newSelection;
    });
  };

  const handleSelectAllMonths = () => {
    setSelectAllMonths(!selectAllMonths);
    setSelectedMonths(selectAllMonths ? [] : availableMonths);
  };

  return (
    <div className="bg-white rounded-lg space-y-6 m-8">
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">Select Months</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="select-all-months"
                checked={selectAllMonths}
                onCheckedChange={handleSelectAllMonths}
              />
              <label
                htmlFor="select-all-months"
                className="text-sm font-medium"
              >
                Select All
              </label>
            </div>
            {availableMonths.map((month) => (
              <div key={month} className="flex items-center space-x-2">
                <Checkbox
                  id={month}
                  checked={selectedMonths.includes(month)}
                  onCheckedChange={() => handleMonthSelect(month)}
                />
                <label htmlFor={month} className="text-sm font-medium">
                  {new Date(month).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <SingleLineChart
        title="Daily Balance Trend"
        data={filteredData}
        xAxisKey="date"
        selectedColumns={["balance"]}
      />

      <SingleBarChart
        data={filteredData}
        xAxis={{ key: "date" }}
        yAxis={[
          { key: "credit", type: "bar", color: "hsl(var(--chart-3))" },
          { key: "debit", type: "line", color: "hsl(var(--chart-5))" },
        ]}
      />

      <PieCharts
        data={categoryData}
        title="Debit Distribution by Category"
        nameKey="Category"
        valueKey="Debit"
      />

      <DataTable data={filteredData} />
    </div>
  );
};

export default Transactions;
