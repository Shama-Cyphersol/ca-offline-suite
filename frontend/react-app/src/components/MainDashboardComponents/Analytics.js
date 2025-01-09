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
} from "../ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

const reports = [
  { date: "13-12-2024", name: "Report_ATS_unit_1_00008" },
  { date: "13-12-2024", name: "Report_ATS_unit_1_00007" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00003" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00002" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00001" },
  { date: "12-12-2024", name: "Report_ATS_unit_1_00001" },
];

const Analytics = () => {
  return (
    <div className="w-full px-4 py-6 -space-y-2 mx-auto ">
      <Card className="border dark:border-gray-700 rounded-lg shadow-sm">
        <CardHeader className="px-4 pb-2">
          <CardTitle className="text-3xl font-bold text-zinc-800 dark:text-slate-300">
            Analytics
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-[#7F8EA3]">
            Select a report to view or download
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-36 text-sm font-medium text-zinc-600 text-center dark:text-[#7F8EA3]">
                  Date
                </TableHead>
                <TableHead className="flex-1 text-sm font-medium text-zinc-600 text-center dark:text-[#7F8EA3]">
                  Report Name
                </TableHead>
                <TableHead className="w-40 text-sm font-medium text-zinc-600 text-center dark:text-[#7F8EA3]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 "
                >
                  <TableCell className="w-36 text-sm dark:text-slate-200 text-zinc-600 text-center">
                    {report.date}
                  </TableCell>
                  <TableCell className="flex-1 text-sm text-zinc-700 text-center dark:text-slate-200">
                    {report.name}
                  </TableCell>
                  <TableCell className="w-40 text-center">
                    <div className="flex justify-center space-x-2">
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
