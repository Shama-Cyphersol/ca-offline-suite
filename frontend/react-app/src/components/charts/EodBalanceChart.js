import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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

const colors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#f97316",
  "#3b82f6",
  "#d97706",
  "#06b6d4",
  "#22d3ee",
  "#4f46e5",
  "#059669",
];

const EodBalanceCharts = () => {
  // Sample data structure - replace with your actual data
  const [monthsData, setMonthsData] = useState({
    January: [100, 150, 200, 180, 160],
    February: [120, 140, 160, 180, 200],
    // Add more months as needed
  });

  const [selectedMonths, setSelectedMonths] = useState(Object.keys(monthsData));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const generateLabels = (dataLength) => {
    return Array.from({ length: dataLength }, (_, i) => (i + 1).toString());
  };

  // Prepare chart data
  const prepareChartData = () => {
    const labels = generateLabels(
      Math.max(...Object.values(monthsData).map((arr) => arr.length))
    );
    return labels.map((day, index) => {
      const dataPoint = { day: parseInt(day) };
      selectedMonths.forEach((month) => {
        dataPoint[month] = monthsData[month][index] || null;
      });
      return dataPoint;
    });
  };

  // Filter table data based on search term
  const filterData = () => {
    let combinedData = [];
    selectedMonths.forEach((month) => {
      const monthData = monthsData[month].map((value, index) => ({
        month,
        day: index + 1,
        value,
      }));
      combinedData = combinedData.concat(monthData);
    });

    if (!searchTerm) return combinedData;

    return combinedData.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.day.toString().includes(searchLower) ||
        item.value.toString().includes(searchLower) ||
        item.month.toLowerCase().includes(searchLower)
      );
    });
  };

  const handleSelectAll = (checked) => {
    setSelectedMonths(checked ? Object.keys(monthsData) : []);
  };

  const handleMonthSelect = (month, checked) => {
    setSelectedMonths((prev) => {
      if (checked) {
        return [...prev, month];
      }
      return prev.filter((m) => m !== month);
    });
  };

  const filteredData = filterData();
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Checkboxes */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAll"
                checked={
                  selectedMonths.length === Object.keys(monthsData).length
                }
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="selectAll">Select All</label>
            </div>
            {Object.keys(monthsData).map((month) => (
              <div key={month} className="flex items-center space-x-2">
                <Checkbox
                  id={month}
                  checked={selectedMonths.includes(month)}
                  onCheckedChange={(checked) =>
                    handleMonthSelect(month, checked)
                  }
                />
                <label htmlFor={month}>{month}</label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Financial Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMonths.map((month, index) => (
                  <Line
                    key={month}
                    type="monotone"
                    dataKey={month}
                    stroke={colors[index % colors.length]}
                    dot={{
                      stroke: colors[index % colors.length],
                      strokeWidth: 2,
                      r: 4,
                      fill: "white",
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by day or amount..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={`${item.month}-${item.day}-${index}`}>
                    <TableCell>{item.month}</TableCell>
                    <TableCell>{item.day}</TableCell>
                    <TableCell>{item.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell>
                    {filteredData
                      .reduce((sum, item) => sum + item.value, 0)
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EodBalanceCharts;
