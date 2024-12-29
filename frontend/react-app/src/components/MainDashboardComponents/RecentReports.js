import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { Badge } from "../ui/badge";
import { useState } from 'react';
import { cn } from "../../lib/utils";
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Trash2, Info, Search} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination"

const RecentReports = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const [recentReports, setRecentReports] = useState([
        { id: 1, date: '13-12-2024', caseId: 'ATS_unit_1_00008', reportName: 'Report_ATS_unit_1_00008', status: 'Completed' },
        { id: 2, date: '13-12-2024', caseId: 'ATS_unit_1_00007', reportName: 'Report_ATS_unit_1_00007', status: 'Completed' },
        { id: 3, date: '12-12-2024', caseId: 'ATS_unit_1_00003', reportName: 'Report_ATS_unit_1_00003', status: 'In Progress' },
        { id: 4, date: '12-12-2024', caseId: 'ATS_unit_1_00002', reportName: 'Report_ATS_unit_1_00002', status: 'Failed'},
        { id: 5, date: '12-12-2024', caseId: 'ATS_unit_1_00001', reportName: 'Report_ATS_unit_1_00001', status: 'Completed' },
        { id: 6, date: '11-12-2024', caseId: 'ATS_unit_1_00006', reportName: 'Report_ATS_unit_1_00006', status: 'In Progress' },
        { id: 7, date: '11-12-2024', caseId: 'ATS_unit_1_00005', reportName: 'Report_ATS_unit_1_00005', status: 'Completed' },
        { id: 8, date: '11-12-2024', caseId: 'ATS_unit_1_00004', reportName: 'Report_ATS_unit_1_00004', status: 'Failed' },
        { id: 9, date: '10-12-2024', caseId: 'ATS_unit_1_00009', reportName: 'Report_ATS_unit_1_00009', status: 'Completed' },
        { id: 10, date: '10-12-2024', caseId: 'ATS_unit_1_00010', reportName: 'Report_ATS_unit_1_00010', status: 'In Progress' }
    ]);

    // Filter reports based on search query
    const filteredReports = recentReports.filter(report =>
        report.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.caseId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const currentReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than or equal to maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            
            // Show current page and surrounding pages
            if (currentPage > 2) {
                pageNumbers.push('ellipsis');
            }
            
            if (currentPage !== 1 && currentPage !== totalPages) {
                pageNumbers.push(currentPage);
            }
            
            if (currentPage < totalPages - 1) {
                pageNumbers.push('ellipsis');
            }
            
            // Always show last page
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const StatusBadge = ({ status }) => {
        const variants = {
            'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            'Failed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
        };

        return (
            <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-semibold", variants[status])}>
                {status}
            </Badge>
        );
    };

    const handleAddReport = () => {
        console.log('Clicked on add report');
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

    const handleViewInfo = () => {
        console.log('Clicked on info');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Recent Reports</CardTitle>
                        <CardDescription>
                            A list of recent reports from all projects
                        </CardDescription>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reports..."
                            className="pl-10 w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead>Info</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.reportName}</TableCell>
                                <TableCell>
                                    <StatusBadge status={report.status} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleView(report.id)}
                                            className="h-8 w-8 text-blue-600  hover:text-blue-800  bg-blue-200 hover:bg-blue-400
                                                        dark:bg-blue-900 dark:text-blue-200 dark:hover:text-blue-100 dark:hover:bg-blue-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-green-600 hover:text-green-800 bg-green-200 hover:bg-green-400 
                                                        dark:bg-green-900 dark:text-green-200 dark:hover:text-green-100 dark:hover:bg-green-600"
                                            onClick={() => handleAddReport()}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-red-600 hover:text-red-800 bg-red-200 hover:bg-red-400
                                                        dark:bg-red-900 dark:text-red-200 dark:hover:text-red-100 dark:hover:bg-red-600"
                                            onClick={() => handleDeleteReport(report.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 text-black hover:text-black bg-gray-200 hover:bg-gray-400
                                                            dark:bg-gray-900 dark:text-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-600"
                                                onClick={() => handleViewInfo()}
                                            >
                                                <Info className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your
                                                    account and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className={cn(
                                            "cursor-pointer",
                                            currentPage === 1 && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                                
                                {getPageNumbers().map((pageNumber, index) => (
                                    <PaginationItem key={index}>
                                        {pageNumber === 'ellipsis' ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                onClick={() => handlePageChange(pageNumber)}
                                                isActive={currentPage === pageNumber}
                                                className="cursor-pointer"
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className={cn(
                                            "cursor-pointer",
                                            currentPage === totalPages && "pointer-events-none opacity-50"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default RecentReports