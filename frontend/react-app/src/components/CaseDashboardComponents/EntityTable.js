import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Input } from "../ui/input";
import { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";
import { Search } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";
import DataTable from '../IndividualDashboardComponents/TableData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import entitydistdata from "../../data/entity_analysis.json";
import transactionData from "../../data/Transaction.json";

const EntityTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const itemsPerPage = 10;

    const filteredEntities = entitydistdata.filter(entities =>
        entities.Entity_Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEntityClick = (entityName) => {
        setSelectedEntity(entityName);
    };

    const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);
    const currentReports = filteredEntities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);      
            if (currentPage > 2) {
                pageNumbers.push('ellipsis');
            }
            if (currentPage !== 1 && currentPage !== totalPages) {
                pageNumbers.push(currentPage);
            }
            if (currentPage < totalPages - 1) {
                pageNumbers.push('ellipsis');
            }
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const processDailyData = (transactions) => {
        return transactions.reduce((acc, transaction) => {
          const date = transaction["Value Date"];
          if (!acc[date]) {
            acc[date] = {
              date,
              Description: transaction.Description,
              credit: transaction.Credit || 0,
              debit: transaction.Debit || 0,
              balance: transaction.Balance,
              category: transaction.Category,
              Entity: transaction.Entity
            };
          }
          acc[date].credit += transaction.Credit || 0;
          acc[date].debit += transaction.Debit || 0;
          return acc;
        }, {});
      };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Entity Distribution Table</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table className="pt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Entity</TableHead>
                                <TableHead className="text-center">Frequency</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.map((entity) => (
                                <TableRow key={entity.Entity_Name}>
                                    <TableCell 
                                        className="text-center hover:font-semibold cursor-pointer"
                                        onClick={() => handleEntityClick(entity.Entity_Name)}
                                    >
                                        {entity.Entity_Name}
                                    </TableCell>
                                    <TableCell className="text-center">{entity.No_of_times_occurred}</TableCell>
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

            <Dialog open={!!selectedEntity} onOpenChange={(isOpen) => !isOpen && setSelectedEntity(null)}>
                {selectedEntity && (
                    <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span>Transactions for {selectedEntity}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <DataTable 
                        data={Object.values(processDailyData(
                        transactionData
                            .filter(transaction => transaction.Entity === selectedEntity)
                        ))}
                    />
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

export default EntityTable;
