import React, { useState, useMemo, useEffect } from "react";
import summaryData from "../../data/summary.json";
import PieCharts from "../charts/PieCharts";
import TableData from "./TableData";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BarChart from "../charts/BarChart";
import { Table } from "lucide-react";

const Summary = () => {
  const { income, importantExpenses, otherExpenses } = summaryData;
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const particulars = summaryData.particulars;

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

    const extractedMonths = Array.from(allMonths);
    return extractedMonths.sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );
  }, [income, importantExpenses, otherExpenses]);

  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    if (months.length > 0) {
      setSelectedMonths(months);
    }
  }, [months]);

  const handleMonthChange = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const handleSelectAll = () => {
    setSelectedMonths(
      selectedMonths.length === months.length ? [] : [...months]
    );
  };

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

  const filteredData = useMemo(() => {
    const credit = particulars.find(
      (item) => item.particulars === "Total Amount of Credit Transactions"
    );
    const debit = particulars.find(
      (item) => item.particulars === "Total Amount of Debit Transactions"
    );

    if (!credit || !debit) return [];

    return months.map((month) => ({
      month,
      credit: parseFloat(credit[month] || 0),
      debit: parseFloat(debit[month] || 0),
    }));
  }, [months, particulars]);

  // Helper function to map data keys
  const mapDataKeys = (data) =>
    data.map((item) => ({
      "Income Category": item.name,
      Amounts: item.value,
    }));

  const incomeDataTransformed = mapDataKeys(incomeData);
  const importantExpensesDataTransformed = mapDataKeys(importantExpensesData);
  const otherExpensesDataTransformed = mapDataKeys(otherExpensesData);

  const MonthSelection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="dark:text-slate-300">Select Months</CardTitle>
      </CardHeader>
      <div className="mb-4 flex flex-wrap gap-4 items-center p-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="selectAll"
            checked={selectedMonths.length === months.length}
            onCheckedChange={handleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none whitespace-nowrap"
          >
            Select All
          </label>
        </div>
        {months.map((month) => (
          <div key={month} className="flex items-center space-x-2">
            <Checkbox
              id={month}
              checked={selectedMonths.includes(month)}
              onCheckedChange={() => handleMonthChange(month)}
            />
            <label
              htmlFor={month}
              className="text-sm font-medium leading-none whitespace-nowrap"
            >
              {month}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 m-8">
      <MonthSelection />
      <BarChart data={filteredData} />
      {selectedMonths.length === 0 ? (
        <div className="text-center text-gray-600 my-6">
          Select checkbox to display the graph
        </div>
      ) : (
        <>
          <TableData data={filteredData} />
          <PieCharts
            data={incomeData}
            title="Income Breakdown"
            valueKey="value"
            nameKey="name"
          />
          <TableData data={incomeDataTransformed} />
          <PieCharts
            data={importantExpensesData}
            title="Important Expenses Breakdown"
            valueKey="value"
            nameKey="name"
          />
          <TableData data={importantExpensesDataTransformed} />
          <PieCharts
            data={otherExpensesData}
            title="Other Expenses Breakdown"
            valueKey="value"
            nameKey="name"
          />
          <TableData data={otherExpensesDataTransformed} />
        </>
      )}
    </div>
  );
};

export default Summary;
