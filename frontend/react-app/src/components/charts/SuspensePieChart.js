import React from "react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";

const SuspensePieChart = ({
  data = [],
  title = "",
  config = {},
  valueKey = null,
  nameKey = null,
}) => {
  // Get all columns from the first data item
  // const columns = data.length > 0 ? Object.keys(data[0]) : [];

  // // Determine numeric columns
  // const numericColumns = columns.filter((column) =>
  //   data.some((row) => {
  //     const value = String(row[column]);
  //     return !isNaN(parseFloat(value)) && !value.includes("-");
  //   })
  // );

  // If keys are not provided, use Description as nameKey
  // and automatically detect Credit or Debit as valueKey based on title
  const defaultNameKey = "Description";
  const defaultValueKey = title.toLowerCase().includes("credit")
    ? "Credit"
    : "Debit";

  const finalNameKey = nameKey || defaultNameKey;
  const finalValueKey = valueKey || defaultValueKey;

  // Generate colors for pie slices
  const getColor = (index) => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];
    return colors[index % colors.length];
  };

  // Transform data to include colors
  const transformedData = data.map((item, index) => ({
    ...item,
    fill: getColor(index),
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      <ChartContainer 
          config={config}
          className="w-full min-h-[50vh]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <Pie
              data={transformedData}
              dataKey={finalValueKey}
              nameKey={finalNameKey}
              stroke="0"
              radius={120}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SuspensePieChart;
