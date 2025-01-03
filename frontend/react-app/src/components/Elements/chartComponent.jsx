"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function ReportChart({ chartData }) {
  const [viewType, setViewType] = useState("daily");

  const data = viewType === "daily" ? chartData.daily : chartData.monthly;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Report Trends</CardTitle>
        <div className="space-x-2">
          <Button
            variant={viewType === "monthly" ? "default" : "outline"}
            onClick={() => setViewType("monthly")}
          >
            Monthly View
          </Button>
          <Button
            variant={viewType === "daily" ? "default" : "outline"}
            onClick={() => setViewType("daily")}
          >
            Daily View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="blue"
                strokeWidth={2}
                dot={false}
                name={`${viewType === "daily" ? "Daily" : "Monthly"} Reports`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
