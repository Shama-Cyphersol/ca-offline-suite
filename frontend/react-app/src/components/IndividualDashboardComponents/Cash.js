import React from "react";
import BarLineChart from "../charts/BarLineChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"; // ShadCN Tabs components
import DataTable from "./TableData";
import cashDepositData from "../../data/cash_deposit.json";
import cashWithdrawalData from "../../data/cash_withdrawal.json";


const Cash = () => {

  return (
    <div className="rounded-xl shadow-sm m-8 mt-2  space-y-6 ">
      <Tabs defaultValue="withdrawal">
        <TabsList className="grid w-[500px] grid-cols-2 pb-10">
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          <TabsTrigger value="debit">Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawal">
          
          {cashWithdrawalData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                    <>
                    <div className="mb-6 w-full h-[60vh]">
                    <BarLineChart data={cashWithdrawalData} title="Withdrawal"/>
                  </div>

                  <div>
                    <DataTable data={cashWithdrawalData} />
                </div>

                  </>
                )}
          
        </TabsContent>


        <TabsContent value="debit">
        {cashDepositData.length === 0 ? (
                                <div className="bg-gray-100 p-4 rounded-md w-full h-[10vh]">
                                    <p className="text-gray-800 text-center mt-3 font-medium text-lg">No Data Available</p>
                                </div>
                ) : (
                    <>
                    <div className="mb-6 w-full h-[60vh]">
                    <BarLineChart data={cashDepositData} title="Deposit"/>
                  </div>

                  <div>
                    <DataTable data={cashDepositData} />
                </div>
                  </>
                )}
          
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cash;
