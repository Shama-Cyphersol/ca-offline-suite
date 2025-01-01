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
import { Eye, Plus, Trash2, Info, Search, Edit, Edit2} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
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
import CategoryEditModal from './CategoryEditModal';

const RecentReports = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentInfoIndex, setCurrentInfoIndex] = useState(0);
    const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);

    const itemsPerPage = 10;
    console.log({isLoading})
    const [recentReports, setRecentReports] = useState([

        { date: '13-12-2024', reportName: 'Report_ATS_unit_1_00008', status: 'Completed' },
        { date: '13-12-2024', reportName: 'Report_ATS_unit_1_00007', status: 'Completed' },
        { date: '12-12-2024', reportName: 'Report_ATS_unit_1_00003', status: 'In Progress' },
        { date: '12-12-2024', reportName: 'Report_ATS_unit_1_00002', status: 'Failed'},
        { date: '12-12-2024', reportName: 'Report_ATS_unit_1_00001', status: 'Completed' },
        { date: '11-12-2024', reportName: 'Report_ATS_unit_1_00006', status: 'In Progress' },
        { date: '11-12-2024', reportName: 'Report_ATS_unit_1_00005', status: 'Completed' },
        { date: '11-12-2024', reportName: 'Report_ATS_unit_1_00004', status: 'Failed' },
        { date: '10-12-2024', reportName: 'Report_ATS_unit_1_00009', status: 'Completed' },
        { date: '10-12-2024', reportName: 'Report_ATS_unit_1_00010', status: 'In Progress' },
        { date: '10-12-2024', reportName: 'Report_ATS_unit_1_00011', status: 'Completed' },
        { date: '10-12-2024', reportName: 'Report_ATS_unit_1_00012', status: 'Completed' },
    ]);

    const reportInfoData = [
        {
            id: 1,
            reportName: 'Report_ATS_unit_1_00008',
            documents: [
                {
                    path: "C:/Users/documents/Reports/2024/January/Statement_Analysis_1.pdf",
                    type: "Bank Statement"
                },
                {
                    path: "C:/Users/documents/Reports/2024/January/Transaction_Report_1.pdf",
                    type: "Transaction Report"
                }
            ]
        },
        {
            id: 2,
            reportName: 'Report_ATS_unit_1_00007',
            documents: [
                {
                    path: "C:/Users/documents/Reports/2024/February/Client_Statement.pdf",
                    type: "Bank Statement"
                },
                {
                    path: "C:/Users/documents/Reports/2024/February/Analysis_Summary.pdf",
                    type: "Analysis Report"
                }
            ]
        },
        {
            id: 3,
            reportName: 'Report_ATS_unit_1_00006',
            documents: [
                {
                    path: "C:/Users/documents/Reports/2024/March/Corporate_Statement.pdf",
                    type: "Corporate Statement"
                },
                {
                    path: "C:/Users/documents/Reports/2024/March/Transaction_Analysis.pdf",
                    type: "Analysis Report"
                }
            ]
        }
    ];


    const isFirstInfo = currentInfoIndex === 0;
    const isLastInfo = currentInfoIndex === reportInfoData.length - 1;

    const handlePrevInfo = () => {
        if (!isFirstInfo) {
            setCurrentInfoIndex(prev => prev - 1);
        }
    };

    const handleNextInfo = () => {
        if (!isLastInfo) {
            setCurrentInfoIndex(prev => prev + 1);
        }
    };


    // Filter reports based on search query
    const filteredReports = recentReports.filter(report =>
        report.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportName.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleDeleteReport = (reportName) => {
        setRecentReports(recentReports.filter(report => report.reportName !== reportName));
        toast({
            title: "Report Deleted",
            description: "The report has been removed from your list.",
            variant: "destructive",
        });
    };

    const handleView = (caseId) => {
        setIsLoading(true);
        navigate(`/case-dashboard/${caseId}/defaultTab`);
        setIsLoading(false);
    };

    const handleViewInfo = () => {
        console.log('Clicked on info');
    };

    const toggleEdit = (id) => {
        console.log('Clicked on edit');
        setIsCategoryEditOpen(!isCategoryEditOpen);
    }


    return (
        <Card>
            <CategoryEditModal open={isCategoryEditOpen} onOpenChange={toggleEdit} />

            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Recent Reports</CardTitle>
                        <CardDescription className="py-3">
                            A list of recent reports from all projects
                        </CardDescription>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reports..."
                            className="pl-10 w-[400px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="align-">
                            <TableHead>Date</TableHead>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead>Details</TableHead>
                            {/* <TableHead>Details</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentReports.map((report) => (
                            <TableRow key={report.reportName}>
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
                                            onClick={() => handleView(report.caseId)}

                                            className="h-8 w-8"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleAddReport()}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => toggleEdit(report.caseId)}
                                            className="h-8 w-8"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDeleteReport(report.reportName)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-black/5 "
                                        >
                                            <Info className="h-4 w-4 " />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-2xl bg-white shadow-lg border-0">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl font-medium text-black bg-black/[0.03] -mx-6 -mt-6 p-4 border-b border-black/10">
                                                Report Information
                                            </AlertDialogTitle>
                                            <div className="py-6">
                                                <h3 className="text-base font-medium text-black">
                                                    {reportInfoData[currentInfoIndex].reportName}
                                                </h3>
                                                <div className="mt-6 space-y-4">
                                                    {reportInfoData[currentInfoIndex].documents.map((doc, idx) => (
                                                        <div key={idx} className="bg-black/[0.02] hover:bg-black/[0.04] transition-colors p-4 rounded-md border border-black/5">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm font-medium text-black/40">Path:</span>
                                                                <span className="text-sm text-black/70">{doc.path}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="border-t border-black/10 pt-6">
                                            <div className="flex justify-between w-full gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevInfo}
                                                    disabled={isFirstInfo}
                                                    className="px-6 bg-transparent border-black/10 text-black/70 hover:bg-black/[0.03] hover:border-black/20 hover:text-black disabled:opacity-30"
                                                >
                                                    Previous
                                                </Button>
                                                <AlertDialogCancel className="px-8 bg-black text-white hover:bg-black/90 hover:text-white">
                                                    Close
                                                </AlertDialogCancel>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleNextInfo}
                                                    disabled={isLastInfo}
                                                    className="px-6 bg-transparent border-black/10 text-black/70 hover:bg-black/[0.03] hover:border-black/20 hover:text-black disabled:opacity-30"
                                                >
                                                    Next
                                                </Button>
                                            </div>
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