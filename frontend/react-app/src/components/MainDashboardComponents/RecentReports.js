import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../ui/badge";
import { useState } from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from 'react-router-dom';

const RecentReports = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [recentReports, setRecentReports] = useState([
        { id: 1, date: '13-12-2024', caseId: 'ATS_unit_1_00008', reportName: 'Report_ATS_unit_1_00008', status: 'Completed' },
        { id: 2, date: '13-12-2024', caseId: 'ATS_unit_1_00007', reportName: 'Report_ATS_unit_1_00007', status: 'In Progress' },
        { id: 3, date: '12-12-2024', caseId: 'ATS_unit_1_00003', reportName: 'Report_ATS_unit_1_00003', status: 'Completed' },
        { id: 4, date: '12-12-2024', caseId: 'ATS_unit_1_00002', reportName: 'Report_ATS_unit_1_00002', status: 'Under Review' },
        { id: 5, date: '12-12-2024', caseId: 'ATS_unit_1_00001', reportName: 'Report_ATS_unit_1_00001', status: 'Completed' }
      ]);
    const StatusBadge = ({ status }) => {
        const variants = {
          'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
          'Under Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
        };
    
        return (
          <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-semibold", variants[status])}>
            {status}
          </Badge>
        );
      };

      const handleAddReport = (id) => {
          toast({
            title: "Report Viewed",
            description: `Opening report ${id} for viewing.`,
          });
        };
      
        const handleDeleteReport = (id) => {
          setRecentReports(recentReports.filter(report => report.id !== id));
          toast({
            title: "Report Deleted",
            description: "The report has been removed from your list.",
            variant: "destructive",
          });
        };

        const handleView = (caseId) => {
            console.log('View case:', caseId);
            setIsLoading(true);
            navigate(`/case-dashboard/${caseId}`);
            setIsLoading(false);
        };
      
  return (
    <Card>
    <CardHeader>
      <CardTitle>Recent Reports</CardTitle>
      <CardDescription>
        A list of recent reports from all projects
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Report Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentReports.map((report) => (
            <TableRow key={report.id} >
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.caseId}</TableCell>
              <TableCell>{report.reportName}</TableCell>
              <TableCell>
                <StatusBadge status={report.status} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(report.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
    )
}

export default RecentReports