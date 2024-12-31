import React from 'react';
import BarChart from '../charts/BarChart';
import BarLineChart from '../charts/BarLineChart';
import {PieCharts} from '../charts/PieCharts';
import DataTable from './TableData';

const chartData = [
    { month: "January", balance: 120, debit: 80 },
    { month: "February", balance: 305, debit: 200 },
    { month: "March", balance: 237, debit: 120 },
    { month: "April", balance: 73, debit: 190 },
    { month: "May", balance: 209, debit: 130 },
    { month: "June", balance: 214, debit: 140 },
    { month: "July", balance: 110, debit: 80 },
    { month: "August", balance: 175, debit: 200 },
    { month: "September", balance: 237, debit: 120 },
    { month: "October", balance: 73, debit: 190 },
    { month: "November", balance: 209, debit: 130 },
    { month: "December", balance: 100, debit: 140 },
];

const transactionData = [
    {
      date: "2024-01-01",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-01",
      description:
        "hello what ois u doing the i want to tell something to u can i talk to na pata tenu dj fadu song suna raha hu kya kar raha hai tu bata na mujhe",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-05",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-03",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
    {
      date: "2024-01-04",
      description: "Purchase",
      debit: 100,
      credit: 0,
      balance: 900,
      category: "Shopping",
      entity: "Store A",
    },
  
    // ... more transaction data
  ];
  


const Transactions = () => {
    return (
        <div className="bg-white rounded-lg p-4">
            <BarLineChart
                data={chartData}
                title="Transactions"
                xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'debit', type: 'bar', color: 'hsl(var(--chart-3))' },
                    { key: 'balance', type: 'line', color: 'hsl(var(--chart-5))' },
                ]}
            />
            <BarChart
                data={chartData}
                title="Transactions"
                xAxis={{ key: 'month'}}
                yAxis={[
                    { key: 'balance', type: 'bar', color: 'hsl(var(--chart-3))' },
                    { key: 'debit', type: 'line', color: 'hsl(var(--chart-5))' },
                ]}
            />

            <PieCharts />
            <div>
            <DataTable data={transactionData} />
          </div>
        </div>
    );
};

export default Transactions;
