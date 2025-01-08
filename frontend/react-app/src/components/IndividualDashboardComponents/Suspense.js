"use client";

import React from "react";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import PieCharts from "../charts/PieCharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"; // ShadCN Tabs components
import DataTable from "./TableData";
import SuspenseCreditData from "../../data/suspense_credit.json";
import SuspenseDebitData from "../../data/suspense_debit.json";

// const chartDataCredit = [
//   { month: "January", desktop: 60, mobile: 80 },
//   { month: "February", desktop: 100, mobile: 80 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 92, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const chartDataDebit = [
//   { month: "January", desktop: 60, mobile: 80 },
//   { month: "February", desktop: 100, mobile: 80 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 92, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

// const pieData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

// const transactionData = [
//   {
//     date: "2024-01-01",
//     description: "Purchase",
//     debit: 100,
//     credit: 0,
//     balance: 900,
//     category: "Shopping",
//     entity: "Store A",
//   },
//   {
//     date: "2024-01-01",
//     description:
//       "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
//     debit: 100,
//     credit: 0,
//     balance: 900,
//     category: "Shopping",
//     entity: "Store A",
//   },
//   {
//     date: "2024-01-05",
//     description: "Purchase",
//     debit: 100,
//     credit: 0,
//     balance: 900,
//     category: "Shopping",
//     entity: "Store A",
//   },
//   {
//     date: "2024-01-03",
//     description: "Purchase",
//     debit: 100,
//     credit: 0,
//     balance: 900,
//     category: "Shopping",
//     entity: "Store A",
//   },
//   {
//     date: "2024-01-04",
//     description: "Purchase",
//     debit: 100,
//     credit: 0,
//     balance: 900,
//     category: "Shopping",
//     entity: "Store A",
//   },

//   // ... more transaction data
// ];

const Suspense = () => {
  return (
    <div className="w-full rounded-xl shadow-sm m-8 bg-white dark:bg-slate-950">
      <Tabs defaultValue="credit">
        <TabsList className="grid w-[500px] grid-cols-2">
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="debit">Debit</TabsTrigger>
        </TabsList>

        <TabsContent value="credit">
          <div className="mb-6">
            <HorizontalBarChart
              data={SuspenseCreditData}
              title="Suspense Credit Chart"
              xAxisKey="Description"
              yAxisKey="Credit"
            />
          </div>
          <div>
            <PieCharts
              data={SuspenseCreditData}
              title="Suspense Credit Chart"
            />
          </div>
          <div className="mt-6">
            <DataTable data={SuspenseCreditData} />
          </div>
        </TabsContent>

        <TabsContent value="debit">
          <div className="mb-6">
            <HorizontalBarChart
              data={SuspenseDebitData}
              title="Suspense Debit Chart"
              xAxisKey="Description"
              yAxisKey="Debit"
            />
          </div>
          <div>
            <PieCharts data={SuspenseDebitData} title="Suspense Debit Chart" />
          </div>
          <div className="mt-6">
            <DataTable data={SuspenseDebitData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suspense;
