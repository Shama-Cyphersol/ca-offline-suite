import React, { useState } from "react";
import SingleLineChart from "../charts/LineChart";
import SingleBarChart from "../charts/BarChart";
import PieCharts from "../charts/PieCharts";
import DataTable from "./TableData";
import { Maximize2, Minimize2 } from "lucide-react";
import transactionData from "../../data/Transaction.json";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ToggleStrip from "./ToggleStrip";

const MaximizableChart = ({ children, title }) => {
  const [isMaximized, setIsMaximized] = useState(false);

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
        <CardHeader className="relative">
          <CardTitle className="dark:text-slate-300">{title}</CardTitle>
          <button
            onClick={toggleMaximize}
            className="absolute top-4 right-4 p-1 rounded-lg 
                     bg-slate-100 dark:bg-slate-800 
                     hover:bg-slate-200 dark:hover:bg-slate-700
                     transition-colors duration-200"
            aria-label="Maximize"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </CardHeader>
        <div className="p-4">{children}</div>
      </Card>
    </div>
  );
};

const Transactions = () => {
  // Function to format date as DD-MM-YYYY
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const monthsData = transactionData.reduce((acc, transaction) => {
    const [day, month, year] = transaction["Value Date"].split("-");
    const monthKey = `${day}-${month}-${year}`;
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(transaction);
    return acc;
  }, {});

  const processDailyData = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = formatDate(transaction["Value Date"]);
      if (!acc[date]) {
        acc[date] = {
          date,
          credit: transaction.Credit || 0,
          debit: transaction.Debit || 0,
          balance: transaction.Balance,
          category: transaction.Category,
        };
      }
      acc[date].credit += transaction.Credit || 0;
      acc[date].debit += transaction.Debit || 0;
      return acc;
    }, {});
  };

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

  const availableMonths = Object.keys(monthsData).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("-");
    const [dayB, monthB, yearB] = b.split("-");
    return (
      new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB)
    );
  });

  const [selectedMonths, setSelectedMonths] = useState(availableMonths);

  const filteredData = selectedMonths
    .flatMap((month) => {
      const dailyData = processDailyData(monthsData[month]);
      return Object.values(dailyData);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const categoryData = processCategoryData(
    selectedMonths.flatMap((month) => monthsData[month])
  );

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg space-y-6 m-8 mt-2">
      <ToggleStrip
        columns={availableMonths}
        selectedColumns={selectedMonths}
        setSelectedColumns={setSelectedMonths}
      />

      {selectedMonths.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 my-6">
          Select months to display the graphs
        </div>
      ) : (
        <>
          <div className="flex flex-wrap -mx-2">
            <MaximizableChart title="Daily Balance Trend">
              <div className="w-full h-full">
                <SingleLineChart
                  data={filteredData}
                  xAxisKey="date"
                  selectedColumns={["balance"]}
                  cardheight={"h-[37vh]"}
                />
              </div>
            </MaximizableChart>

            <MaximizableChart title="Credit vs Debit">
              <div className="w-full h-full">
                <SingleBarChart
                  data={filteredData}
                  xAxis={{ key: "date" }}
                  yAxis={[
                    {
                      key: "credit",
                      type: "bar",
                      color: "hsl(var(--chart-3))",
                    },
                    {
                      key: "debit",
                      type: "line",
                      color: "hsl(var(--chart-5))",
                    },
                  ]}
                />
              </div>
            </MaximizableChart>

            <MaximizableChart title="Debit Distribution by Category">
              <div className="w-full h-full">
                <PieCharts
                  data={categoryData}
                  nameKey="Category"
                  valueKey="Debit"
                />
              </div>
            </MaximizableChart>
          </div>

          <DataTable data={filteredData} />
        </>
      )}
    </div>
  );
};

export default Transactions;
