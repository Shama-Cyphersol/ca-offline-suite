import React from "react";
import { Eye, Download } from "lucide-react";
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
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Select a name to view the report
        </p>
      </div>

      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[150px] font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Report Name</TableHead>
              <TableHead className="w-[280px] text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow 
                key={index}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{report.date}</TableCell>
                <TableCell>{report.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Analytics;