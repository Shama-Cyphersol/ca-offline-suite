import React, { useState, useMemo, useEffect } from "react";
import summaryData from "../../data/summary.json";
import PieCharts from "../charts/PieCharts";
import TableData from "./TableData";
import { Checkbox } from "../ui/checkbox";
import { Card, CardHeader, CardTitle } from "../ui/card";
import BarChart from "../charts/BarChart";
import { Table } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import ToggleStrip from "./ToggleStrip";

const MaximizableChart = ({ children, title, isMaximized, setIsMaximized }) => {
  // const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  if (isMaximized) {
    return (
      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-[100vw] w-[70vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full overflow-hidden">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-2">
      <Card className="h-full">
        <CardHeader className="relative pb-0 pt-2">
          <CardTitle className="dark:text-slate-300">{title}</CardTitle>
          <button
            onClick={toggleMaximize}
            className="absolute top-1 right-3 p-1 rounded-lg bg-slate-100 dark:bg-slate-800"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};

const Summary = () => {
  const { income, importantExpenses, otherExpenses } = summaryData;
  const [activeTable, setActiveTable] = useState("income"); // Default to showing income table
  const [isMaximized, setIsMaximized] = useState(false);

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
  const [selectedMonths, setSelectedMonths] = useState([]);

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

  // Helper function to map data keys
  const mapDataKeys = (data) =>
    data.map((item) => ({
      "Income Category": item.name,
      Amounts: item.value,
    }));

  const incomeDataTransformed = mapDataKeys(incomeData);
  const importantExpensesDataTransformed = mapDataKeys(importantExpensesData);
  const otherExpensesDataTransformed = mapDataKeys(otherExpensesData);

  const renderActiveTable = () => {
    switch (activeTable) {
      case "income":
        return <TableData data={incomeDataTransformed} title="Income" />;
      case "importantExpenses":
        return (
          <TableData
            data={importantExpensesDataTransformed}
            title="Important Expenses"
          />
        );
      case "otherExpenses":
        return (
          <TableData
            data={otherExpensesDataTransformed}
            title="Other Expenses"
          />
        );
      default:
        return <TableData data={incomeDataTransformed} />;
    }
  };

  return (
    <div className="space-y-6 m-8 mt-2">
      {/* Use ToggleStrip for month selection */}
      <ToggleStrip
        columns={months}
        selectedColumns={selectedMonths}
        setSelectedColumns={setSelectedMonths}
      />
      {selectedMonths.length === 0 ? (
        <div className="text-center text-gray-600 my-6">
          Select checkbox to display the graph
        </div>
      ) : (
        <>
          <div className="flex flex-wrap -mx-2">
            <MaximizableChart
              title="Income"
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
            >
              <div className="w-full h-full p-5">
                <PieCharts
                  data={incomeData}
                  title=""
                  valueKey="value"
                  nameKey="name"
                />
                {!isMaximized && (
                  <Button
                    onClick={() => setActiveTable("income")}
                    variant={activeTable === "income" ? "default" : "outline"}
                    className="mt-4 w-full"
                  >
                    View Table
                  </Button>
                )}
              </div>
            </MaximizableChart>

            <MaximizableChart
              title="Important Expenses"
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
            >
              <div className="w-full h-full p-5">
                <PieCharts
                  data={importantExpensesData}
                  title=""
                  valueKey="value"
                  nameKey="name"
                />
                {!isMaximized && (
                  <Button
                    onClick={() => setActiveTable("importantExpenses")}
                    variant={
                      activeTable === "importantExpenses"
                        ? "default"
                        : "outline"
                    }
                    className="mt-4 w-full"
                  >
                    View Table
                  </Button>
                )}
              </div>
            </MaximizableChart>

            <MaximizableChart
              title="Other Expenses Breakdown"
              isMaximized={isMaximized}
              setIsMaximized={setIsMaximized}
            >
              <div className="w-full h-full p-5">
                <PieCharts
                  data={otherExpensesData}
                  title=""
                  valueKey="value"
                  nameKey="name"
                />
                {!isMaximized && (
                  <Button
                    onClick={() => setActiveTable("otherExpenses")}
                    variant={
                      activeTable === "otherExpenses" ? "default" : "outline"
                    }
                    className="mt-4 w-full"
                  >
                    View Table
                  </Button>
                )}
              </div>
            </MaximizableChart>
          </div>
          {renderActiveTable()}
        </>
      )}
    </div>
  );
};

export default Summary;
