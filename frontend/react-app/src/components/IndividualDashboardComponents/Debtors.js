
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import DataTable from "./TableData";

const Debtors = () => {
  const transactionData = [
    { Description: "Transaction 1", Debit: 7000 },
    { Description: "Transaction 2", Debit: 8000 },
    { Description: "Transaction 3", Debit: 7500 },
  ];

  // Pie chart data matching your ratios
  const pieData = [
    { name: "Unknown Debit", value: 3 }, // Count of transactions
    { name: "Total Debit", value: 22500 }, // Total debit amount
  ];

  // Using the exact colors from your code
  const COLORS = ["#94cb94", "#f16e65"];

  return (
    <div className="w-full space-y-8">
      {/* Bar Chart matching Plotly visualization */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Debit Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[700px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transactionData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  label={{
                    value: "Debit Amount (₹)",
                    position: "bottom",
                  }}
                />
                <YAxis type="category" dataKey="Description" width={100} />
                <Tooltip formatter={(value) => [`₹${value}`, "Debit"]} />
                <Bar
                  dataKey="Debit"
                  fill="#3b82f6"
                  background={{ fill: "#f5f5f5" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart matching your Plotly visualization */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Unknown Debit Transactions vs Total Debit Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius="80%"
                  paddingAngle={0}
                  dataKey="value"
                  label={({ name, value, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Value"]} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  layout="horizontal"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <DataTable data={transactionData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Debtors;
