import React from 'react';
import BarChart from '../charts/BarChart';
import BarLineChart from '../charts/BarLineChart';
import {PieCharts} from '../charts/PieCharts';
import DataTable from './TableData';

const chartData = [
    { month: "January", balance: 1200, debit: 8000 },
    { month: "February", balance: 3050, debit: 2000 },
    { month: "March", balance: 2370, debit: 1200 },
    { month: "April", balance: 7300, debit: 1900 },
    { month: "May", balance: 2090, debit: 1300 },
    { month: "June", balance: 2140, debit: 1400 },
    { month: "July", balance: 1100, debit: 8000 },
    { month: "August", balance: 1750, debit: 2000 },
    { month: "September", balance: 2370, debit: 1200 },
    { month: "October", balance: 7300, debit: 1900 },
    { month: "November", balance: 2090, debit: 1300 },
    { month: "December", balance: 1000, debit: 1400 },
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
                    { key: 'debit', type: 'bar', color: 'hsl(var(--chart-5))' },
                    { key: 'balance', type: 'line', color: 'hsl(var(--chart-3))' },
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
