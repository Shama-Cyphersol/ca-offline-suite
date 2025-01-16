import React from "react";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import SuspensePieChart from "../charts/SuspensePieChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import DataTable from "./TableData";
import SuspenseCreditData from "../../data/suspense_credit.json";
import SuspenseDebitData from "../../data/suspense_debit.json";
import PieCharts from "../charts/PieCharts";

const Suspense = () => {
  // Transform credit data
  const transformedCreditData = SuspenseCreditData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    Description: item.Description,
    Credit: Number(item.Credit || 0),
  }));

  // Transform debit data
  const transformedDebitData = SuspenseDebitData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    Description: item.Description,
    Debit: Number(item.Debit || 0),
  }));

  // Chart configuration
  const chartConfig = {
    yAxis: {
      type: "String",
      ticks: ["Credit", "Debit"],
    },
    xAxis: {
      type: "Number",
      ticks: [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000],
    },
  };

  return (
    <div className="rounded-xl shadow-sm m-8 mt-2 bg-white space-y-6 dark:bg-slate-950 ">
      <Tabs defaultValue="credit">
        <TabsList className="grid w-[500px] grid-cols-2 pb-10">
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="debit">Debit</TabsTrigger>
        </TabsList>

        <TabsContent value="credit">
          <div className="grid grid-rows-[60vh_auto] gap-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full h-full">
                <HorizontalBarChart
                  data={transformedCreditData}
                  title="Suspense Credit Chart"
                  xAxisKey="Description"
                  yAxisKey="Credit"
                  config={chartConfig}
                />
              </div>
              <div className="w-full h-full">
                <SuspensePieChart
                  data={transformedCreditData}
                  title="Suspense Credit Chart"
                />
              </div>
            </div>
            <div>
              <DataTable data={transformedCreditData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="debit">
          <div className="grid grid-rows-[60vh_auto] gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full h-full">
                <HorizontalBarChart
                  data={transformedDebitData}
                  title="Suspense Debit Chart"
                  xAxisKey="Description"
                  yAxisKey="Debit"
                  config={chartConfig}
                />
              </div>
              <div className="w-full h-full">
                <SuspensePieChart
                  data={transformedDebitData}
                  title="Suspense Debit Chart"
                />
              </div>
            </div>
            <div>
              <DataTable data={transformedDebitData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suspense;
