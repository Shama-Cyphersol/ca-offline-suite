import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../ui/badge";
import { useState } from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Trash2, Info } from 'lucide-react';

const Analytics = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [recentReports, setRecentReports] = useState([
        { id: 1, date: '13-12-2024', caseId: 'ATS_unit_1_00008', reportName: 'Report_ATS_unit_1_00008'},
        { id: 2, date: '13-12-2024', caseId: 'ATS_unit_1_00007', reportName: 'Report_ATS_unit_1_00007'},
        { id: 3, date: '12-12-2024', caseId: 'ATS_unit_1_00003', reportName: 'Report_ATS_unit_1_00003'},
        { id: 4, date: '12-12-2024', caseId: 'ATS_unit_1_00002', reportName: 'Report_ATS_unit_1_00002'},
        { id: 5, date: '12-12-2024', caseId: 'ATS_unit_1_00001', reportName: 'Report_ATS_unit_1_00001'}
    ]);

    

    const handleDownload = () => {
        console.log('Clicked on dowbload');
    };

    return (
        <div className="p-8 space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                    Select a name to view the report
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.reportName}</TableCell>
                                <TableCell>
                                <Button 
                                    variant="default" 
                                    // size="sm" 
                                    onClick={() => handleDownload()}
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View Report</span>
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
    )
}

export default Analytics