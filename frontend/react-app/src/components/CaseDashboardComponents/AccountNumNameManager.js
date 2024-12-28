import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const AccountNumNameManager = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [recentReports, setRecentReports] = useState([
        { 
            id: 1, 
            date: '13-12-2024', 
            fileName: '/path/to/documents/john_doe_statement.pdf',
            accNumber: 'ACC123456',
            name: 'John Doe',
            status: 'Completed' 
        },
        { 
            id: 2, 
            date: '13-12-2024', 
            fileName: '/path/to/documents/jane_smith_statement.pdf',
            accNumber: 'ACC789012',
            name: 'Jane Smith',
            status: 'In Progress' 
        },
        { 
            id: 3, 
            date: '12-12-2024', 
            fileName: '/path/to/documents/bob_wilson_statement.pdf',
            accNumber: 'ACC345678',
            name: 'Bob Wilson',
            status: 'Failed' 
        },
        { 
            id: 4, 
            date: '12-12-2024', 
            fileName: '/path/to/documents/alice_johnson_statement.pdf',
            accNumber: 'ACC901234',
            name: 'Alice Johnson',
            status: 'Completed' 
        },
        { 
            id: 5, 
            date: '12-12-2024', 
            fileName: '/path/to/documents/charlie_brown_statement.pdf',
            accNumber: 'ACC567890',
            name: 'Charlie Brown',
            status: 'In Progress' 
        },
        { 
            id: 6, 
            date: '11-12-2024', 
            fileName: '/path/to/documents/diana_clark_statement.pdf',
            accNumber: 'ACC234567',
            name: 'Diana Clark',
            status: 'Completed' 
        },
        { 
            id: 7, 
            date: '11-12-2024', 
            fileName: '/path/to/documents/evan_white_statement.pdf',
            accNumber: 'ACC890123',
            name: 'Evan White',
            status: 'Failed' 
        },
        { 
            id: 8, 
            date: '11-12-2024', 
            fileName: '/path/to/documents/fiona_green_statement.pdf',
            accNumber: 'ACC456789',
            name: 'Fiona Green',
            status: 'Completed' 
        },
        { 
            id: 9, 
            date: '10-12-2024', 
            fileName: '/path/to/documents/george_taylor_statement.pdf',
            accNumber: 'ACC012345',
            name: 'George Taylor',
            status: 'In Progress' 
        },
        { 
            id: 10, 
            date: '10-12-2024', 
            fileName: '/path/to/documents/helen_adams_statement.pdf',
            accNumber: 'ACC678901',
            name: 'Helen Adams',
            status: 'Completed' 
        }
    ]);

    const totalPages = Math.ceil(recentReports.length / itemsPerPage);
    const currentReports = recentReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="p-8 space-y-8">
        <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Account Number & Name Manager</CardTitle>
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
                            <TableHead>No.</TableHead>
                            <TableHead>File Location</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Account Number</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentReports.map((report, index) => (
                            <TableRow key={report.id}>
                                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <div className="truncate max-w-full" title={report.fileName}>
                                        {report.fileName}
                                    </div>
                                </TableCell>
                                <TableCell>{report.name}</TableCell>
                                <TableCell>{report.accNumber}</TableCell>
                               
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <Button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        variant="default"
                    >
                        Previous
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                        {recentReports.length > 0 ? `Page ${currentPage} of ${totalPages}` : ''}
                    </span>
                    
                    <Button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || recentReports.length === 0}
                        variant="default"
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

export default AccountNumNameManager