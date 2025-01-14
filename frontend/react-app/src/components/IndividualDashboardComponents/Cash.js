import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import BarLineChart from "../charts/BarLineChart";
import DataTable from "./TableData";
import cashWithdrawalData from "../../data/cash_withdrawal.json";
import cashDepositData from "../../data/cash_deposit.json";

const Cash = () => {
  // Transform the withdrawal data to match the desired format
  const transformedWithdrawalData = cashWithdrawalData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    Debit: item.Debit || 0,
    Balance: item.Balance || 0,
  }));

  // Transform the deposit data similarly
  const transformedDepositData = cashDepositData.map((item) => ({
    date: new Date(item["Value Date"]).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    Credit: item.Credit || 0,
    Balance: item.Balance || 0,
  }));

  const chartConfig = {
    yAxis: {
      min: 0,
      max: 40000,
      ticks: [0, 9000, 18000, 27000, 36000],
    },
  };

  const columnTypes = {
    Debit: "bar",
    Credit: "bar",
    Balance: "line",
  };

  return (
    <div className="rounded-xl shadow-sm m-8 mt-2  space-y-6 ">
      <Tabs defaultValue="withdrawal">
        <TabsList className="grid w-[500px] grid-cols-2 pb-10">
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawal">
          <div className="mb-6 w-full h-[60vh]">
            <BarLineChart
              data={transformedWithdrawalData}
              xAxisKey="date"
              columnTypes={columnTypes}
              config={chartConfig}
            />
          </div>
          <div>
            <DataTable data={transformedWithdrawalData} />
          </div>
        </TabsContent>

        <TabsContent value="deposit">
          <div className="mb-6 w-full h-[60vh]">
            <BarLineChart
              data={transformedDepositData}
              xAxisKey="date"
              columnTypes={columnTypes}
              config={chartConfig}
            />
          </div>
          <div>
            <DataTable data={transformedDepositData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cash;
