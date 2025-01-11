import React from "react";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import SuspensePieChart from "../charts/SuspensePieChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import DataTable from "./TableData";
import SuspenseCreditData from "../../data/suspense_credit.json";
import SuspenseDebitData from "../../data/suspense_debit.json";

const Suspense = () => {
  return (
    <div className="rounded-xl shadow-sm m-8 mt-2  space-y-6 ">
    {/* Toggle Code */}
      <Tabs defaultValue="credit">
        <TabsList className="grid w-[500px] grid-cols-2 pb-10">
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="debit">Debit</TabsTrigger>
        </TabsList>
    {/* Credit Code */}
        <TabsContent value="credit">

        {/* change vh to change the height of grids */}
        {SuspenseCreditData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                    <>
                    <div className="grid grid-rows-[60vh_auto] gap-2">
                        <div className="grid grid-cols-2 gap-4">
                            <HorizontalBarChart
                            data={SuspenseCreditData}
                            title="Suspense Credit Chart"
                            xAxisKey="Description"
                            yAxisKey="Credit"
                            />
                            <SuspensePieChart
                            data={SuspenseCreditData}
                            title="Suspense Credit Chart"
                            />
                        </div>
                        <div className="mt-4">
                        <DataTable data={SuspenseCreditData} />
                        </div>
                    </div>
                    </>
                )}
       
        </TabsContent>
      {/* Debit code */}
        <TabsContent value="debit">
        {SuspenseDebitData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                    <>
                    <div className="grid grid-rows-[60vh_auto]">
                        <div className="grid grid-cols-2 gap-4">
                            <HorizontalBarChart
                            data={SuspenseDebitData}
                            title="Suspense Debit Chart"
                            xAxisKey="Description"
                            yAxisKey="Debit"
                            />
                            <SuspensePieChart
                            data={SuspenseDebitData}
                            title="Suspense Debit Chart"
                            />
                        </div>
                        <div className="mt-6">
                        <DataTable data={SuspenseDebitData} />
                        </div>
                    </div>
                    </>
                )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suspense;