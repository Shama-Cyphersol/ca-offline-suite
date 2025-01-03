import React from "react";
import BarLineChart from "../charts/BarLineChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"; // ShadCN Tabs components
import DataTable from "./TableData";
import cashDepositData from "../../data/cash_deposit.json";
import cashWithdrawalData from "../../data/cash_withdrawal.json";

// const withdrawalData = [
//   { month: "January", mobile: 120, desktop: 200 },
//   { month: "February", mobile: 150, desktop: 180 },
//   { month: "March", mobile: 170, desktop: 220 },
//   { month: "April", mobile: 200, desktop: 250 },
//   { month: "May", mobile: 230, desktop: 270 },
//   { month: "June", mobile: 260, desktop: 300 },
//   { month: "July", mobile: 300, desktop: 320 },
//   { month: "August", mobile: 280, desktop: 310 },
//   { month: "September", mobile: 270, desktop: 290 },
//   { month: "October", mobile: 260, desktop: 270 },
//   { month: "November", mobile: 240, desktop: 260 },
//   { month: "December", mobile: 220, desktop: 250 },
// ];

// const debitData = [
//   { month: "January", mobile: 120, desktop: 20 },
//   { month: "February", mobile: 10, desktop: 80 },
//   { month: "March", mobile: 170, desktop: 22 },
//   { month: "April", mobile: 200, desktop: 250 },
//   { month: "May", mobile: 230, desktop: 270 },
//   { month: "June", mobile: 22, desktop: 300 },
//   { month: "July", mobile: 300, desktop: 320 },
//   { month: "August", mobile: 80, desktop: 310 },
//   { month: "September", mobile: 270, desktop: 290 },
//   { month: "October", mobile: 20, desktop: 270 },
//   { month: "November", mobile: 220, desktop: 260 },
//   { month: "December", mobile: 22, desktop: 250 },
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

const Cash = () => {
  // First, add this import at the top of the file

  // Then modify the return statement to use cashDepositData
  return (
    <div className="w-full rounded-xl shadow-sm m-8 bg-white dark:bg-gray-800">
      <Tabs defaultValue="withdrawal">
        <TabsList className="grid w-[500px] grid-cols-2">
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
          <TabsTrigger value="debit">Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawal">
          <div className="mb-6">
            <BarLineChart data={cashWithdrawalData} title="Withdrawal" />
          </div>
          <div>
            <DataTable data={cashWithdrawalData} />
          </div>
        </TabsContent>

        <TabsContent value="debit">
          <div className="mb-6">
            <BarLineChart data={cashDepositData} title="Deposit" />
          </div>

          <div>
            <DataTable data={cashDepositData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Cash;
