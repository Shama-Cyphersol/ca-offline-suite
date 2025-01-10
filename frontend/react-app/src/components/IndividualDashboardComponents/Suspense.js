import React from "react";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import PieCharts from "../charts/PieCharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import DataTable from "./TableData";
import SuspenseCreditData from "../../data/suspense_credit.json";
import SuspenseDebitData from "../../data/suspense_debit.json";

const Suspense = () => {
  return (
    <div className="rounded-xl shadow-sm m-8 mt-2 bg-white space-y-6 dark:bg-slate-950">
    {/* Toggle Code */}
      <Tabs defaultValue="credit">
        <TabsList className="grid w-[500px] grid-cols-2 pb-10">
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="debit">Debit</TabsTrigger>
        </TabsList>
    {/* Credit Code */}
        <TabsContent value="credit">
          <div className="grid grid-rows-[60vh_auto] gap-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="w-full h-full">
                <HorizontalBarChart
                  data={SuspenseCreditData}
                  title="Suspense Credit Chart"
                  xAxisKey="Description"
                  yAxisKey="Credit"
                />
              </div>
              <div className="w-full h-full">
                <PieCharts
                  data={SuspenseCreditData}
                  title="Suspense Credit Chart"
                />
              </div>
            </div>
            <div>
              <DataTable data={SuspenseCreditData} />
            </div>
          </div>
        </TabsContent>
      {/* Debit code */}
        <TabsContent value="debit">
          <div className="grid grid-rows-[60vh_auto]">
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full h-full">
                <HorizontalBarChart
                  data={SuspenseDebitData}
                  title="Suspense Debit Chart"
                  xAxisKey="Description"
                  yAxisKey="Debit"
                />
              </div>
              <div className="w-full h-full">
                <PieCharts
                  data={SuspenseDebitData}
                  title="Suspense Debit Chart"
                />
              </div>
            </div>
            <div>
              <DataTable data={SuspenseDebitData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suspense;