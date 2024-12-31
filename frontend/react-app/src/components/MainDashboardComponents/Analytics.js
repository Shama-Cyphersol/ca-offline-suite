import React from "react";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../ui/table";

const reports = [
  { date: "13-12-2024", name: "Report_ATS_unit_1_00008" },
  { date: "13-12-2024", name: "Report_ATS_unit_1_00007" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00003" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00002" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00001" },
];

const Analytics = () => {
  return (
    <div className="w-full mx-2 p-4 pr-6">
      <h1 className="text-4xl font-bold mb-2">Analytics</h1>
      <p className="text-muted-foreground mb-6">
        Select a name to view the report
      </p>

      <Table className=" rounded-lg p-4 pr-2">
        
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Report Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.name}</TableCell>
              <TableCell className="text-right">
                <Button variant="default" size="sm" className="space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>View Report</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Analytics;
